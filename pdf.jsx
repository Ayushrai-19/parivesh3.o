import { useState, useEffect, useRef } from "react";

const G = {
  bg: "#f0f4f0",
  bgDark: "#0d1a0f",
  green1: "#1a4d2e",
  green2: "#2d7a4f",
  green3: "#4caf7d",
  green4: "#a8d5b5",
  green5: "#e8f5ec",
  gold: "#c9a84c",
  goldLight: "#f0d080",
  red: "#c0392b",
  amber: "#d4850a",
  blue: "#1a5276",
  teal: "#0e7c7b",
  purple: "#6c3483",
  text: "#1a2e1a",
  textMid: "#3d5a3e",
  textLight: "#6b8f6b",
  border: "#b8d4bc",
  white: "#ffffff",
};

const STAGES = [
  { id: "draft", label: "DRAFT", color: G.textLight, dot: "#8fac8f" },
  { id: "submitted", label: "SUBMITTED", color: G.blue, dot: G.blue },
  { id: "scrutiny", label: "UNDER SCRUTINY", color: G.amber, dot: G.amber },
  { id: "eds", label: "EDS RAISED", color: G.red, dot: G.red },
  { id: "referred", label: "REFERRED", color: G.purple, dot: G.purple },
  { id: "mom_gen", label: "MoM GENERATED", color: G.teal, dot: G.teal },
  { id: "finalized", label: "FINALIZED", color: G.green2, dot: G.green2 },
];

const FEATURES = [
  {
    cat: "🤖 AI & Automation",
    color: G.teal,
    bg: "#e6f4f4",
    items: [
      "Claude/GPT-powered Meeting Gist auto-generation from uploaded EIA documents",
      "AI document completeness checker — flags missing fields before human review",
      "Smart resubmission assistant — tells proponent exactly what to correct",
      "Predictive delay analysis — estimates approval timeline from historical data",
      "AI-powered sector auto-classification from project description text",
      "Automated duplicate application detection across proponent accounts",
    ],
  },
  {
    cat: "🔐 Security & Compliance",
    color: G.green1,
    bg: "#e8f0e8",
    items: [
      "Blockchain-based immutable audit trail for every status transition",
      "Digital signature integration for MoM finalization by authorized officer",
      "Two-factor authentication for Scrutiny and MoM team accounts",
      "Document watermarking on all downloaded MoM PDF/Word files",
      "Session anomaly detection with auto-logout on suspicious activity",
      "GDPR-compliant data retention and right-to-erasure policies",
    ],
  },
  {
    cat: "📊 Analytics & Transparency",
    color: G.blue,
    bg: "#e8eef4",
    items: [
      "Public dashboard with anonymized clearance statistics by sector",
      "Real-time bottleneck heatmap — shows exactly where applications stall",
      "Officer performance metrics — average review time per scrutiny member",
      "Sector-wise approval rate analytics for Admin oversight",
      "Monthly auto-generated compliance PDF reports for ministry submission",
      "Proponent SLA tracker — countdown to deadline breach warning",
    ],
  },
  {
    cat: "🌐 Integrations",
    color: G.gold,
    bg: "#f5f0e0",
    items: [
      "DigiLocker integration — pull verified identity documents directly",
      "Razorpay / PayGov UPI + QR code payment module (plug-in ready slot)",
      "Email + SMS + WhatsApp multi-channel notification gateway",
      "GIS map integration — plot and verify project location during filing",
      "Aadhaar-based eKYC for proponent identity verification",
      "REST API for third-party ministry system interoperability",
    ],
  },
  {
    cat: "⚡ Future Architecture",
    color: G.purple,
    bg: "#f0eaf5",
    items: [
      "Microservices-ready modular backend — scale each role independently",
      "Hindi + English bilingual UI with full i18n support",
      "Progressive Web App — works offline for field officers in remote areas",
      "Voice-to-text MoM editing for mobile use in the field",
      "Multi-state deployment — exportable to other state ECBs across India",
      "WCAG 2.1 AA accessibility compliance for government mandate",
    ],
  },
];

const PRIORITY = [
  { label: "Complete 7-Stage Workflow", tag: "MUST HAVE", color: G.green2 },
  { label: "AI Gist Generation", tag: "DIFFERENTIATOR", color: G.teal },
  { label: "MoM Document Lock", tag: "MUST HAVE", color: G.green1 },
  { label: "Real-time Notifications", tag: "HIGH IMPACT", color: G.amber },
  { label: "GIS Map Filing", tag: "WOW FACTOR", color: G.blue },
  { label: "Analytics Dashboard", tag: "JUDGE PLEASER", color: G.purple },
];

export default function App() {
  const [tab, setTab] = useState("workflow");
  const [vis, setVis] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);

  return (
    <div style={{
      fontFamily: "'Georgia', 'Palatino Linotype', serif",
      background: G.bg,
      minHeight: "100vh",
      color: G.text,
    }}>
      {/* Top bar - govt style */}
      <div style={{
        background: G.green1,
        padding: "6px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `3px solid ${G.gold}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: `linear-gradient(135deg, ${G.green3}, ${G.gold})`,
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, boxShadow: `0 0 12px ${G.gold}60`,
          }}>🌿</div>
          <div>
            <div style={{ color: G.goldLight, fontWeight: 700, fontSize: 15, letterSpacing: "1px" }}>PARIVESH 3.0</div>
            <div style={{ color: G.green4, fontSize: 10, letterSpacing: "2px" }}>CHHATTISGARH ENVIRONMENT CONSERVATION BOARD</div>
          </div>
        </div>
        <div style={{ color: G.green4, fontSize: 11, letterSpacing: "1px" }}>DIGITAL CLEARANCE MANAGEMENT SYSTEM</div>
      </div>

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${G.green1} 0%, #2a5c3a 60%, #1e4a30 100%)`,
        padding: "40px 40px 32px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: 80 + i * 60,
            height: 80 + i * 60,
            borderRadius: "50%",
            border: `1px solid rgba(255,255,255,${0.03 + i * 0.01})`,
            top: -20 - i * 30,
            right: -20 - i * 30,
          }} />
        ))}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            fontSize: 11, letterSpacing: "3px", color: G.gold,
            textTransform: "uppercase", marginBottom: 10,
          }}>Environmental Governance · GovTech · PS-02</div>
          <div style={{ fontSize: 34, fontWeight: 700, color: G.white, lineHeight: 1.2, marginBottom: 8 }}>
            Role-Based Environmental<br />Clearance System
          </div>
          <div style={{ color: G.green4, fontSize: 14, maxWidth: 600 }}>
            Complete lifecycle management — from application filing to finalized Minutes of Meeting
          </div>

          {/* Tab switcher */}
          <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
            {[
              { id: "workflow", label: "⚡  Workflow Diagram" },
              { id: "features", label: "🚀  Feature Roadmap" },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "9px 22px",
                borderRadius: 6,
                border: "none",
                background: tab === t.id ? G.gold : "rgba(255,255,255,0.1)",
                color: tab === t.id ? G.green1 : G.green4,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                letterSpacing: "0.5px",
                fontFamily: "'Georgia', serif",
                transition: "all 0.2s",
                boxShadow: tab === t.id ? `0 2px 12px ${G.gold}50` : "none",
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "36px 40px 60px" }}>
        {tab === "workflow" ? (
          <>
            {/* Status Strip */}
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              marginBottom: 36,
              background: G.white,
              border: `1px solid ${G.border}`,
              borderRadius: 10,
              padding: "14px 20px",
              flexWrap: "wrap",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: G.textLight, letterSpacing: "1.5px", marginRight: 8 }}>LIFECYCLE STAGES</span>
              {STAGES.map((s, i) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "4px 12px",
                    borderRadius: 100,
                    background: s.color + "15",
                    border: `1px solid ${s.color}40`,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: s.color, letterSpacing: "0.8px" }}>{s.label}</span>
                  </div>
                  {i < STAGES.length - 1 && <span style={{ color: G.border, fontSize: 14 }}>›</span>}
                </div>
              ))}
            </div>

            {/* Role Headers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 4 }}>
              {[
                { icon: "⚙️", label: "ADMIN", sub: "Controls & Templates", color: G.gold, bg: "#fdf6e3" },
                { icon: "🏗️", label: "PROJECT PROPONENT", sub: "Files & Tracks", color: G.blue, bg: "#e8eef4" },
                { icon: "🔍", label: "SCRUTINY TEAM", sub: "Reviews & Refers", color: G.purple, bg: "#f0eaf5" },
                { icon: "📋", label: "MoM TEAM", sub: "Drafts & Finalizes", color: G.teal, bg: "#e6f4f4" },
              ].map(r => (
                <div key={r.label} style={{
                  background: r.bg,
                  border: `2px solid ${r.color}50`,
                  borderRadius: "10px 10px 0 0",
                  padding: "14px 16px",
                  textAlign: "center",
                  opacity: vis ? 1 : 0,
                  transform: vis ? "translateY(0)" : "translateY(-10px)",
                  transition: "all 0.4s ease",
                }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{r.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: r.color, letterSpacing: "1px" }}>{r.label}</div>
                  <div style={{ fontSize: 10, color: G.textLight, marginTop: 2 }}>{r.sub}</div>
                </div>
              ))}
            </div>

            {/* Swimlane Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              border: `1px solid ${G.border}`,
              borderTop: "none",
              borderRadius: "0 0 12px 12px",
              overflow: "hidden",
              background: G.white,
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}>
              {/* Col backgrounds */}
              {/* Row 1: Admin setup */}
              <SLCell color={G.gold} bg="#fffbf0">
                <Node icon="⚙️" color={G.gold} title="System Setup" body="Create master gist templates · Assign sector params · Create Scrutiny & MoM accounts" badge="ADMIN ONLY" badgeColor={G.gold} />
              </SLCell>
              <SLCell color={G.blue} bg="#f5f8fc" shade>
                <Node icon="👤" color={G.blue} title="Register & Login" body="Self-register with email · Complete profile · Select industry & sector type" />
              </SLCell>
              <SLCell color={G.purple} bg="#faf7fc" shade />
              <SLCell color={G.teal} bg="#f5fbfb" shade />

              {/* Connector row */}
              <ConnRow color={G.gold} col="left" />
              <ConnRow color={G.blue} />
              <ConnRow color={G.purple} shade />
              <ConnRow color={G.teal} shade />

              {/* Row 2 */}
              <SLCell color={G.gold} bg="#fffbf0" shade />
              <SLCell color={G.blue} bg="#f5f8fc">
                <Node icon="📝" color={G.blue} title="Multi-Step Application Form" body="Step 1: Project name, sector, category, location · Step 2: Description & environmental summary" badge="STATUS: DRAFT" badgeColor={G.textLight} />
              </SLCell>
              <SLCell color={G.purple} bg="#faf7fc" shade />
              <SLCell color={G.teal} bg="#f5fbfb" shade />

              <ConnRow color={G.gold} shade />
              <ConnRow color={G.blue} />
              <ConnRow color={G.purple} shade />
              <ConnRow color={G.teal} shade />

              {/* Row 3 */}
              <SLCell color={G.gold} bg="#fffbf0" shade />
              <SLCell color={G.blue} bg="#f5f8fc">
                <Node icon="📄" color={G.blue} title="Upload Documents" body="Only .doc / .docx accepted · Rejected at frontend AND backend · File slot per document type" />
              </SLCell>
              <SLCell color={G.purple} bg="#faf7fc" shade />
              <SLCell color={G.teal} bg="#f5fbfb" shade />

              <ConnRow color={G.gold} shade />
              <ConnRow color={G.blue} />
              <ConnRow color={G.purple} shade />
              <ConnRow color={G.teal} shade />

              {/* Payment placeholder */}
              <SLCell color={G.gold} bg="#fffbf0" shade />
              <SLCell color={G.blue} bg="#f5f8fc">
                <div style={{
                  border: `2px dashed ${G.border}`,
                  borderRadius: 8, padding: "12px 14px",
                  background: "#f8f9fa",
                }}>
                  <div style={{ fontSize: 12, color: G.textLight, fontWeight: 700, marginBottom: 4 }}>💳 PAYMENT MODULE</div>
                  <div style={{ fontSize: 11, color: G.textLight, fontStyle: "italic" }}>TODO: UPI / QR Code integration · Fee auto-calculated by sector & project size</div>
                  <div style={{ marginTop: 6, fontSize: 9, color: G.gold, fontWeight: 700, letterSpacing: "1px" }}>← PLUG-IN READY SLOT →</div>
                </div>
              </SLCell>
              <SLCell color={G.purple} bg="#faf7fc" shade />
              <SLCell color={G.teal} bg="#f5fbfb" shade />

              <ConnRow color={G.gold} shade />
              <ConnRow color={G.blue} />
              <ConnRow color={G.purple} shade />
              <ConnRow color={G.teal} shade />

              {/* Submit */}
              <SLCell color={G.gold} bg="#fffbf0" shade />
              <SLCell color={G.blue} bg="#f5f8fc">
                <Node icon="🚀" color={G.blue} title="Submit Application" body="Status moves DRAFT → SUBMITTED · Scrutiny team receives in-app notification instantly" badge="STATUS: SUBMITTED" badgeColor={G.blue} />
              </SLCell>
              <SLCell color={G.purple} bg="#faf7fc" shade />
              <SLCell color={G.teal} bg="#f5fbfb" shade />

              {/* Arrow to Scrutiny */}
              <SLCell color={G.gold} bg="#fffbf0" shade />
              <SLCell color={G.blue} bg="#f5f8fc" shade>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "4px 0", gap: 4 }}>
                  <div style={{ fontSize: 10, color: G.purple, fontWeight: 700 }}>Appears in queue</div>
                  <div style={{ flex: 1, height: 2, background: `linear-gradient(to right, ${G.blue}40, ${G.purple})`, borderRadius: 2 }} />
                  <span style={{ color: G.purple }}>▶</span>
                </div>
              </SLCell>
              <SLCell color={G.purple} bg="#faf7fc" />
              <SLCell color={G.teal} bg="#f5fbfb" shade />

              {/* Scrutiny reviews */}
              <SLCell color={G.gold} bg="#fffbf0" shade />
              <SLCell color={G.blue} bg="#f5f8fc" shade />
              <SLCell color={G.purple} bg="#faf7fc">
                <Node icon="🔎" color={G.purple} title="Document Review" body="Opens application · Downloads & reads .doc/.docx · Verifies payment receipt · Checks completeness" badge="STATUS: UNDER SCRUTINY" badgeColor={G.amber} />
              </SLCell>
              <SLCell color={G.teal} bg="#f5fbfb" shade />

              {/* EDS Branch */}
              <SLCell color={G.gold} bg="#fffbf0" shade />
              <SLCell color={G.blue} bg="#f5f8fc">
                <div style={{
                  border: `1px solid ${G.red}40`,
                  borderRadius: 8, padding: "12px 14px",
                  background: "#fdf5f5",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <span>⚠️</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: G.red }}>EDS Notification</span>
                  </div>
                  <div style={{ fontSize: 11, color: G.textMid, lineHeight: 1.5 }}>Proponent alerted · Re-upload corrected .doc/.docx · Resubmit → loops back to UNDER SCRUTINY</div>
                  <div style={{ marginTop: 8, padding: "3px 10px", background: `${G.red}15`, border: `1px solid ${G.red}40`, borderRadius: 100, display: "inline-block", fontSize: 9, color: G.red, fontWeight: 800, letterSpacing: "0.8px" }}>STATUS: EDS RAISED</div>
                  <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ flex: 1, height: 1.5, background: `linear-gradient(to right, ${G.red}, ${G.purple})`, borderRadius: 2 }} />
                    <span style={{ color: G.purple, fontSize: 11 }}>↩ loop</span>
                  </div>
                </div>
              </SLCell>
              <SLCell color={G.purple} bg="#faf7fc">
                <Node icon="🚩" color={G.red} title="Raise EDS Flag" body="Type specific deficiency reason · Proponent auto-notified · Application returns for correction" badge="TRIGGER: EDS" badgeColor={G.red} />
              </SLCell>
              <SLCell color={G.teal} bg="#f5fbfb" shade />

              {/* OR - Refer */}
              <SLCell color={G.gold} bg="#fffbf0" shade />
              <SLCell color={G.blue} bg="#f5f8fc" shade />
              <SLCell color={G.purple} bg="#faf7fc">
                <div style={{
                  borderTop: `1px dashed ${G.border}`,
                  paddingTop: 10, marginTop: 4,
                  fontSize: 10, color: G.textLight, textAlign: "center", marginBottom: 8,
                }}>— OR if documents complete —</div>
                <Node icon="✅" color={G.purple} title="Refer for Meeting" body="All documents verified · Click Refer button · Triggers automatic gist generation on backend" badge="STATUS: REFERRED" badgeColor={G.purple} />
              </SLCell>
              <SLCell color={G.teal} bg="#f5fbfb" shade />

              {/* Arrow to gist */}
              <ConnRow color={G.gold} shade />
              <ConnRow color={G.blue} shade />
              <ConnRow color={G.purple} />
              <ConnRow color={G.teal} shade />

              {/* Auto gist */}
              <SLCell color={G.gold} bg="#fffbf0" shade />
              <SLCell color={G.blue} bg="#f5f8fc" shade />
              <SLCell color={G.purple} bg="#faf7fc">
                <Node icon="🤖" color={G.teal} title="Auto Gist Generation" body="Backend fetches sector template · Substitutes {{project_name}}, {{sector}}, {{location}}, {{proponent_name}} · Saves to gists table" badge="STATUS: MoM GENERATED" badgeColor={G.teal} />
              </SLCell>
              <SLCell color={G.teal} bg="#f5fbfb" shade />

              {/* Arrow right to MoM team */}
              <SLCell color={G.gold} bg="#fffbf0" shade />
              <SLCell color={G.blue} bg="#f5f8fc" shade />
              <SLCell color={G.purple} bg="#faf7fc" shade>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "4px 0", gap: 4 }}>
                  <div style={{ fontSize: 10, color: G.teal, fontWeight: 700 }}>Appears in MoM queue</div>
                  <div style={{ flex: 1, height: 2, background: `linear-gradient(to right, ${G.purple}40, ${G.teal})`, borderRadius: 2 }} />
                  <span style={{ color: G.teal }}>▶</span>
                </div>
              </SLCell>
              <SLCell color={G.teal} bg="#f5fbfb" />

              {/* MoM edit */}
              <SLCell color={G.gold} bg="#fffbf0" shade />
              <SLCell color={G.blue} bg="#f5f8fc" shade />
              <SLCell color={G.purple} bg="#faf7fc" shade />
              <SLCell color={G.teal} bg="#f5fbfb">
                <Node icon="✍️" color={G.teal} title="Edit & Refine Gist" body="Rich text editor opens generated gist · MoM officer refines AI content · Adds committee discussion notes" />
              </SLCell>

              <ConnRow color={G.gold} shade />
              <ConnRow color={G.blue} shade />
              <ConnRow color={G.purple} shade />
              <ConnRow color={G.teal} />

              {/* Finalize */}
              <SLCell color={G.gold} bg="#fffbf0" shade />
              <SLCell color={G.blue} bg="#f5f8fc" shade />
              <SLCell color={G.purple} bg="#faf7fc" shade />
              <SLCell color={G.teal} bg="#f5fbfb">
                <Node icon="🔒" color={G.green2} title="Finalize & Lock MoM" body="is_locked = TRUE in DB · Backend returns 423 on any edit attempt · Immutable record created" badge="STATUS: FINALIZED 🔒" badgeColor={G.green2} />
              </SLCell>

              {/* Arrow back to proponent */}
              <SLCell color={G.gold} bg="#fffbf0" shade />
              <SLCell color={G.blue} bg="#f5f8fc">
                <div style={{
                  border: `1px solid ${G.green2}40`,
                  borderRadius: 8, padding: "12px 14px",
                  background: G.green5,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span>⬇️</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: G.green2 }}>Download Final MoM</span>
                  </div>
                  <div style={{ fontSize: 11, color: G.textMid }}>Available as PDF & Word (.docx) · Application journey complete!</div>
                  <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                    <span style={{ padding: "2px 8px", background: `${G.green2}20`, border: `1px solid ${G.green2}50`, borderRadius: 100, fontSize: 9, color: G.green2, fontWeight: 700 }}>PDF</span>
                    <span style={{ padding: "2px 8px", background: `${G.blue}20`, border: `1px solid ${G.blue}50`, borderRadius: 100, fontSize: 9, color: G.blue, fontWeight: 700 }}>WORD</span>
                  </div>
                </div>
              </SLCell>
              <SLCell color={G.purple} bg="#faf7fc" shade />
              <SLCell color={G.teal} bg="#f5fbfb" shade>
                <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 0" }}>
                  <span style={{ color: G.blue, fontSize: 11 }}>◀ notifies proponent</span>
                  <div style={{ flex: 1, height: 2, background: `linear-gradient(to left, ${G.teal}40, ${G.blue})`, borderRadius: 2 }} />
                  <span style={{ color: G.blue }}>◀</span>
                </div>
              </SLCell>
            </div>

            {/* Audit trail */}
            <div style={{
              marginTop: 20,
              padding: "14px 20px",
              background: G.green5,
              border: `1px solid ${G.green4}`,
              borderLeft: `4px solid ${G.green2}`,
              borderRadius: 8,
              display: "flex", alignItems: "center", gap: 12,
              fontSize: 13, color: G.textMid,
            }}>
              <span style={{ fontSize: 18 }}>📝</span>
              <span><strong style={{ color: G.green1 }}>Audit Trail:</strong> Every status transition is logged to <code style={{ background: G.green4 + "50", padding: "1px 6px", borderRadius: 3, fontSize: 12 }}>audit_log</code> with timestamp, officer ID, old status, new status, and remarks. Immutable. Exportable.</span>
            </div>
          </>
        ) : (
          /* FEATURES TAB */
          <>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ fontSize: 11, letterSpacing: "3px", color: G.gold, textTransform: "uppercase", marginBottom: 8 }}>Hackathon Advantage</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: G.green1 }}>Future-Proof Feature Roadmap</div>
              <div style={{ color: G.textLight, fontSize: 14, marginTop: 6 }}>30 features to make PARIVESH 3.0 unique, AI-ready, and production-grade</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {FEATURES.map((f, i) => (
                <div key={i}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  style={{
                    background: f.bg,
                    border: `1px solid ${f.color}30`,
                    borderLeft: `4px solid ${f.color}`,
                    borderRadius: 10,
                    padding: "20px 22px",
                    transition: "all 0.2s",
                    boxShadow: hoveredFeature === i ? `0 4px 20px ${f.color}20` : "0 2px 6px rgba(0,0,0,0.04)",
                    opacity: vis ? 1 : 0,
                    transform: vis ? "translateY(0)" : "translateY(16px)",
                  }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: f.color, marginBottom: 14, fontFamily: "'Georgia', serif" }}>{f.cat}</div>
                  {f.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 9 }}>
                      <div style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: f.color, marginTop: 6, flexShrink: 0,
                        boxShadow: `0 0 4px ${f.color}80`,
                      }} />
                      <div style={{ fontSize: 13, color: G.textMid, lineHeight: 1.6 }}>{item}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Priority */}
            <div style={{
              marginTop: 24,
              background: G.green5,
              border: `1px solid ${G.green4}`,
              borderRadius: 10,
              padding: "20px 24px",
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: G.green1, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                🎯 <span>Hackathon Build Priority</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {PRIORITY.map(p => (
                  <div key={p.label} style={{
                    padding: "7px 16px",
                    background: G.white,
                    border: `1px solid ${p.color}50`,
                    borderRadius: 100,
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: G.text }}>{p.label}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 800, color: p.color,
                      background: p.color + "15", padding: "1px 7px", borderRadius: 100, letterSpacing: "0.5px",
                    }}>{p.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{
        background: G.green1,
        borderTop: `2px solid ${G.gold}`,
        padding: "12px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ color: G.green4, fontSize: 11, letterSpacing: "1px" }}>PARIVESH 3.0 · CECB · PS-02 · Team Delulu</span>
        <span style={{ color: G.gold, fontSize: 11 }}>Web2 Hackathon 2026</span>
      </div>
    </div>
  );
}

function SLCell({ children, color, bg, shade }) {
  return (
    <div style={{
      background: shade ? (bg + "bb") : bg,
      borderRight: `1px solid ${color}15`,
      borderBottom: `1px solid rgba(0,0,0,0.04)`,
      padding: "10px 12px",
      minHeight: 24,
    }}>
      {children}
    </div>
  );
}

function Node({ icon, color, title, body, badge, badgeColor }) {
  return (
    <div style={{
      background: G.white,
      border: `1px solid ${color}30`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 8,
      padding: "10px 12px",
      boxShadow: `0 2px 8px ${color}10`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
        <span style={{ fontSize: 15 }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 800, color, fontFamily: "'Georgia', serif" }}>{title}</span>
      </div>
      <div style={{ fontSize: 11, color: G.textLight, lineHeight: 1.55 }}>{body}</div>
      {badge && (
        <div style={{
          marginTop: 8,
          display: "inline-block",
          padding: "2px 9px",
          borderRadius: 100,
          background: badgeColor + "18",
          border: `1px solid ${badgeColor}50`,
          color: badgeColor,
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.8px",
        }}>{badge}</div>
      )}
    </div>
  );
}

function ConnRow({ color, shade }) {
  return (
    <div style={{
      background: shade ? "rgba(0,0,0,0.01)" : "transparent",
      borderRight: `1px solid ${color}15`,
      borderBottom: `1px solid rgba(0,0,0,0.03)`,
      padding: "0 12px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 20,
    }}>
      {!shade && (
        <>
          <div style={{ width: 2, height: 12, background: `linear-gradient(to bottom, ${color}60, ${color}30)` }} />
          <span style={{ color, fontSize: 10, lineHeight: 1 }}>▼</span>
        </>
      )}
    </div>
  );
}