import React, { useState } from "react";
import { SimulationEmail } from "../types";
import { X, ShieldCheck, ShieldAlert, ShieldX, Terminal, Copy, Check, Info } from "lucide-react";

interface HeaderInspectorModalProps {
  email: SimulationEmail;
  isOpen: boolean;
  onClose: () => void;
}

export const HeaderInspectorModal: React.FC<HeaderInspectorModalProps> = ({
  email,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"visual" | "raw">("visual");

  if (!isOpen) return null;

  const rawHeadersString = `Delivered-To: employee@acmecorp.com
Received: by 2002:a05:6e02:1189 with SMTP id x9csp389148
        Wed, 19 Aug 2026 08:42:15 -0700 (PDT)
X-Received: by 2002:a17:902:d00d with SMTP id j13mr29841804
ARC-Authentication-Results: i=1; mx.google.com;
       spf=${email.headers.spf.toLowerCase()} (ip=${email.headers.receivedFromIp})
       dkim=${email.headers.dkim.toLowerCase()}
       dmarc=${email.headers.dmarc.toLowerCase()}
Return-Path: ${email.headers.returnPath}
Received-SPF: ${email.headers.spf} (${email.headers.authenticationResults})
From: ${email.headers.from}
To: ${email.headers.to}
Reply-To: ${email.replyTo || email.senderEmail}
Subject: ${email.subject}
Date: Wed, 19 Aug 2026 08:42:01 -0700
Message-ID: <sim-${email.id}-security-${Date.now()}@relay.gateway>
X-Mailer: Security-Simulation-Engine/2.4
X-Originating-IP: [${email.headers.receivedFromIp}]
MIME-Version: 1.0
Content-Type: text/html; charset=UTF-8`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawHeadersString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PASS":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase"><ShieldCheck className="w-3 h-3" /> PASS</span>;
      case "FAIL":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase"><ShieldX className="w-3 h-3" /> FAIL</span>;
      case "SOFTFAIL":
      case "QUARANTINE":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase"><ShieldAlert className="w-3 h-3" /> {status}</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">NONE</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden text-slate-800 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Email Header &amp; Authentication Forensics</h3>
              <p className="text-xs text-slate-500">Inspection of SPF, DKIM, DMARC, and sender routing</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setActiveTab("visual")}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  activeTab === "visual" ? "bg-white text-blue-600 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Diagnostics
              </button>
              <button
                onClick={() => setActiveTab("raw")}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  activeTab === "raw" ? "bg-white text-blue-600 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Raw Headers
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-700 text-xs space-y-5">
          {activeTab === "visual" ? (
            <>
              {/* Protocol Diagnostics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* SPF Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-xs">SPF Check</span>
                    {getStatusBadge(email.headers.spf)}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
                    Sender Policy Framework: Verifies if the sending server IP address is authorized by the domain.
                  </p>
                  <div className="text-[10px] font-mono bg-white p-2 rounded border border-slate-200 text-slate-700 break-all">
                    IP: {email.headers.receivedFromIp}
                  </div>
                </div>

                {/* DKIM Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-xs">DKIM Signature</span>
                    {getStatusBadge(email.headers.dkim)}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
                    DomainKeys Identified Mail: Cryptographically signs email contents to verify integrity.
                  </p>
                  <div className="text-[10px] font-mono bg-white p-2 rounded border border-slate-200 text-slate-700 break-all">
                    Status: {email.headers.dkim === "PASS" ? "Valid Cryptographic Signature" : "Missing / Unsigned Key"}
                  </div>
                </div>

                {/* DMARC Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-xs">DMARC Alignment</span>
                    {getStatusBadge(email.headers.dmarc)}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
                    Domain-based Message Authentication: Enforces policy when SPF or DKIM fails alignment checks.
                  </p>
                  <div className="text-[10px] font-mono bg-white p-2 rounded border border-slate-200 text-slate-700 break-all">
                    Policy: {email.headers.dmarc === "PASS" ? "Aligned Pass (none)" : "Unaligned / Fail"}
                  </div>
                </div>
              </div>

              {/* Envelope vs Display Breakdown */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sender Routing &amp; Address Mismatch Forensics</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Header From (Display):</span>
                    <div className="text-slate-900 font-mono mt-0.5 break-all font-medium">{email.headers.from}</div>
                    <p className="text-[10px] text-slate-500 mt-1">What the user sees in the client interface.</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Return-Path (Envelope Sender):</span>
                    <div className="text-slate-900 font-mono mt-0.5 break-all font-medium">{email.headers.returnPath}</div>
                    <p className="text-[10px] text-slate-500 mt-1">Where automated bounce reports and replies actually route.</p>
                  </div>

                  {email.replyTo && (
                    <div className="bg-white p-3 rounded-lg border border-slate-200 sm:col-span-2">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Reply-To Redirection:</span>
                      <div className="text-amber-700 font-mono mt-0.5 break-all font-semibold">{email.replyTo}</div>
                      <p className="text-[10px] text-amber-700 mt-1">
                        {email.replyTo !== email.senderEmail ? "⚠️ Note: Reply-To points to a different destination than the sender!" : "Matches sender."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Authentication Results String */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-slate-500 font-semibold mb-1 text-[11px]">Authentication-Results Header Log:</div>
                <div className="font-mono text-slate-700 bg-white p-3 rounded border border-slate-200 text-[11px] leading-relaxed break-all">
                  {email.headers.authenticationResults}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-slate-500">RFC 5322 Standard Email Headers</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs transition-colors border border-slate-200 shadow-xs cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Raw Headers"}</span>
                </button>
              </div>
              <pre className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 leading-relaxed overflow-x-auto whitespace-pre">
                {rawHeadersString}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
