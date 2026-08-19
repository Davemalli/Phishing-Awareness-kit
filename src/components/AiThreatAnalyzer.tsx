import React, { useState } from "react";
import { Sparkles, ShieldAlert, ShieldCheck, AlertTriangle, ArrowRight, RefreshCw, Copy, Check, FileSearch, Zap } from "lucide-react";
import { ThreatAnalysisResponse } from "../types";

export const AiThreatAnalyzer: React.FC = () => {
  const [sender, setSender] = useState<string>("it-support@okta-identity-verify.net");
  const [subject, setSubject] = useState<string>("URGENT: Okta SSO Token Expired - Re-authenticate within 4 hours");
  const [headers, setHeaders] = useState<string>("Received: from unknown-vps-194.26.29.102; Return-Path: <bounces@identity-relay.top>; SPF=fail; DMARC=fail");
  const [body, setBody] = useState<string>(
    `Dear Employee,\n\nOur automated security monitors detected an expired SSO session certificate on your workstation.\n\nTo avoid total account suspension and loss of access to Jira, GitHub, and Corporate Email, you must re-verify your MFA token immediately.\n\nClick below to verify:\nhttps://auth-okta-portal.identity-gateway-sso.net/login/auth?ref=workstation\n\nIT Identity Operations`
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ThreatAnalysisResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick preset samples
  const loadPreset = (presetType: string) => {
    setErrorMsg(null);
    if (presetType === "bec") {
      setSender("Jonathan Sterling <ceo.sterling@executive-direct-line.com>");
      setSubject("Confidential urgent request - Need you to process a wire transfer");
      setHeaders("Return-Path: <jonathan.private.inbox@mail-consulting-relay.com>; SPF=neutral; DKIM=none; DMARC=fail");
      setBody(
        `Hi,\n\nI am currently in an executive closed-door NDA session with outside counsel and cannot take voice phone calls.\n\nI need you to process an immediate wire disbursement of $48,500 to secure an acquisition retainer before 2 PM.\n\nPlease keep this strictly between us until the company all-hands tomorrow. Reply with your cell number and I will send the bank wire routing info.\n\nJonathan Sterling\nChief Executive Officer`
      );
    } else if (presetType === "docusign") {
      setSender("DocuSign Signature Service <service@docusign-cloud-docs-portal.com>");
      setSubject("Action Required: Please DocuSign '2026_Severance_and_Compensation_Schedule.pdf'");
      setHeaders("Return-Path: <mailer@docusign-cloud-docs-portal.com>; SPF=fail; DKIM=fail");
      setBody(
        `DocuSign Electronic Signature Notification:\n\nHR Leadership has requested your electronic signature on the following restricted document:\n\nDocument: 2026_Severance_and_Compensation_Schedule.pdf\n\nClick the secure link below to authenticate your identity and sign:\nhttps://docusign-cloud-docs-portal.com/sign/auth?docId=98418\n\nThis document link will expire in 24 hours.`
      );
    } else if (presetType === "payroll") {
      setSender("Payroll Direct Deposit <payroll-update@acmecorp-hris-verify.info>");
      setSubject("Mandatory: Verify Bank Routing Number for August Payroll Run");
      setHeaders("Return-Path: <mailer@hris-verify.info>; SPF=fail; DMARC=fail");
      setBody(
        `Hello,\n\nDue to our mid-year banking partner transition, all direct deposit checking accounts must be re-verified by 5:00 PM today to avoid delayed paycheck disbursement.\n\nPlease log in to the payroll gateway to confirm your account number:\nhttps://acmecorp-hris-verify.info/banking/direct-deposit\n\nHuman Resources & Benefits`
      );
    } else if (presetType === "legit") {
      setSender("Corporate Communications <all-staff@acmecorp.com>");
      setSubject("Company All-Hands Meeting & Q3 Milestone Celebration - This Thursday at 10 AM");
      setHeaders("Return-Path: <all-staff@acmecorp.com>; SPF=pass (IP 35.190.247.1); DKIM=pass header.d=acmecorp.com; DMARC=pass");
      setBody(
        `Hi Everyone,\n\nPlease join us for our quarterly all-hands meeting this Thursday at 10:00 AM UTC in the main cafeteria or on our standard internal Google Meet link.\n\nAgenda:\n- Q2 Financial Highlights & Customer Growth\n- Product Roadmap Unveiling\n- Live Q&A with Executive Leadership\n\nSubmit questions in advance on the internal #all-hands Slack channel.\n\nBest regards,\nCorporate Communications Team`
      );
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/analyze-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender,
          subject,
          headers,
          body,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned error status ${response.status}`);
      }

      const data: ThreatAnalysisResponse = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error("AI Analysis failed:", err);
      setErrorMsg(err.message || "Failed to analyze email.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadge = (score: number) => {
    if (score >= 70) return "text-red-700 bg-red-100 border-red-200";
    if (score >= 40) return "text-amber-700 bg-amber-100 border-amber-200";
    return "text-green-700 bg-green-100 border-green-200";
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Threat Forensics & Analysis Engine</h2>
              <p className="text-xs text-slate-500">
                Powered by Gemini models for automated social engineering detection and IOC dissection.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-medium">Test Presets:</span>
          <button
            onClick={() => loadPreset("bec")}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
          >
            CEO Wire (BEC)
          </button>
          <button
            onClick={() => loadPreset("docusign")}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
          >
            Fake DocuSign
          </button>
          <button
            onClick={() => loadPreset("payroll")}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
          >
            Payroll Scam
          </button>
          <button
            onClick={() => loadPreset("legit")}
            className="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium border border-green-200 transition-colors cursor-pointer"
          >
            Legitimate Memo
          </button>
        </div>
      </div>

      {/* Main Grid: Input Form (Left 6) + AI Results (Right 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Form */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-blue-600" />
            <span>Email Data Under Inspection</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Sender Address / Display Name</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g. IT Helpdesk <admin@lookalike-domain.com>"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 font-mono text-xs shadow-xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Subject Line</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Urgent Action Required..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 text-xs shadow-xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Headers & Technical Context (Optional)</label>
              <input
                type="text"
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                placeholder="e.g. Return-Path, SPF status, originating IP..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 font-mono text-xs shadow-xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Email Body Content</label>
              <textarea
                rows={8}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Paste the raw body text of the suspicious email here..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-none focus:border-blue-500 font-sans text-xs leading-relaxed shadow-xs"
              />
            </div>

            <button
              id="btn-run-ai-analysis"
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating Threat Indicators with AI...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Analyze Threat & Identify Red Flags</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Threat Forensics Results Display */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[540px] flex flex-col">
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {analysisResult ? (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Verdict & Score Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Threat Assessment Verdict
                  </span>
                  <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    {analysisResult.riskScore >= 60 ? (
                      <ShieldAlert className="w-5 h-5 text-red-600" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    )}
                    <span>{analysisResult.verdict}</span>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-xl border text-center font-mono ${getRiskBadge(analysisResult.riskScore)}`}>
                  <div className="text-2xl font-bold">{analysisResult.riskScore}%</div>
                  <div className="text-[9px] uppercase font-bold tracking-wider">Risk Score</div>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Executive Threat Summary
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  {analysisResult.summary}
                </p>
              </div>

              {/* Psychological Triggers */}
              {analysisResult.psychologicalTriggers?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Social Engineering Triggers Detected
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.psychologicalTriggers.map((trigger, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[11px] font-medium"
                      >
                        ⚠️ {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Red Flags Dissected */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Identified Red Flags & Deceptions
                </h4>
                <div className="space-y-2">
                  {analysisResult.redFlags.map((flag, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Indicators */}
              {analysisResult.technicalIndicators && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Technical Indicators of Compromise (IOC)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block font-semibold">Sender Domain:</span>
                      <span className="text-slate-800 mt-0.5 block font-medium">{analysisResult.technicalIndicators.senderAnomaly}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block font-semibold">Link Safety:</span>
                      <span className="text-slate-800 mt-0.5 block font-medium">{analysisResult.technicalIndicators.linkSafety}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block font-semibold">Attachment Risk:</span>
                      <span className="text-slate-800 mt-0.5 block font-medium">{analysisResult.technicalIndicators.attachmentRisk}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommended Actions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  SOC Recommended Defensive Actions
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {analysisResult.recommendedActions.map((act, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
                <Sparkles className="w-7 h-7 text-blue-600" />
              </div>
              <h4 className="text-slate-800 font-semibold text-sm">Awaiting Email Submission</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Enter email content or select a preset on the left, then click <strong>"Analyze Threat"</strong> to generate a comprehensive AI forensic report.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
