/* eslint-disable no-console */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Client } = require('pg');

const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');
const GENESIS_HASH = '0'.repeat(64);

const run = async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const schemaSql = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf8');
    await client.query(schemaSql);

    const hash = (pwd) => bcrypt.hashSync(pwd, 10);

    const users = [
      ['System Admin', 'Admin1', 'admin1@parivesh.gov.in', hash('12345678'), 'ADMIN'],
      ['Scrutiny Officer 1', 'Scrutiny1', 'scrutiny1@parivesh.gov.in', hash('Scrutiny@123'), 'SCRUTINY'],
      ['Scrutiny Officer 2', 'Scrutiny2', 'scrutiny2@parivesh.gov.in', hash('Scrutiny@123'), 'SCRUTINY'],
      ['MoM Officer 1', 'Mom1', 'mom1@parivesh.gov.in', hash('Mom@123'), 'MOM'],
      ['MoM Officer 2', 'Mom2', 'mom2@parivesh.gov.in', hash('Mom@123'), 'MOM'],
      ['Aarav Infra', 'Prop1', 'proponent1@example.com', hash('Proponent@123'), 'PROPONENT'],
      ['GreenMine Ltd', 'Prop2', 'proponent2@example.com', hash('Proponent@123'), 'PROPONENT'],
      ['EcoPower Pvt Ltd', 'Prop3', 'proponent3@example.com', hash('Proponent@123'), 'PROPONENT'],
    ];

    for (const u of users) {
      await client.query('INSERT INTO users (name, login_id, email, password, role) VALUES ($1, $2, $3, $4, $5)', u);
    }

    const getUser = async (email) => {
      const r = await client.query('SELECT id FROM users WHERE email = $1', [email]);
      return r.rows[0].id;
    };

    const adminId = await getUser('admin@parivesh.gov.in');
    const scrutiny1 = await getUser('scrutiny1@parivesh.gov.in');
    const mom1 = await getUser('mom1@parivesh.gov.in');
    const p1 = await getUser('proponent1@example.com');
    const p2 = await getUser('proponent2@example.com');
    const p3 = await getUser('proponent3@example.com');

    await client.query(
      `INSERT INTO templates (name, content, sector, created_by)
       VALUES
       ('Mining Master Template', 'Project {{project_name}} in {{location}} under {{sector}} submitted by {{proponent_name}}. Summary: {{description}}', 'Mining', $1),
       ('Infrastructure Template', 'Infra project {{project_name}} located at {{location}} in sector {{sector}}. Description: {{description}}. Proponent: {{proponent_name}}', 'Infrastructure', $1),
       ('Industry Template', 'Industry case {{project_name}} for {{sector}} at {{location}}. Submitted by {{proponent_name}}. Details: {{description}}', 'Industry', $1),
       ('Power Template', 'Power project {{project_name}} in {{location}} by {{proponent_name}}. Sector: {{sector}}. {{description}}', 'Power', $1),
       ('Tourism Template', 'Tourism project {{project_name}} at {{location}}. Proponent {{proponent_name}}. {{description}}', 'Tourism', $1)`,
      [adminId]
    );

    await client.query(
      `INSERT INTO sector_parameters (sector, required_documents)
       VALUES
       ('Mining', '["Geological Report", "Land Ownership Document", "Impact Assessment"]'::jsonb),
       ('Infrastructure', '["Site Plan", "Construction Clearance", "Impact Assessment"]'::jsonb),
       ('Industry', '["Factory Layout", "Pollution Control Plan", "Impact Assessment"]'::jsonb),
       ('Power', '["Fuel Report", "Emission Plan", "Impact Assessment"]'::jsonb),
       ('Tourism', '["Site Survey", "Local Consent", "Impact Assessment"]'::jsonb)`
    );

    const appInsert = async (proponentId, project, sector, category, location, desc, impact, status) => {
      const r = await client.query(
        `INSERT INTO applications (proponent_id, project_name, sector, category, location, description, impact_summary, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [proponentId, project, sector, category, location, desc, impact, status]
      );
      return r.rows[0].id;
    };

    const appDraft = await appInsert(
      p1,
      'Blue River Tourism Corridor',
      'Tourism',
      'A',
      'Uttarakhand, Dehradun',
      'Riverfront eco tourism facilities and access roads',
      'Low construction disturbance and seasonal traffic increase',
      'DRAFT'
    );

    const appEds = await appInsert(
      p2,
      'GreenMine Expansion Block-B',
      'Mining',
      'B',
      'Jharkhand, Dhanbad',
      'Open cast mining expansion with mitigation systems',
      'Dust and noise impact controlled with suppression systems',
      'ESSENTIAL_DOC_SOUGHT'
    );

    const appMom = await appInsert(
      p3,
      'EcoPower Thermal Upgrade',
      'Power',
      'A',
      'Chhattisgarh, Korba',
      'Retrofit thermal plant for better emissions performance',
      'Expected reduction in particulate output',
      'MOM_GENERATED'
    );

    const appFinal = await appInsert(
      p1,
      'Metro Link Infrastructure Phase-2',
      'Infrastructure',
      'A',
      'Maharashtra, Mumbai',
      'Urban metro extension and elevated stations',
      'Temporary construction impact with long-term emission benefits',
      'FINALIZED'
    );

    await client.query(
      `INSERT INTO documents (application_id, file_name, file_path, file_type)
       VALUES
       ($1, 'tourism_project.docx', 'uploads/$1/tourism_project.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
       ($2, 'mining_supporting.doc', 'uploads/$2/mining_supporting.doc', 'application/msword'),
       ($3, 'power_compliance.docx', 'uploads/$3/power_compliance.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')`,
      [appDraft, appEds, appMom]
    );

    await client.query(
      `INSERT INTO eds_flags (application_id, raised_by, reason)
       VALUES ($1, $2, 'Please attach signed baseline monitoring report and correct map references')`,
      [appEds, scrutiny1]
    );

    const gistMom = await client.query(
      `INSERT INTO gists (application_id, content, edited_content, edited_by)
       VALUES ($1, 'Auto generated gist for EcoPower Thermal Upgrade', 'Edited gist content for MoM meeting', $2)
       RETURNING id`,
      [appMom, mom1]
    );

    const gistFinal = await client.query(
      `INSERT INTO gists (application_id, content, edited_content, edited_by)
       VALUES ($1, 'Auto generated gist for Metro Link Infrastructure', 'Finalized meeting notes for Metro Link', $2)
       RETURNING id`,
      [appFinal, mom1]
    );

    await client.query(
      `INSERT INTO mom (application_id, gist_id, content, finalized_by, finalized_at, is_locked)
       VALUES
       ($1, $2, 'MoM draft content awaiting lock', NULL, NULL, false),
       ($3, $4, 'Final MoM content for Metro Link Infrastructure Phase-2', $5, NOW() - INTERVAL '1 day', true)`,
      [appMom, gistMom.rows[0].id, appFinal, gistFinal.rows[0].id, mom1]
    );

    const auditEvents = [
      { application_id: appEds, changed_by: scrutiny1, old_status: 'SUBMITTED', new_status: 'UNDER_SCRUTINY', notes: 'Scrutiny started' },
      { application_id: appEds, changed_by: scrutiny1, old_status: 'UNDER_SCRUTINY', new_status: 'ESSENTIAL_DOC_SOUGHT', notes: 'Missing signed baseline report' },
      { application_id: appMom, changed_by: scrutiny1, old_status: 'SUBMITTED', new_status: 'UNDER_SCRUTINY', notes: 'Scrutiny started' },
      { application_id: appMom, changed_by: scrutiny1, old_status: 'UNDER_SCRUTINY', new_status: 'REFERRED', notes: 'Documents verified' },
      { application_id: appMom, changed_by: mom1, old_status: 'REFERRED', new_status: 'MOM_GENERATED', notes: 'Auto gist generation' },
      { application_id: appFinal, changed_by: scrutiny1, old_status: 'SUBMITTED', new_status: 'UNDER_SCRUTINY', notes: 'Scrutiny started earlier' },
      { application_id: appFinal, changed_by: scrutiny1, old_status: 'UNDER_SCRUTINY', new_status: 'REFERRED', notes: 'Meeting referral' },
      { application_id: appFinal, changed_by: mom1, old_status: 'REFERRED', new_status: 'MOM_GENERATED', notes: 'Auto gist generation' },
      { application_id: appFinal, changed_by: mom1, old_status: 'MOM_GENERATED', new_status: 'FINALIZED', notes: 'MoM locked' },
    ];

    let previousAuditHash = GENESIS_HASH;
    for (const event of auditEvents) {
      const currentAuditHash = sha256(`${previousAuditHash}:${JSON.stringify(event)}`);
      await client.query(
        `INSERT INTO audit_log (application_id, changed_by, old_status, new_status, previous_hash, current_hash, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          event.application_id,
          event.changed_by,
          event.old_status,
          event.new_status,
          previousAuditHash,
          currentAuditHash,
          event.notes,
        ]
      );
      previousAuditHash = currentAuditHash;
    }

    await client.query(
      `INSERT INTO notifications (user_id, message, is_read)
       VALUES
       ($1, 'EDS raised for your application. Please re-upload corrected documents.', false),
       ($2, 'Application referred and gist auto-generated successfully.', true),
       ($3, 'Your application has been finalized. Download files now available.', false)`,
      [p2, scrutiny1, p1]
    );

    const paymentEvents = [
      {
        application_id: appDraft,
        proponent_id: p1,
        amount: 1250.0,
        method: 'upi',
        method_label: 'UPI',
        transaction_reference: 'TXN-SEED-1001',
        status: 'SUCCESS',
        failure_reason: null,
        meta: { upiId: 'aarav@upi' },
      },
      {
        application_id: appEds,
        proponent_id: p2,
        amount: 1250.0,
        method: 'debit',
        method_label: 'Debit Card',
        transaction_reference: 'TXN-SEED-1002',
        status: 'FAILED',
        failure_reason: 'Issuer bank rejected this card transaction.',
        meta: { cardNumber: '1111 2222 3333 0000' },
      },
      {
        application_id: appEds,
        proponent_id: p2,
        amount: 1250.0,
        method: 'debit',
        method_label: 'Debit Card',
        transaction_reference: 'TXN-SEED-1003',
        status: 'SUCCESS',
        failure_reason: null,
        meta: { cardNumber: '1111 2222 3333 4444' },
      },
      {
        application_id: appMom,
        proponent_id: p3,
        amount: 1250.0,
        method: 'testpay',
        method_label: 'Test Pay',
        transaction_reference: 'TXN-SEED-1004',
        status: 'SUCCESS',
        failure_reason: null,
        meta: {},
      },
    ];

    let previousPaymentHash = GENESIS_HASH;
    for (const paymentEvent of paymentEvents) {
      const currentPaymentHash = sha256(`${previousPaymentHash}:${JSON.stringify(paymentEvent)}`);
      await client.query(
        `INSERT INTO payments (
           application_id, proponent_id, amount, method, method_label,
           transaction_reference, status, failure_reason, previous_hash, current_hash, meta
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb)`,
        [
          paymentEvent.application_id,
          paymentEvent.proponent_id,
          paymentEvent.amount,
          paymentEvent.method,
          paymentEvent.method_label,
          paymentEvent.transaction_reference,
          paymentEvent.status,
          paymentEvent.failure_reason,
          previousPaymentHash,
          currentPaymentHash,
          JSON.stringify(paymentEvent.meta),
        ]
      );
      previousPaymentHash = currentPaymentHash;
    }

    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
};

run();
