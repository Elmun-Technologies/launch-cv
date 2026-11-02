import type { ResumeExample } from "@/lib/resume-examples";

/** More role examples (see lib/resume-examples.ts for the shape and rules). */
export const MORE_EXAMPLES_D: ResumeExample[] = [
  // ─── Tech & product ──────────────────────────────────────────────────
  {
    slug: "it-support-specialist",
    role: "IT Support Specialist",
    group: "Tech & product",
    photo: { src: "/images/photos/role-it-support-specialist.webp", alt: "Network patch panel with blue and gray Ethernet cables" },
    level: "Mid-level · 5 years experience",
    intro:
      "An IT support specialist resume that shows how many users you keep working, the systems you manage and the tickets you close — with the CompTIA, Microsoft 365 and ticketing keywords IT managers screen for.",
    resume: {
      name: "Tyler Henderson",
      headline: "IT Support Specialist",
      contact: "Columbus, OH · tyler.henderson@email.com · (614) 555-0127",
      summary:
        "IT support specialist with 5 years of technical support for offices of 100 to 450 people. I handle Tier 2 troubleshooting across Windows, macOS, networking and Microsoft 365, keep ticketing systems tidy and explain fixes in plain language — good customer service is half the job.",
      jobs: [
        {
          title: "IT Support Specialist",
          company: "Scioto Ridge Insurance Group",
          dates: "Mar 2023 – Present",
          bullets: [
            "Support 450 employees across 3 offices on Windows 11, macOS and Microsoft 365, resolving 92% of Tier 2 tickets without escalation",
            "Manage users, groups and licenses in Active Directory and Microsoft Entra ID; automated new-hire account setup with PowerShell, cutting prep from 2 hours to 20 minutes",
            "Enroll and patch 500+ laptops and phones in Microsoft Intune, raising patch compliance from 78% to 97%",
            "Replaced switches and Wi-Fi access points in 2 branch offices over weekends, troubleshooting VPN and TCP/IP issues with no lost workdays",
          ],
        },
        {
          title: "Desktop Support Technician",
          company: "Granville Manufacturing Co.",
          dates: "Jun 2021 – Feb 2023",
          bullets: [
            "Closed 40–50 ServiceNow tickets a week for hardware, printer, VPN and software issues, with a 4.8/5 satisfaction score",
            "Handled device imaging and deployment for 300 Windows laptops during a hardware refresh, finishing 2 weeks ahead of plan",
            "Wrote 35 knowledge base articles that cut repeat password and VPN tickets by 25%",
          ],
        },
      ],
      education:
        "A.A.S. Information Technology, Columbus State Community College, 2021 · CompTIA A+ · CompTIA Network+ · ITIL 4 Foundation",
      skills: ["Windows 11", "macOS", "Microsoft 365", "Active Directory", "Microsoft Intune", "ServiceNow", "PowerShell", "TCP/IP", "VPN", "Hardware troubleshooting"],
    },
    whyItWorks:
      "The first bullet gives the scale of the job — users, offices and how much gets fixed without escalation — and every system is named the way IT job posts name it. The CompTIA and ITIL certifications sit in plain text next to the degree, where a recruiter's search will find them.",
    summaries: [
      { level: "Entry level", text: "CompTIA A+ certified IT graduate with a year of part-time help desk work. Comfortable with Windows, Microsoft 365 and Active Directory password and account tasks, and patient with non-technical users." },
      { level: "Mid level", text: "IT support specialist with 5 years supporting offices of up to 450 people. I resolve 92% of Tier 2 tickets without escalation and automate the repetitive work with PowerShell." },
      { level: "Senior", text: "IT support lead who runs a team of 4 technicians for 1,200 users, owns device management in Intune and sets the service desk's SLAs and knowledge base standards." },
    ],
    bullets: [
      { skill: "Resolution", weak: "Fixed tickets", strong: "Resolved 92% of Tier 2 tickets without escalation for 450 employees across 3 offices" },
      { skill: "Automation", weak: "Used PowerShell", strong: "Automated new-hire account setup with PowerShell, cutting prep from 2 hours to 20 minutes" },
      { skill: "Device management", weak: "Managed laptops", strong: "Raised patch compliance from 78% to 97% across 500+ devices enrolled in Microsoft Intune" },
      { skill: "Networking", weak: "Did network work", strong: "Replaced switches and Wi-Fi access points in 2 branch offices over weekends with no lost workdays" },
      { skill: "Deployment", weak: "Set up new computers", strong: "Imaged and deployed 300 Windows laptops in a hardware refresh, finishing 2 weeks ahead of plan" },
      { skill: "Knowledge base", weak: "Wrote documentation", strong: "Wrote 35 knowledge base articles that cut repeat password and VPN tickets by 25%" },
    ],
    keywords: [
      "Technical support", "Troubleshooting", "Windows", "macOS", "Microsoft 365", "Active Directory", "Microsoft Entra ID",
      "Microsoft Intune", "ServiceNow", "Ticketing systems", "PowerShell", "Networking", "TCP/IP", "VPN", "Device imaging",
      "CompTIA A+", "CompTIA Network+", "ITIL", "Customer service",
    ],
    keywordSort: {
      tools: ["Microsoft 365", "Active Directory", "Microsoft Entra ID", "Microsoft Intune", "ServiceNow", "PowerShell"],
      credentials: ["CompTIA A+", "CompTIA Network+", "ITIL"],
      soft: ["Customer service"],
    },
    tips: [
      { t: "Size your support load", d: "Number of users, offices and devices tells a hiring manager what scale you can handle. Ticket volume and escalation rate show how well." },
      { t: "Name the platforms exactly", d: "Write Microsoft Intune, Active Directory or Microsoft Entra ID (formerly Azure AD) and ServiceNow or Jira Service Management — job posts and recruiter searches use the product names." },
      { t: "Say which tier you work at", d: "Tier 1, Tier 2 or desktop support are different jobs. Saying which one you do, and what you escalate, sets the right level." },
      { t: "Show one thing you automated", d: "A PowerShell script, an onboarding checklist or a knowledge base article that reduced tickets shows you fix causes, not just symptoms." },
      { t: "List certifications by full name", d: "Write \"CompTIA A+\" and \"CompTIA Network+\" rather than logos or abbreviations alone, and only list certifications you've actually earned." },
    ],
    faqs: [
      { q: "What certifications help most for IT support jobs?", a: "CompTIA A+ is the most common entry-level requirement; it takes two exams, Core 1 and Core 2. Network+ and Security+ are common next steps, and ITIL 4 Foundation helps at companies that run a formal service desk." },
      { q: "What's the difference between IT support and help desk on a resume?", a: "Help desk roles usually mean Tier 1: answering calls and tickets, password resets and first-line fixes. IT support specialist roles often add Tier 2 work like device management, account administration and small network jobs. Use the title you actually held." },
      { q: "Should I list every piece of software I've supported?", a: "No. Lead with the platforms the job post names and the ones you've administered, not just used. A long list of every app makes it harder to see what you know well." },
      { q: "How do I show soft skills on an IT support resume?", a: "Through results: satisfaction scores, knowledge base articles that cut tickets, or training you gave users. A line like \"excellent communicator\" adds little on its own." },
      { q: "Do I need a degree for IT support?", a: "Many IT support roles accept certifications and experience instead of a degree. If you have an associate degree or relevant coursework, list it; if not, put certifications and hands-on experience first." },
    ],
    related: ["help-desk-technician", "cybersecurity-analyst", "customer-service-representative"],
  },
  {
    slug: "help-desk-technician",
    role: "Help Desk Technician",
    group: "Tech & product",
    photo: { src: "/images/photos/role-help-desk-technician.webp", alt: "Help desk technician talking on the phone at a desk behind computer monitors" },
    level: "Entry level · 2 years experience",
    intro:
      "A help desk technician resume for Tier 1 roles that shows your ticket volume, first-contact resolution and how you treat users — with the keywords service desk managers search for.",
    resume: {
      name: "Destiny Howard",
      headline: "Help Desk Technician",
      contact: "Phoenix, AZ · destiny.howard@email.com · (602) 555-0119",
      summary:
        "CompTIA A+ certified help desk technician with 2 years of Tier 1 technical support and 2 years of hands-on device repair before that. I handle password resets, Outlook and printer issues fast, keep ticketing systems up to date, write clear documentation and escalate with notes Tier 2 can act on.",
      jobs: [
        {
          title: "Help Desk Technician",
          company: "Sunline Medical Billing Services",
          dates: "Jan 2024 – Present",
          bullets: [
            "Answer 30–40 calls, chats and emails a day as Tier 1 support for 600 users, logging every contact in Jira Service Management",
            "Keep a 75% first-contact resolution rate on password resets, Outlook, Microsoft 365 and printer support requests",
            "Unlock accounts and reset passwords in Active Directory and set up multi-factor authentication (MFA) for new hires",
            "Use remote desktop support tools to fix Windows issues without a site visit; fewer than 5% of my tickets are reopened",
          ],
        },
        {
          title: "Technology Repair Associate",
          company: "Westshore Electronics",
          dates: "Aug 2021 – Dec 2023",
          bullets: [
            "Diagnosed and repaired 15+ laptops, phones and tablets a week, from screen replacements to malware removal",
            "Set up new devices, data transfers and home Wi-Fi for customers, explaining each step in plain language",
            "Earned a 4.9/5 average customer service rating across 200+ reviews",
          ],
        },
      ],
      education: "A.A. General Studies, Phoenix College, 2021 · CompTIA A+, 2023",
      skills: ["Windows", "Microsoft 365", "Outlook", "Active Directory", "Jira Service Management", "Remote desktop support", "Password resets", "Printer support", "Troubleshooting", "Documentation"],
    },
    whyItWorks:
      "It reads like a Tier 1 job description with numbers: contacts a day, users supported, first-contact resolution and reopen rate. The repair job is kept because it proves hands-on troubleshooting and customer service, and the CompTIA A+ is named in the summary where it's seen first.",
    summaries: [
      { level: "Career changer", text: "Retail associate moving into IT, with CompTIA A+ certification and a home lab running Windows Server and Active Directory. Known for calm, patient help with customers who aren't technical." },
      { level: "Entry level", text: "CompTIA A+ certified help desk technician with 2 years of Tier 1 support for 600 users. I keep a 75% first-contact resolution rate and write escalation notes Tier 2 can act on." },
      { level: "Experienced", text: "Senior help desk technician who trains new hires, maintains the knowledge base and handles VIP support for a 900-person company." },
    ],
    bullets: [
      { skill: "Volume", weak: "Answered phones and tickets", strong: "Handle 30–40 calls, chats and emails a day as Tier 1 support for 600 users" },
      { skill: "Resolution", weak: "Solved user problems", strong: "Keep a 75% first-contact resolution rate on password, Outlook, Microsoft 365 and printer issues" },
      { skill: "Accounts", weak: "Reset passwords", strong: "Unlock accounts and reset passwords in Active Directory, and set up MFA for every new hire" },
      { skill: "Quality", weak: "Did good work", strong: "Fewer than 5% of my tickets are reopened, thanks to clear fixes and follow-up notes" },
      { skill: "Repair", weak: "Fixed devices", strong: "Diagnosed and repaired 15+ laptops, phones and tablets a week, from screens to malware removal" },
      { skill: "Customer service", weak: "Good with customers", strong: "Earned a 4.9/5 average rating across 200+ customer service reviews" },
    ],
    keywords: [
      "Help desk", "Tier 1 support", "Technical support", "Troubleshooting", "Password resets", "Multi-factor authentication",
      "Active Directory", "Microsoft 365", "Outlook", "Windows", "Jira Service Management", "Ticketing systems",
      "Remote desktop support", "Printer support", "First-contact resolution", "Documentation", "Customer service", "CompTIA A+",
    ],
    keywordSort: {
      tools: ["Active Directory", "Microsoft 365", "Outlook", "Jira Service Management"],
      credentials: ["CompTIA A+"],
      soft: ["Customer service", "Documentation"],
    },
    tips: [
      { t: "Lead with volume and resolution", d: "Contacts per day, users supported and first-contact resolution are the numbers a service desk manager tracks. Put them in your first bullets." },
      { t: "Name the ticketing system", d: "ServiceNow, Jira Service Management, Zendesk and Freshservice are all searched by name. Write the one you've used." },
      { t: "Use earlier jobs that prove the basics", d: "Repair counters, retail tech support and school IT jobs show troubleshooting and patience with users. Keep them, with numbers." },
      { t: "Show you escalate well", d: "A low reopen rate or a line about clear escalation notes tells Tier 2 teams you'll make their day easier." },
      { t: "Don't overstate certifications", d: "List certifications you've passed. If you're studying for one, mention it in an interview or a cover letter rather than in the certification line." },
    ],
    faqs: [
      { q: "How do I get a help desk job with no IT experience?", a: "Lead with any role where you fixed things or helped people with technology — retail tech support, a school computer lab, family and small-business setups — and add the CompTIA A+ if you have it. A home lab with Active Directory is a good talking point too." },
      { q: "Is CompTIA A+ worth putting on a help desk resume?", a: "Yes. It's one of the most common requirements in Tier 1 job posts. It takes two exams, Core 1 and Core 2, so only list it once you've passed both." },
      { q: "Should I include call center or customer service experience?", a: "Yes. Help desk work is customer service with a technical layer. Handle times, satisfaction scores and volume from a call center carry over well." },
      { q: "What's first-contact resolution, and should I list it?", a: "It's the share of issues solved on the first call, chat or email without a callback or escalation. If your team tracked it and your number is solid, it's one of the strongest metrics you can show." },
      { q: "How long should a help desk technician resume be?", a: "One page. Two jobs with 3–4 bullets each, a short skills section and your certifications is enough at this level." },
    ],
    related: ["it-support-specialist", "customer-service-representative", "administrative-assistant"],
  },
  {
    slug: "cybersecurity-analyst",
    role: "Cybersecurity Analyst",
    group: "Tech & product",
    photo: { src: "/images/photos/role-cybersecurity-analyst.webp", alt: "Red padlock resting on a backlit laptop keyboard" },
    level: "Mid-level · 5 years experience",
    intro:
      "A cybersecurity analyst resume that shows the alerts you triage, the incidents you contain and the risk you reduce — with the SIEM, EDR and framework keywords security hiring managers filter on.",
    resume: {
      name: "Samuel Okoye",
      headline: "Cybersecurity Analyst",
      contact: "San Antonio, TX · samuel.okoye@email.com · (210) 555-0136",
      summary:
        "Cybersecurity analyst with 5 years in security operations, from a managed SOC to an in-house team at a financial services firm. I focus on threat detection, incident response and vulnerability management, and I tune detections until analysts trust them.",
      jobs: [
        {
          title: "Cybersecurity Analyst",
          company: "Riverwalk Financial Group",
          dates: "Apr 2023 – Present",
          bullets: [
            "Triage 150+ Splunk alerts a day in a 24/7 SOC and escalate confirmed incidents under the company's incident response plan",
            "Tuned 40 noisy correlation searches, cutting false positives by 35% and freeing about 10 analyst hours a week",
            "Led response to a phishing campaign that reached 120 inboxes: blocked the sender, purged the messages and reset 6 exposed accounts within 2 hours",
            "Run monthly vulnerability scans in Tenable and track fixes with IT; critical findings open past 30 days fell from 48 to 9",
          ],
        },
        {
          title: "SOC Analyst",
          company: "Lonestar Managed Security",
          dates: "Jun 2021 – Mar 2023",
          bullets: [
            "Investigated endpoint alerts in CrowdStrike Falcon for 25 client environments",
            "Wrote 20 runbooks for common alert types, cutting average triage time from 25 to 15 minutes",
            "Mapped client detections to MITRE ATT&CK techniques and the NIST Cybersecurity Framework to show coverage gaps",
            "Wrote Python scripts that added threat intelligence lookups to alerts before an analyst opened them",
          ],
        },
      ],
      education: "B.S. Computer Science, The University of Texas at San Antonio, 2021 · CompTIA Security+ · CompTIA CySA+",
      skills: ["SIEM (Splunk)", "EDR (CrowdStrike Falcon)", "Incident response", "Threat detection", "Vulnerability management", "Tenable", "Log analysis", "Phishing analysis", "MITRE ATT&CK", "Python"],
    },
    whyItWorks:
      "It names the exact SIEM, EDR and scanner the analyst uses, gives alert volume and response times, and shows risk going down in numbers — false positives, triage time and open critical findings. The CompTIA certifications are listed by full name, and it doesn't claim credentials the analyst hasn't earned.",
    summaries: [
      { level: "Entry level", text: "CompTIA Security+ certified IT support specialist moving into security, with 2 years handling account, endpoint and phishing tickets and a home lab running Splunk and Sysmon." },
      { level: "Mid level", text: "Cybersecurity analyst with 5 years in security operations. I triage 150+ alerts a day, cut false positives by 35% and led a phishing response that was contained within 2 hours." },
      { level: "Senior", text: "Senior security analyst who leads incident response for a 3,000-person company, owns detection engineering in the SIEM and reports risk to the CISO each quarter." },
    ],
    bullets: [
      { skill: "Detection tuning", weak: "Worked on SIEM rules", strong: "Tuned 40 Splunk correlation searches, cutting false positives by 35% and freeing about 10 analyst hours a week" },
      { skill: "Incident response", weak: "Responded to incidents", strong: "Contained a phishing campaign that reached 120 inboxes within 2 hours, including resets for 6 exposed accounts" },
      { skill: "Vulnerability management", weak: "Ran vulnerability scans", strong: "Cut critical findings open past 30 days from 48 to 9 with monthly Tenable scans and tracked fixes" },
      { skill: "Process", weak: "Wrote procedures", strong: "Wrote 20 runbooks that cut average triage time from 25 to 15 minutes" },
      { skill: "Endpoint", weak: "Used CrowdStrike", strong: "Investigated CrowdStrike Falcon endpoint alerts across 25 client environments" },
      { skill: "Frameworks", weak: "Knowledge of MITRE ATT&CK", strong: "Mapped client detections to MITRE ATT&CK and the NIST Cybersecurity Framework to show coverage gaps" },
    ],
    keywords: [
      "Security operations", "SOC", "SIEM", "Splunk", "Incident response", "Threat detection", "Vulnerability management",
      "Tenable", "EDR", "CrowdStrike Falcon", "MITRE ATT&CK", "NIST Cybersecurity Framework", "Phishing analysis",
      "Log analysis", "Threat intelligence", "Runbooks", "Python", "CompTIA Security+", "CompTIA CySA+",
    ],
    keywordSort: {
      tools: ["Splunk", "Tenable", "CrowdStrike Falcon", "Python"],
      credentials: ["CompTIA Security+", "CompTIA CySA+"],
    },
    tips: [
      { t: "Name your tool stack", d: "Splunk, Microsoft Sentinel, CrowdStrike, Tenable and similar tools are searched by name. List the ones you've worked in, not the whole market." },
      { t: "Show volume and speed", d: "Alerts triaged a day, time to contain and triage time give a hiring manager a sense of the pace you're used to." },
      { t: "Prove risk went down", d: "Fewer false positives, fewer open critical findings or faster response are stronger than a list of duties." },
      { t: "Be careful with incident details", d: "Describe what you did and the result, but leave out anything confidential — client names, specific vulnerabilities or details an attacker could use." },
      { t: "Only list certifications you hold", d: "Certifying bodies restrict use of their marks. If you've passed an exam but don't hold the full certification yet, describe it exactly as the certifying body allows." },
    ],
    faqs: [
      { q: "Which certifications matter for a cybersecurity analyst?", a: "CompTIA Security+ is a common baseline, and CompTIA CySA+ is built for analyst work in detection and response. Vendor certifications for the SIEM or EDR you use can also help." },
      { q: "Should I list CISSP if I'm studying for it?", a: "No. ISC2 requires five years of cumulative paid work in at least two of the eight CISSP domains before you can hold the certification. People who pass the exam without the experience can become an Associate of ISC2 and should describe it that way." },
      { q: "How do I move from IT support into cybersecurity?", a: "Lead with the security parts of your current job — account lockouts, phishing reports, patching, endpoint alerts — and add a home lab or Security+ to show you're building the skills on purpose." },
      { q: "How much technical detail should my bullets have?", a: "Enough to name the tool and the technique, plus the result. \"Tuned 40 Splunk searches, cutting false positives by 35%\" is specific without exposing anything sensitive." },
      { q: "Should I include CTF competitions or a home lab?", a: "Yes, especially early in your career. Give it a short section with what you built or solved and the tools you used." },
    ],
    related: ["it-support-specialist", "devops-engineer", "software-engineer"],
  },
  {
    slug: "devops-engineer",
    role: "DevOps Engineer",
    group: "Tech & product",
    photo: { src: "/images/photos/role-devops-engineer.webp", alt: "Engineer holding a laptop in a server room corridor" },
    level: "Mid-level · 6 years experience",
    intro:
      "A DevOps engineer resume that shows faster deploys, steadier systems and infrastructure as code — with the AWS, Kubernetes and CI/CD keywords platform teams search for.",
    resume: {
      name: "Ryan Gallagher",
      headline: "DevOps Engineer",
      contact: "Raleigh, NC · ryan.gallagher@email.com · github.com/rgallagher",
      summary:
        "DevOps engineer with 6 years running Linux and AWS infrastructure. I build CI/CD pipelines and infrastructure as code that let developers ship several times a day, and I set up the monitoring that tells us when something breaks before customers do.",
      jobs: [
        {
          title: "DevOps Engineer",
          company: "Pinecrest Software",
          dates: "May 2022 – Present",
          bullets: [
            "Manage AWS infrastructure for 40 services entirely in Terraform, with every change reviewed through pull requests",
            "Rebuilt CI/CD pipelines in GitHub Actions, cutting average build-and-deploy time from 28 to 9 minutes",
            "Moved 25 services from EC2 to Amazon EKS with Helm charts and blue-green deploys, with no customer-facing downtime",
            "Set up Prometheus and Grafana alerting with on-call runbooks for incident response; mean time to recovery fell from 70 to 25 minutes",
          ],
        },
        {
          title: "Systems Engineer",
          company: "Crabtree Data Services",
          dates: "Jul 2020 – Apr 2022",
          bullets: [
            "Automated configuration for 120 Linux servers with Ansible, replacing manual setup checklists",
            "Maintained Jenkins build jobs for 15 internal applications and moved the first 5 to pipeline-as-code",
            "Containerized 8 legacy applications with Docker as the first step toward Kubernetes",
            "Wrote Bash and Python scripts for backups and log rotation, ending repeat disk-full alerts",
          ],
        },
      ],
      education:
        "B.S. Computer Engineering, North Carolina State University, 2020 · AWS Certified DevOps Engineer - Professional · Certified Kubernetes Administrator (CKA)",
      skills: ["AWS", "Terraform", "Kubernetes", "Amazon EKS", "Helm", "Docker", "GitHub Actions", "Jenkins", "Ansible", "Prometheus", "Grafana", "Monitoring and alerting"],
    },
    whyItWorks:
      "Each bullet ties a tool to a result a team feels — deploy time, recovery time, downtime avoided — and the infrastructure is sized in services and servers. Certifications are written with their full official names, so both the long form and the acronym are searchable.",
    summaries: [
      { level: "Entry level", text: "Linux systems administrator moving into DevOps, with 2 years of Bash and Ansible automation and personal projects deploying containerized apps to AWS with Terraform and GitHub Actions." },
      { level: "Mid level", text: "DevOps engineer with 6 years on AWS. I cut deploy time from 28 to 9 minutes and moved 25 services to Amazon EKS with no customer-facing downtime." },
      { level: "Senior", text: "Platform engineering lead who has run teams of 5, built internal developer platforms on Kubernetes and owned reliability targets for 100+ production services." },
    ],
    bullets: [
      { skill: "CI/CD", weak: "Worked on pipelines", strong: "Rebuilt CI/CD in GitHub Actions, cutting average build-and-deploy time from 28 to 9 minutes" },
      { skill: "Infrastructure as code", weak: "Used Terraform", strong: "Manage AWS infrastructure for 40 services entirely in Terraform, with every change reviewed in a pull request" },
      { skill: "Kubernetes", weak: "Migrated to Kubernetes", strong: "Moved 25 services from EC2 to Amazon EKS with Helm and blue-green deploys and no customer-facing downtime" },
      { skill: "Reliability", weak: "Improved monitoring", strong: "Set up Prometheus and Grafana alerting with runbooks; mean time to recovery fell from 70 to 25 minutes" },
      { skill: "Configuration", weak: "Managed servers", strong: "Automated configuration for 120 Linux servers with Ansible, replacing manual checklists" },
      { skill: "Containers", weak: "Used Docker", strong: "Containerized 8 legacy applications with Docker as the first step toward Kubernetes" },
    ],
    keywords: [
      "AWS", "Terraform", "Infrastructure as code", "CI/CD", "GitHub Actions", "Jenkins", "Kubernetes", "Amazon EKS", "Docker",
      "Ansible", "Linux", "Bash", "Python", "Prometheus", "Grafana", "Monitoring and alerting", "Incident response",
      "AWS Certified DevOps Engineer", "CKA",
    ],
    keywordSort: {
      tools: ["AWS", "Terraform", "GitHub Actions", "Jenkins", "Kubernetes", "Amazon EKS", "Docker", "Ansible", "Prometheus", "Grafana"],
      credentials: ["AWS Certified DevOps Engineer", "CKA"],
    },
    tips: [
      { t: "Measure what developers feel", d: "Deploy time, deploy frequency, failed changes and time to recovery show the value of platform work better than a list of tools." },
      { t: "Size the estate", d: "Number of services, servers, clusters or accounts tells a hiring manager the scale you've run." },
      { t: "Name the cloud and the tools precisely", d: "AWS, Azure and Google Cloud are searched separately, and so are Terraform, Pulumi and CloudFormation. Write the ones you've used in production." },
      { t: "Write certifications in full", d: "Use the official name, such as \"AWS Certified DevOps Engineer - Professional\" or \"Certified Kubernetes Administrator (CKA)\", and keep them current — both expire." },
      { t: "Link code you can show", d: "A GitHub profile with real Terraform modules or pipeline examples helps, but the resume bullets should still stand on their own." },
    ],
    faqs: [
      { q: "Which certifications help a DevOps engineer resume?", a: "Cloud certifications for the provider you work on, such as AWS Certified DevOps Engineer - Professional, and the Certified Kubernetes Administrator (CKA) are common. The CKA is a hands-on, command-line exam, so it says something about practical skill." },
      { q: "Should I list every tool I've touched?", a: "No. Lead with the cloud, infrastructure-as-code tool, CI/CD system and container platform you know best, and match them to the job post. A shorter list you can defend in an interview is better." },
      { q: "How do I move from system administration to DevOps?", a: "Show the automation you already do — Bash, Python, Ansible — and any pipelines or cloud work, even small ones. Then describe a project where you deployed something end to end with code." },
      { q: "Is DevOps engineer the same as site reliability engineer?", a: "They overlap. SRE roles lean more on reliability targets, on-call and incident work; DevOps roles lean more on pipelines and infrastructure. Use the title you held, and mirror the language of the post in your bullets where it's true." },
      { q: "Do I need to know how to code?", a: "Yes, at least scripting. Most DevOps posts ask for Bash and Python or Go, and infrastructure as code is code. Show it with a bullet, not just a skills entry." },
    ],
    related: ["software-engineer", "cybersecurity-analyst", "data-engineer"],
  },
  {
    slug: "qa-engineer",
    role: "QA Engineer",
    group: "Tech & product",
    photo: { src: "/images/photos/role-qa-engineer.webp", alt: "Laptop showing code in an editor on a white desk" },
    level: "Mid-level · 5 years experience",
    intro:
      "A QA engineer resume that shows the tests you automate, the time you save and the bugs that never reach customers — with the automation, API testing and ISTQB keywords engineering teams search for.",
    resume: {
      name: "Natalia Cruz",
      headline: "QA Engineer",
      contact: "Salt Lake City, UT · natalia.cruz@email.com · github.com/nataliacruz",
      summary:
        "QA engineer with 5 years in insurance and health software. I build test automation that runs in CI/CD on every pull request, plan testing around risk, and work inside Agile teams so quality is part of the sprint instead of a gate at the end.",
      jobs: [
        {
          title: "QA Engineer",
          company: "Bonneville Software",
          dates: "Mar 2023 – Present",
          bullets: [
            "Built a Playwright and TypeScript suite of 600 end-to-end tests that runs on every pull request in GitHub Actions",
            "Cut regression testing from 3 days of manual work to 40 minutes, letting the team release weekly instead of monthly",
            "Wrote 250 API tests in Postman collections that run in the pipeline, catching contract breaks before front-end work starts",
            "Introduced risk-based test planning for each sprint; customer-reported defects fell from 18 to 5 a quarter",
          ],
        },
        {
          title: "Software Test Analyst",
          company: "Granite Peak Insurance",
          dates: "Jun 2021 – Feb 2023",
          bullets: [
            "Wrote and ran 400+ manual test cases in TestRail for a policy administration system",
            "Handled defect tracking in Jira with clear reproduction steps, halving tickets returned as \"cannot reproduce\"",
            "Automated 120 smoke tests with Selenium WebDriver and Java",
            "Wrote SQL queries to set up test data and check back-end results",
          ],
        },
      ],
      education: "B.S. Information Systems, University of Utah, 2021 · ISTQB Certified Tester Foundation Level (CTFL)",
      skills: ["Playwright", "Selenium", "TypeScript", "Java", "Postman", "API testing", "TestRail", "Jira", "SQL", "GitHub Actions"],
    },
    whyItWorks:
      "It shows both halves of QA work — automation and test planning — with the numbers that matter to an engineering manager: tests running in CI, regression time saved and fewer customer-reported defects. Tools and the ISTQB certification are named exactly as job posts write them.",
    summaries: [
      { level: "Entry level", text: "ISTQB Foundation Level certified tester with a year of manual testing for a web app and personal Playwright projects on GitHub. Detail-minded and clear in bug reports." },
      { level: "Mid level", text: "QA engineer with 5 years of manual and automated testing. I built a 600-test Playwright suite and cut regression from 3 days to 40 minutes." },
      { level: "Senior", text: "QA lead who has set test strategy for 4 product teams, built shared automation frameworks and mentored 6 testers into automation roles." },
    ],
    bullets: [
      { skill: "Automation", weak: "Wrote automated tests", strong: "Built 600 Playwright end-to-end tests in TypeScript that run on every pull request" },
      { skill: "Speed", weak: "Made testing faster", strong: "Cut regression testing from 3 days of manual work to 40 minutes, enabling weekly releases" },
      { skill: "API testing", weak: "Tested APIs", strong: "Wrote 250 Postman API tests that run in the pipeline and catch contract breaks early" },
      { skill: "Test planning", weak: "Planned tests", strong: "Introduced risk-based sprint test planning; customer-reported defects fell from 18 to 5 a quarter" },
      { skill: "Defect reporting", weak: "Logged bugs", strong: "Wrote Jira defect reports with clear reproduction steps, halving \"cannot reproduce\" returns" },
      { skill: "Manual testing", weak: "Did manual testing", strong: "Wrote and ran 400+ manual test cases in TestRail for a policy administration system" },
    ],
    keywords: [
      "Test automation", "Playwright", "Selenium", "TypeScript", "Java", "API testing", "Postman", "Regression testing",
      "End-to-end tests", "Test planning", "Test cases", "TestRail", "Jira", "SQL", "CI/CD", "Agile", "Defect tracking", "ISTQB",
    ],
    keywordSort: {
      tools: ["Playwright", "Selenium", "Postman", "TestRail", "Jira"],
      credentials: ["ISTQB"],
    },
    tips: [
      { t: "Show automation and judgment", d: "Hiring managers want both: tests you've automated and how you decide what to test. One bullet about each helps." },
      { t: "Measure time saved and bugs prevented", d: "Regression time, release frequency and customer-reported defects are the clearest results for QA work." },
      { t: "Name the framework and the language", d: "\"Playwright with TypeScript\" or \"Selenium with Java\" is what recruiters search for. \"Automation tools\" isn't." },
      { t: "Mention where tests run", d: "Tests in a CI/CD pipeline on every pull request show a more mature setup than tests run by hand before a release." },
      { t: "List the ISTQB level exactly", d: "Write \"ISTQB Certified Tester Foundation Level (CTFL)\" so both the full name and the abbreviation can be found." },
    ],
    faqs: [
      { q: "Is the ISTQB certification worth it for QA engineers?", a: "It can help, especially early in your career or with employers that ask for it. The Foundation Level (CTFL) is the entry point and a prerequisite for ISTQB's higher levels. Automation experience usually matters more after a few years." },
      { q: "Should a QA resume focus on manual or automated testing?", a: "Match the job post. Most QA engineer roles now expect some automation, but strong manual testing, test design and exploratory testing are still valuable. Show both if you do both." },
      { q: "QA engineer, SDET or test analyst — which title should I use?", a: "Use the title you held. In your summary and bullets, describe the work in the language the post uses — automation framework, API testing, test strategy — where it's accurate." },
      { q: "How do I show test automation skills without a work example?", a: "Link a GitHub repository with a small, well-organized test suite against a public demo app, and describe it in one bullet with the framework, language and what it covers." },
      { q: "Should I list bug counts?", a: "Raw bug counts can mislead. Customer-reported defects going down, faster regression or more frequent releases are better signs of good QA." },
    ],
    related: ["software-engineer", "devops-engineer", "business-analyst"],
  },
  {
    slug: "data-engineer",
    role: "Data Engineer",
    group: "Tech & product",
    photo: { src: "/images/photos/role-data-engineer.webp", alt: "Server racks with bundled network cables and status lights in a data center" },
    level: "Mid-level · 5 years experience",
    intro:
      "A data engineer resume that shows reliable data pipelines, lower run times and data people trust — with the SQL, Airflow, dbt and cloud keywords data teams filter on.",
    resume: {
      name: "Omar Haddad",
      headline: "Data Engineer",
      contact: "Pittsburgh, PA · omar.haddad@email.com · github.com/omarhaddad",
      summary:
        "Data engineer with 5 years building data pipelines for retail and logistics. I design batch and streaming ETL in SQL and Python, model data warehousing layers analysts can use without asking me, and treat data quality as part of the pipeline.",
      jobs: [
        {
          title: "Data Engineer",
          company: "Three Rivers Grocery Co.",
          dates: "Feb 2023 – Present",
          bullets: [
            "Build and maintain 60 Airflow DAGs that load sales, inventory and loyalty data into Snowflake every night",
            "Rebuilt the nightly batch as incremental dbt models, cutting run time from 6 hours to 90 minutes and Snowflake credit use by 30%",
            "Added dbt tests and freshness checks to 200 models; data incidents reported by analysts fell from 12 to 3 a month",
            "Stream point-of-sale events from 85 stores through Kafka so inventory dashboards update within 5 minutes",
          ],
        },
        {
          title: "Junior Data Engineer",
          company: "Ohio Valley Logistics",
          dates: "Jul 2021 – Jan 2023",
          bullets: [
            "Wrote Python and SQL ETL jobs on AWS — Amazon S3, AWS Glue and Amazon Redshift — for shipment and billing data",
            "Migrated 40 cron-scheduled scripts to Airflow with retries, logging and alerting",
            "Designed a star schema for billing data modeling that finance analysts now use for monthly revenue reporting",
          ],
        },
      ],
      education: "B.S. Computer Science, University of Pittsburgh, 2021 · AWS Certified Data Engineer - Associate",
      skills: ["SQL", "Python", "Airflow", "dbt", "Snowflake", "Kafka", "Spark", "Amazon S3", "AWS Glue", "Amazon Redshift", "Git"],
    },
    whyItWorks:
      "It sizes the work in pipelines, models and stores, and every bullet ends with something a data team cares about: run time, cost, freshness or fewer incidents. The tools are named precisely, and the AWS certification uses its official name.",
    summaries: [
      { level: "Entry level", text: "Computer science graduate with a data engineering internship and a portfolio pipeline that loads public transit data into Postgres with Airflow and dbt. Strong in SQL and Python." },
      { level: "Mid level", text: "Data engineer with 5 years in retail and logistics. I cut a nightly batch from 6 hours to 90 minutes and dropped analyst-reported data incidents from 12 to 3 a month." },
      { level: "Senior", text: "Senior data engineer who has led warehouse migrations to Snowflake, set modeling standards for a team of 8 and owns data platform costs and SLAs." },
    ],
    bullets: [
      { skill: "Performance", weak: "Made pipelines faster", strong: "Rebuilt a nightly batch as incremental dbt models, cutting run time from 6 hours to 90 minutes" },
      { skill: "Cost", weak: "Reduced Snowflake costs", strong: "Cut Snowflake credit use by 30% by moving full refreshes to incremental models" },
      { skill: "Data quality", weak: "Tested data", strong: "Added dbt tests and freshness checks to 200 models; analyst-reported incidents fell from 12 to 3 a month" },
      { skill: "Streaming", weak: "Worked with Kafka", strong: "Streamed point-of-sale events from 85 stores through Kafka, updating inventory dashboards within 5 minutes" },
      { skill: "Orchestration", weak: "Used Airflow", strong: "Migrated 40 cron-scheduled scripts to Airflow with retries, logging and alerting" },
      { skill: "Modeling", weak: "Designed tables", strong: "Designed a star schema for billing that finance analysts use for monthly revenue reporting" },
    ],
    keywords: [
      "SQL", "Python", "ETL", "Data pipelines", "Airflow", "dbt", "Snowflake", "Kafka", "Spark", "AWS", "Amazon S3", "AWS Glue",
      "Amazon Redshift", "Data modeling", "Data warehousing", "Data quality", "Git", "AWS Certified Data Engineer",
    ],
    keywordSort: {
      tools: ["Airflow", "dbt", "Snowflake", "Kafka", "Spark", "AWS", "Amazon S3", "AWS Glue", "Amazon Redshift", "Git"],
      credentials: ["AWS Certified Data Engineer"],
    },
    tips: [
      { t: "Show reliability, not just building", d: "Fewer failed runs, fewer data incidents and on-time freshness matter as much as new pipelines. Put at least one of those in your bullets." },
      { t: "Give run time and cost", d: "Data platform spend is a common concern. A bullet that cut warehouse credits or run time gets attention." },
      { t: "Name the stack exactly", d: "Airflow or Dagster, dbt, Snowflake, BigQuery or Redshift, Spark — recruiters search for each by name. List the ones you've run in production." },
      { t: "Size the data", d: "Number of pipelines, models, sources or stores — or rows and terabytes if you know them — helps a hiring manager judge scale." },
      { t: "Mention who uses your data", d: "Analysts, finance or a product team using your models shows the work mattered beyond the data team." },
    ],
    faqs: [
      { q: "What's the difference between a data engineer and a data analyst resume?", a: "A data engineer resume focuses on pipelines, data models, orchestration and reliability; an analyst resume focuses on the questions answered and decisions made. If you've done both, lead with the side that matches the job." },
      { q: "Are cloud certifications worth listing for data engineers?", a: "They can help, especially when the post names the cloud. AWS offers the AWS Certified Data Engineer - Associate; Google Cloud and Microsoft have their own data engineering certifications. Experience with results still matters most." },
      { q: "Should I include personal data projects?", a: "Yes if you have under about two years of experience. A small end-to-end project — ingestion, transformation, tests and a dashboard — with a GitHub link shows you can build the whole path." },
      { q: "How technical should my bullets be?", a: "Name the tool and the technique — incremental models, CDC, partitioning — and the result. Skip internal table names and detail only your team would understand." },
      { q: "Do I need Spark on my resume?", a: "Only if you've used it. Many data engineering roles now run mostly on SQL in a cloud warehouse with dbt; others rely on Spark. Match the post, and don't list tools you can't discuss." },
    ],
    related: ["data-analyst", "data-scientist", "software-engineer", "devops-engineer"],
  },

  // ─── Business ────────────────────────────────────────────────────────
  {
    slug: "operations-manager",
    role: "Operations Manager",
    group: "Business",
    photo: { src: "/images/photos/role-operations-manager.webp", alt: "Team meeting around a long conference table with laptops" },
    level: "Senior · 9 years experience",
    intro:
      "An operations manager resume that shows the site, team and budget you run and the safety, quality, delivery and cost results you deliver — with the Lean, Six Sigma and KPI keywords recruiters search for.",
    resume: {
      name: "Lauren Fischer",
      headline: "Operations Manager",
      contact: "Indianapolis, IN · lauren.fischer@email.com · (317) 555-0181",
      summary:
        "Operations manager with 9 years in distribution and light manufacturing. I run sites through clear KPIs and daily production planning, lead process improvement with Lean and Six Sigma tools, and keep cost reduction from coming at the expense of safety compliance.",
      jobs: [
        {
          title: "Operations Manager",
          company: "Circle City Home Products",
          dates: "Apr 2021 – Present",
          bullets: [
            "Run day-to-day operations for a 220,000 sq ft distribution and light assembly site with 140 employees across 2 shifts and a $14M operating budget",
            "Raised on-time shipments from 89% to 97% by redesigning pick paths, inventory management and daily production planning",
            "Cut operating costs by $1.1M a year through overtime controls, a carrier rebid with vendor management support from procurement, and Lean waste reduction",
            "Led a Six Sigma root cause analysis on packaging damage that reduced customer damage claims by 42%",
          ],
        },
        {
          title: "Operations Supervisor",
          company: "Hoosier Parts Distribution",
          dates: "Jun 2017 – Mar 2021",
          bullets: [
            "Supervised 35 associates and 3 team leads on second shift in a 24-hour parts warehouse",
            "Started daily huddles and a KPI board for safety, quality, delivery and cost, later adopted on all shifts",
            "Cut OSHA recordable injuries from 7 to 2 a year with job safety analyses and a new-hire training program",
            "Worked with IT and the vendor on an ERP and warehouse system upgrade, testing workflows and training 60 users",
          ],
        },
      ],
      education: "B.S. Industrial Engineering, Purdue University, 2017 · ASQ Certified Six Sigma Green Belt (CSSGB)",
      skills: ["Operations management", "Process improvement", "Lean", "Six Sigma", "KPIs", "Budget management", "Inventory management", "Production planning", "Power BI", "ERP", "Team leadership"],
    },
    whyItWorks:
      "The first bullet sizes the job in square feet, people, shifts and budget, and the rest report results in the four measures operations leaders track: safety, quality, delivery and cost. The Six Sigma certification is named with its issuing body, which matters because many organizations offer belts.",
    summaries: [
      { level: "Supervisor", text: "Operations supervisor with 4 years leading warehouse shifts of 30+ associates. I run daily huddles, track KPIs and cut recordable injuries by more than half on my shift." },
      { level: "Manager", text: "Operations manager with 9 years in distribution and light manufacturing. I raised on-time shipments from 89% to 97% and cut operating costs by $1.1M a year." },
      { level: "Director", text: "Director of operations responsible for 4 sites and 600 employees, owning a $60M budget and a network-wide Lean program." },
    ],
    bullets: [
      { skill: "Scope", weak: "Managed a warehouse", strong: "Run a 220,000 sq ft site with 140 employees across 2 shifts and a $14M operating budget" },
      { skill: "Delivery", weak: "Improved shipping", strong: "Raised on-time shipments from 89% to 97% by redesigning pick paths and daily production planning" },
      { skill: "Cost", weak: "Reduced costs", strong: "Cut operating costs by $1.1M a year through overtime controls, a carrier rebid and Lean waste reduction" },
      { skill: "Quality", weak: "Worked on quality issues", strong: "Led a Six Sigma root cause analysis that cut customer damage claims by 42%" },
      { skill: "Safety", weak: "Promoted safety", strong: "Cut OSHA recordable injuries from 7 to 2 a year with job safety analyses and new-hire training" },
      { skill: "Systems", weak: "Helped with a system upgrade", strong: "Tested workflows and trained 60 users during an ERP and warehouse system upgrade" },
    ],
    keywords: [
      "Operations management", "Process improvement", "Lean", "Six Sigma", "KPIs", "Budget management", "Cost reduction",
      "Inventory management", "Production planning", "Vendor management", "Safety compliance", "OSHA", "Root cause analysis",
      "Team leadership", "Power BI", "ERP", "Certified Six Sigma Green Belt",
    ],
    keywordSort: {
      tools: ["Power BI", "ERP"],
      credentials: ["Certified Six Sigma Green Belt"],
      soft: ["Team leadership"],
    },
    tips: [
      { t: "Size your operation first", d: "Square footage, headcount, shifts, sites and budget tell a recruiter the scale you can run before they read anything else." },
      { t: "Report in safety, quality, delivery and cost", d: "These four measures are how most operations teams are judged. Try to show a result in each across your resume." },
      { t: "Name the method and the result", d: "\"Led a Six Sigma project\" is a start; adding what it fixed and by how much makes it worth reading." },
      { t: "Be precise about certifications", d: "Six Sigma belts are offered by many organizations. Name the issuer — for example, ASQ Certified Six Sigma Green Belt (CSSGB) — so the reader knows what you earned." },
      { t: "Show the people side", d: "Team size, supervisors you developed and training programs you built matter as much as process work in an operations role." },
    ],
    faqs: [
      { q: "What should an operations manager resume focus on?", a: "Scope and results. Say what you run — site, team, budget — and then show improvements in safety, quality, delivery and cost with numbers." },
      { q: "Is a Six Sigma certification worth listing?", a: "Yes, if you've earned it and can talk about a project. Name the certifying body; requirements differ a lot between providers. ASQ's Green Belt, for example, requires three years of full-time paid work experience in its body of knowledge." },
      { q: "How do I show P&L or budget responsibility?", a: "State the budget you manage and whether you own it or contribute to it, then give a cost result. Be accurate — \"manage a $14M operating budget\" and \"own a P&L\" mean different things." },
      { q: "How do I move from supervisor to operations manager?", a: "Show results beyond your shift: a process you changed across shifts, a project you led with other departments or a budget you helped manage. Those are the parts of the manager job you've already done." },
      { q: "Should I include industry-specific terms?", a: "Yes, where they're true. Distribution, manufacturing and service operations each have their own vocabulary — pick paths, OEE, throughput — and using it shows you know the work." },
    ],
    related: ["project-manager", "logistics-coordinator", "store-manager", "business-analyst"],
  },
  {
    slug: "recruiter",
    role: "Recruiter",
    group: "People & service",
    photo: { src: "/images/photos/role-recruiter.webp", alt: "Two women talking across a small table by an office window during an interview" },
    level: "Mid-level · 6 years experience",
    intro:
      "A recruiter resume that shows the roles you fill, how fast and how well — with the sourcing, ATS and full-cycle recruiting keywords talent acquisition leaders search for.",
    resume: {
      name: "Monica Alvarez",
      headline: "Corporate Recruiter",
      contact: "Nashville, TN · monica.alvarez@email.com · linkedin.com/in/monicaalvarez",
      summary:
        "Full-cycle recruiter with 6 years in healthcare recruiting and staffing. I partner with hiring managers on what the role really needs, use sourcing and Boolean search to reach people who aren't applying, and keep candidate experience strong from first call to offer.",
      jobs: [
        {
          title: "Corporate Recruiter",
          company: "Cumberland Health Network",
          dates: "Jan 2022 – Present",
          bullets: [
            "Manage 20–25 open requisitions at a time for nursing, IT and corporate roles across 6 hospitals on a 5-person talent acquisition team",
            "Filled 140 roles in 2025 and cut average time to fill from 52 to 38 days",
            "Source passive candidates with LinkedIn Recruiter and Boolean search and run employee referral campaigns; sourced hires rose to 35% of the total",
            "Rebuilt interview scorecards with hiring managers in Greenhouse, our applicant tracking system; offer acceptance rose from 78% to 90%",
          ],
        },
        {
          title: "Staffing Recruiter",
          company: "Music Row Staffing",
          dates: "Jun 2020 – Dec 2021",
          bullets: [
            "Placed 90+ contract and direct-hire candidates in administrative, warehouse and customer service roles",
            "Ran candidate screening calls with 60+ people a week and tracked every step in Bullhorn",
            "Organized on-site hiring events that filled 45 seasonal roles in 3 weeks",
          ],
        },
      ],
      education: "B.A. Psychology, University of Tennessee, Knoxville, 2020",
      skills: ["Full-cycle recruiting", "Sourcing", "Boolean search", "LinkedIn Recruiter", "Greenhouse", "Bullhorn", "Candidate screening", "Interviewing", "Offer negotiation", "Hiring manager partnership"],
    },
    whyItWorks:
      "It reports the metrics talent acquisition teams actually track — requisition load, roles filled, time to fill, sourced hires and offer acceptance — and names the applicant tracking systems and sourcing tools by product. The staffing job shows volume and speed without padding.",
    summaries: [
      { level: "Entry level", text: "Recruiting coordinator with 2 years scheduling 50+ interviews a week in Greenhouse, moving into a recruiter role. I keep candidates informed and hiring managers on schedule." },
      { level: "Mid level", text: "Full-cycle recruiter with 6 years in healthcare and staffing. I filled 140 roles in 2025 and cut average time to fill from 52 to 38 days." },
      { level: "Senior", text: "Senior technical recruiter and team lead who has built recruiting processes for 2 high-growth companies, led a team of 4 and hired 300+ engineers and product staff." },
    ],
    bullets: [
      { skill: "Volume", weak: "Filled many roles", strong: "Filled 140 roles in 2025 across nursing, IT and corporate teams at 6 hospitals" },
      { skill: "Speed", weak: "Hired quickly", strong: "Cut average time to fill from 52 to 38 days while carrying 20–25 open requisitions" },
      { skill: "Sourcing", weak: "Sourced candidates", strong: "Raised sourced hires to 35% of the total with LinkedIn Recruiter, Boolean search and referral campaigns" },
      { skill: "Offers", weak: "Extended offers", strong: "Rebuilt interview scorecards with hiring managers; offer acceptance rose from 78% to 90%" },
      { skill: "Screening", weak: "Phone screened candidates", strong: "Screened 60+ candidates a week and tracked every step in Bullhorn" },
      { skill: "Events", weak: "Ran hiring events", strong: "Organized on-site hiring events that filled 45 seasonal roles in 3 weeks" },
    ],
    keywords: [
      "Full-cycle recruiting", "Talent acquisition", "Sourcing", "Boolean search", "LinkedIn Recruiter", "Applicant tracking system",
      "Greenhouse", "Bullhorn", "Candidate screening", "Interviewing", "Time to fill", "Offer negotiation", "Candidate experience",
      "Hiring manager partnership", "Referral campaigns", "Requisitions", "Healthcare recruiting",
    ],
    keywordSort: {
      tools: ["LinkedIn Recruiter", "Applicant tracking system", "Greenhouse", "Bullhorn"],
      soft: ["Candidate experience", "Hiring manager partnership"],
    },
    tips: [
      { t: "Report recruiting metrics", d: "Roles filled, time to fill, requisition load, offer acceptance and sourced hires are what a talent acquisition leader looks for first." },
      { t: "Say who you hire", d: "Nursing, engineering, hourly or executive roles are different jobs. Name the roles and the volume." },
      { t: "Name the ATS and sourcing tools", d: "Greenhouse, Workday Recruiting, iCIMS, Bullhorn and LinkedIn Recruiter are common search terms. List the ones you've worked in." },
      { t: "Separate agency and in-house work", d: "Staffing and corporate recruiting have different goals. Label each job clearly so the reader knows which you've done." },
      { t: "Show partnership with hiring managers", d: "A result like better offer acceptance from scorecards or intake meetings shows you shape hiring, not just fill pipelines." },
    ],
    faqs: [
      { q: "Do recruiters need an HR certification?", a: "Usually not. Recruiting roles rarely require one. SHRM-CP and PHR are general HR certifications; they can help if you want to move toward HR business partner or generalist work." },
      { q: "What metrics should a recruiter resume include?", a: "Roles filled, time to fill, open requisitions you carry, offer acceptance and source of hire. Use the ones your team tracked and that you can explain." },
      { q: "How do I move from agency to corporate recruiting?", a: "Show placement volume and speed, then highlight anything that looks like in-house work: long-term client relationships, hiring manager intake, and candidate experience." },
      { q: "Should I list the companies I've recruited for at an agency?", a: "Only if you're allowed to. Many agency recruiters describe clients by industry and size instead, such as \"regional logistics clients\"." },
      { q: "Is \"talent acquisition\" the same as recruiting on a resume?", a: "Mostly. Talent acquisition often includes employer branding and workforce planning. Use the terms the post uses, and only claim the parts you've done." },
    ],
    related: ["hr-generalist", "sales-representative", "administrative-assistant"],
  },
  {
    slug: "account-manager",
    role: "Account Manager",
    group: "Business",
    photo: { src: "/images/photos/role-account-manager.webp", alt: "Three colleagues reviewing charts and documents at a meeting table" },
    level: "Mid-level · 6 years experience",
    intro:
      "An account manager resume that shows the book you manage, the revenue you keep and the growth you add — with the retention, upselling and CRM keywords sales leaders search for.",
    resume: {
      name: "Christopher Bell",
      headline: "Account Manager",
      contact: "Kansas City, MO · christopher.bell@email.com · linkedin.com/in/christopherbell",
      summary:
        "Account manager with 6 years in B2B sales of packaging and office supplies. I build client relationships through account planning and quarterly business reviews, protect renewals, and grow accounts by upselling and cross-selling what customers actually need.",
      jobs: [
        {
          title: "Account Manager",
          company: "Heartland Packaging Supply",
          dates: "Mar 2022 – Present",
          bullets: [
            "Manage a book of 60 mid-market manufacturing and food accounts worth $8.5M in annual revenue",
            "Kept gross revenue retention at 96% for 3 straight years through quarterly business reviews (QBRs) and early renewal planning",
            "Grew the book 14% in 2025 by upselling custom packaging and cross-selling inventory programs to 18 existing accounts",
            "Won back 2 lapsed accounts worth $650K a year by working with operations to fix a recurring late-delivery problem",
          ],
        },
        {
          title: "Inside Sales Representative",
          company: "Plaza Office Supply",
          dates: "Jul 2020 – Feb 2022",
          bullets: [
            "Handled 150 small-business accounts by phone and email and reached 112% of my 2021 quota",
            "Logged every call and opportunity in Salesforce CRM, keeping my forecasting within 5% of actual",
            "Resolved billing and delivery issues the same day for most customers, which helped customer retention and kept reorders steady",
          ],
        },
      ],
      education: "B.S. Marketing, Kansas State University, 2020",
      skills: ["Account management", "Account planning", "Quarterly business reviews", "Upselling", "Cross-selling", "Renewals", "Negotiation", "Salesforce", "Forecasting", "Pipeline management"],
    },
    whyItWorks:
      "It sizes the book in accounts and annual revenue, then shows the two things account managers are paid for: keeping revenue (96% retention, a won-back account) and growing it (14% book growth). The CRM and account planning terms match the language of account manager job posts.",
    summaries: [
      { level: "Entry level", text: "Inside sales representative with 2 years managing 150 small-business accounts by phone. I reached 112% of quota and kept my forecast within 5% of actual." },
      { level: "Mid level", text: "B2B account manager with 6 years in distribution sales. I manage a $8.5M book, kept retention at 96% for 3 years and grew the book 14% in 2025." },
      { level: "Senior", text: "Strategic account director managing 12 enterprise accounts worth $25M, leading cross-functional account teams and multi-year contract negotiations." },
    ],
    bullets: [
      { skill: "Book of business", weak: "Managed accounts", strong: "Manage 60 mid-market accounts worth $8.5M in annual revenue" },
      { skill: "Retention", weak: "Kept customers happy", strong: "Kept gross revenue retention at 96% for 3 straight years with QBRs and early renewal planning" },
      { skill: "Growth", weak: "Grew accounts", strong: "Grew the book 14% by upselling and cross-selling to 18 existing accounts" },
      { skill: "Win-back", weak: "Recovered lost customers", strong: "Won back 2 lapsed accounts worth $650K a year by fixing a recurring late-delivery problem" },
      { skill: "Quota", weak: "Met sales targets", strong: "Reached 112% of quota on a book of 150 small-business accounts" },
      { skill: "Forecasting", weak: "Used Salesforce", strong: "Logged every opportunity in Salesforce and kept my forecast within 5% of actual" },
    ],
    keywords: [
      "Account management", "Client relationships", "Revenue retention", "Renewals", "Upselling", "Cross-selling",
      "Quarterly business reviews", "Account planning", "Salesforce", "CRM", "Forecasting", "Negotiation", "Pipeline management",
      "B2B sales", "Customer retention",
    ],
    keywordSort: {
      tools: ["Salesforce", "CRM"],
      soft: ["Client relationships", "Negotiation"],
    },
    tips: [
      { t: "Size your book", d: "Number of accounts, their size and the total revenue you manage tell a sales leader what you can take on." },
      { t: "Show retention and growth separately", d: "Account managers are judged on keeping revenue and growing it. Give a number for each." },
      { t: "Explain one save", d: "A bullet about an account you kept or won back — and what you fixed — shows how you handle problems." },
      { t: "Name the CRM", d: "Salesforce, HubSpot and Microsoft Dynamics 365 are searched by name. Mention forecasting accuracy if it was good." },
      { t: "Match the role type", d: "Account management ranges from farming existing accounts to quota-carrying expansion sales. Mirror how the post describes it, where that's true for you." },
    ],
    faqs: [
      { q: "What's the difference between an account manager and a sales representative resume?", a: "A sales rep resume leads with new business and quota; an account manager resume leads with the book you manage, retention and growth from existing customers. Many roles mix both, so show the split." },
      { q: "What if my company doesn't track retention?", a: "Use what you can show: renewal rate, accounts kept year over year, revenue growth in your book or reorder frequency. Don't estimate a metric you never measured." },
      { q: "Should I list my clients' names?", a: "Usually not. Describe them by industry and size — \"mid-market manufacturing accounts\" — unless the relationship is public and your employer is fine with it." },
      { q: "How do I move from inside sales to account management?", a: "Highlight repeat customers you managed, problems you resolved and any upsells. Those are account management skills you already use." },
      { q: "Do account managers need certifications?", a: "Rarely. Product or industry training can help in technical sales, but results with real accounts matter much more." },
    ],
    related: ["sales-representative", "customer-success-manager", "marketing-manager"],
  },
  {
    slug: "customer-success-manager",
    role: "Customer Success Manager",
    group: "Business",
    photo: { src: "/images/photos/role-customer-success-manager.webp", alt: "Two women talking with notebooks open at a table in a bright office" },
    level: "Mid-level · 5 years experience",
    intro:
      "A customer success manager resume that shows the ARR you protect and grow, how quickly customers see value and how you spot churn early — with the SaaS and Gainsight keywords CS leaders search for.",
    resume: {
      name: "Aaliyah Grant",
      headline: "Customer Success Manager",
      contact: "Boston, MA · aaliyah.grant@email.com · linkedin.com/in/aaliyahgrant",
      summary:
        "Customer success manager with 5 years in B2B SaaS. I run customer onboarding and adoption plans, use health scores to catch churn risk early, and work with sales on renewals and expansion revenue. Stakeholder management with both end users and executives is where I do my best work.",
      jobs: [
        {
          title: "Customer Success Manager",
          company: "Harborview Analytics",
          dates: "Apr 2023 – Present",
          bullets: [
            "Own a portfolio of 45 mid-market SaaS accounts worth $3.2M in annual recurring revenue (ARR)",
            "Raised net revenue retention for my book from 98% to 112% through product adoption plans and expansion handoffs to sales",
            "Built health scores in Gainsight from usage and support data, flagging at-risk accounts 60 days before renewal",
            "Cut time to value for new customers from 45 to 21 days with a standard onboarding plan and QBRs that review agreed goals",
          ],
        },
        {
          title: "Onboarding Specialist",
          company: "Back Bay Software",
          dates: "Jun 2021 – Mar 2023",
          bullets: [
            "Onboarded 70+ new customers with kickoff calls, data imports and admin training",
            "Wrote 30 help center articles in Zendesk that cut onboarding tickets by 20%",
            "Kept a 95% CSAT score across 1,500+ support tickets before moving to onboarding",
          ],
        },
      ],
      education: "B.A. Communication Studies, Northeastern University, 2021",
      skills: ["Customer onboarding", "Health scores", "Renewals", "Expansion revenue", "Churn reduction", "QBRs", "Gainsight", "Salesforce", "Zendesk", "Stakeholder management"],
    },
    whyItWorks:
      "It sizes the portfolio in accounts and ARR, then reports the outcomes CS teams are measured on — net revenue retention, time to value and early churn warning — and names Gainsight, Salesforce and Zendesk the way job posts do.",
    summaries: [
      { level: "Entry level", text: "Customer support specialist with 2 years in SaaS moving into customer success. I kept a 95% CSAT across 1,500+ tickets and wrote help articles that cut repeat questions." },
      { level: "Mid level", text: "Customer success manager with 5 years in B2B SaaS. I manage $3.2M in ARR and raised net revenue retention for my book from 98% to 112%." },
      { level: "Senior", text: "Customer success leader who has built a team of 8 CSMs, designed the company's health score and renewal playbooks, and owns $20M in ARR." },
    ],
    bullets: [
      { skill: "Retention", weak: "Kept customers from churning", strong: "Raised net revenue retention for a $3.2M book from 98% to 112%" },
      { skill: "Risk", weak: "Monitored account health", strong: "Built Gainsight health scores that flag at-risk accounts 60 days before renewal" },
      { skill: "Onboarding", weak: "Onboarded customers", strong: "Cut time to value from 45 to 21 days with a standard onboarding plan" },
      { skill: "Expansion", weak: "Helped sales with upsells", strong: "Turned adoption plans into expansion handoffs to sales across 45 accounts" },
      { skill: "Self-service", weak: "Wrote help docs", strong: "Wrote 30 Zendesk help center articles that cut onboarding tickets by 20%" },
      { skill: "Satisfaction", weak: "Good customer feedback", strong: "Kept a 95% CSAT score across 1,500+ support tickets" },
    ],
    keywords: [
      "Customer success", "Customer onboarding", "Net revenue retention", "Churn reduction", "Renewals", "Expansion revenue",
      "Health scores", "Product adoption", "Time to value", "QBRs", "Gainsight", "Salesforce", "Zendesk", "SaaS", "ARR", "CSAT",
      "Stakeholder management",
    ],
    keywordSort: {
      tools: ["Gainsight", "Salesforce", "Zendesk"],
      soft: ["Stakeholder management"],
    },
    tips: [
      { t: "Lead with the portfolio", d: "Number of accounts, their segment and the ARR you manage set your level before anything else." },
      { t: "Use retention metrics correctly", d: "Gross revenue retention, net revenue retention and logo churn mean different things. Use the one your team tracked and label it." },
      { t: "Show how you spot risk", d: "Health scores, usage alerts or a renewal playbook show you work ahead of problems, not just respond to them." },
      { t: "Name the CS platform", d: "Gainsight, Totango, ChurnZero and Vitally are searched by name, along with the CRM and support tool you use." },
      { t: "Be clear about commercial ownership", d: "Some CSMs own renewals and upsells; others hand them to sales. Say which you do so the reader isn't guessing." },
    ],
    faqs: [
      { q: "What metrics should a customer success manager include?", a: "ARR or book size, gross or net revenue retention, renewal rate, time to value and adoption. Use the ones your team measured and that you can explain." },
      { q: "How do I move from support into customer success?", a: "Show account-level work: customers you onboarded, problems you solved before they became tickets, and any renewals or upsells you helped with." },
      { q: "Is customer success a sales role?", a: "It depends on the company. Some CSMs carry renewal or expansion targets; others focus on adoption and hand commercial work to account managers. Describe your role accurately and match the post." },
      { q: "Should I list Gainsight if I only used it lightly?", a: "List tools you could use on day one. If you only viewed dashboards someone else built, say \"Gainsight (user)\" in an interview rather than claiming admin experience." },
      { q: "Do customer success certifications help?", a: "Some training programs exist, but hiring managers usually look for retention and adoption results first. Real outcomes with accounts carry more weight." },
    ],
    related: ["account-manager", "customer-service-representative", "product-manager"],
  },
  {
    slug: "real-estate-agent",
    role: "Real Estate Agent",
    group: "Business",
    photo: { src: "/images/photos/role-real-estate-agent.webp", alt: "House keys on a ring next to a small model house on a wooden table" },
    level: "Mid-level · 5 years experience",
    intro:
      "A real estate agent resume that leads with your state license and shows closed transactions, sales volume and where your business comes from — with the MLS, CMA and negotiation keywords brokers look for.",
    resume: {
      name: "Vanessa Torres",
      headline: "Real Estate Sales Associate, REALTOR®",
      contact: "Tampa, FL · vanessa.torres@email.com · (813) 555-0146",
      summary:
        "Florida-licensed real estate sales associate with 5 years in residential real estate, working both buyer representation and listings. Most of my business comes from referrals, and I win them with local market knowledge, clear pricing strategy and steady communication through closing.",
      jobs: [
        {
          title: "Real Estate Sales Associate",
          company: "Bayshore Realty Group",
          dates: "Mar 2021 – Present",
          bullets: [
            "Closed 28 transactions in 2025 totaling $11.2M in sales volume, 60% on the buyer side",
            "Built 70% of my business from referrals and past clients through referral marketing, a monthly email newsletter and client events",
            "Price listings with a comparative market analysis (CMA) and present them in listing presentations; my 2025 listings sold at an average of 98% of list price in 21 days on market",
            "Handle contract management from offer through closing, coordinating inspections, appraisals, lenders and title companies",
          ],
        },
        {
          title: "Leasing Consultant",
          company: "Palmetto Grove Apartments",
          dates: "Jun 2019 – Feb 2021",
          bullets: [
            "Leased apartments in a 320-unit community and helped keep occupancy at 95% or higher",
            "Gave 40+ tours a month and turned about 1 in 3 into signed leases",
            "Managed renewals and resident requests in Yardi",
          ],
        },
      ],
      education:
        "B.A. Communication, University of South Florida, 2019 · Real estate license: Florida Sales Associate · Member, National Association of REALTORS®",
      skills: ["Buyer representation", "Listing presentations", "Comparative market analysis (CMA)", "Pricing strategy", "Negotiation", "MLS", "Open houses", "CRM", "DocuSign", "Lead generation"],
    },
    whyItWorks:
      "The license type and state are on the page in plain words, and the REALTOR® mark is written the way NAR asks. Results are what a broker checks — transactions, volume, list-to-sale ratio, days on market and how much business comes from referrals — and the leasing job shows sales skills built before the license.",
    summaries: [
      { level: "New agent", text: "Newly licensed real estate sales associate with 2 years as a leasing consultant in a 320-unit community. I turned about 1 in 3 tours into signed leases and know the local rental market." },
      { level: "Experienced", text: "Florida-licensed sales associate and REALTOR® with 5 years in residential sales. I closed 28 transactions and $11.2M in volume in 2025, 70% of it from referrals." },
      { level: "Team lead", text: "Licensed broker and team lead who runs a 6-agent team, handles listing strategy and coaches new agents through their first transactions." },
    ],
    bullets: [
      { skill: "Production", weak: "Sold houses", strong: "Closed 28 transactions in 2025 totaling $11.2M in sales volume" },
      { skill: "Referrals", weak: "Got referrals", strong: "Built 70% of my business from referrals and past clients through a monthly newsletter and client events" },
      { skill: "Pricing", weak: "Priced listings", strong: "Priced listings with a CMA; 2025 listings sold at an average of 98% of list price in 21 days" },
      { skill: "Closing", weak: "Handled paperwork", strong: "Coordinated inspections, appraisals, lenders and title companies from offer through closing" },
      { skill: "Conversion", weak: "Showed apartments", strong: "Gave 40+ tours a month and turned about 1 in 3 into signed leases" },
      { skill: "Occupancy", weak: "Worked in leasing", strong: "Helped keep a 320-unit community at 95% occupancy or higher" },
    ],
    keywords: [
      "Real estate license", "REALTOR®", "Residential real estate", "Buyer representation", "Listing presentations",
      "Comparative market analysis (CMA)", "Pricing strategy", "Negotiation", "MLS", "Contract management", "Lead generation",
      "Referral marketing", "Open houses", "Local market knowledge", "CRM", "DocuSign",
    ],
    keywordSort: {
      tools: ["MLS", "CRM", "DocuSign"],
      credentials: ["Real estate license", "REALTOR®"],
      soft: ["Negotiation"],
    },
    tips: [
      { t: "Put your license near the top", d: "Real estate licenses are issued by each state, and titles differ — sales associate, salesperson or broker. Write the license type and state the way your state does." },
      { t: "Use REALTOR® only if you're a member", d: "REALTOR® is a membership mark of the National Association of REALTORS®, not a license. NAR asks members to write it in capitals with the ® symbol." },
      { t: "Report production clearly", d: "Transactions closed, sales volume, buyer and listing split, list-to-sale ratio and days on market are what brokers compare." },
      { t: "Show where business comes from", d: "Referrals, past clients, open houses or online leads — the split tells a broker how you'll build a pipeline with them." },
      { t: "Keep results accurate and recent", d: "Use a specific year for each number, and only claim transactions where you represented a party." },
    ],
    faqs: [
      { q: "Do real estate agents need a resume?", a: "Often, yes — for joining a brokerage or team, moving into a new market or applying for salaried roles like transaction coordinator or leasing manager." },
      { q: "Is \"REALTOR®\" the same as a real estate license?", a: "No. A license is issued by your state; REALTOR® means you're a member of the National Association of REALTORS®. List them separately and only use the mark if you're a member." },
      { q: "Should I include my license number?", a: "It's optional on a resume. Brokers will ask for it to verify your license with the state, and some agents add it next to the license line to save that step." },
      { q: "What if I'm newly licensed with no closings?", a: "Lead with the license and any sales, leasing, customer service or local experience. Show the skills a broker wants — prospecting, follow-up and knowledge of the area." },
      { q: "Should I list sales volume or number of transactions?", a: "Both if you can. Volume shows price range; transactions show how many clients you've guided through a closing." },
    ],
    related: ["sales-representative", "loan-officer", "marketing-coordinator"],
  },
  {
    slug: "marketing-coordinator",
    role: "Marketing Coordinator",
    group: "Business",
    photo: { src: "/images/photos/role-marketing-coordinator.webp", alt: "Marketing team planning with sticky notes on a wall and laptops on a table" },
    level: "Early career · 3 years experience",
    intro:
      "A marketing coordinator resume that shows the campaigns you run day to day and how they perform — with the social, email, content and analytics keywords marketing managers look for.",
    resume: {
      name: "Kayla Robinson",
      headline: "Marketing Coordinator",
      contact: "Portland, OR · kayla.robinson@email.com · linkedin.com/in/kaylarobinson",
      summary:
        "Marketing coordinator with 3 years in consumer brands. I keep marketing campaigns on schedule across social media marketing, email marketing and events, handle content creation and copywriting, and report what's working in Google Analytics 4.",
      jobs: [
        {
          title: "Marketing Coordinator",
          company: "Willamette Outdoor Co.",
          dates: "Jan 2024 – Present",
          bullets: [
            "Schedule and publish 20+ posts a week across Instagram, LinkedIn and Facebook in Hootsuite; engagement rate rose from 2.4% to 4.1%",
            "Build and send 8 email campaigns a month in Mailchimp, lifting click-through rate from 1.9% to 3.2% with segmented lists and A/B testing on subject lines",
            "Handle event coordination for 6 trade shows and in-store events a year, including booth materials, vendors and budget tracking on a $40K event budget",
            "Update product pages and blog posts in WordPress with basic SEO; organic sessions grew 35% year over year",
          ],
        },
        {
          title: "Marketing Assistant (part-time)",
          company: "Hawthorne Coffee Roasters",
          dates: "Sep 2022 – Dec 2023",
          bullets: [
            "Designed social posts and in-store signage in Canva for 4 locations, following the brand guidelines",
            "Grew the Instagram account from 3,200 to 9,800 followers in 14 months",
            "Pulled monthly marketing analytics on email and social results for the owner",
          ],
        },
      ],
      education: "B.S. Business Administration (Marketing), Portland State University, 2023",
      skills: ["Social media marketing", "Email marketing", "Content creation", "Copywriting", "Event coordination", "Hootsuite", "Mailchimp", "Canva", "WordPress", "Google Analytics 4", "SEO"],
    },
    whyItWorks:
      "Each bullet names the channel, the tool and how it performed — engagement, click-through, traffic or followers — so the reader sees results, not just tasks. The part-time job counts because it shows real growth on a real account.",
    summaries: [
      { level: "Entry level", text: "Marketing graduate with a part-time role running social media for a 4-location coffee company. Grew Instagram from 3,200 to 9,800 followers in 14 months using Canva and Hootsuite." },
      { level: "Coordinator", text: "Marketing coordinator with 3 years in consumer brands. I run social, email and events day to day — engagement rose from 2.4% to 4.1% and email click-through from 1.9% to 3.2%." },
      { level: "Specialist", text: "Marketing specialist who owns the email and lifecycle program for a DTC brand, manages a freelance designer and reports channel results to the marketing director each month." },
    ],
    bullets: [
      { skill: "Social media", weak: "Posted on social media", strong: "Publish 20+ posts a week in Hootsuite; engagement rate rose from 2.4% to 4.1%" },
      { skill: "Email", weak: "Sent newsletters", strong: "Send 8 Mailchimp campaigns a month and lifted click-through rate from 1.9% to 3.2% with segmentation" },
      { skill: "Events", weak: "Helped with events", strong: "Coordinated 6 trade shows and in-store events a year on a $40K budget" },
      { skill: "Web", weak: "Updated the website", strong: "Updated WordPress product pages and blog posts with basic SEO; organic sessions grew 35% year over year" },
      { skill: "Growth", weak: "Grew followers", strong: "Grew an Instagram account from 3,200 to 9,800 followers in 14 months" },
      { skill: "Reporting", weak: "Made reports", strong: "Pulled monthly email and social results so the owner could see which posts drove sales" },
    ],
    keywords: [
      "Marketing campaigns", "Social media marketing", "Email marketing", "Content creation", "Copywriting", "Event coordination",
      "Hootsuite", "Mailchimp", "Canva", "WordPress", "Google Analytics 4", "SEO", "Marketing analytics", "A/B testing",
      "Brand guidelines", "Budget tracking",
    ],
    keywordSort: {
      tools: ["Hootsuite", "Mailchimp", "Canva", "WordPress", "Google Analytics 4"],
    },
    tips: [
      { t: "Give each channel a number", d: "Engagement rate, click-through, traffic and follower growth turn \"managed social media\" into a result a manager can compare." },
      { t: "Name the tools", d: "Hootsuite, Mailchimp, HubSpot, Canva, WordPress and Google Analytics 4 are searched by name. List the ones you use every week." },
      { t: "Show you keep things on schedule", d: "Coordinators are hired to make campaigns happen. Volume — posts a week, campaigns a month, events a year — shows you can carry the load." },
      { t: "Link a few work samples", d: "A short portfolio link with posts, emails or event materials helps, written out as plain text so it survives parsing." },
      { t: "Use part-time and student work", d: "Early in your career, a part-time or internship role with clear results is worth a full entry." },
    ],
    faqs: [
      { q: "What's the difference between a marketing coordinator and a marketing manager resume?", a: "A coordinator resume shows execution — campaigns run, content published, events delivered and their results. A manager resume adds strategy, budget ownership and team leadership." },
      { q: "Should I include a portfolio link?", a: "Yes, if you have work you can share. Pick 5–8 strong pieces and make sure you have permission to show anything made for an employer." },
      { q: "Which metrics matter on a marketing coordinator resume?", a: "Engagement rate, click-through rate, traffic, followers and event results. Use the measures your team tracked, and include the before-and-after when you have it." },
      { q: "Do marketing certifications help?", a: "Free tool certifications from platforms like HubSpot or Google can help at entry level if the post names those tools. Results from real campaigns matter more." },
      { q: "How long should my resume be?", a: "One page. With 3 years of experience, two jobs with 3–4 bullets each and a focused skills section is enough." },
    ],
    related: ["marketing-manager", "sales-representative", "real-estate-agent"],
  },
];
