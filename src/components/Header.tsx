import React from "react";
import { Shield, Award, Flame, RefreshCw, Plus, Menu, X, Zap } from "lucide-react";

export type ActiveTab = "inbox" | "analyzer" | "campaigns" | "courses" | "builder";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userScore: number;
  drillsCompleted: number;
  drillsReported: number;
  streak: number;
  onResetProgress: () => void;
  onNewSimulationClick?: () => void;
  onOpenDemoTour?: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userScore,
  onResetProgress,
  onNewSimulationClick,
  onOpenDemoTour,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const getTabLabel = (tab: ActiveTab) => {
    switch (tab) {
      case "inbox":
        return "Training Sandbox & Inbox";
      case "analyzer":
        return "AI Threat Forensics";
      case "campaigns":
        return "Campaign Analytics & SOC";
      case "courses":
        return "Security Micro-Courses";
      case "builder":
        return "Template Designer";
      default:
        return "Dashboard";
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 900) return { label: "Elite Defender", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (score >= 600) return { label: "Security Champion", color: "bg-blue-50 text-blue-700 border-blue-200" };
    if (score >= 300) return { label: "Cyber Sentinel", color: "bg-indigo-50 text-indigo-700 border-indigo-200" };
    return { label: "Recruit Analyst", color: "bg-amber-50 text-amber-700 border-amber-200" };
  };

  const badge = getScoreBadge(userScore);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-20 sticky top-0">
      {/* Left: Mobile Drawer Button & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-slate-400 hidden sm:inline">PhishGuard</span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="text-slate-800 font-semibold truncate max-w-[180px] sm:max-w-none">
            {getTabLabel(activeTab)}
          </span>
        </div>
      </div>

      {/* Right: Actions, Score & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Interactive Demo Tour Trigger */}
        <button
          onClick={onOpenDemoTour}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer min-h-[36px]"
          title="Start Interactive Live Demo Walkthrough"
        >
          <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
          <span>Interactive Demo ⚡</span>
        </button>

        {/* Quick New Simulation button */}
        <button
          onClick={onNewSimulationClick || (() => setActiveTab("builder"))}
          className="hidden lg:flex items-center gap-1.5 bg-slate-900 text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium shadow-xs active:scale-95 transition-all cursor-pointer min-h-[36px]"
        >
          <Plus className="w-4 h-4" />
          <span>New Simulation</span>
        </button>

        {/* PhishIQ Score Pill */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 sm:px-3 py-1.5 rounded-lg shadow-xs">
          <Award className="w-4 h-4 text-amber-500 shrink-0" />
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-800 font-mono">{userScore}</span>
            <span className="text-[10px] text-slate-500 font-medium">pts</span>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.color} hidden xl:inline-block`}>
            {badge.label}
          </span>
        </div>

        {/* Reset / Refresh Data */}
        <button
          onClick={onResetProgress}
          title="Reset Simulation Progress"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
          aria-label="Reset simulation data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* User Badge */}
        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
          SOC
        </div>
      </div>
    </header>
  );
};
