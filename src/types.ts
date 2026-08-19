export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced Spear-Phishing";

export type AttackVector =
  | "Credential Harvester"
  | "Business Email Compromise (BEC)"
  | "Malicious Attachment / Macro"
  | "OAuth Hijack / Consent Phish"
  | "Quishing (QR Code)"
  | "Fake IT & MFA Reset"
  | "Payroll / HR Scam"
  | "Package Delivery";

export interface RedFlag {
  id: string;
  element: string;
  category: "domain" | "urgency" | "url" | "attachment" | "greeting" | "authority" | "request";
  quoteOrLocation: string;
  explanation: string;
  clue: string;
  discovered?: boolean;
}

export interface SimulationEmail {
  id: string;
  title: string;
  senderName: string;
  senderEmail: string;
  replyTo?: string;
  senderAvatar?: string;
  subject: string;
  timestamp: string;
  difficulty: DifficultyLevel;
  attackVector: AttackVector;
  targetDepartment: string;
  isPhish: boolean;
  previewSnippet: string;
  bodyHtml: string;
  simulatedLinkUrl?: string;
  actualDestinationUrl?: string;
  simulatedAttachment?: {
    name: string;
    size: string;
    extension: string;
    warningNote?: string;
  };
  hasQrCode?: boolean;
  qrPayloadDescription?: string;
  redFlags: RedFlag[];
  headers: {
    from: string;
    to: string;
    returnPath: string;
    spf: "PASS" | "FAIL" | "SOFTFAIL" | "NEUTRAL" | "NONE";
    dkim: "PASS" | "FAIL" | "NONE";
    dmarc: "PASS" | "FAIL" | "QUARANTINE" | "REJECT" | "NONE";
    authenticationResults: string;
    receivedFromIp: string;
  };
  teachableMoments: string[];
}

export interface TrainingQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  category: string;
  readTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  icon: string;
  summary: string;
  lessons: {
    title: string;
    content: string;
    bulletPoints: string[];
    proTip: string;
    realExample?: string;
  }[];
  quiz: TrainingQuizQuestion[];
}

export interface EmployeeRecord {
  id: string;
  name: string;
  email: string;
  department: "Finance" | "Engineering" | "Human Resources" | "Sales & BD" | "Executive" | "Legal";
  avatar: string;
  riskScore: number; // 0 (safest) to 100 (highest risk)
  status: "Trained" | "Needs Refresher" | "High Risk" | "Champion";
  simulationsReceived: number;
  simulationsReported: number;
  simulationsClicked: number;
  simulationsCompromised: number;
  lastSimDate: string;
}

export interface Campaign {
  id: string;
  name: string;
  templateId: string;
  templateTitle: string;
  targetCohort: "All Employees" | "Finance Dept" | "Engineering" | "Executive Suite" | "New Hires" | "High Risk Group";
  difficulty: DifficultyLevel;
  attackVector: AttackVector;
  status: "Draft" | "Running" | "Completed";
  startDate: string;
  totalSent: number;
  openedCount: number;
  clickedCount: number;
  reportedCount: number;
  submittedCredsCount: number;
}

export interface ThreatAnalysisResponse {
  riskScore: number;
  verdict: string;
  summary: string;
  redFlags: string[];
  psychologicalTriggers: string[];
  recommendedActions: string[];
  technicalIndicators: {
    senderAnomaly: string;
    linkSafety: string;
    attachmentRisk: string;
  };
}
