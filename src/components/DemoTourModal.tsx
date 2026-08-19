import React, { useState } from "react";
import {
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Flag,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  RefreshCw,
  X,
  Award,
  Zap,
  Target
} from "lucide-react";
import confetti from "canvas-confetti";
import { ActiveTab } from "./Header";

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onTriggerReportPhish: () => void;
  onTriggerInspectHeaders: () => void;
  onTriggerSpotterMode: () => void;
  onTriggerSimulateDrill: () => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onTriggerReportPhish,
  onTriggerInspectHeaders,
  onTriggerSpotterMode,
  onTriggerSimulateDrill,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [demoLog, setDemoLog] = useState<string[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  if (!isOpen) return null;

  const demoSteps = [
    {
      title: "1. Simulated Phishing Inbox & Email Triage",
      description: "Inspect simulated emails in a safe sandbox. Spot lookalike sender domains, urgency traps, and suspicious attachments.",
      tab: "inbox" as ActiveTab,
      actionLabel: "Try Action: Report Phish & Score +100",
      actionIcon: <Flag className="w-4 h-4 text-red-500" />,
      runAction: () => {
        onNavigateTab("inbox");
        onTriggerReportPhish();
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        setDemoLog((prev) => [...prev, "🎯 Successfully reported phishing email 'Okta MFA Reset' (+100 PhishIQ pts awarded)"]);
      },
    },
    {
      title: "2. Red-Flag Radar & Header Forensics",
      description: "Activate Spotter Mode to inspect forensic cues (domain mismatches, deceptive URLs) or inspect RFC 5322 SPF/DKIM/DMARC headers.",
      tab: "inbox" as ActiveTab,
      actionLabel: "Try Action: Inspect Headers & Enable Radar",
      actionIcon: <FileCode className="w-4 h-4 text-blue-500" />,
      runAction: () => {
        onNavigateTab("inbox");
        onTriggerSpotterMode();
        onTriggerInspectHeaders();
        setDemoLog((prev) => [...prev, "🔍 Activated Red-Flag Spotter Radar & opened RFC 5322 header forensic inspector"]);
      },
    },
    {
      title: "3. AI Threat Forensics & IOC Engine",
      description: "Leverage Gemini AI models to analyze email bodies, uncover psychological manipulation tactics, and extract IOC indicators.",
      tab: "analyzer" as ActiveTab,
      actionLabel: "Try Action: Run AI Threat Analysis",
      actionIcon: <Sparkles className="w-4 h-4 text-cyan-500" />,
      runAction: () => {
        onNavigateTab("analyzer");
        setDemoLog((prev) => [...prev, "⚡ Switched to AI Threat Analyzer - scanning CEO Wire Scam payload"]);
      },
    },
    {
      title: "4. Live Campaign Telemetry & Department Waves",
      description: "Dispatch simulated phishing campaigns across 150+ employees, measure the Phish-Prone Percentage (PPP), and monitor resilience.",
      tab: "campaigns" as ActiveTab,
      actionLabel: "Try Action: Simulate Live Phishing Wave",
      actionIcon: <Play className="w-4 h-4 text-emerald-500" />,
      runAction: () => {
        onNavigateTab("campaigns");
        onTriggerSimulateDrill();
        setDemoLog((prev) => [...prev, "🚀 Dispatched live simulation drill wave to 6 department cohorts"]);
      },
    },
    {
      title: "5. Security Awareness Micro-Courses & Quizzes",
      description: "Interactive bite-sized security lessons covering Business Email Compromise, Quishing, OAuth Hijacking, and Ransomware prevention.",
      tab: "courses" as ActiveTab,
      actionLabel: "Try Action: Open Training Curriculum",
      actionIcon: <Award className="w-4 h-4 text-amber-500" />,
      runAction: () => {
        onNavigateTab("courses");
        setDemoLog((prev) => [...prev, "📚 Opened Security Awareness Micro-Courses and Defender certification"]);
      },
    },
  ];

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      demoSteps[nextStep].runAction();
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      demoSteps[prevStep].runAction();
    }
  };

  const handleExecuteCurrentAction = () => {
    demoSteps[currentStep].runAction();
  };

  const handleRunFullAutoDemo = async () => {
    setIsAutoPlaying(true);
    setDemoLog(["⚡ Starting Automated Guided Demo..."]);

    for (let i = 0; i < demoSteps.length; i++) {
      setCurrentStep(i);
      demoSteps[i].runAction();
      await new Promise((r) => setTimeout(r, 1600));
    }

    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    setDemoLog((prev) => [...prev, "✅ Full Interactive Demo completed! All platform capabilities demonstrated."]);
    setIsAutoPlaying(false);
  };

  const step = demoSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden text-slate-800 flex flex-col">
        {/* Header */}
        <div className="bg-[#0f172a] text-white p-6 relative flex items-start justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Interactive Demo Mode
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Step {currentStep + 1} of {demoSteps.length}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                PhishGuard Live Simulation Walkthrough
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Demo Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-5 border-b border-slate-100 bg-slate-50 text-center">
          {demoSteps.map((s, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <button
                key={idx}
                onClick={() => {
                  setCurrentStep(idx);
                  demoSteps[idx].runAction();
                }}
                className={`py-3 px-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                  isCurrent
                    ? "border-blue-600 text-blue-600 bg-white shadow-xs"
                    : isDone
                    ? "border-emerald-500 text-emerald-700 bg-emerald-50/50"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider block">Step {idx + 1}</div>
                <div className="truncate hidden sm:block text-[11px] mt-0.5">{s.title.split(". ")[1]}</div>
              </button>
            );
          })}
        </div>

        {/* Step Details & Action Sandbox */}
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{step.title}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Interactive Trigger Button for this specific step */}
          <div className="p-4 bg-blue-50/80 border border-blue-100 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-blue-200 flex items-center justify-center shadow-xs">
                {step.actionIcon}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-900 block">
                  Simulated Action Trigger
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {step.actionLabel}
                </span>
              </div>
            </div>

            <button
              onClick={handleExecuteCurrentAction}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold rounded-lg text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Click to Execute Action</span>
            </button>
          </div>

          {/* Live Action Telemetry Stream */}
          {demoLog.length > 0 && (
            <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs max-h-32 overflow-y-auto">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                Demo Action Telemetry:
              </div>
              {demoLog.map((log, idx) => (
                <div key={idx} className="text-[11px] text-emerald-400 flex items-start gap-1.5">
                  <span className="text-slate-500">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={handleRunFullAutoDemo}
            disabled={isAutoPlaying}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-xs"
          >
            {isAutoPlaying ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" /> : <Sparkles className="w-3.5 h-3.5 text-blue-600" />}
            <span>{isAutoPlaying ? "Running Demo..." : "Auto-Run All 5 Steps ⚡"}</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Previous Step
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold rounded-lg text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>{currentStep === demoSteps.length - 1 ? "Finish Demo" : "Next Step"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
