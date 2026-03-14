const { GoogleGenerativeAI } = require('@google/generative-ai');

const buildGistPrompt = (app) => `You are a senior government official drafting a formal Meeting Gist for India's environmental clearance process (Parivesh portal).

Write a professional, concise Meeting Gist (150-250 words) based on the application details below. The gist will be reviewed by the MoM (Minutes of Meeting) committee before granting environmental clearance.

Application Details:
- Project Name: ${app.project_name}
- Sector: ${app.sector}
- Location: ${app.location}
- Proponent / Company: ${app.proponent_name}
- Project Description: ${app.description}
- Environmental Impact Summary: ${app.impact_summary || 'Not provided'}

Format the output as follows:
1. Start with "MEETING GIST" as a heading
2. A short "Project Overview" paragraph
3. A short "Key Environmental Considerations" paragraph
4. A short "Recommendations / Points for Discussion" paragraph
5. End with "Prepared for review by the MoM Committee"

Use formal, neutral government language. Do not use bullet points.`;

const generateGistWithAI = async (app) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error('GEMINI_API_KEY is not configured'), { status: 503 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(buildGistPrompt(app));
  return result.response.text();
};

const buildMomPrompt = (app, gistSummary) => `You are a senior official at India's Ministry of Environment, Forest and Climate Change (MoEFCC) drafting the official Minutes of Meeting (MoM) for an Expert Appraisal Committee (EAC) environmental clearance meeting.

Based on the following project details, generate the complete MoM document content. Return ONLY valid JSON — no explanation, no markdown fences.

Project Details:
- Name: ${app.project_name}
- Sector: ${app.sector}
- Category: ${app.category}
- Location: ${app.location}
- Proponent: ${app.proponent_name}
- Description: ${app.description}
- Environmental Impact Summary: ${app.impact_summary || 'Not provided'}
- Prior Gist: ${gistSummary}

Return exactly this JSON structure (fill in realistic, formal values — do NOT leave any field empty):
{
  "agenda_id": "e.g. EAC(Infra-2)/NCM/2024-25/01 — official EAC agenda reference number",
  "meeting_venue": "e.g. Conference Room No.1, Indira Paryavaran Bhawan, Jorbagh Road, New Delhi - 110003",
  "meeting_mode": "Physical / Virtual / Hybrid",
  "date_time": "e.g. 25th March, 2024 at 10:00 AM IST",
  "opening_remarks": "3-4 formal sentences: EAC convened, chairmanship noted, quorum declared, agenda item for this project formally introduced",
  "committee_discussion": "4-6 formal sentences: technical examination by EAC, environmental safeguards discussed, key observations, proponent responses noted, any conditions proposed",
  "project_description": "3-4 sentences giving a formal overview of the project, its objectives, scale, and significance",
  "proposal_for": "${app.proponent_name}",
  "proposal_no": "e.g. IA/XX/NCP/XXXXX/2024 — infer state code from location",
  "file_no": "e.g. J-11011/23/2024-IA II(M)",
  "submission_date": "formal date derived from project timeline context",
  "activity_sub_activity": "Primary mining activity / Non-Coal Mining / Category designation (Schedule Item reference)",
  "salient_features": "4-6 sentences: project capacity/area, land use breakdown, water requirement, employment generation, key proposed environmental and pollution control measures",
  "village": "village name inferred from location: ${app.location}",
  "district_taluka": "district and taluka inferred from location: ${app.location}",
  "state_code": "state name and state code inferred from location: ${app.location}"
}`;

const generateMomWithAI = async (app, gistSummary) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error('GEMINI_API_KEY is not configured'), { status: 503 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(buildMomPrompt(app, gistSummary));
  const raw = result.response.text().replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

  const parseMaybeJson = (text) => {
    try {
      return JSON.parse(text);
    } catch {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start !== -1 && end > start) {
        try {
          return JSON.parse(text.slice(start, end + 1));
        } catch {
          return null;
        }
      }
      return null;
    }
  };

  const parsed = parseMaybeJson(raw);
  if (parsed && typeof parsed === 'object') {
    // Ensure required fields always exist with fallbacks
    const doc = {
      agenda_id: parsed.agenda_id || '',
      meeting_venue: parsed.meeting_venue || '',
      meeting_mode: parsed.meeting_mode || '',
      date_time: parsed.date_time || '',
      opening_remarks: parsed.opening_remarks || '',
      committee_discussion: parsed.committee_discussion || '',
      project_description: parsed.project_description || app.description || '',
      proposal_for: parsed.proposal_for || app.proponent_name || '',
      proposal_no: parsed.proposal_no || '',
      file_no: parsed.file_no || '',
      submission_date: parsed.submission_date || '',
      activity_sub_activity: parsed.activity_sub_activity || '',
      salient_features: parsed.salient_features || '',
      village: parsed.village || '',
      district_taluka: parsed.district_taluka || '',
      state_code: parsed.state_code || '',
    };
    return JSON.stringify(doc);
  }

  // Fallback: wrap raw text in JSON envelope
  return JSON.stringify({
    agenda_id: '', meeting_venue: '', meeting_mode: '', date_time: '',
    opening_remarks: raw, committee_discussion: '', project_description: '',
    proposal_for: app.proponent_name || '', proposal_no: '', file_no: '',
    submission_date: '', activity_sub_activity: '', salient_features: '',
    village: app.location || '', district_taluka: '', state_code: '',
  });
};

module.exports = { generateGistWithAI, generateMomWithAI };
