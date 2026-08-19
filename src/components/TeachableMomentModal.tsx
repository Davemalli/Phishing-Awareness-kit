import React, { useState } from "react";
import { SimulationEmail } from "../types";
import { AlertTriangle, ShieldCheck, CheckCircle2, XCircle, ArrowRight, Lightbulb, Lock, HelpCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface TeachableMomentModalProps {
  email: SimulationEmail;
  isOpen: boolean;
  onClose: () => void;
  onCompletedRemediation: (pointsAwarded: number) => void;
}

export const TeachableMomentModal: React.FC<TeachableMomentModalProps> = ({
  email,
  isOpen,
  onClose,
  onCompletedRemediation,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  if (!isOpen) return null;

  const remediationQuestions: Record<string, { question: string; options: string[]; correctIndex: number; tip: string }> = {
    "Credential Harvester": {
      question: "Next time you receive an unexpected urgent request to re-authenticate or verify your corporate account, what should you do?",
      options: [
        "Click the link immediately to prevent your account from being locked",
        "Navigate to the official corporate portal or SSO bookmark independently in your browser",
        "Forward your username and password in a reply email to the sender",
        "Disable your multi-factor authentication (MFA) temporarily"
      ],
      correctIndex: 1,
      tip: "Authentic corporate services should always be accessed via known direct bookmarks, not unsolicited email links."
    },
    "Malicious Attachment / Macro": {
      question: "If an unexpected spreadsheet or document arrives asking you to 'Enable Macros' or 'Enable Content' to decrypt your bonus or invoice, what is the correct action?",
      options: [
        "Click Enable Content immediately to see the figures",
        "Do NOT enable macros; report the email to Security Operations (SOC)",
        "Rename the file extension to .txt and run it",
        "Send the file to your personal home computer to open safely"
      ],
      correctIndex: 1,
      tip: "Malicious VBA macros in .xlsm or .docm files are a primary vector for dropper malware and ransomware."
    },
    "Business Email Compromise (BEC)": {
      question: "An executive sends an urgent email asking for an off-the-books wire transfer and states they cannot be reached by phone. How should you respond?",
      options: [
        "Process the wire transfer immediately since the CEO has highest authority",
        "Verify the request through an independent out-of-band phone call or internal chat before transferring funds",
        "Reply to the email asking if they really meant $48,500",
        "Post the wire details on social media"
      ],
      correctIndex: 1,
      tip: "Always enforce dual-control verification and out-of-band telephone checks for all financial disbursements."
    },
    "OAuth Hijack / Consent Phish": {
      question: "When clicking a link to view a shared cloud file, you are prompted to grant an unfamiliar third-party app access to 'Read all your emails and files'. What should you do?",
      options: [
        "Click 'Grant Access' so you can view the document quickly",
        "Deny the permission request and report the suspicious OAuth application to IT",
        "Grant permissions only for 1 hour",
        "Create a guest account"
      ],
      correctIndex: 1,
      tip: "Illicit OAuth consent grants allow rogue apps persistent API access to your mailbox without needing your password."
    },
    "Quishing (QR Code)": {
      question: "An email displays a QR code asking you to scan it with your personal phone to install a corporate certificate or Wi-Fi profile. What is the main risk?",
      options: [
        "It drains your phone's battery faster",
        "It transfers the attack to your unmanaged personal mobile device and bypasses desktop security controls",
        "It might take up too much cellular data",
        "QR codes are only compatible with Android"
      ],
      correctIndex: 1,
      tip: "Quishing hides destination URLs inside image pixels to evade corporate email firewalls."
    }
  };

  const currentQuiz = remediationQuestions[email.attackVector] || {
    question: "What is the single most effective action when encountering an email with suspicious urgency or mismatched sender domains?",
    options: [
      "Click all links to see if they look realistic",
      "Click the 'Report Phish' button to alert your Security Operations Center (SOC)",
      "Reply with angry remarks to the sender",
      "Ignore it and leave it in your inbox"
    ],
    correctIndex: 1,
    tip: "Reporting allows automated security defenses to isolate the threat and protect other colleagues across the organization."
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setHasSubmitted(true);
    const correct = selectedAnswer === currentQuiz.correctIndex;
    setIsCorrect(correct);
    if (correct) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      onCompletedRemediation(50);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden text-slate-800 max-h-[90vh] flex flex-col">
        {/* Banner Header */}
        <div className="bg-red-600 p-6 text-white relative">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md text-white shadow-xs">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/20 text-white text-xs font-semibold uppercase tracking-wider mb-1">
                <Lock className="w-3 h-3" />
                Simulated Training Exercise
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Simulated Phishing Link Intercepted
              </h2>
              <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-xl">
                This was a safe internal security drill designed to strengthen your detection reflexes. No credentials or data were leaked.
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">
          {/* Attack Vector Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold">Attack Vector Used:</span>
              <div className="text-base font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                <span>{email.attackVector}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold uppercase">
                  {email.difficulty}
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-500 sm:text-right">
              <div>Simulated Sender: <span className="text-slate-800 font-mono font-medium">{email.senderEmail}</span></div>
              <div>Subject: <span className="text-slate-800 font-medium">{email.subject}</span></div>
            </div>
          </div>

          {/* Red Flags Breakdown */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Red Flags in This Simulation:</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {email.redFlags.map((flag, idx) => (
                <div key={flag.id || idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs mb-1">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span>{flag.element}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    {flag.explanation}
                  </p>
                  <div className="text-[11px] bg-white text-amber-800 px-2 py-1 rounded border border-amber-200 font-medium">
                    💡 Key Rule: {flag.clue}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Educational Takeaways */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Golden Defensive Takeaways</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-blue-950">
              {email.teachableMoments.map((moment, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 font-bold">&bull;</span>
                  <span>{moment}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Interactive Remediation Quiz */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2 text-xs uppercase font-bold text-slate-500 tracking-wider mb-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Remediation Check (+50 PhishIQ Points)</span>
            </div>
            <p className="font-semibold text-slate-900 text-sm mb-4">
              {currentQuiz.question}
            </p>

            <div className="space-y-2 mb-4">
              {currentQuiz.options.map((opt, i) => {
                let btnStyle = "bg-white border-slate-200 text-slate-700 hover:bg-slate-100";
                if (selectedAnswer === i) {
                  btnStyle = "bg-blue-50 border-blue-500 text-blue-900 font-medium";
                }
                if (hasSubmitted) {
                  if (i === currentQuiz.correctIndex) {
                    btnStyle = "bg-green-100 border-green-400 text-green-900 font-bold";
                  } else if (selectedAnswer === i) {
                    btnStyle = "bg-red-100 border-red-400 text-red-900 line-through";
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={hasSubmitted}
                    onClick={() => setSelectedAnswer(i)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {hasSubmitted && i === currentQuiz.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 ml-2" />
                    )}
                    {hasSubmitted && selectedAnswer === i && i !== currentQuiz.correctIndex && (
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {!hasSubmitted ? (
              <button
                disabled={selectedAnswer === null}
                onClick={handleCheckAnswer}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg text-xs transition-all shadow-sm cursor-pointer"
              >
                Submit Remediation Answer
              </button>
            ) : (
              <div className={`p-3 rounded-lg text-xs border ${isCorrect ? "bg-green-50 border-green-200 text-green-800" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
                <div className="font-semibold mb-0.5">
                  {isCorrect ? "✅ Excellent! 50 PhishIQ Points Awarded" : "⚠️ Review the takeaway:"}
                </div>
                <div>{currentQuiz.tip}</div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 hidden sm:block">
            Your defensive instincts improve with every simulation test.
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-sm ml-auto cursor-pointer"
          >
            <span>I Understand &amp; Continue Training</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
