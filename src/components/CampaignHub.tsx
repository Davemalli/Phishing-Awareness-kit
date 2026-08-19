import React, { useState } from "react";
import { Campaign, EmployeeRecord, SimulationEmail } from "../types";
import {
  BarChart3,
  Users,
  Play,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  Activity,
  TrendingDown,
  TrendingUp,
  Clock,
  Award,
  Search,
  RefreshCw,
  X,
  ChevronRight
} from "lucide-react";
import confetti from "canvas-confetti";

interface CampaignHubProps {
  campaigns: Campaign[];
  employees: EmployeeRecord[];
  templates: SimulationEmail[];
  onAddCampaign: (newCamp: Campaign) => void;
  onUpdateEmployees: (updated: EmployeeRecord[]) => void;
}

export const CampaignHub: React.FC<CampaignHubProps> = ({
  campaigns,
  employees,
  templates,
  onAddCampaign,
  onUpdateEmployees,
}) => {
  const [isSimulatingLiveDrill, setIsSimulatingLiveDrill] = useState<boolean>(false);
  const [liveLog, setLiveLog] = useState<{ time: string; text: string; type: "report" | "click" | "pass" }[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [searchEmp, setSearchEmp] = useState<string>("");
  const [filterDept, setFilterDept] = useState<string>("all");

  // Form states for new campaign
  const [campName, setCampName] = useState<string>("");
  const [selectedCohort, setSelectedCohort] = useState<string>("All Employees");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || "");

  // Calculate Organization KPIs
  const totalSent = campaigns.reduce((acc, c) => acc + c.totalSent, 0);
  const totalClicked = campaigns.reduce((acc, c) => acc + c.clickedCount, 0);
  const totalReported = campaigns.reduce((acc, c) => acc + c.reportedCount, 0);
  const orgPhishPronePercentage = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : "18.4";
  const orgReportPercentage = totalSent > 0 ? ((totalReported / totalSent) * 100).toFixed(1) : "63.5";

  // Simulate a live simulated phishing wave across all employees
  const handleExecuteLiveDrill = () => {
    setIsSimulatingLiveDrill(true);
    setLiveLog([]);

    const actions: { delay: number; text: string; type: "report" | "click" | "pass"; empIndex: number }[] = [
      { delay: 400, text: "Simulation payload dispatched to 6 department cohort gateways.", type: "pass", empIndex: -1 },
      { delay: 1200, text: "Marcus Vance (Engineering) inspected headers and REPORTED phishing template (+100 pts).", type: "report", empIndex: 1 },
      { delay: 2000, text: "Tariq Al-Mansoor (Legal) spotted lookalike domain and REPORTED threat.", type: "report", empIndex: 5 },
      { delay: 2800, text: "⚠️ Elena Rostova (HR) clicked simulated macro attachment. Directed to Teachable Moment.", type: "click", empIndex: 2 },
      { delay: 3500, text: "Samantha Wright (Executive) verified sender out-of-band and REPORTED attack.", type: "report", empIndex: 4 },
      { delay: 4200, text: "⚠️ Alex Rivera (Finance) clicked fake MFA link. Completed remediation quiz.", type: "click", empIndex: 0 },
      { delay: 4900, text: "David Chen (Sales) reported suspicious parcel delivery email.", type: "report", empIndex: 3 },
      { delay: 5400, text: "✅ Live simulation wave completed. Metrics aggregated to SOC database.", type: "pass", empIndex: -1 },
    ];

    actions.forEach((act) => {
      setTimeout(() => {
        setLiveLog((prev) => [
          ...prev,
          {
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            text: act.text,
            type: act.type,
          },
        ]);

        if (act.empIndex >= 0 && employees[act.empIndex]) {
          const updated = [...employees];
          const emp = { ...updated[act.empIndex] };
          emp.simulationsReceived += 1;
          if (act.type === "report") {
            emp.simulationsReported += 1;
            emp.riskScore = Math.max(5, emp.riskScore - 8);
          } else if (act.type === "click") {
            emp.simulationsClicked += 1;
            emp.riskScore = Math.min(95, emp.riskScore + 12);
          }
          updated[act.empIndex] = emp;
          onUpdateEmployees(updated);
        }
      }, act.delay);
    });

    setTimeout(() => {
      setIsSimulatingLiveDrill(false);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    }, 5800);
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName.trim()) return;

    const tpl = templates.find((t) => t.id === selectedTemplateId) || templates[0];
    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      name: campName,
      templateId: tpl.id,
      templateTitle: tpl.title,
      targetCohort: selectedCohort as any,
      difficulty: tpl.difficulty,
      attackVector: tpl.attackVector,
      status: "Running",
      startDate: new Date().toISOString().split("T")[0],
      totalSent: selectedCohort === "All Employees" ? 148 : 24,
      openedCount: selectedCohort === "All Employees" ? 130 : 21,
      clickedCount: 0,
      reportedCount: 0,
      submittedCredsCount: 0,
    };

    onAddCampaign(newCamp);
    setShowCreateModal(false);
    setCampName("");
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchEmp.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchEmp.toLowerCase());
    const matchesDept = filterDept === "all" || emp.department === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Campaign Analytics & SOC Telemetry</h2>
              <p className="text-xs text-slate-500">
                Orchestrate internal simulations, analyze vulnerability vectors, and monitor employee resilience.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            id="btn-simulate-drill"
            disabled={isSimulatingLiveDrill}
            onClick={handleExecuteLiveDrill}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg text-xs shadow-sm transition-all cursor-pointer"
          >
            {isSimulatingLiveDrill ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating Live Drill...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Simulate Live Drill Wave 🚀</span>
              </>
            )}
          </button>

          <button
            id="btn-launch-campaign"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg text-xs border border-slate-200 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Launch New Campaign</span>
          </button>
        </div>
      </div>

      {/* 4-Column Sleek Metric Cards matching Design Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Total Sent */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Sent</div>
          <div className="text-2xl font-bold mt-1 text-slate-900 font-mono">{totalSent}</div>
          <div className="text-green-600 text-[11px] font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% vs last month
          </div>
        </div>

        {/* Metric 2: Open Rate / PPP */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Phish-Prone % (PPP)</div>
          <div className="text-2xl font-bold mt-1 text-slate-900 font-mono">{orgPhishPronePercentage}%</div>
          <div className="text-green-600 text-[11px] font-medium mt-1 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> -14.2% risk reduction
          </div>
        </div>

        {/* Metric 3: Click Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Click Rate</div>
          <div className="text-2xl font-bold mt-1 text-slate-900 font-mono">
            {totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : "8.2"}%
          </div>
          <div className="text-slate-400 text-[11px] font-medium mt-1">
            Industry avg: 11.4%
          </div>
        </div>

        {/* Metric 4: Threat Reported */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Reported Rate</div>
          <div className="text-2xl font-bold mt-1 text-slate-900 font-mono">{orgReportPercentage}%</div>
          <div className="text-blue-600 text-[11px] font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +5% SOC reporting
          </div>
        </div>
      </div>

      {/* Live Simulation Stream Console */}
      {liveLog.length > 0 && (
        <div className="bg-[#0f172a] text-slate-200 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Live Simulation Telemetry & Response Stream
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">{liveLog.length} events recorded</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-xs divide-y divide-slate-800">
            {liveLog.map((item, idx) => (
              <div key={idx} className="pt-1.5 flex items-start gap-2.5">
                <span className="text-slate-500 text-[10px] shrink-0">{item.time}</span>
                <span
                  className={
                    item.type === "report"
                      ? "text-emerald-400 font-semibold"
                      : item.type === "click"
                      ? "text-red-400 font-semibold"
                      : "text-blue-400"
                  }
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Simulations Table & Department Matrix */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Active Campaigns Table (Flex 2) matching Design HTML */}
        <div className="flex-[2] bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
            <h3 className="font-bold text-slate-800 text-sm">Active & Historic Simulations</h3>
            <span className="text-blue-600 text-xs font-medium cursor-pointer">{campaigns.length} Total</span>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] text-slate-500 uppercase font-bold tracking-wider border-b border-slate-100">
                  <th className="px-5 py-3">Campaign Name</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Recipients</th>
                  <th className="px-5 py-3 text-right">Failure Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {campaigns.map((camp) => {
                  const clickRate = camp.totalSent > 0 ? ((camp.clickedCount / camp.totalSent) * 100).toFixed(1) : "0.0";
                  return (
                    <tr key={camp.id} className="text-xs hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 font-medium text-slate-900">
                        <div>{camp.name}</div>
                        <div className="text-[10px] text-slate-400">{camp.attackVector} &bull; {camp.targetCohort}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            camp.status === "Running"
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {camp.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right text-slate-600 font-mono">{camp.totalSent}</td>
                      <td className="px-5 py-4 text-right font-bold font-mono text-red-600">{clickRate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vulnerability by Dept (Flex 1) matching Design HTML */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Vulnerability by Dept</h3>
          <div className="space-y-4 flex-1">
            {[
              { dept: "Marketing & Growth", risk: 32, color: "bg-red-600" },
              { dept: "Sales & BD", risk: 24, color: "bg-red-500" },
              { dept: "Finance & Accounts", risk: 18, color: "bg-orange-500" },
              { dept: "Legal & Compliance", risk: 11, color: "bg-amber-500" },
              { dept: "Engineering & DevOps", risk: 4, color: "bg-green-500" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">{item.dept}</span>
                  <span className="font-bold text-slate-900 font-mono">{item.risk}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.risk}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full py-2 bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              Generate Targeted Training Plan
            </button>
          </div>
        </div>
      </div>

      {/* Employee Training & Risk Roster */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Employee Vulnerability Index & Training Roster</span>
            </h3>
            <p className="text-xs text-slate-500">
              Individual cyber hygiene tracking and adaptive micro-training assignments.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchEmp}
              onChange={(e) => setSearchEmp(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => {
            const getStatusBadge = (status: string) => {
              switch (status) {
                case "Champion":
                  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase">🏆 Champion</span>;
                case "High Risk":
                  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase">🚨 High Risk</span>;
                case "Needs Refresher":
                  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase">⚠️ Refresher</span>;
                default:
                  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase">✅ Trained</span>;
              }
            };

            return (
              <div key={emp.id} className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 space-y-3 hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{emp.name}</div>
                      <div className="text-[11px] text-slate-500">{emp.department}</div>
                    </div>
                  </div>
                  {getStatusBadge(emp.status)}
                </div>

                <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-lg text-center text-[10px] border border-slate-200 shadow-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Received</span>
                    <span className="font-bold text-slate-800 text-xs font-mono">{emp.simulationsReceived}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Reported</span>
                    <span className="font-bold text-emerald-600 text-xs font-mono">{emp.simulationsReported}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Clicked</span>
                    <span className="font-bold text-red-600 text-xs font-mono">{emp.simulationsClicked}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Risk Index:</span>
                  <span className={`font-mono font-bold ${emp.riskScore > 60 ? "text-red-600" : emp.riskScore > 30 ? "text-amber-600" : "text-emerald-600"}`}>
                    {emp.riskScore}/100
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create New Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Configure Simulation Campaign</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  placeholder="e.g. Q3 Finance Hook - Invoice Repay"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Target Department / Cohort</label>
                <select
                  value={selectedCohort}
                  onChange={(e) => setSelectedCohort(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="All Employees">All Employees (Org-wide)</option>
                  <option value="Finance Dept">Finance & Accounting</option>
                  <option value="Engineering">Engineering & DevOps</option>
                  <option value="Human Resources">Human Resources (HR)</option>
                  <option value="Executive Suite">Executive Leadership</option>
                  <option value="High Risk Group">High Risk Employees Only</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select Phishing Template</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.title} ({tpl.attackVector} - {tpl.difficulty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-[11px] text-blue-800">
                💡 <strong>Safety Contained:</strong> All simulated emails include safe redirect tracking and educational teachable moments.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm cursor-pointer"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
