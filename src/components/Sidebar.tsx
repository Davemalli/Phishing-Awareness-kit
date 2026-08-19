import React from "react";
import {
  Shield,
  Mail,
  Sparkles,
  BarChart3,
  BookOpen,
  PenTool,
  Award,
  Flame,
  X,
  CheckCircle2
} from "lucide-react";
import { ActiveTab } from "./Header";

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userScore: number;
  drillsCompleted: number;
  drillsReported: number;
  streak: number;
  completionRate: number;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userScore,
  drillsCompleted,
  drillsReported,
  streak,
  completionRate,
  mobileOpen,
  setMobileOpen,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: "inbox",
      label: "Training Inbox",
      icon: <Mail className="w-4 h-4" />,
    },
    {
      id: "analyzer",
      label: "AI Threat Analyzer",
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      badge: "AI",
    },
    {
      id: "campaigns",
      label: "Campaign Analytics",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: "courses",
      label: "Micro-Courses",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: "builder",
      label: "Template Designer",
      icon: <PenTool className="w-4 h-4" />,
    },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-300">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-600/30 text-white shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white tracking-wider text-base block font-mono">PHISHGUARD</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block -mt-0.5">Defense Simulator</span>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] uppercase font-bold text-slate-500 px-3 mb-2 tracking-wider">
          Main Navigation
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-xs font-medium text-left cursor-pointer min-h-[44px] ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "hover:bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? "text-white" : "text-slate-400"}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Progress & Training Status Card */}
      <div className="p-4 border-t border-slate-800 mt-auto space-y-3 shrink-0">
        {/* PhishIQ Stats Widget */}
        <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">PhishIQ Score</div>
              <div className="text-sm font-bold text-white font-mono">{userScore} pts</div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/90 px-2 py-1 rounded-md border border-slate-700 text-[11px] text-orange-400 font-semibold">
            <Flame className="w-3.5 h-3.5" />
            <span>{streak}</span>
          </div>
        </div>

        {/* Training Completion Meter */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
            <span>Training Status</span>
            <span className="text-blue-400 font-mono">{completionRate}%</span>
          </div>
          <div className="text-xs text-slate-300 font-medium flex items-center justify-between">
            <span>{drillsCompleted} Drills</span>
            <span>{drillsReported} Reported</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, Math.max(8, completionRate))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-slate-800 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Out Drawer & Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
