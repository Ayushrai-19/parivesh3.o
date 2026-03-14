DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS login_activity CASCADE;
DROP TABLE IF EXISTS sector_parameters CASCADE;
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS mom CASCADE;
DROP TABLE IF EXISTS gists CASCADE;
DROP TABLE IF EXISTS eds_flags CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;

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
  status VARCHAR(20) NOT NULL CHECK (status IN ('SUCCESS', 'FAILED')),
  failure_reason TEXT,
  previous_hash CHAR(64) NOT NULL,
  current_hash CHAR(64) NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION enforce_linear_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;

  IF OLD.status = 'DRAFT' AND NEW.status = 'SUBMITTED' THEN RETURN NEW; END IF;
  IF OLD.status = 'SUBMITTED' AND NEW.status = 'UNDER_SCRUTINY' THEN RETURN NEW; END IF;
  IF OLD.status = 'UNDER_SCRUTINY' AND NEW.status = 'ESSENTIAL_DOC_SOUGHT' THEN RETURN NEW; END IF;
  IF OLD.status = 'ESSENTIAL_DOC_SOUGHT' AND NEW.status = 'UNDER_SCRUTINY' THEN RETURN NEW; END IF;
  IF OLD.status = 'UNDER_SCRUTINY' AND NEW.status = 'REFERRED' THEN RETURN NEW; END IF;
  IF OLD.status = 'REFERRED' AND NEW.status = 'MOM_GENERATED' THEN RETURN NEW; END IF;
  IF OLD.status = 'MOM_GENERATED' AND NEW.status = 'FINALIZED' THEN RETURN NEW; END IF;

  RAISE EXCEPTION 'Invalid status transition: % -> %', OLD.status, NEW.status;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enforce_linear_status_transition
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION enforce_linear_status_transition();
