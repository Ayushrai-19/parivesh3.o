const express = require('express');
const { param } = require('express-validator');
const { Document, Packer, Paragraph, HeadingLevel, TextRun, AlignmentType } = require('docx');
const puppeteer = require('puppeteer');

const pool = require('../config/db');
const authenticate = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');
const { ROLES, APP_STATUS } = require('../utils/constants');
const { sendResponse, asyncHandler } = require('../utils/response');

const router = express.Router();

const getExportPayload = async (applicationId) => {
  const result = await pool.query(
    `SELECT a.id AS application_id,
            a.project_name,
            a.sector,
            a.category,
            a.location,
            a.description,
            a.impact_summary,
            a.status,
            a.created_at AS submission_date,
            u.id AS proponent_id,
            u.name AS proponent_name,
            m.content AS mom_content,
            m.finalized_at
     FROM applications a
     JOIN users u ON u.id = a.proponent_id
     LEFT JOIN mom m ON m.application_id = a.id
     WHERE a.id = $1`,
    [applicationId]
  );

  return result.rows[0] || null;
};

const canAccessExport = (requestUser, payload) => {
  if (requestUser.role === ROLES.PROPONENT) {
    return requestUser.id === payload.proponent_id;
  }
  return [ROLES.ADMIN, ROLES.SCRUTINY, ROLES.MOM].includes(requestUser.role);
};

const fmtDate = (v) => (v ? new Date(v).toLocaleDateString('en-IN', { dateStyle: 'long' }) : 'N/A');
const fmtDateTime = (v) => (v ? new Date(v).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }) : 'N/A');
const currentYear = () => new Date().getFullYear();
const parseMomSections = (content) => {
  if (!content) return [];
  return content.split('\n\n---\n\n').map((s) => s.trim()).filter(Boolean);
};

/* eslint-disable no-template-curly-in-string */
const buildPdfHtml = (p) => {
  const momId = 'MOM-' + p.application_id + '-' + currentYear();
  const agendaId = 'AGENDA-' + p.application_id;
  const fileNo = 'ENV-' + p.application_id + '-' + currentYear();
  const sections = parseMomSections(p.mom_content);
  const sectionsHtml =
    sections.length > 1
      ? sections.map((s) => '<div class="content-box"><pre class="block-text">' + s + '</pre></div>').join('')
      : '<div class="content-box"><pre class="block-text">' + (p.mom_content || 'Content not yet generated.') + '</pre></div>';

  return '<!DOCTYPE html>\n' +
    '<html><head><meta charset="utf-8" /><style>\n' +
    '  * { box-sizing: border-box; margin: 0; padding: 0; }\n' +
    '  body { font-family: Arial, sans-serif; font-size: 11pt; padding: 28px 36px; color: #000; }\n' +
    '  .header { text-align: center; margin-bottom: 20px; line-height: 1.7; }\n' +
    '  .header .h-bold { font-weight: bold; font-size: 12pt; }\n' +
    '  .header .stars { font-size: 16pt; letter-spacing: 8px; margin: 4px 0; }\n' +
    '  .meta-table { width: 62%; border-collapse: collapse; margin: 16px 0; }\n' +
    '  .meta-table td { padding: 4px 8px; font-size: 10.5pt; vertical-align: top; }\n' +
    '  .meta-table td:nth-child(2) { width: 12px; text-align: center; }\n' +
    '  .meta-table .meta-key { font-weight: bold; white-space: nowrap; }\n' +
    '  .section-title { font-weight: bold; font-size: 12pt; text-decoration: underline; margin: 18px 0 8px; }\n' +
    '  .content-box { border: 1px solid #333; padding: 10px 14px; margin: 8px 0; min-height: 64px; }\n' +
    '  .block-text { white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 10.5pt; line-height: 1.6; }\n' +
    '  .data-table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 10.5pt; }\n' +
    '  .data-table td, .data-table th { border: 1px solid #333; padding: 6px 10px; vertical-align: top; }\n' +
    '  .data-table th { background: #f0f0f0; font-weight: bold; text-align: left; }\n' +
    '  .data-table .key-cell { font-weight: bold; width: 220px; }\n' +
    '  .divider { border: none; border-top: 1px solid #000; margin: 20px 0; }\n' +
    '  .footer { margin-top: 30px; font-size: 9.5pt; font-style: italic; text-align: center; color: #555; }\n' +
    '</style></head><body>\n' +
    '  <div class="header">\n' +
    '    <div class="h-bold">Government of India</div>\n' +
    '    <div class="h-bold">Ministry of Environment, Forest and Climate Change</div>\n' +
    '    <div class="h-bold">IA Division</div>\n' +
    '    <div class="h-bold">(Non-Coal Mining)</div>\n' +
    '    <div class="stars">* * *</div>\n' +
    '  </div>\n' +
    '  <table class="meta-table">\n' +
    '    <tr><td class="meta-key">MoM ID</td><td>:</td><td>' + momId + '</td></tr>\n' +
    '    <tr><td class="meta-key">Agenda ID</td><td>:</td><td>' + agendaId + '</td></tr>\n' +
    '    <tr><td class="meta-key">Meeting Venue</td><td>:</td><td>Ministry of Environment, Forest and Climate Change, New Delhi</td></tr>\n' +
    '    <tr><td class="meta-key">Meeting Mode</td><td>:</td><td>Physical / Hybrid</td></tr>\n' +
    '    <tr><td class="meta-key">Date &amp; Time</td><td>:</td><td>' + fmtDateTime(p.finalized_at) + '</td></tr>\n' +
    '  </table>\n' +
    '  <hr class="divider" />\n' +
    '  <div class="section-title">Meeting Details &amp; Proposal Overview</div>\n' +
    '  ' + sectionsHtml + '\n' +
    '  <hr class="divider" />\n' +
    '  <div class="section-title">Project Description Overview</div>\n' +
    '  <div class="content-box"><pre class="block-text">' + (p.description || '') + '</pre></div>\n' +
    '  <table class="data-table">\n' +
    '    <tr><td class="key-cell">Proposal For</td><td colspan="3">' + p.proponent_name + '</td></tr>\n' +
    '    <tr><th>Proposal No</th><th>File No</th><th>Submission Date</th><th>Activity / Sub-Activity (Schedule Item)</th></tr>\n' +
    '    <tr><td>' + p.application_id + '</td><td>' + fileNo + '</td><td>' + fmtDate(p.submission_date) + '</td><td>' + p.sector + ' / ' + p.category + '</td></tr>\n' +
    '  </table>\n' +
    '  <hr class="divider" />\n' +
    '  <div class="section-title">2. Project Details (As Submitted by Project Proponent)</div>\n' +
    '  <table class="data-table">\n' +
    '    <tr><td class="key-cell">Name of the Proposal</td><td colspan="2">' + p.project_name + '</td></tr>\n' +
    '    <tr><td class="key-cell" rowspan="3">Location</td><td class="key-cell" style="width:140px;font-weight:bold;">District / State</td><td>' + p.location + '</td></tr>\n' +
    '    <tr><td class="key-cell" style="font-weight:bold;">Sector</td><td>' + p.sector + '</td></tr>\n' +
    '    <tr><td class="key-cell" style="font-weight:bold;">Category</td><td>' + p.category + '</td></tr>\n' +
    '    <tr><td class="key-cell">Environmental Impact Summary</td><td colspan="2">' + (p.impact_summary || 'N/A') + '</td></tr>\n' +
    '  </table>\n' +
    '  <div class="footer">This document is officially generated by the Parivesh Environmental Clearance Portal &mdash; Government of India.<br/>Finalized on: ' + fmtDate(p.finalized_at) + '</div>\n' +
    '</body></html>';
};

router.use(authenticate);

router.get(
  '/applications/:applicationId/docx',
  [param('applicationId').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const payload = await getExportPayload(Number(req.params.applicationId));
    if (!payload) return sendResponse(res, 404, false, null, 'Application not found');
    if (!canAccessExport(req.user, payload)) return sendResponse(res, 403, false, null, 'Forbidden');
    if (payload.status !== APP_STATUS.FINALIZED || !payload.mom_content) {
      return sendResponse(res, 400, false, null, 'MoM export is available only after finalization');
    }

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ children: [new TextRun({ text: 'Government of India', bold: true })], alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [new TextRun({ text: 'Ministry of Environment, Forest and Climate Change', bold: true })], alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [new TextRun({ text: 'IA Division (Non-Coal Mining)', bold: true })], alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [new TextRun('* * *')], alignment: AlignmentType.CENTER }),
            new Paragraph({ text: '' }),
            new Paragraph({ children: [new TextRun({ text: 'MoM ID: ', bold: true }), new TextRun('MOM-' + payload.application_id + '-' + currentYear())] }),
            new Paragraph({ children: [new TextRun({ text: 'Agenda ID: ', bold: true }), new TextRun('AGENDA-' + payload.application_id)] }),
            new Paragraph({ children: [new TextRun({ text: 'Meeting Venue: ', bold: true }), new TextRun('Ministry of Environment, Forest and Climate Change, New Delhi')] }),
            new Paragraph({ children: [new TextRun({ text: 'Meeting Mode: ', bold: true }), new TextRun('Physical / Hybrid')] }),
            new Paragraph({ children: [new TextRun({ text: 'Date & Time: ', bold: true }), new TextRun(fmtDateTime(payload.finalized_at))] }),
            new Paragraph({ text: '' }),
            new Paragraph({ text: 'Meeting Details & Proposal Overview', heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: '' }),
            ...(() => {
              const secs = parseMomSections(payload.mom_content);
              return secs.length > 1
                ? secs.flatMap((s) => [new Paragraph({ text: s }), new Paragraph({ text: '' })])
                : [new Paragraph({ text: payload.mom_content || '' })];
            })(),
            new Paragraph({ text: '' }),
            new Paragraph({ text: 'Project Description Overview', heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: payload.description || '' }),
            new Paragraph({ text: '' }),
            new Paragraph({ children: [new TextRun({ text: 'Proposal For: ', bold: true }), new TextRun(payload.proponent_name)] }),
            new Paragraph({ children: [new TextRun({ text: 'Proposal No: ', bold: true }), new TextRun(String(payload.application_id))] }),
            new Paragraph({ children: [new TextRun({ text: 'File No: ', bold: true }), new TextRun('ENV-' + payload.application_id + '-' + currentYear())] }),
            new Paragraph({ children: [new TextRun({ text: 'Submission Date: ', bold: true }), new TextRun(fmtDate(payload.submission_date))] }),
            new Paragraph({ children: [new TextRun({ text: 'Activity / Sub-Activity: ', bold: true }), new TextRun(payload.sector + ' / ' + payload.category)] }),
            new Paragraph({ text: '' }),
            new Paragraph({ text: '2. Project Details (As Submitted by Project Proponent)', heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ children: [new TextRun({ text: 'Name of the Proposal: ', bold: true }), new TextRun(payload.project_name)] }),
            new Paragraph({ children: [new TextRun({ text: 'Location: ', bold: true }), new TextRun(payload.location)] }),
            new Paragraph({ children: [new TextRun({ text: 'Sector: ', bold: true }), new TextRun(payload.sector)] }),
            new Paragraph({ children: [new TextRun({ text: 'Category: ', bold: true }), new TextRun(payload.category)] }),
            new Paragraph({ children: [new TextRun({ text: 'Environmental Impact Summary: ', bold: true }), new TextRun(payload.impact_summary || 'N/A')] }),
            new Paragraph({ text: '' }),
            new Paragraph({ children: [new TextRun({ text: 'Parivesh Environmental Clearance Portal — Government of India', italics: true })], alignment: AlignmentType.CENTER }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="mom_application_${payload.application_id}.docx"`);
    return res.send(buffer);
  })
);

router.get(
  '/applications/:applicationId/pdf',
  [param('applicationId').isInt()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const payload = await getExportPayload(Number(req.params.applicationId));
    if (!payload) return sendResponse(res, 404, false, null, 'Application not found');
    if (!canAccessExport(req.user, payload)) return sendResponse(res, 403, false, null, 'Forbidden');
    if (payload.status !== APP_STATUS.FINALIZED || !payload.mom_content) {
      return sendResponse(res, 400, false, null, 'MoM export is available only after finalization');
    }

    const browser = await puppeteer.launch({ headless: true });
    try {
      const page = await browser.newPage();
      await page.setContent(buildPdfHtml(payload), { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="mom_application_${payload.application_id}.pdf"`);
      return res.send(pdfBuffer);
    } finally {
      await browser.close();
    }
  })
);

module.exports = router;
