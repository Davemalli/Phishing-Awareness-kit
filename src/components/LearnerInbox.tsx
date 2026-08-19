import React, { useState } from "react";
import { SimulationEmail, RedFlag } from "../types";
import {
  ShieldAlert,
  ShieldCheck,
  Flag,
  FileCode,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  Paperclip,
  QrCode,
  Sparkles,
  Award,
  ChevronRight,
  Filter,
  Check,
  HelpCircle,
  Zap
} from "lucide-react";
import confetti from "canvas-confetti";
import { TeachableMomentModal } from "./TeachableMomentModal";
import { HeaderInspectorModal } from "./HeaderInspectorModal";

interface LearnerInboxProps {
  emails: SimulationEmail[];
  userScore: number;
  onUpdateScore: (delta: number) => void;
  onRecordDrillResult: (emailId: string, result: "reported" | "compromised" | "safe") => void;
  drillResults: Record<string, "reported" | "compromised" | "safe">;
  onOpenDemoTour?: () => void;
}

export const LearnerInbox: React.FC<LearnerInboxProps> = ({
  emails,
  onUpdateScore,
  onRecordDrillResult,
  drillResults,
  onOpenDemoTour,
}) => {
  const [selectedEmailId, setSelectedEmailId] = useState<string>(emails[0]?.id || "");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSpotterMode, setIsSpotterMode] = useState<boolean>(false);
  const [discoveredFlags, setDiscoveredFlags] = useState<Record<string, string[]>>({});
  const [showTeachableMoment, setShowTeachableMoment] = useState<boolean>(false);
  const [showHeaderInspector, setShowHeaderInspector] = useState<boolean>(false);
  const [activeFlagDetails, setActiveFlagDetails] = useState<RedFlag | null>(null);
  const [feedbackBanner, setFeedbackBanner] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || emails[0];

  // Filtering emails
  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.senderEmail.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCategory === "phish") return email.isPhish;
    if (filterCategory === "legit") return !email.isPhish;
    if (filterCategory === "unresolved") return !drillResults[email.id];
    if (filterCategory === "completed") return !!drillResults[email.id];
    return true;
  });

  const handleSelectEmail = (emailId: string) => {
    setSelectedEmailId(emailId);
    setFeedbackBanner(null);
    setActiveFlagDetails(null);
  };

  // Action: Report Phish
  const handleReportPhish = () => {
    if (!selectedEmail) return;

    if (selectedEmail.isPhish) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onUpdateScore(100);
      onRecordDrillResult(selectedEmail.id, "reported");
      setFeedbackBanner({
        message: "🎯 Threat Neutralized! You successfully identified and reported a simulated phishing attack (+100 PhishIQ points).",
        type: "success",
      });
    } else {
      onRecordDrillResult(selectedEmail.id, "reported");
      setFeedbackBanner({
        message: "ℹ️ Training Note: This was a legitimate internal communication. Review email headers for verified SPF/DKIM authentication.",
        type: "info",
      });
    }
  };

  // Action: Mark as Legitimate / Safe
  const handleMarkAsSafe = () => {
    if (!selectedEmail) return;

    if (!selectedEmail.isPhish) {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
      });
      onUpdateScore(50);
      onRecordDrillResult(selectedEmail.id, "safe");
      setFeedbackBanner({
        message: "✅ Correct! You accurately verified an authentic corporate communication (+50 PhishIQ points).",
        type: "success",
      });
    } else {
      onUpdateScore(-30);
      onRecordDrillResult(selectedEmail.id, "compromised");
      setShowTeachableMoment(true);
    }
  };

  // Intercept any click inside simulated body links/buttons
  const handleSimulatedContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isClickable =
      target.tagName === "A" ||
      target.tagName === "BUTTON" ||
      target.closest("a") ||
      target.closest("button") ||
      target.closest("[data-simulated-click]");

    if (isClickable) {
      e.preventDefault();
      if (selectedEmail.isPhish) {
        onRecordDrillResult(selectedEmail.id, "compromised");
        setShowTeachableMoment(true);
      } else {
        setFeedbackBanner({
          message: "ℹ️ This is a safe internal link. In authentic practice, it takes you to the verified corporate portal.",
          type: "info",
        });
      }
    }
  };

  const handleDiscoverFlag = (flag: RedFlag) => {
    const currentDiscovered = discoveredFlags[selectedEmail.id] || [];
    if (!currentDiscovered.includes(flag.id)) {
      const updated = [...currentDiscovered, flag.id];
      setDiscoveredFlags({
        ...discoveredFlags,
        [selectedEmail.id]: updated,
      });
      onUpdateScore(25);
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.8 },
      });
    }
    setActiveFlagDetails(flag);
  };

  const currentEmailDiscovered = discoveredFlags[selectedEmail?.id] || [];
  const currentStatus = drillResults[selectedEmail?.id];

  return (
    <div className="space-y-6">
      {/* Top Banner / Mode Explainer */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Training Inbox & Simulation Sandbox</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Evaluate simulated employee emails. Spot deceptive domains, urgent calls-to-action, and suspicious attachments. Practice safe reporting or test your radar in Spotter Mode.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {onOpenDemoTour && (
            <button
              onClick={onOpenDemoTour}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xs transition-all active:scale-95 cursor-pointer min-h-[36px]"
            >
              <Zap className="w-4 h-4 fill-current text-amber-300" />
              <span>Interactive Demo ⚡</span>
            </button>
          )}

          <button
            onClick={() => setIsSpotterMode(!isSpotterMode)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer min-h-[36px] ${
              isSpotterMode
                ? "bg-amber-50 text-amber-800 border-amber-300 shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
            }`}
          >
            <Eye className={`w-4 h-4 ${isSpotterMode ? "text-amber-600" : "text-slate-500"}`} />
            <span>{isSpotterMode ? "Spotter Mode Active 🎯" : "Toggle Spotter Mode"}</span>
          </button>
        </div>
      </div>

      {/* Main Split-Screen Inbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Email Roster & Filters (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[480px] sm:h-[560px] lg:h-[760px]">
          {/* Filter Bar & Search */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/60 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search simulated emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
              <button
                onClick={() => setFilterCategory("all")}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer min-h-[32px] ${
                  filterCategory === "all" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                All ({emails.length})
              </button>
              <button
                onClick={() => setFilterCategory("unresolved")}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer min-h-[32px] ${
                  filterCategory === "unresolved" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                Untested ({emails.filter((e) => !drillResults[e.id]).length})
              </button>
              <button
                onClick={() => setFilterCategory("phish")}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer min-h-[32px] ${
                  filterCategory === "phish" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                Phish Tests ({emails.filter((e) => e.isPhish).length})
              </button>
              <button
                onClick={() => setFilterCategory("legit")}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer min-h-[32px] ${
                  filterCategory === "legit" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                Legit Memos ({emails.filter((e) => !e.isPhish).length})
              </button>
            </div>
          </div>

          {/* Email Item List */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No simulated emails match the selected filter.
              </div>
            ) : (
              filteredEmails.map((email) => {
                const isSelected = email.id === selectedEmail?.id;
                const status = drillResults[email.id];

                return (
                  <button
                    key={email.id}
                    onClick={() => handleSelectEmail(email.id)}
                    className={`w-full text-left p-4 transition-all flex items-start gap-3 relative cursor-pointer min-h-[64px] ${
                      isSelected
                        ? "bg-blue-50/40 border-l-4 border-blue-600"
                        : "hover:bg-slate-50 bg-white"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-base shrink-0">
                      {email.senderAvatar || "✉️"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-slate-900 text-xs truncate">
                          {email.senderName}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {email.timestamp}
                        </span>
                      </div>

                      <div className="font-medium text-slate-800 text-xs truncate mb-1">
                        {email.subject}
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                        {email.previewSnippet}
                      </p>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {email.attackVector}
                        </span>

                        {email.hasQrCode && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                            <QrCode className="w-2.5 h-2.5" /> Quishing
                          </span>
                        )}

                        {email.simulatedAttachment && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                            <Paperclip className="w-2.5 h-2.5" /> Attachment
                          </span>
                        )}

                        {status === "reported" && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 uppercase flex items-center gap-1 ml-auto">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Reported
                          </span>
                        )}

                        {status === "compromised" && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 uppercase flex items-center gap-1 ml-auto">
                            <AlertCircle className="w-2.5 h-2.5" /> Compromised
                          </span>
                        )}

                        {status === "safe" && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase flex items-center gap-1 ml-auto">
                            <ShieldCheck className="w-2.5 h-2.5" /> Verified Safe
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Full Email Inspection Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[480px] lg:min-h-[760px]">
          {selectedEmail ? (
            <>
              {/* Email Toolbar & Actions */}
              <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    id="btn-report-phish"
                    onClick={handleReportPhish}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer min-h-[40px]"
                  >
                    <Flag className="w-4 h-4" />
                    <span>Report Phish 🚨</span>
                  </button>

                  <button
                    id="btn-mark-safe"
                    onClick={handleMarkAsSafe}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 transition-all cursor-pointer shadow-xs min-h-[40px]"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Mark as Safe</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHeaderInspector(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-all shadow-xs cursor-pointer min-h-[36px]"
                  >
                    <FileCode className="w-3.5 h-3.5 text-blue-600" />
                    <span>Inspect Raw Headers</span>
                  </button>
                </div>
              </div>

              {/* Feedback Banner */}
              {feedbackBanner && (
                <div
                  className={`p-3.5 text-xs flex items-center justify-between border-b ${
                    feedbackBanner.type === "success"
                      ? "bg-green-50 border-green-200 text-green-800"
                      : feedbackBanner.type === "error"
                      ? "bg-red-50 border-red-200 text-red-800"
                      : "bg-blue-50 border-blue-200 text-blue-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {feedbackBanner.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                    <span>{feedbackBanner.message}</span>
                  </div>
                  <button
                    onClick={() => setFeedbackBanner(null)}
                    className="text-slate-400 hover:text-slate-700 text-xs ml-3 cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
              )}

              {/* Red-Flag Spotter HUD */}
              {isSpotterMode && selectedEmail.isPhish && (
                <div className="bg-amber-50/70 border-b border-amber-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 bg-amber-100 text-amber-700 rounded-md">
                        <Sparkles className="w-4 h-4" />
                      </span>
                      <span className="font-bold text-xs text-amber-900 uppercase tracking-wider">
                        Red-Flag Radar: Spot the Anomaly
                      </span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      {currentEmailDiscovered.length} of {selectedEmail.redFlags.length} Discovered (+25 pts each)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedEmail.redFlags.map((flag) => {
                      const isFound = currentEmailDiscovered.includes(flag.id);
                      return (
                        <button
                          key={flag.id}
                          onClick={() => handleDiscoverFlag(flag)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                            isFound
                              ? "bg-green-100 border-green-300 text-green-800 font-semibold"
                              : "bg-white border-amber-300 text-amber-900 hover:bg-amber-100 shadow-xs"
                          }`}
                        >
                          <span>{isFound ? "✅" : "🎯"}</span>
                          <span>{flag.element}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Active Flag Explanation Popup */}
              {activeFlagDetails && (
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-amber-900 flex items-center gap-2">
                      <span>Forensic Finding: {activeFlagDetails.element}</span>
                      <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                        {activeFlagDetails.category}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {activeFlagDetails.explanation}
                    </p>
                    <div className="text-[11px] text-blue-700 font-medium">
                      💡 Rule of Thumb: {activeFlagDetails.clue}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveFlagDetails(null)}
                    className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
              )}

              {/* Email Envelope Metadata Header */}
              <div className="p-5 border-b border-slate-200 bg-white space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {selectedEmail.subject}
                  </h1>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                    {selectedEmail.difficulty}
                  </span>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0">
                    {selectedEmail.senderAvatar || "👤"}
                  </div>

                  <div className="flex-1 min-w-0 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">
                        {selectedEmail.senderName}
                      </span>
                      <span className="text-slate-500 font-mono text-xs">
                        &lt;{selectedEmail.senderEmail}&gt;
                      </span>
                    </div>

                    <div className="text-slate-500 flex items-center gap-3 mt-1 flex-wrap text-[11px]">
                      <div>To: <span className="text-slate-800 font-medium">You (employee@acmecorp.com)</span></div>
                      <div>&bull;</div>
                      <div>Date: <span className="text-slate-800">{selectedEmail.timestamp}</span></div>
                      {selectedEmail.replyTo && (
                        <>
                          <div>&bull;</div>
                          <div>Reply-To: <span className="text-amber-700 font-mono font-medium">{selectedEmail.replyTo}</span></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Body Canvas */}
              <div className="p-6 overflow-y-auto flex-1 bg-white text-slate-900">
                <div
                  onClick={handleSimulatedContentClick}
                  className="prose prose-sm max-w-none prose-slate"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml }}
                />

                {selectedEmail.simulatedAttachment && (
                  <div className="mt-6 border border-slate-200 bg-slate-50 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs uppercase">
                        {selectedEmail.simulatedAttachment.extension}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          {selectedEmail.simulatedAttachment.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {selectedEmail.simulatedAttachment.size} &bull; Click to open
                        </div>
                      </div>
                    </div>

                    <button
                      data-simulated-click="true"
                      onClick={handleSimulatedContentClick}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      Download & Open
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">
              Select an email from the left sidebar to begin training.
            </div>
          )}
        </div>
      </div>

      {/* Teachable Moment Educational Modal */}
      {selectedEmail && (
        <TeachableMomentModal
          email={selectedEmail}
          isOpen={showTeachableMoment}
          onClose={() => setShowTeachableMoment(false)}
          onCompletedRemediation={(pts) => onUpdateScore(pts)}
        />
      )}

      {/* Technical Raw Header Forensics Modal */}
      {selectedEmail && (
        <HeaderInspectorModal
          email={selectedEmail}
          isOpen={showHeaderInspector}
          onClose={() => setShowHeaderInspector(false)}
        />
      )}
    </div>
  );
};
