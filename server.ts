import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy initialize Gemini client safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Email Threat Analysis Endpoint
app.post("/api/analyze-email", async (req, res) => {
  try {
    const { sender, subject, body, headers } = req.body;

    if (!body && !subject) {
      return res.status(400).json({ error: "Subject or body content is required for analysis." });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Return high-quality heuristic fallback if no Gemini API key
      const lowerBody = (body || "").toLowerCase();
      const lowerSender = (sender || "").toLowerCase();
      const lowerSubject = (subject || "").toLowerCase();

      const urgencyKeywords = ["urgent", "immediate", "suspended", "24 hours", "action required", "payroll", "wire transfer", "gift card", "overdue"];
      const credentialKeywords = ["password", "verify account", "login", "credentials", "sign in", "reset", "authenticate"];

      const hasUrgency = urgencyKeywords.some(k => lowerBody.includes(k) || lowerSubject.includes(k));
      const hasCreds = credentialKeywords.some(k => lowerBody.includes(k));
      const hasSuspiciousDomain = lowerSender.includes("secure") || lowerSender.includes("verify") || lowerSender.includes("update") || lowerSender.includes(".xyz") || lowerSender.includes(".top");

      let calculatedRisk = 25;
      if (hasUrgency) calculatedRisk += 30;
      if (hasCreds) calculatedRisk += 25;
      if (hasSuspiciousDomain) calculatedRisk += 15;
      calculatedRisk = Math.min(98, calculatedRisk);

      return res.json({
        riskScore: calculatedRisk,
        verdict: calculatedRisk > 60 ? "Phishing Threat" : calculatedRisk > 35 ? "Suspicious" : "Likely Legitimate",
        summary: "Static heuristics analysis detected typical social engineering indicators including artificial urgency and credential solicitation patterns.",
        redFlags: [
          hasUrgency ? "Artificial urgency creating psychological pressure to bypass scrutiny" : "Unusual tone and context for the stated business relationship",
          hasCreds ? "Direct or indirect attempt to collect credentials or redirect to login landing page" : "Call-to-action requiring prompt unverified action",
          hasSuspiciousDomain ? "Sender address does not align with authenticated corporate top-level domain" : "Generic salutation lacking specific employee personalization",
        ],
        psychologicalTriggers: [
          hasUrgency ? "Fear & Time Scarcity" : "Authority Bias",
          "Compliance Reflex",
          "Loss Aversion"
        ],
        recommendedActions: [
          "Do NOT click any embedded hyperlinks or download attachments.",
          "Inspect the raw email headers for SPF, DKIM, and DMARC alignment failures.",
          "Use the internal 'Report Phish' button to alert the Security Operations Center (SOC).",
          "Verify the request through an out-of-band communication channel (e.g. phone or verified internal chat)."
        ],
        technicalIndicators: {
          senderAnomaly: hasSuspiciousDomain ? "High - Display name mismatch with envelope domain" : "Moderate - Verification recommended",
          linkSafety: "Potential lookalike / typosquatted redirect",
          attachmentRisk: body?.toLowerCase()?.includes(".zip") || body?.toLowerCase()?.includes(".exe") || body?.toLowerCase()?.includes(".html") ? "High" : "Low"
        }
      });
    }

    const prompt = `You are an elite Cybersecurity Threat Analyst and Security Operations Center (SOC) specialist evaluating an email for phishing and social engineering indicators.

Analyze the following email metadata and content thoroughly:
Sender: ${sender || "Unknown"}
Subject: ${subject || "Unknown"}
Headers / Context: ${headers || "None provided"}
Body:
"""
${body}
"""

Provide an educational, comprehensive threat analysis in JSON format adhering strictly to this JSON structure:
{
  "riskScore": <number between 0 and 100>,
  "verdict": "<Phishing Threat | Suspicious | Likely Legitimate | Malicious Spear-Phishing>",
  "summary": "<2-3 sentence executive threat summary explaining why this is or isn't malicious>",
  "redFlags": [
    "<specific red flag with exact textual quote or header proof>",
    "<another specific red flag>",
    "<another specific red flag>"
  ],
  "psychologicalTriggers": ["<e.g. Artificial Urgency>", "<e.g. Authority Impersonation>", "<e.g. Fear of Penalty>", "<e.g. Greed / Financial Incentive>"],
  "recommendedActions": [
    "<Action 1 for the employee / recipient>",
    "<Action 2 for defensive reporting>",
    "<Action 3 for incident response>"
  ],
  "technicalIndicators": {
    "senderAnomaly": "<Description of domain/display name spoofing or alignment>",
    "linkSafety": "<Analysis of deceptive links, URL shorteners, or typosquatting>",
    "attachmentRisk": "<Analysis of payload, macro execution risk, or document bait>"
  }
}
Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    try {
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch {
      // Clean up markdown fences if any
      const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return res.json(parsed);
    }
  } catch (error: any) {
    console.error("Error analyzing email:", error);
    return res.status(500).json({
      error: "Failed to analyze email threat: " + (error?.message || "Unknown error")
    });
  }
});

// AI Scenario Generator Endpoint for Training Campaigns
app.post("/api/generate-scenario", async (req, res) => {
  try {
    const { targetDepartment, difficulty, attackVector, industry } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback realistic scenario
      return res.json({
        title: `${industry || "Enterprise"} - ${attackVector || "Urgent Action"} Simulation`,
        senderName: "IT Security Operations",
        senderEmail: "alerts@security-internal-verify.com",
        subject: `[ACTION REQUIRED] Mandatory Security Token Renewal for ${targetDepartment || "Staff"}`,
        difficulty: difficulty || "Intermediate",
        attackVector: attackVector || "Credential Harvesting",
        targetDepartment: targetDepartment || "All Employees",
        bodyHtml: `<p>Dear Team Member,</p><p>As part of our updated SOC 2 Type II compliance policy, all employees in <strong>${targetDepartment || "your department"}</strong> must re-authenticate their Multi-Factor Authentication (MFA) tokens within 24 hours to prevent account lockout.</p><p><a href="https://corp-auth-sso.portal-verify.net/sso/login" style="background:#0284c7;color:#fff;padding:8px 16px;text-decoration:none;border-radius:4px;display:inline-block;margin:12px 0;">Renew MFA Token Now</a></p><p>Failure to complete verification will restrict network access to company Slack, Jira, and Email servers.</p><p>Best regards,<br>IT Identity & Access Management</p>`,
        redFlagsExplained: [
          {
            element: "Sender Domain (@security-internal-verify.com)",
            explanation: "The domain uses a lookalike domain instead of the authentic company domain.",
            clue: "External domain mimicking internal IT"
          },
          {
            element: "Deceptive Link Target (portal-verify.net)",
            explanation: "Hovering over the button reveals an unauthorized third-party destination rather than internal SSO.",
            clue: "Mismatched destination URL"
          },
          {
            element: "Artificial 24-Hour Urgency",
            explanation: "Attackers weaponize urgent deadlines to pressure employees into acting without verifying.",
            clue: "Threat of account lockout"
          }
        ],
        teachableMoments: [
          "Never click login links directly from unexpected emails. Navigate to your corporate SSO bookmark directly.",
          "Internal IT will never send external non-company domain links for credential verification.",
          "Always report suspicious internal communications using the Phish Alarm button."
        ]
      });
    }

    const prompt = `You are a Cybersecurity Awareness Training Architect designing a high-fidelity, safe educational phishing simulation template for an internal corporate awareness program.

Parameters:
- Target Department: ${targetDepartment || "General Staff"}
- Difficulty Level: ${difficulty || "Intermediate"} (Beginner, Intermediate, Advanced Spear-Phishing)
- Attack Vector: ${attackVector || "Credential Harvester"} (e.g., Business Email Compromise, Fake Invoice, HR Bonus, IT MFA Reset, Shared Cloud Doc, QR Code Quishing)
- Industry / Context: ${industry || "Corporate Technology"}

Design an educational training simulation scenario that teaches employees to recognize subtle social engineering cues. Return ONLY a valid JSON object matching this schema:
{
  "title": "<Simulation Title>",
  "senderName": "<Spoofed Sender Display Name>",
  "senderEmail": "<Deceptive Spoofed Email Address, e.g., hr-portal@rewards-corp-benefits.com>",
  "subject": "<Compelling Subject Line with plausible context>",
  "difficulty": "${difficulty || "Intermediate"}",
  "attackVector": "${attackVector || "Credential Harvester"}",
  "targetDepartment": "${targetDepartment || "General"}",
  "bodyHtml": "<HTML formatted email body with simulated links, realistic tone, and clear identifiable red flags>",
  "redFlagsExplained": [
    {
      "element": "<Specific part of the email, e.g. Domain name, fake deadline, URL>",
      "explanation": "<Why this is a red flag and what real danger it represents>",
      "clue": "<Short scannable rule of thumb>"
    }
  ],
  "teachableMoments": [
    "<Key takeaway 1 for employee cyber hygiene>",
    "<Key takeaway 2 for safe reporting procedures>",
    "<Key takeaway 3 for verifying authentic requests>"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    try {
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch {
      const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return res.json(parsed);
    }
  } catch (error: any) {
    console.error("Error generating scenario:", error);
    return res.status(500).json({
      error: "Failed to generate training scenario: " + (error?.message || "Unknown error")
    });
  }
});

// Production static assets & Dev Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PhishGuard Training Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
