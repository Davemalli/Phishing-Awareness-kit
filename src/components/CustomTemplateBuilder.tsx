import React, { useState } from "react";
import { SimulationEmail, AttackVector, DifficultyLevel, RedFlag } from "../types";
import { PenTool, Sparkles, Smartphone, Monitor, Save, RefreshCw, Plus, Trash2, CheckCircle2, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

interface CustomTemplateBuilderProps {
  onSaveTemplate: (newTemplate: SimulationEmail) => void;
}

export const CustomTemplateBuilder: React.FC<CustomTemplateBuilderProps> = ({ onSaveTemplate }) => {
  const [title, setTitle] = useState<string>("Corporate Password Expiration Notice");
  const [senderName, setSenderName] = useState<string>("IT Security Portal");
  const [senderEmail, setSenderEmail] = useState<string>("notifications@corporate-identity-renew.net");
  const [replyTo, setReplyTo] = useState<string>("");
  const [subject, setSubject] = useState<string>("🚨 [MANDATORY] Corporate Password Expiration Warning - Update in 24 Hours");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Intermediate");
  const [attackVector, setAttackVector] = useState<AttackVector>("Credential Harvester");
  const [targetDepartment, setTargetDepartment] = useState<string>("All Staff");
  const [bodyHtml, setBodyHtml] = useState<string>(
    `<div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
  <p>Dear Colleague,</p>
  <p>In accordance with corporate identity security protocols, your network access password is scheduled to expire in <strong>24 hours</strong>.</p>
  <p>To retain uninterrupted access to company emails, Slack, and cloud storage, please click the secure link below to update your password:</p>
  <div style="margin: 20px 0; text-align: center;">
    <a href="https://corporate-identity-renew.net/sso/reset?user=auth" style="background: #2563eb; color: white; padding: 10px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
      Update Password Now &rarr;
    </a>
  </div>
  <p style="font-size: 12px; color: #64748b;">
    If you do not update within the required window, your account will be temporarily suspended.
  </p>
</div>`
  );

  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [industryContext, setIndustryContext] = useState<string>("Enterprise SaaS");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Red flags definition list
  const [redFlags, setRedFlags] = useState<RedFlag[]>([
    {
      id: "rf-custom-1",
      element: "Sender Domain (@corporate-identity-renew.net)",
      category: "domain",
      quoteOrLocation: "notifications@corporate-identity-renew.net",
      explanation: "Lookalike typosquat domain not belonging to the verified corporate company domain.",
      clue: "Lookalike domain name"
    },
    {
      id: "rf-custom-2",
      element: "Artificial 24-Hour Urgency",
      category: "urgency",
      quoteOrLocation: "Update in 24 Hours / Account will be temporarily suspended",
      explanation: "Creates psychological pressure to rush the employee into submitting credentials without scrutiny.",
      clue: "Urgency and fear of suspension"
    }
  ]);

  // AI Scenario Generator
  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    try {
      const response = await fetch("/api/generate-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetDepartment,
          difficulty,
          attackVector,
          industry: industryContext,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate AI scenario");
      }

      const data = await response.json();
      if (data.title) setTitle(data.title);
      if (data.senderName) setSenderName(data.senderName);
      if (data.senderEmail) setSenderEmail(data.senderEmail);
      if (data.subject) setSubject(data.subject);
      if (data.bodyHtml) setBodyHtml(data.bodyHtml);

      if (data.redFlagsExplained && Array.isArray(data.redFlagsExplained)) {
        const formatted: RedFlag[] = data.redFlagsExplained.map((rf: any, i: number) => ({
          id: `rf-ai-${Date.now()}-${i}`,
          element: rf.element || "Red Flag Anomaly",
          category: "domain",
          quoteOrLocation: rf.element || "",
          explanation: rf.explanation || "",
          clue: rf.clue || "Inspect sender and links",
        }));
        setRedFlags(formatted);
      }
    } catch (err) {
      console.error("AI Generation error:", err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAddRedFlag = () => {
    const newFlag: RedFlag = {
      id: `rf-custom-${Date.now()}`,
      element: "New Red Flag Indicator",
      category: "request",
      quoteOrLocation: "Target text snippet",
      explanation: "Why this element represents a cybersecurity threat.",
      clue: "Rule of thumb for employees",
    };
    setRedFlags([...redFlags, newFlag]);
  };

  const handleRemoveRedFlag = (index: number) => {
    setRedFlags(redFlags.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const newTemplate: SimulationEmail = {
      id: `sim-custom-${Date.now()}`,
      title,
      senderName,
      senderEmail,
      replyTo: replyTo || undefined,
      senderAvatar: "🛠️",
      subject,
      timestamp: "Just now",
      difficulty,
      attackVector,
      targetDepartment,
      isPhish: true,
      previewSnippet: subject,
      bodyHtml,
      redFlags,
      headers: {
        from: `"${senderName}" <${senderEmail}>`,
        to: "employee@acmecorp.com",
        returnPath: `<bounces@${senderEmail.split("@")[1] || "relay.net"}>`,
        spf: "FAIL",
        dkim: "FAIL",
        dmarc: "FAIL",
        authenticationResults: "spf=fail; dkim=fail; dmarc=fail (unaligned)",
        receivedFromIp: "198.51.100.22",
      },
      teachableMoments: [
        "Always verify unexpected login or security links by navigating independently to official corporate portals.",
        "Check domain endings carefully for deceptive additions or unauthorized top-level domains.",
      ],
    };

    onSaveTemplate(newTemplate);
    setSavedSuccess(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Custom Simulation Template Designer</h2>
              <p className="text-xs text-slate-500">
                Design custom phishing scenarios or generate tailored templates using Gemini models.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Deploy Template</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>Template saved successfully! It is now active in your Training Inbox and Campaign roster.</span>
        </div>
      )}

      {/* Main Grid: Builder Form (Left 6) + Live Device Preview (Right 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Builder Form */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
          {/* AI Generator Bar */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  AI Scenario Generator
                </span>
              </div>
              <button
                onClick={handleAiGenerate}
                disabled={isAiGenerating}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                {isAiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{isAiGenerating ? "Generating..." : "Generate AI Template"}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] uppercase font-semibold text-slate-500 block mb-0.5">Industry Context</label>
                <select
                  value={industryContext}
                  onChange={(e) => setIndustryContext(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
                >
                  <option value="Enterprise SaaS">Enterprise SaaS / Tech</option>
                  <option value="Healthcare & HIPAA">Healthcare & Hospital</option>
                  <option value="Banking & Financial Services">Banking & Finance</option>
                  <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                  <option value="Higher Education & University">Higher Education</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-slate-500 block mb-0.5">Target Department</label>
                <select
                  value={targetDepartment}
                  onChange={(e) => setTargetDepartment(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
                >
                  <option value="All Staff">All Staff (General)</option>
                  <option value="Finance & Accounting">Finance & Accounting</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Engineering & DevOps">Engineering & DevOps</option>
                  <option value="Executive Suite">Executive Assistants</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Template Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Sender Display Name</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Spoofed Sender Email</label>
                <input
                  type="text"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 font-mono text-xs shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Attack Vector</label>
                <select
                  value={attackVector}
                  onChange={(e) => setAttackVector(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
                >
                  <option value="Credential Harvester">Credential Harvester</option>
                  <option value="Business Email Compromise (BEC)">Business Email Compromise (BEC)</option>
                  <option value="Malicious Attachment / Macro">Malicious Attachment / Macro</option>
                  <option value="OAuth Hijack / Consent Phish">OAuth Hijack / Consent Phish</option>
                  <option value="Quishing (QR Code)">Quishing (QR Code)</option>
                  <option value="Fake IT & MFA Reset">Fake IT & MFA Reset</option>
                  <option value="Payroll / HR Scam">Payroll / HR Scam</option>
                  <option value="Package Delivery">Package Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
                >
                  <option value="Beginner">Beginner (Blatant Clues)</option>
                  <option value="Intermediate">Intermediate (Lookalike Domain)</option>
                  <option value="Advanced Spear-Phishing">Advanced Spear-Phishing</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Subject Line</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Email HTML Body (Safe Sandboxed)</label>
              <textarea
                rows={7}
                value={bodyHtml}
                onChange={(e) => setBodyHtml(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 font-mono text-xs focus:outline-none focus:border-blue-500 leading-relaxed shadow-xs"
              />
            </div>

            {/* Red Flags Builder */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-600 font-semibold">Configured Red Flags ({redFlags.length})</label>
                <button
                  type="button"
                  onClick={handleAddRedFlag}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Indicator
                </button>
              </div>

              <div className="space-y-2">
                {redFlags.map((flag, idx) => (
                  <div key={flag.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={flag.element}
                        onChange={(e) => {
                          const copy = [...redFlags];
                          copy[idx].element = e.target.value;
                          setRedFlags(copy);
                        }}
                        placeholder="Red flag title..."
                        className="bg-white border border-slate-200 rounded-md px-2.5 py-1 text-slate-800 font-semibold w-full text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveRedFlag(idx)}
                        className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={flag.explanation}
                      onChange={(e) => {
                        const copy = [...redFlags];
                        copy[idx].explanation = e.target.value;
                        setRedFlags(copy);
                      }}
                      placeholder="Why this is a red flag..."
                      className="bg-white border border-slate-200 rounded-md px-2.5 py-1 text-slate-600 text-xs w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Device Preview Canvas (Right 6) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Interactive Preview
            </h3>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1.5 rounded-md text-xs transition-all cursor-pointer ${
                  previewDevice === "desktop" ? "bg-white text-blue-600 shadow-xs font-semibold" : "text-slate-500 hover:text-slate-800"
                }`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1.5 rounded-md text-xs transition-all cursor-pointer ${
                  previewDevice === "mobile" ? "bg-white text-blue-600 shadow-xs font-semibold" : "text-slate-500 hover:text-slate-800"
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Email Preview Frame */}
          <div className={`mx-auto transition-all ${previewDevice === "mobile" ? "max-w-sm" : "w-full"}`}>
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-slate-200 text-slate-900">
              {/* Email Client Chrome */}
              <div className="bg-slate-50 p-4 border-b border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-900 text-sm leading-snug">
                  {subject || "Subject line..."}
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {senderName ? senderName[0] : "I"}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">{senderName || "Sender"}</span>{" "}
                    <span className="text-slate-400 font-mono">&lt;{senderEmail || "sender@domain.com"}&gt;</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400">
                  To: employee@acmecorp.com &bull; Today at 10:00 AM
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 overflow-y-auto max-h-[480px]">
                <div
                  className="prose prose-sm max-w-none prose-slate"
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
