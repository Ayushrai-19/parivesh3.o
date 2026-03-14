const bcrypt = require('bcryptjs');

const initMemoryDb = async (pool) => {
  await pool.query(`
    CREATE TYPE user_role AS ENUM ('ADMIN', 'PROPONENT', 'SCRUTINY', 'MOM');
    CREATE TYPE application_status AS ENUM (
      'DRAFT',
      'SUBMITTED',
      'UNDER_SCRUTINY',
      'ESSENTIAL_DOC_SOUGHT',
      'REFERRED',
      'MOM_GENERATED',
      'FINALIZED'
    );

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      login_id VARCHAR(120) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role user_role NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE login_activity (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role user_role NOT NULL,
      login_method VARCHAR(20) NOT NULL,
      identifier_used VARCHAR(255),
      previous_hash CHAR(64) NOT NULL,
      current_hash CHAR(64) NOT NULL,
      login_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE applications (
      id SERIAL PRIMARY KEY,
      proponent_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      project_name VARCHAR(255) NOT NULL,
      sector VARCHAR(80) NOT NULL,
      category VARCHAR(80) NOT NULL,
      location VARCHAR(255) NOT NULL,
      location_lat NUMERIC(9,6),
      location_lng NUMERIC(9,6),
      land_area_diameter_km NUMERIC(10,2),
      forest_land_area_ha NUMERIC(12,2),
      water_requirement_kld NUMERIC(12,2),
      biodiversity_impact TEXT,
      mitigation_measures TEXT,
      description TEXT NOT NULL,
      impact_summary TEXT NOT NULL,
      status application_status NOT NULL DEFAULT 'DRAFT',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE documents (
      id SERIAL PRIMARY KEY,
      application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      file_name VARCHAR(255) NOT NULL,
      file_path TEXT NOT NULL,
      file_type VARCHAR(150) NOT NULL,
      uploaded_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE eds_flags (
      id SERIAL PRIMARY KEY,
      application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      raised_by INTEGER NOT NULL REFERENCES users(id),
      reason TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      resolved_at TIMESTAMP NULL
    );

    CREATE TABLE gists (
      id SERIAL PRIMARY KEY,
      application_id INTEGER UNIQUE NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      generated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      edited_content TEXT NULL,
      edited_by INTEGER NULL REFERENCES users(id)
    );

    CREATE TABLE mom (
      id SERIAL PRIMARY KEY,
      application_id INTEGER UNIQUE NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      gist_id INTEGER NOT NULL REFERENCES gists(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      finalized_by INTEGER NULL REFERENCES users(id),
      finalized_at TIMESTAMP NULL,
      is_locked BOOLEAN NOT NULL DEFAULT false
    );

    CREATE TABLE audit_log (
      id SERIAL PRIMARY KEY,
      application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      changed_by INTEGER NOT NULL REFERENCES users(id),
      old_status application_status,
      new_status application_status,
      previous_hash CHAR(64) NOT NULL,
      current_hash CHAR(64) NOT NULL,
      timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
      notes TEXT
    );

    CREATE TABLE templates (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      content TEXT NOT NULL,
      sector VARCHAR(80) NOT NULL,
      created_by INTEGER NOT NULL REFERENCES users(id),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE sector_parameters (
      id SERIAL PRIMARY KEY,
      sector VARCHAR(80) UNIQUE NOT NULL,
      required_documents JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      is_read BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE payments (
      id SERIAL PRIMARY KEY,
      application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      proponent_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount NUMERIC(12,2) NOT NULL,
      method VARCHAR(30) NOT NULL,
      method_label VARCHAR(60) NOT NULL,
      transaction_reference VARCHAR(120) NOT NULL,
      status VARCHAR(20) NOT NULL,
      failure_reason TEXT,
      previous_hash CHAR(64) NOT NULL,
      current_hash CHAR(64) NOT NULL,
      meta JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  const users = [
    ['System Admin', 'Admin1', 'admin1@parivesh.gov.in', bcrypt.hashSync('12345678', 10), 'ADMIN'],
    ['Scrutiny Officer 1', 'Scrutiny1', 'scrutiny1@parivesh.gov.in', bcrypt.hashSync('Scrutiny@123', 10), 'SCRUTINY'],
    ['Scrutiny Officer 2', 'Scrutiny2', 'scrutiny2@parivesh.gov.in', bcrypt.hashSync('Scrutiny@123', 10), 'SCRUTINY'],
    ['MoM Officer 1', 'Mom1', 'mom1@parivesh.gov.in', bcrypt.hashSync('Mom@123', 10), 'MOM'],
    ['MoM Officer 2', 'Mom2', 'mom2@parivesh.gov.in', bcrypt.hashSync('Mom@123', 10), 'MOM'],
    ['Aarav Infra', 'Prop1', 'proponent1@example.com', bcrypt.hashSync('Proponent@123', 10), 'PROPONENT'],
    ['GreenMine Ltd', 'Prop2', 'proponent2@example.com', bcrypt.hashSync('Proponent@123', 10), 'PROPONENT'],
    ['EcoPower Pvt Ltd', 'Prop3', 'proponent3@example.com', bcrypt.hashSync('Proponent@123', 10), 'PROPONENT'],
  ];

  for (const u of users) {
    // eslint-disable-next-line no-await-in-loop
    await pool.query('INSERT INTO users (name, login_id, email, password, role) VALUES ($1, $2, $3, $4, $5)', u);
  }

  const admin = await pool.query("SELECT id FROM users WHERE login_id = 'Admin1'");
  const adminId = admin.rows[0].id;

  await pool.query(
    `INSERT INTO templates (name, content, sector, created_by)
     VALUES
     ('Mining Master Template', 'Project {{project_name}} in {{location}} under {{sector}} submitted by {{proponent_name}}. Summary: {{description}}', 'Mining', $1),
     ('Infrastructure Template', 'Infra project {{project_name}} located at {{location}} in sector {{sector}}. Description: {{description}}. Proponent: {{proponent_name}}', 'Infrastructure', $1),
     ('Industry Template', 'Industry case {{project_name}} for {{sector}} at {{location}}. Submitted by {{proponent_name}}. Details: {{description}}', 'Industry', $1),
     ('Power Template', 'Power project {{project_name}} in {{location}} by {{proponent_name}}. Sector: {{sector}}. {{description}}', 'Power', $1),
     ('Tourism Template', 'Tourism project {{project_name}} at {{location}}. Proponent {{proponent_name}}. {{description}}', 'Tourism', $1)`,
    [adminId]
  );
};

module.exports = {
  initMemoryDb,
};
