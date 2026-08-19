import React, { useState, useEffect } from "react";
import { Header, ActiveTab } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { LearnerInbox } from "./components/LearnerInbox";
import { AiThreatAnalyzer } from "./components/AiThreatAnalyzer";
import { CampaignHub } from "./components/CampaignHub";
import { TrainingCourses } from "./components/TrainingCourses";
import { CustomTemplateBuilder } from "./components/CustomTemplateBuilder";
import { DemoTourModal } from "./components/DemoTourModal";
import {
  INITIAL_SIMULATION_EMAILS,
  TRAINING_MODULES,
  INITIAL_EMPLOYEES,
  INITIAL_CAMPAIGNS,
} from "./data/preloadedData";
import { SimulationEmail, Campaign, EmployeeRecord } from "./types";
import { ShieldCheck, Info } from "lucide-react";
import confetti from "canvas-confetti";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("inbox");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showDemoTour, setShowDemoTour] = useState<boolean>(false);

  // State with localStorage persistence for seamless user experience
  const [emails, setEmails] = useState<SimulationEmail[]>(() => {
    const saved = localStorage.getItem("phishguard_emails");
    return saved ? JSON.parse(saved) : INITIAL_SIMULATION_EMAILS;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem("phishguard_campaigns");
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [employees, setEmployees] = useState<EmployeeRecord[]>(() => {
    const saved = localStorage.getItem("phishguard_employees");
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("phishguard_completed_modules");
    return saved ? JSON.parse(saved) : ["mod-1"];
  });

  const [userScore, setUserScore] = useState<number>(() => {
    const saved = localStorage.getItem("phishguard_score");
    return saved ? Number(saved) : 420;
  });

  const [drillsCompleted, setDrillsCompleted] = useState<number>(() => {
    const saved = localStorage.getItem("phishguard_drills_completed");
    return saved ? Number(saved) : 4;
  });

  const [drillsReported, setDrillsReported] = useState<number>(() => {
    const saved = localStorage.getItem("phishguard_drills_reported");
    return saved ? Number(saved) : 3;
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem("phishguard_streak");
    return saved ? Number(saved) : 3;
  });

  const [drillResults, setDrillResults] = useState<Record<string, "reported" | "compromised" | "safe">>(() => {
    const saved = localStorage.getItem("phishguard_drill_results");
    return saved
      ? JSON.parse(saved)
      : {
          "sim-1": "reported",
          "sim-7": "safe",
        };
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("phishguard_emails", JSON.stringify(emails));
  }, [emails]);

  useEffect(() => {
    localStorage.setItem("phishguard_campaigns", JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem("phishguard_employees", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem("phishguard_completed_modules", JSON.stringify(completedModuleIds));
  }, [completedModuleIds]);

  useEffect(() => {
    localStorage.setItem("phishguard_score", userScore.toString());
  }, [userScore]);

  useEffect(() => {
    localStorage.setItem("phishguard_drills_completed", drillsCompleted.toString());
  }, [drillsCompleted]);

  useEffect(() => {
    localStorage.setItem("phishguard_drills_reported", drillsReported.toString());
  }, [drillsReported]);

  useEffect(() => {
    localStorage.setItem("phishguard_streak", streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem("phishguard_drill_results", JSON.stringify(drillResults));
  }, [drillResults]);

  const handleUpdateScore = (delta: number) => {
    setUserScore((prev) => Math.max(0, prev + delta));
  };

  const handleRecordDrillResult = (emailId: string, result: "reported" | "compromised" | "safe") => {
    setDrillResults((prev) => ({
      ...prev,
      [emailId]: result,
    }));
    setDrillsCompleted((prev) => prev + 1);
    if (result === "reported") {
      setDrillsReported((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else if (result === "compromised") {
      setStreak(0);
    }
  };

  const handleCompleteModule = (moduleId: string, pointsAwarded: number) => {
    if (!completedModuleIds.includes(moduleId)) {
      setCompletedModuleIds((prev) => [...prev, moduleId]);
    }
    handleUpdateScore(pointsAwarded);
  };

  const handleAddCampaign = (newCamp: Campaign) => {
    setCampaigns((prev) => [newCamp, ...prev]);
  };

  const handleSaveTemplate = (newTemplate: SimulationEmail) => {
    setEmails((prev) => [newTemplate, ...prev]);
    setActiveTab("inbox");
  };

  const handleResetProgress = () => {
    if (confirm("Reset simulation progress and PhishIQ score to defaults?")) {
      setEmails(INITIAL_SIMULATION_EMAILS);
      setCampaigns(INITIAL_CAMPAIGNS);
      setEmployees(INITIAL_EMPLOYEES);
      setCompletedModuleIds(["mod-1"]);
      setUserScore(420);
      setDrillsCompleted(4);
      setDrillsReported(3);
      setStreak(3);
      setDrillResults({
        "sim-1": "reported",
        "sim-7": "safe",
      });
      localStorage.clear();
    }
  };

  // Demo Action Helpers
  const handleDemoReportPhish = () => {
    const targetEmail = emails[0];
    if (targetEmail) {
      handleRecordDrillResult(targetEmail.id, "reported");
      handleUpdateScore(100);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleDemoSimulateDrill = () => {
    // Randomize drill wave metrics
    setCampaigns((prev) =>
      prev.map((c, i) =>
        i === 0
          ? {
              ...c,
              metrics: {
                ...c.metrics,
                reportedRate: Math.min(95, c.metrics.reportedRate + 8),
                phishProneRate: Math.max(2, c.metrics.phishProneRate - 4),
              },
            }
          : c
      )
    );
  };

  const totalPossibleDrills = emails.length;
  const completionRate = totalPossibleDrills > 0 ? Math.round((drillsCompleted / totalPossibleDrills) * 100) : 60;

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans selection:bg-blue-600 selection:text-white overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userScore={userScore}
        drillsCompleted={drillsCompleted}
        drillsReported={drillsReported}
        streak={streak}
        completionRate={completionRate}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userScore={userScore}
          drillsCompleted={drillsCompleted}
          drillsReported={drillsReported}
          streak={streak}
          onResetProgress={handleResetProgress}
          onOpenDemoTour={() => setShowDemoTour(true)}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === "inbox" && (
              <LearnerInbox
                emails={emails}
                userScore={userScore}
                onUpdateScore={handleUpdateScore}
                onRecordDrillResult={handleRecordDrillResult}
                drillResults={drillResults}
                onOpenDemoTour={() => setShowDemoTour(true)}
              />
            )}

            {activeTab === "analyzer" && <AiThreatAnalyzer />}

            {activeTab === "campaigns" && (
              <CampaignHub
                campaigns={campaigns}
                employees={employees}
                templates={emails}
                onAddCampaign={handleAddCampaign}
                onUpdateEmployees={setEmployees}
              />
            )}

            {activeTab === "courses" && (
              <TrainingCourses
                modules={TRAINING_MODULES}
                completedModuleIds={completedModuleIds}
                onCompleteModule={handleCompleteModule}
              />
            )}

            {activeTab === "builder" && (
              <CustomTemplateBuilder onSaveTemplate={handleSaveTemplate} />
            )}

            {/* Bottom Security Footer */}
            <footer className="pt-8 pb-4 text-xs text-slate-400 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-500">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-700">PhishGuard Security Simulation Platform</span>
                <span>&bull; Authorized Training Environment</span>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 text-center sm:text-right">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>All drill payloads and simulations are securely contained.</span>
              </div>
            </footer>
          </div>
        </main>
      </div>

      {/* Guided Interactive Demo Tour Modal */}
      <DemoTourModal
        isOpen={showDemoTour}
        onClose={() => setShowDemoTour(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onTriggerReportPhish={handleDemoReportPhish}
        onTriggerInspectHeaders={() => {}}
        onTriggerSpotterMode={() => {}}
        onTriggerSimulateDrill={handleDemoSimulateDrill}
      />
    </div>
  );
}
