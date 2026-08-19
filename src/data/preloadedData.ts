import { SimulationEmail, TrainingModule, EmployeeRecord, Campaign } from "../types";

export const INITIAL_SIMULATION_EMAILS: SimulationEmail[] = [
  {
    id: "sim-1",
    title: "Urgent: Mandatory Multi-Factor Authentication (MFA) Re-sync",
    senderName: "Corporate IT Support Desk",
    senderEmail: "admin@corp-it-securityauth.com",
    replyTo: "no-reply@corp-it-securityauth.com",
    senderAvatar: "🛡️",
    subject: "🚨 [ACTION REQUIRED] Mandatory Okta / SSO MFA Re-authentication within 12 Hours",
    timestamp: "Today at 08:42 AM",
    difficulty: "Beginner",
    attackVector: "Credential Harvester",
    targetDepartment: "All Staff",
    isPhish: true,
    previewSnippet: "Our identity management systems detected expired SAML tokens. You must re-authenticate your credentials immediately...",
    bodyHtml: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <div style="background: #ef4444; color: white; padding: 8px 12px; font-weight: bold; font-size: 13px; border-radius: 4px; margin-bottom: 16px;">
          ⚠️ URGENT SECURITY NOTICE: ACCOUNT ACCESS SUSPENSION IMMINENT
        </div>
        <p>Dear Employee,</p>
        <p>During our routine quarterly compliance audit, our automated identity system detected an <strong>unverified MFA security certificate</strong> attached to your workstation account.</p>
        <p>To prevent disruption to your email, Slack, and VPN access, you are required to re-authenticate and sync your identity credentials within the next <strong>12 hours</strong>.</p>
        
        <div style="margin: 24px 0; text-align: center;">
          <a href="https://auth-okta-portal.identity-gateway-sso.net/login/auth?ref=workstation" style="background: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            Re-Authenticate MFA Token Now &rarr;
          </a>
        </div>

        <p style="font-size: 13px; color: #64748b;">
          Failure to complete this verification will result in an automated account lock requiring manual on-site IT helpdesk provisioning.
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 11px; color: #94a3b8;">
          Global IT Operations &bull; Identity & Access Management Group<br />
          Ticket Reference: IT-MFA-984210-CRITICAL
        </p>
      </div>
    `,
    simulatedLinkUrl: "https://auth-okta-portal.identity-gateway-sso.net/login/auth?ref=workstation",
    actualDestinationUrl: "https://auth-okta-portal.identity-gateway-sso.net/login/auth?ref=workstation",
    redFlags: [
      {
        id: "rf-1-1",
        element: "Sender Domain (@corp-it-securityauth.com)",
        category: "domain",
        quoteOrLocation: "admin@corp-it-securityauth.com",
        explanation: "The sender domain is a lookalike domain created to mimic authentic corporate IT, but uses an unauthorized external .com domain instead of the verified internal company domain.",
        clue: "Lookalike typosquat domain"
      },
      {
        id: "rf-1-2",
        element: "Artificial 12-Hour Urgency",
        category: "urgency",
        quoteOrLocation: "within the next 12 hours / ACCOUNT ACCESS SUSPENSION IMMINENT",
        explanation: "Attackers manufacture strict deadlines and high stakes (e.g. account suspension) to induce panic and force employees to act impulsively without verifying.",
        clue: "Fear-based artificial urgency"
      },
      {
        id: "rf-1-3",
        element: "Deceptive Link Target URL (identity-gateway-sso.net)",
        category: "url",
        quoteOrLocation: "https://auth-okta-portal.identity-gateway-sso.net/...",
        explanation: "The button link leads to an unverified third-party phishing domain designed to harvest corporate usernames, passwords, and 2FA OTP codes.",
        clue: "Mismatched destination domain"
      },
      {
        id: "rf-1-4",
        element: "Generic Salutation & Vague Context",
        category: "greeting",
        quoteOrLocation: "Dear Employee",
        explanation: "Generic salutations often indicate mass-spearphishing campaigns rather than personalized internal company IT tickets.",
        clue: "Impersonal greeting"
      }
    ],
    headers: {
      from: '"Corporate IT Support Desk" <admin@corp-it-securityauth.com>',
      to: 'employee@acmecorp.com',
      returnPath: '<bounces@corp-it-securityauth.com>',
      spf: 'FAIL',
      dkim: 'FAIL',
      dmarc: 'FAIL',
      authenticationResults: 'spf=fail (sender IP 194.26.29.102 is not allowed); dkim=fail (no key for domain); dmarc=fail action=none',
      receivedFromIp: '194.26.29.102 (Unknown Cloud VPS)'
    },
    teachableMoments: [
      "Authentic IT teams never threaten automated account termination within a few hours via external email links.",
      "Always hover over buttons to preview the real destination domain in the browser status bar.",
      "Check the sender domain: look for subtle additions like '-securityauth.com' or '-portal.net'.",
      "Whenever asked for credentials, navigate to your saved corporate SSO bookmark independently."
    ]
  },
  {
    id: "sim-2",
    title: "HR Announcement: Q3 Employee Retention Bonus & Compensation Plan",
    senderName: "People & Culture Operations",
    senderEmail: "hr-payroll@acmecorp-benefits-portal.info",
    replyTo: "hr-inquiries@acmecorp-benefits-portal.info",
    senderAvatar: "💼",
    subject: "CONFIDENTIAL: 2026 Mid-Year Compensation Adjustments & Q3 Retention Bonus Schedule",
    timestamp: "Today at 10:15 AM",
    difficulty: "Intermediate",
    attackVector: "Malicious Attachment / Macro",
    targetDepartment: "Human Resources / Finance",
    isPhish: true,
    previewSnippet: "Please find attached the finalized executive leadership compensation schedule. Review your individual tier allocation...",
    bodyHtml: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <p>Dear Colleague,</p>
        <p>The Executive Leadership Committee in conjunction with the Board of Directors has approved a special mid-year <strong>Q3 Employee Retention & Equity Incentive Plan</strong>.</p>
        <p>Due to privacy regulations, individual adjustment breakdowns and eligibility tiers are distributed in the encrypted spreadsheet attached below.</p>
        
        <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 32px;">📊</div>
            <div>
              <div style="font-weight: 700; color: #0f172a;">Q3_Compensation_Schedule_Confidential.xlsm</div>
              <div style="font-size: 12px; color: #64748b;">Excel Macro-Enabled Worksheet &bull; 842 KB</div>
            </div>
          </div>
          <p style="font-size: 12px; color: #b45309; margin-top: 10px; background: #fef3c7; padding: 8px 10px; border-radius: 4px;">
            ⚠️ <em>Note: If prompted by Microsoft Excel, click <strong>"Enable Content / Enable Macros"</strong> to calculate and decrypt your personal tier.</em>
          </p>
        </div>

        <p>Please review and confirm receipt with HR Operations prior to payroll cutoff on Friday.</p>
        <p>Warm regards,<br /><strong>People & Talent Rewards Team</strong></p>
      </div>
    `,
    simulatedAttachment: {
      name: "Q3_Compensation_Schedule_Confidential.xlsm",
      size: "842 KB",
      extension: "xlsm",
      warningNote: "Executable Excel Macro (.xlsm) containing simulated dropper payload"
    },
    redFlags: [
      {
        id: "rf-2-1",
        element: "Macro Enablement Instruction",
        category: "attachment",
        quoteOrLocation: "click 'Enable Content / Enable Macros' to calculate and decrypt",
        explanation: "Attackers commonly use malicious VBA macros inside .xlsm or .docm files to execute malicious shellcode upon user confirmation.",
        clue: "Suspicious macro enablement prompt"
      },
      {
        id: "rf-2-2",
        element: "Greed / Financial Incentive Psychological Bait",
        category: "request",
        quoteOrLocation: "Q3 Retention Bonus & Compensation Plan",
        explanation: "Bonus and salary adjustment lures exploit curiosity and financial desire, reducing employee skepticism.",
        clue: "Financial curiosity lure"
      },
      {
        id: "rf-2-3",
        element: "External Domain with '.info' TLD",
        category: "domain",
        quoteOrLocation: "@acmecorp-benefits-portal.info",
        explanation: "The company domain is spoofed using a cheap '.info' registry domain not registered or owned by corporate infrastructure.",
        clue: "Suspicious TLD (.info)"
      }
    ],
    headers: {
      from: '"People & Culture Operations" <hr-payroll@acmecorp-benefits-portal.info>',
      to: 'finance-team@acmecorp.com',
      returnPath: '<bounces@acmecorp-benefits-portal.info>',
      spf: 'FAIL',
      dkim: 'NONE',
      dmarc: 'FAIL',
      authenticationResults: 'spf=fail; dkim=none; dmarc=fail',
      receivedFromIp: '185.193.88.42'
    },
    teachableMoments: [
      "Never enable macros ('Enable Editing' / 'Enable Content') on spreadsheets received unexpectedly via email.",
      "Authentic corporate compensation statements are delivered securely through internal HRIS systems (e.g. Workday, BambooHR), never raw macro attachments.",
      "Examine file extensions carefully: '.xlsm', '.vbs', '.iso', '.exe', '.bat', and '.html' attachments are high-risk indicators."
    ]
  },
  {
    id: "sim-3",
    title: "Executive Urgent Task: Confidential Vendor Wire / Gift Cards (CEO Fraud)",
    senderName: "Jonathan Sterling (CEO)",
    senderEmail: "ceo-office.sterling@executive-direct-line.com",
    replyTo: "jonathan.private.inbox@mail-consulting-relay.com",
    senderAvatar: "👔",
    subject: "Quick request - Are you at your desk right now? (Confidential)",
    timestamp: "Today at 11:30 AM",
    difficulty: "Advanced Spear-Phishing",
    attackVector: "Business Email Compromise (BEC)",
    targetDepartment: "Finance / Executive Assistants",
    isPhish: true,
    previewSnippet: "I am currently tied up in an NDA partner summit and cannot take calls. I need you to handle a time-sensitive financial transfer...",
    bodyHtml: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <p>Hi,</p>
        <p>Are you currently at your desk and available to handle an urgent confidential task?</p>
        <p>I am locked in closed-door discussions with legal counsel regarding an off-market M&A deal and my cell signal is restricted in the conference facility.</p>
        <p>I need you to process an immediate expedited vendor retainer transfer of <strong>$48,500</strong> to secure the retainment contract before the 1:00 PM cutoff.</p>
        <p style="background: #f1f5f9; padding: 12px; border-left: 4px solid #3b82f6; font-style: italic;">
          "Please handle this directly without alerting the wider department until the public announcement tomorrow. Reply with your direct cell number and I will forward the wire instructions."
        </p>
        <p>Thanks,<br /><strong>Jonathan Sterling</strong><br /><span style="font-size: 12px; color: #64748b;">Chief Executive Officer &bull; Sent from my iPad Pro</span></p>
      </div>
    `,
    redFlags: [
      {
        id: "rf-3-1",
        element: "Authority Pressure & Secrecy Mandate",
        category: "authority",
        quoteOrLocation: "handle this directly without alerting the wider department",
        explanation: "CEO Fraud / Business Email Compromise relies on bypassing dual-control accounting checks by demanding strict confidentiality and exploiting hierarchical authority.",
        clue: "Demand to bypass standard verification protocols"
      },
      {
        id: "rf-3-2",
        element: "Mismatched Reply-To Address",
        category: "domain",
        quoteOrLocation: "Reply-To: jonathan.private.inbox@mail-consulting-relay.com",
        explanation: "While the display name shows the CEO, hitting 'Reply' redirects your response to a rogue attacker-controlled mailbox.",
        clue: "Hidden Reply-To redirection"
      },
      {
        id: "rf-3-3",
        element: "Inability to Verify Out-of-Band",
        category: "urgency",
        quoteOrLocation: "cannot take calls / cell signal restricted",
        explanation: "Attackers preemptively excuse why the victim cannot verify their identity with a quick phone call.",
        clue: "Excuses preventing out-of-band phone verification"
      }
    ],
    headers: {
      from: '"Jonathan Sterling" <ceo-office.sterling@executive-direct-line.com>',
      to: 'accounting@acmecorp.com',
      returnPath: '<jonathan.private.inbox@mail-consulting-relay.com>',
      spf: 'NEUTRAL',
      dkim: 'NONE',
      dmarc: 'FAIL',
      authenticationResults: 'spf=neutral; dkim=none; dmarc=fail (unaligned domain)',
      receivedFromIp: '91.240.118.15'
    },
    teachableMoments: [
      "Any request to bypass standard dual-control wire transfer verification or keep financial disbursements secret is an immediate red flag.",
      "Always verify unexpected financial requests via a known voice telephone number or in-person check — never rely on the email thread itself.",
      "Inspect the 'Reply-To' header if an executive email appears to come from an unusual personal or external address."
    ]
  },
  {
    id: "sim-4",
    title: "Shared Document: 'FY26 Engineering Restructuring & Org Chart.pdf'",
    senderName: "Microsoft 365 Cloud Share",
    senderEmail: "notifications@sharepoint-cloud-docs-sync.net",
    senderAvatar: "📁",
    subject: "📄 Document Shared with You: 'FY26 Engineering Restructuring & Org Chart.pdf'",
    timestamp: "Yesterday at 03:14 PM",
    difficulty: "Intermediate",
    attackVector: "OAuth Hijack / Consent Phish",
    targetDepartment: "Engineering",
    isPhish: true,
    previewSnippet: "Sarah Jenkins (VP of Engineering) shared a protected Microsoft SharePoint file with your corporate email...",
    bodyHtml: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b; max-width: 540px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: #0078d4; padding: 14px 20px; color: white; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-weight: 700; font-size: 16px;">Microsoft SharePoint</span>
          <span style="font-size: 12px; opacity: 0.9;">Secure File Transfer</span>
        </div>
        <div style="padding: 24px;">
          <p style="margin-top: 0;"><strong>Sarah Jenkins</strong> (VP of Product Engineering) shared a restricted document with your email address:</p>
          <div style="background: #f8fafc; border-left: 4px solid #0078d4; padding: 12px; margin: 16px 0; border-radius: 4px;">
            <div style="font-weight: 600;">📑 FY26_Engineering_Restructuring_Org_Chart.pdf</div>
            <div style="font-size: 12px; color: #64748b;">Expires in 48 hours &bull; Restricted to Authorized Staff</div>
          </div>
          <div style="text-align: center; margin: 24px 0;">
            <a href="https://login-microsoftonline.cloud-docs-sync.net/oauth2/authorize?client_id=fake" style="background: #0078d4; color: white; padding: 10px 24px; text-decoration: none; border-radius: 4px; font-weight: 600; display: inline-block;">
              Open in Microsoft 365
            </a>
          </div>
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 0;">
            This email was sent from an automated notification service. Please do not reply.
          </p>
        </div>
      </div>
    `,
    simulatedLinkUrl: "https://login-microsoftonline.cloud-docs-sync.net/oauth2/authorize?client_id=fake",
    actualDestinationUrl: "https://login-microsoftonline.cloud-docs-sync.net/oauth2/authorize?client_id=fake",
    redFlags: [
      {
        id: "rf-4-1",
        element: "Lookalike SharePoint Subdomain",
        category: "domain",
        quoteOrLocation: "notifications@sharepoint-cloud-docs-sync.net",
        explanation: "Authentic Microsoft 365 notifications originate from authenticated domains like @sharepointonline.com or @microsoft.com, not 'cloud-docs-sync.net'.",
        clue: "Fake Microsoft cloud domain"
      },
      {
        id: "rf-4-2",
        element: "Sensational Document Topic (Restructuring & Layoffs)",
        category: "request",
        quoteOrLocation: "Engineering Restructuring & Org Chart",
        explanation: "Attackers pick high-anxiety topics such as layoffs, payroll cuts, or re-orgs to exploit emotional panic and spur instant clicks.",
        clue: "Emotional anxiety clickbait"
      },
      {
        id: "rf-4-3",
        element: "Suspicious OAuth Consent URL",
        category: "url",
        quoteOrLocation: "login-microsoftonline.cloud-docs-sync.net",
        explanation: "The URL masquerades as Microsoft Online login but is hosted on a fraudulent rogue server attempting an Illicit Consent Grant attack.",
        clue: "Spoofed OAuth authentication endpoint"
      }
    ],
    headers: {
      from: '"Microsoft SharePoint" <notifications@sharepoint-cloud-docs-sync.net>',
      to: 'dev-team@acmecorp.com',
      returnPath: '<bounces@cloud-docs-sync.net>',
      spf: 'FAIL',
      dkim: 'FAIL',
      dmarc: 'FAIL',
      authenticationResults: 'spf=fail; dkim=fail; dmarc=fail',
      receivedFromIp: '103.145.22.8'
    },
    teachableMoments: [
      "Check OAuth permission prompts carefully: malicious apps often request 'Read your mail', 'Access files anytime', or 'Offline access'.",
      "Look at the full domain name in the address bar: 'cloud-docs-sync.net' is the true domain, not 'login-microsoftonline'.",
      "Verify shared files directly through your company's official OneDrive or SharePoint app without clicking email links."
    ]
  },
  {
    id: "sim-5",
    title: "Quishing Attack: Scan QR Code for Corporate Wi-Fi / VPN Certificate",
    senderName: "Facilities & Network Engineering",
    senderEmail: "network-provisioning@acme-facility-connect.org",
    senderAvatar: "📱",
    subject: "📶 Upgrade to 6GHz Wi-Fi: Scan QR Code to Install Corporate Root Certificate",
    timestamp: "2 days ago",
    difficulty: "Advanced Spear-Phishing",
    attackVector: "Quishing (QR Code)",
    targetDepartment: "All Staff",
    isPhish: true,
    hasQrCode: true,
    qrPayloadDescription: "QR redirects mobile browser to a malicious rogue MDM mobile profile installation page",
    previewSnippet: "Campus network engineers upgraded building access points to Wi-Fi 6E. Scan the configuration QR code with your mobile device...",
    bodyHtml: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <p>Dear Staff,</p>
        <p>Network Engineering has finalized the installation of next-generation <strong>Wi-Fi 6E (6GHz)</strong> access points across all corporate offices.</p>
        <p>To enable automated seamless zero-trust authentication on your iOS or Android mobile device, open your camera and scan the secure provisioning code below:</p>

        <div style="text-align: center; margin: 24px 0; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; display: inline-block;">
          <div style="width: 160px; height: 160px; margin: 0 auto; background: #0f172a; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 11px; border-radius: 8px; letter-spacing: 1px; position: relative;">
            <div style="font-size: 38px; margin-bottom: 4px;">🔲</div>
            <div style="font-weight: 700;">[ QR CODE ]</div>
            <div style="font-size: 9px; opacity: 0.75; margin-top: 4px;">SCAN WITH PHONE</div>
          </div>
          <div style="font-size: 12px; color: #64748b; margin-top: 10px;">
            Target: <code>https://wifi-provisioning.net/profile/install</code>
          </div>
        </div>

        <p style="font-size: 13px; color: #475569;">
          <em>Note: Scanning offloads authentication to your mobile sandbox, bypassing desktop endpoint browser firewalls.</em>
        </p>
        <p>IT Network Operations Team</p>
      </div>
    `,
    redFlags: [
      {
        id: "rf-5-1",
        element: "Quishing (QR Code Phishing) Vector",
        category: "request",
        quoteOrLocation: "Scan the configuration QR code with your mobile device",
        explanation: "Attackers embed QR codes in emails to bypass corporate secure email gateways (SEGs) and transfer the attack to personal mobile devices where endpoint protection is absent.",
        clue: "QR code bypassing desktop email gateway scanners"
      },
      {
        id: "rf-5-2",
        element: "Rogue Configuration Profile Request",
        category: "attachment",
        quoteOrLocation: "Install Corporate Root Certificate",
        explanation: "Installing unknown certificates or MDM profiles on mobile devices grants attackers root decryption and traffic interception rights.",
        clue: "Untrusted root certificate installation"
      }
    ],
    headers: {
      from: '"Facilities & Network" <network-provisioning@acme-facility-connect.org>',
      to: 'all-employees@acmecorp.com',
      returnPath: '<bounces@acme-facility-connect.org>',
      spf: 'FAIL',
      dkim: 'NONE',
      dmarc: 'FAIL',
      authenticationResults: 'spf=fail; dmarc=fail',
      receivedFromIp: '198.51.100.44'
    },
    teachableMoments: [
      "Never scan QR codes in emails using personal mobile devices unless independently verified with IT.",
      "QR codes obscure the destination URL, preventing users from seeing where the link leads before loading it.",
      "Authentic corporate MDM profiles are installed via managed enterprise MDM (such as Jamf, Intune, or Google Workspace), never email QR codes."
    ]
  },
  {
    id: "sim-6",
    title: "Delivery Exception: Incomplete Address for Express Equipment Parcel",
    senderName: "FedEx Express Dispatch",
    senderEmail: "dispatch-alert-notify@fedx-tracking-express.com",
    senderAvatar: "📦",
    subject: "🚨 Delivery Exception: Shipment #FDX-9941824-US On Hold - Address Missing",
    timestamp: "3 days ago",
    difficulty: "Beginner",
    attackVector: "Package Delivery",
    targetDepartment: "General Staff",
    isPhish: true,
    previewSnippet: "Your express parcel containing hardware equipment could not be delivered due to an illegible suite number...",
    bodyHtml: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <div style="color: #4f46e5; font-size: 20px; font-weight: 800; margin-bottom: 12px;">FedEx Express</div>
        <p>Dear Customer,</p>
        <p>Our courier driver attempted delivery of your express shipment <strong>#FDX-9941824-US</strong>, but the street delivery address had missing floor/suite details.</p>
        <p>Your package has been returned to the central regional sorting depot and will be returned to sender unless your address is verified within <strong>24 hours</strong>.</p>
        
        <div style="margin: 20px 0;">
          <a href="https://fedx-tracking-express.com/update-address?track=FDX9941824" style="background: #ff6600; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: 700; display: inline-block;">
            Update Address & Reschedule Delivery ($1.85 Redelivery Fee)
          </a>
        </div>
        <p style="font-size: 12px; color: #64748b;">
          FedEx Logistics International &bull; Customer Care Operations
        </p>
      </div>
    `,
    simulatedLinkUrl: "https://fedx-tracking-express.com/update-address?track=FDX9941824",
    actualDestinationUrl: "https://fedx-tracking-express.com/update-address?track=FDX9941824",
    redFlags: [
      {
        id: "rf-6-1",
        element: "Typosquatted Brand Domain (fedx-tracking-express.com)",
        category: "domain",
        quoteOrLocation: "@fedx-tracking-express.com",
        explanation: "Notice the misspelling 'fedx' instead of the official 'fedex.com' domain.",
        clue: "Typo in brand name (Fedx vs FedEx)"
      },
      {
        id: "rf-6-2",
        element: "Small Fee Credit Card Trap",
        category: "request",
        quoteOrLocation: "$1.85 Redelivery Fee",
        explanation: "Requiring nominal credit card fees ($1.50 - $2.00) is a standard tactic to trick victims into entering complete credit card numbers and CVVs.",
        clue: "Phony credit card processing fee"
      }
    ],
    headers: {
      from: '"FedEx Express Dispatch" <dispatch-alert-notify@fedx-tracking-express.com>',
      to: 'staff@acmecorp.com',
      returnPath: '<mailer@fedx-tracking-express.com>',
      spf: 'FAIL',
      dkim: 'FAIL',
      dmarc: 'FAIL',
      authenticationResults: 'spf=fail; dkim=fail; dmarc=fail',
      receivedFromIp: '45.142.122.9'
    },
    teachableMoments: [
      "Carriers like FedEx and UPS do not charge random credit card redelivery fees via unauthenticated email links.",
      "Check the exact spelling in the domain: 'fedx' missing the 'e' is a classic typosquatting sign.",
      "Always go directly to the official carrier website (fedex.com, ups.com) and paste the tracking number directly."
    ]
  },
  {
    id: "sim-7",
    title: "Legitimate Corporate Memo: Scheduled Datacenter Maintenance & Patch Notes",
    senderName: "Infrastructure & Cloud Ops",
    senderEmail: "devops@acmecorp.com",
    senderAvatar: "⚙️",
    subject: "🔧 [INFO] Scheduled Monthly Maintenance Window: Sunday 02:00 UTC",
    timestamp: "4 days ago",
    difficulty: "Beginner",
    attackVector: "Fake IT & MFA Reset",
    targetDepartment: "Engineering & IT",
    isPhish: false,
    previewSnippet: "Routine monthly security patching and database index optimization will occur this Sunday morning...",
    bodyHtml: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 12px; margin-bottom: 16px;">
          <strong>Official Internal Infrastructure Bulletin</strong> &bull; Routine Maintenance
        </div>
        <p>Hi Team,</p>
        <p>This is a standard informational notice regarding our regular monthly infrastructure patching window.</p>
        <p><strong>Window:</strong> Sunday, 02:00 AM - 04:00 AM UTC<br />
        <strong>Expected Impact:</strong> Staging and development database clusters will undergo brief rolling restarts (1-2 min max). Production traffic is routed to hot standby replicas with zero expected downtime.</p>
        <p><strong>No action is required from employees.</strong> No credentials, passwords, or system configurations need to be updated.</p>
        <p>Status updates will be published to the internal status channel: <code>#it-cloud-status</code> on Slack.</p>
        <p>Best regards,<br />DevOps & Site Reliability Team</p>
      </div>
    `,
    redFlags: [],
    headers: {
      from: '"Infrastructure & Cloud Ops" <devops@acmecorp.com>',
      to: 'engineering-all@acmecorp.com',
      returnPath: '<devops@acmecorp.com>',
      spf: 'PASS',
      dkim: 'PASS',
      dmarc: 'PASS',
      authenticationResults: 'spf=pass (IP 35.190.247.1 is authorized); dkim=pass header.d=acmecorp.com; dmarc=pass action=none',
      receivedFromIp: '35.190.247.1 (Google Workspace Corporate Relay)'
    },
    teachableMoments: [
      "Legitimate internal maintenance notices do not ask for urgent password resets or credit card info.",
      "Headers show verified SPF, DKIM, and DMARC passes from the authentic company domain.",
      "The message directs users to existing internal channels (Slack #it-cloud-status) without unsolicited third-party links."
    ]
  },
  {
    id: "sim-8",
    title: "Legitimate HR Memo: Company Volunteer Day & Community Outreach",
    senderName: "Corporate Social Responsibility",
    senderEmail: "community@acmecorp.com",
    senderAvatar: "🌱",
    subject: "🌱 Annual ACME Gives Back Volunteer Day: Signups Open on Corporate Portal",
    timestamp: "5 days ago",
    difficulty: "Beginner",
    attackVector: "Payroll / HR Scam",
    targetDepartment: "All Staff",
    isPhish: false,
    previewSnippet: "Join colleagues for our annual day of service in local community gardens and STEM mentoring...",
    bodyHtml: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <p>Dear ACME Team,</p>
        <p>Our annual <strong>ACME Gives Back Day</strong> is scheduled for next month! Employees receive 8 hours of paid volunteer time off (VTO) to participate in local environmental cleanup, food bank sorting, or STEM youth tutoring.</p>
        <p>To sign up for a project team, simply visit the <strong>Volunteer</strong> tab inside our standard internal intranet at <code>https://intranet.acmecorp.com/csr</code>.</p>
        <p>Thank you for making a positive impact in our communities!</p>
        <p>Warmly,<br />Corporate Social Responsibility Committee</p>
      </div>
    `,
    redFlags: [],
    headers: {
      from: '"Corporate Social Responsibility" <community@acmecorp.com>',
      to: 'all-company@acmecorp.com',
      returnPath: '<community@acmecorp.com>',
      spf: 'PASS',
      dkim: 'PASS',
      dmarc: 'PASS',
      authenticationResults: 'spf=pass; dkim=pass header.d=acmecorp.com; dmarc=pass',
      receivedFromIp: '35.190.247.1'
    },
    teachableMoments: [
      "This is a legitimate internal email containing verified company domain headers, no deceptive links, and no credential requests.",
      "It encourages users to visit known corporate bookmarks rather than clicking mysterious external links."
    ]
  }
];

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: "mod-1",
    title: "Deconstructing Email Headers & Domain Spoofing",
    category: "Technical Defense",
    readTime: "4 min read",
    difficulty: "Beginner",
    icon: "🔍",
    summary: "Learn how to inspect sender headers, understand SPF, DKIM, and DMARC, and spot typosquatted lookalike domains before you click.",
    lessons: [
      {
        title: "The Anatomy of an Email Sender: Display Name vs Envelope",
        content: "Anyone can write 'Tim Cook' or 'Corporate IT Helpdesk' as their Display Name in an email client. The display name is purely cosmetic. What matters is the actual envelope address and authentication records behind it.",
        bulletPoints: [
          "Display Name: 'Apple Support' (Cosmetic, easily forged)",
          "Actual Sender: 'service@apple-support-verify92.net' (The true sender domain)",
          "Lookalike Domains: Typosquatting (e.g. 'micros0ft.com' or 'paypa1.com') and combomquatting ('paypal-security-update.com')."
        ],
        proTip: "On desktop, hover over or click the sender name to reveal the full email address inside angle brackets <...>.",
        realExample: "An email displayed 'CEO Jonathan Sterling', but clicking the address revealed: 'ceo.acme@mail-relay-direct.xyz'."
      },
      {
        title: "SPF, DKIM, and DMARC in Plain English",
        content: "These three security protocols work together to verify whether an email server is genuinely authorized to send mail on behalf of a given domain.",
        bulletPoints: [
          "SPF (Sender Policy Framework): A DNS record listing which IP addresses are authorized to send mail for the domain.",
          "DKIM (DomainKeys Identified Mail): A cryptographic signature attached to the email header proving it wasn't altered in transit.",
          "DMARC (Domain-based Message Authentication): Policies telling the receiving mail server whether to block, quarantine, or accept mail that fails SPF or DKIM."
        ],
        proTip: "If an email fails both SPF and DKIM, modern mail servers will flag it or send it to quarantine.",
        realExample: "When an attacker tries to forge @google.com from an unauthorized VPS, the DMARC record enforces a strict 'REJECT' rule."
      }
    ],
    quiz: [
      {
        id: "q1-1",
        question: "Which part of an incoming email is easiest for an attacker to fake without triggering security warnings?",
        options: [
          "The cryptographic DKIM signature",
          "The Display Name (e.g. 'HR Benefits Department')",
          "The authenticated sender IP reverse DNS",
          "The DMARC pass policy alignment"
        ],
        correctIndex: 1,
        explanation: "Display names are free-form text strings that require no cryptographic validation, making them the most commonly spoofed element."
      },
      {
        id: "q1-2",
        question: "You receive an email from 'support@acmecorp-internal-sso.com' instead of 'support@acmecorp.com'. What attack technique is this?",
        options: [
          "Cross-Site Scripting (XSS)",
          "Typosquatting / Lookalike Combosquatting Domain",
          "Zero-Day Buffer Overflow",
          "SQL Injection"
        ],
        correctIndex: 1,
        explanation: "Adding keywords like '-internal-sso' to a registered domain is a classic lookalike domain tactic to trick victims into trusting the sender."
      }
    ]
  },
  {
    id: "mod-2",
    title: "Psychological Triggers & Social Engineering Tactics",
    category: "Human Defense",
    readTime: "5 min read",
    difficulty: "Intermediate",
    icon: "🧠",
    summary: "Understand the core emotional weapons attackers use: Artificial Urgency, Authority Impersonation, Scarcity, Fear, and Greed.",
    lessons: [
      {
        title: "The 5 Psychological Levers of Phishing",
        content: "Social engineering works by bypassing your analytical prefrontal cortex and triggering emotional, impulsive reflexes.",
        bulletPoints: [
          "1. Artificial Urgency: 'Your account will be deleted in 3 hours' — prevents thoughtful verification.",
          "2. Authority: Impersonating the CEO, CFO, FBI, or Head of HR to leverage instinctive compliance.",
          "3. Fear & Panic: 'Unrecognized login from North Korea' or 'Legal subpoena attached'.",
          "4. Greed & Curiosity: 'Unclaimed retention bonus', 'Exclusive company salary adjustments'.",
          "5. Helpfulness: 'Could you do me a quick favor while I am in this meeting?'"
        ],
        proTip: "Whenever an email makes you feel a sudden surge of panic, excitement, or urgency, take a 30-second breath. Emotion is the primary indicator of a social engineering lure.",
        realExample: "91% of successful data breaches begin with a phishing email that induced fear or urgency to rush the recipient."
      },
      {
        title: "The 'Out-of-Band' Verification Golden Rule",
        content: "If an executive or vendor emails you asking for sensitive changes (wire transfer, gift cards, password reset, direct deposit bank switch), NEVER reply to the same email thread.",
        bulletPoints: [
          "Call them on a known, pre-established phone number.",
          "Ping them on official internal Slack/Teams messaging.",
          "Verify the physical purchase order in the official ERP / finance portal."
        ],
        proTip: "Attackers control the email conversation. Verifying through an independent second channel breaks their trap instantly.",
        realExample: "A company saved $2.4M when an accountant called the CFO's real cell phone before executing a requested 'urgent emergency acquisition wire'."
      }
    ],
    quiz: [
      {
        id: "q2-1",
        question: "Why do attackers frequently include tight deadlines (e.g. 'Must complete within 2 hours') in phishing emails?",
        options: [
          "To test the recipient's speed reading skills",
          "Because email servers automatically delete mail after 2 hours",
          "To induce panic and pressure the victim into bypassing security verification checks",
          "To comply with international email protocols"
        ],
        correctIndex: 2,
        explanation: "Urgency suppresses analytical thinking and prompts victims to act on impulse before spotting obvious flaws."
      },
      {
        id: "q2-2",
        question: "What is the best way to verify an unexpected email from your CEO requesting an urgent confidential wire transfer?",
        options: [
          "Reply to the email asking if it's really them",
          "Call the CEO using a known internal contact number or speak in person",
          "Forward the email to your personal Gmail",
          "Click the wire link to see if the bank page looks real"
        ],
        correctIndex: 1,
        explanation: "Out-of-band verification via a known authentic phone number is the only foolproof defense against Business Email Compromise (BEC)."
      }
    ]
  },
  {
    id: "mod-3",
    title: "Next-Gen Vectors: Quishing, Smishing & OAuth Hijacks",
    category: "Emerging Threats",
    readTime: "6 min read",
    difficulty: "Advanced",
    icon: "⚡",
    summary: "Master modern threat vectors including QR Code Phishing (Quishing), SMS Phishing (Smishing), and Illicit OAuth Consent App Grants.",
    lessons: [
      {
        title: "Quishing (QR Code Phishing) Explained",
        content: "As secure email filters improved at scanning hyperlinks, attackers pivoted to embedding QR codes inside image attachments. Scanning transfers the attack to the employee's personal mobile phone.",
        bulletPoints: [
          "Bypasses desktop email scanners because QR code URLs are rendered inside image pixels.",
          "Mobile devices often lack enterprise endpoint detection and response (EDR) agents.",
          "Users cannot inspect the destination URL before scanning."
        ],
        proTip: "Never scan email QR codes that ask for login, Wi-Fi certificates, or 2FA setups. Authentic enterprise systems push profiles automatically.",
        realExample: "An attacker sent fake 2FA reset QR codes that harvested over 1,000 corporate session cookies across Fortune 500 companies in 2024."
      },
      {
        title: "Illicit OAuth Consent Grants (App Hijacking)",
        content: "Instead of stealing passwords, modern attacks trick users into clicking 'Accept' on a fake cloud application that requests API permissions to read your mailbox, OneDrive files, and contacts.",
        bulletPoints: [
          "Does NOT require stealing your password or 2FA token!",
          "Gives the attacker a persistent OAuth refresh token with direct API access.",
          "Looks like a standard Google or Microsoft permission dialog."
        ],
        proTip: "Carefully inspect what permissions a third-party app is requesting. Never grant 'Read all mail' or 'Have full access to files' to unverified apps.",
        realExample: "A fake 'PDF Reader Cloud' app harvested enterprise SharePoint repositories after employees clicked 'Grant Access'."
      }
    ],
    quiz: [
      {
        id: "q3-1",
        question: "Why is an Illicit OAuth Consent Grant attack particularly dangerous compared to a basic password phishing page?",
        options: [
          "It forces your computer to overheat",
          "It can bypass Multi-Factor Authentication (MFA) and grant persistent API access without needing your password",
          "It only works on Linux machines",
          "It sends spam from your home router"
        ],
        correctIndex: 1,
        explanation: "OAuth tokens are authenticated session keys. Once granted, the rogue application has direct API access to corporate cloud resources regardless of MFA."
      }
    ]
  }
];

export const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  {
    id: "emp-1",
    name: "Alex Rivera",
    email: "arivera@acmecorp.com",
    department: "Finance",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    riskScore: 68,
    status: "Needs Refresher",
    simulationsReceived: 6,
    simulationsReported: 2,
    simulationsClicked: 3,
    simulationsCompromised: 1,
    lastSimDate: "2026-08-10"
  },
  {
    id: "emp-2",
    name: "Marcus Vance",
    email: "mvance@acmecorp.com",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    riskScore: 12,
    status: "Champion",
    simulationsReceived: 8,
    simulationsReported: 8,
    simulationsClicked: 0,
    simulationsCompromised: 0,
    lastSimDate: "2026-08-14"
  },
  {
    id: "emp-3",
    name: "Elena Rostova",
    email: "erostova@acmecorp.com",
    department: "Human Resources",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    riskScore: 82,
    status: "High Risk",
    simulationsReceived: 7,
    simulationsReported: 1,
    simulationsClicked: 5,
    simulationsCompromised: 3,
    lastSimDate: "2026-08-16"
  },
  {
    id: "emp-4",
    name: "David Chen",
    email: "dchen@acmecorp.com",
    department: "Sales & BD",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    riskScore: 45,
    status: "Trained",
    simulationsReceived: 5,
    simulationsReported: 3,
    simulationsClicked: 1,
    simulationsCompromised: 0,
    lastSimDate: "2026-08-12"
  },
  {
    id: "emp-5",
    name: "Samantha Wright",
    email: "swright@acmecorp.com",
    department: "Executive",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    riskScore: 25,
    status: "Trained",
    simulationsReceived: 6,
    simulationsReported: 5,
    simulationsClicked: 1,
    simulationsCompromised: 0,
    lastSimDate: "2026-08-15"
  },
  {
    id: "emp-6",
    name: "Tariq Al-Mansoor",
    email: "talmansoor@acmecorp.com",
    department: "Legal",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    riskScore: 18,
    status: "Champion",
    simulationsReceived: 5,
    simulationsReported: 5,
    simulationsClicked: 0,
    simulationsCompromised: 0,
    lastSimDate: "2026-08-11"
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-1",
    name: "Q3 All-Hands MFA Token Renewal Drill",
    templateId: "sim-1",
    templateTitle: "Urgent: Mandatory Multi-Factor Authentication (MFA) Re-sync",
    targetCohort: "All Employees",
    difficulty: "Beginner",
    attackVector: "Credential Harvester",
    status: "Running",
    startDate: "2026-08-15",
    totalSent: 148,
    openedCount: 132,
    clickedCount: 28,
    reportedCount: 94,
    submittedCredsCount: 9
  },
  {
    id: "camp-2",
    name: "Finance Department BEC & Wire Fraud Drill",
    templateId: "sim-3",
    templateTitle: "Executive Urgent Task: Confidential Vendor Wire",
    targetCohort: "Finance Dept",
    difficulty: "Advanced Spear-Phishing",
    attackVector: "Business Email Compromise (BEC)",
    status: "Completed",
    startDate: "2026-08-01",
    totalSent: 24,
    openedCount: 22,
    clickedCount: 4,
    reportedCount: 17,
    submittedCredsCount: 1
  }
];
