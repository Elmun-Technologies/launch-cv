import type { CoverLetterExample } from "@/lib/cover-letter-examples";

/** Cover letters for the roles in lib/resume-examples-more-d.ts (same fictional person). */
export const MORE_COVER_LETTERS_D: CoverLetterExample[] = [
  // ---------------------------------------------------------- Tech & product
  {
    slug: "it-support-specialist",
    target: { title: "IT Support Specialist", company: "Humongous Insurance", hiringManager: "Paula Brennan" },
    paragraphs: [
      "I'm applying for the IT Support Specialist position at Humongous Insurance. At Scioto Ridge Insurance Group I support 450 employees across 3 offices on Windows 11, macOS and Microsoft 365, and I resolve 92% of Tier 2 tickets without escalating them — the kind of in-house support your posting describes for your regional offices.",
      "A lot of my time goes into making routine work go away. New-hire account setup in Active Directory and Microsoft Entra ID used to take about 2 hours; I wrote a PowerShell script that brings it down to 20 minutes. I also enrolled 500+ laptops and phones in Microsoft Intune and raised patch compliance from 78% to 97%, which matters in a business that holds customers' policy data.",
      "I like the hands-on side too. I replaced switches and Wi-Fi access points in 2 branch offices over weekends so nobody lost a workday. Before Scioto Ridge, as a desktop support technician at Granville Manufacturing Co., I closed 40–50 ServiceNow tickets a week with a 4.8/5 satisfaction score and wrote 35 knowledge base articles that cut repeat password and VPN tickets by 25%. I hold CompTIA A+, CompTIA Network+ and ITIL 4 Foundation.",
      "I'd welcome the chance to talk about how your IT team supports its offices and where I could help. Thank you for your time.",
    ],
    annotations: [
      "Gives the scale of his current job and his escalation rate in the first two sentences, in the same industry as the employer.",
      "Shows he fixes causes, not just tickets: one automation and one security result, each with a before-and-after.",
      "Adds hands-on network work, a second job with service numbers, and the certifications IT managers screen for.",
      "A short close that keeps the focus on the employer's team.",
    ],
    tips: [
      { t: "Lead with your support load", d: "Users, offices and the share of tickets you close yourself tell an IT manager your level faster than years of experience." },
      { t: "Pick one thing you automated", d: "A script, an onboarding checklist or a knowledge base article that cut tickets shows you think beyond the queue." },
      { t: "Name certifications once", d: "Mention CompTIA or ITIL certifications in a single sentence. The resume carries the details." },
    ],
    faqs: [
      { q: "Do IT support specialists need a cover letter?", a: "Often it's optional. A short letter helps when you're moving from help desk to a Tier 2 role, changing industries, or applying to a company that asks for one." },
      { q: "How technical should an IT support cover letter be?", a: "Name the main platforms you manage and one or two results. Hiring managers want to see you can explain technical work clearly, which is part of the job." },
    ],
  },
  {
    slug: "help-desk-technician",
    target: { title: "Help Desk Technician (Tier 1)", company: "Wide World Importers", hiringManager: "Marcus Webb" },
    paragraphs: [
      "I'm applying for the Tier 1 Help Desk Technician role at Wide World Importers. I'm CompTIA A+ certified, and at Sunline Medical Billing Services I answer 30–40 calls, chats and emails a day for 600 users, logging every contact in Jira Service Management.",
      "I keep a 75% first-contact resolution rate on the requests that fill most help desk queues: password resets, Outlook, Microsoft 365 and printers. I unlock accounts in Active Directory, set up multi-factor authentication for new hires, and fix many Windows issues over remote desktop without a site visit. When something does need Tier 2, I send it with notes they can act on — fewer than 5% of my tickets are reopened.",
      "Before moving into IT, I spent more than 2 years at Westshore Electronics repairing 15+ laptops, phones and tablets a week and setting up devices for customers. That job taught me to explain fixes in plain language to people who are frustrated or in a hurry, and I earned a 4.9/5 average rating across 200+ reviews.",
      "I'd be glad to talk about your service desk and how I could help your users. Thank you for considering my application.",
    ],
    annotations: [
      "Leads with the certification and daily volume, the two things a service desk manager checks first.",
      "Shows the core Tier 1 work, first-contact resolution and how she escalates — in numbers.",
      "Uses an earlier non-IT job to prove troubleshooting and customer service, with a rating to back it up.",
      "A brief, friendly close.",
    ],
    tips: [
      { t: "Show your daily volume", d: "Contacts per day and users supported tell a hiring manager you can handle a busy queue." },
      { t: "Mention how you escalate", d: "A low reopen rate or clear escalation notes shows Tier 2 teams you'll make their work easier." },
      { t: "Use earlier jobs well", d: "Repair counters, retail tech support and call centers all build help desk skills. Give one result from them." },
    ],
    faqs: [
      { q: "Should I write a cover letter for a help desk job?", a: "If the application allows one, a short letter can help, especially for your first IT role. It's your chance to connect customer service experience to technical support." },
      { q: "What if I don't have IT job experience yet?", a: "Lead with your certification, any home lab or volunteer IT work, and a past job where you solved problems for customers. Keep it to three short paragraphs." },
    ],
  },
  {
    slug: "cybersecurity-analyst",
    target: { title: "Cybersecurity Analyst, Security Operations", company: "Woodgrove Bank", hiringManager: "Elaine Choi" },
    paragraphs: [
      "I'm applying for the Cybersecurity Analyst role on Woodgrove Bank's security operations team. At Riverwalk Financial Group I triage 150+ Splunk alerts a day in a 24/7 SOC and escalate confirmed incidents under our incident response plan, so I know the pace and the expectations of security work in financial services.",
      "One incident shows how I work. When a phishing campaign reached 120 inboxes, I led the response: I blocked the sender, purged the messages and reset the 6 exposed accounts, all within 2 hours.",
      "I also spend time on the quieter work that makes a SOC better. I tuned 40 noisy correlation searches, cutting false positives by 35% and freeing about 10 analyst hours a week, and I run the monthly Tenable scans that brought critical findings open past 30 days down from 48 to 9. Before Riverwalk, I investigated CrowdStrike Falcon alerts for 25 client environments at Lonestar Managed Security and wrote 20 runbooks that cut average triage time from 25 to 15 minutes. I hold CompTIA Security+ and CompTIA CySA+.",
      "I'd welcome the chance to talk about your SOC and where I could contribute. Thank you for your time.",
    ],
    annotations: [
      "Names the team and matches his current environment — alert volume, 24/7 SOC, financial services — to theirs.",
      "One incident told briefly: what happened, what he did and how fast. No sensitive detail.",
      "Shows detection tuning, vulnerability management and earlier SOC work, each with a measurable result.",
      "A short, direct close.",
    ],
    tips: [
      { t: "Tell one incident carefully", d: "Describe your actions and the result, and leave out anything confidential — names, systems or details an attacker could use." },
      { t: "Show you improve the SOC", d: "Fewer false positives, faster triage or better runbooks show you make the team stronger, not just busier." },
      { t: "Be exact about certifications", d: "Name only certifications you hold, by their official names." },
    ],
    faqs: [
      { q: "Do cybersecurity analysts need a cover letter?", a: "Not always, but a focused letter helps when moving from IT into security, from an MSSP to an in-house team, or into a regulated industry." },
      { q: "How much technical detail should a security cover letter include?", a: "Enough to show your tools and judgment: the SIEM, the type of incident and the result. Keep anything specific to your employer's systems out of it." },
    ],
  },
  {
    slug: "devops-engineer",
    target: { title: "Senior DevOps Engineer, Platform", company: "Litware", hiringManager: "Jonah Feld" },
    paragraphs: [
      "I'm applying for the Senior DevOps Engineer role on Litware's platform team. At Pinecrest Software I manage AWS infrastructure for 40 services entirely in Terraform, with every change reviewed through a pull request, and your posting's focus on moving workloads to Kubernetes matches the work I've been doing there.",
      "I moved 25 services from EC2 to Amazon EKS, using Helm charts and blue-green deploys so customers never saw downtime. Alongside that, I rebuilt our CI/CD pipelines in GitHub Actions and cut average build-and-deploy time from 28 to 9 minutes, which changed how often developers were willing to ship.",
      "I care just as much about what happens after a deploy. I set up Prometheus and Grafana alerting with on-call runbooks, and our mean time to recovery fell from 70 to 25 minutes. Before Pinecrest, as a systems engineer at Crabtree Data Services, I automated configuration for 120 Linux servers with Ansible and containerized our first 8 legacy applications. I hold the AWS Certified DevOps Engineer - Professional and Certified Kubernetes Administrator (CKA) certifications.",
      "I'd enjoy talking about Litware's platform roadmap and how I could help. I'm available for a call most days next week.",
    ],
    annotations: [
      "Opens with the size of the estate he runs and ties it to the employer's stated project.",
      "One migration told with its safety measure and outcome, plus a deploy-speed result developers feel.",
      "Covers reliability, earlier automation work and certifications by their official names.",
      "A specific close with availability.",
    ],
    tips: [
      { t: "Lead with scale", d: "Services, servers or clusters you run tell a platform lead your level quickly." },
      { t: "Show developer impact", d: "Faster deploys or fewer failed changes show your work makes other engineers more productive." },
      { t: "Cover reliability", d: "Monitoring, on-call and recovery time results show you own systems after they ship." },
    ],
    faqs: [
      { q: "Should a DevOps cover letter list my whole tool stack?", a: "No. Name the few tools the posting cares about in context. Your resume holds the full list." },
      { q: "How do I address a stack I haven't used?", a: "Name the closest tool you have used and how you learned it. For example, moving from Jenkins to GitHub Actions shows you can pick up a new CI system." },
    ],
  },
  {
    slug: "qa-engineer",
    target: { title: "QA Engineer, Test Automation", company: "Trey Research", hiringManager: "Priya Raman" },
    paragraphs: [
      "I'm applying for the QA Engineer role on Trey Research's test automation team. At Bonneville Software I built a Playwright and TypeScript suite of 600 end-to-end tests that runs on every pull request in GitHub Actions, and your posting's goal of releasing more often is exactly what that suite made possible for us.",
      "Before the suite, regression testing took 3 days of manual work, so we released monthly. It now runs in 40 minutes and the team releases weekly. I also wrote 250 API tests in Postman that run in the pipeline and catch contract breaks before front-end work starts.",
      "Automation is only part of QA, though. I introduced risk-based test planning for each sprint, and customer-reported defects fell from 18 to 5 a quarter. Earlier, as a test analyst at Granite Peak Insurance, I wrote and ran 400+ manual test cases in TestRail and automated 120 smoke tests with Selenium and Java. I hold the ISTQB Certified Tester Foundation Level (CTFL).",
      "I'd welcome the chance to talk about your testing approach and where I could help. Thank you for considering my application.",
    ],
    annotations: [
      "Leads with the automation she built, how it runs and how it connects to the employer's goal.",
      "A before-and-after on regression time and release frequency, plus API testing.",
      "Shows test judgment as well as automation, earlier manual testing and her certification.",
      "A short close inviting a conversation.",
    ],
    tips: [
      { t: "Show automation and judgment", d: "One result from automation and one from test planning shows you're more than a script writer." },
      { t: "Connect testing to releases", d: "Faster regression and more frequent releases are results engineering managers care about." },
      { t: "Name framework and language", d: "\"Playwright with TypeScript\" is clearer than \"modern automation tools\"." },
    ],
    faqs: [
      { q: "Do QA engineers need a cover letter?", a: "It's often optional. A letter helps when moving from manual to automation roles or into a new domain, like health or finance." },
      { q: "Should I mention bug counts?", a: "Customer-reported defects going down is a better measure than total bugs found. Use it if you have it." },
    ],
  },
  {
    slug: "data-engineer",
    target: { title: "Data Engineer, Analytics Platform", company: "Northwind Traders", hiringManager: "Grace Liu" },
    paragraphs: [
      "I'm applying for the Data Engineer role on Northwind Traders' analytics platform team. At Three Rivers Grocery Co. I build and maintain 60 Airflow DAGs that load sales, inventory and loyalty data into Snowflake every night, and the retail data your posting describes is the work I know best.",
      "The project I'm proudest of was our nightly batch. It took 6 hours to run. I rebuilt it as incremental dbt models, and it now runs in 90 minutes and uses 30% fewer Snowflake credits.",
      "I treat data quality as part of the pipeline. I added dbt tests and freshness checks to 200 models, and data incidents reported by analysts fell from 12 to 3 a month. I also stream point-of-sale events from 85 stores through Kafka so inventory dashboards update within 5 minutes. Before that, at Ohio Valley Logistics, I wrote Python and SQL ETL jobs on AWS and moved 40 cron-scheduled scripts to Airflow. I hold the AWS Certified Data Engineer - Associate certification.",
      "I'd be glad to talk about your data platform and where I could help. Thank you for your time.",
    ],
    annotations: [
      "Gives the size of his pipeline work and connects it to the employer's industry.",
      "One project with the problem, the fix and two measurable results.",
      "Shows reliability, streaming and earlier AWS work, plus his certification.",
      "A short, polite close.",
    ],
    tips: [
      { t: "Pick one pipeline story", d: "A single before-and-after on run time, cost or freshness is more convincing than a list of tools." },
      { t: "Show who used the data", d: "Analysts, finance or store managers relying on your work shows impact beyond the data team." },
      { t: "Mention data quality", d: "Tests, checks and fewer incidents show you build pipelines people can trust." },
    ],
    faqs: [
      { q: "Do data engineers need a cover letter?", a: "Many applications make it optional. It helps when you're moving from analytics into engineering or between industries." },
      { q: "Should I include code or GitHub links?", a: "Link a specific repository if it's relevant to the role. A clean, documented pipeline project is better than a list of every repo." },
    ],
  },

  // ---------------------------------------------------------------- Business
  {
    slug: "operations-manager",
    target: { title: "Operations Manager, Distribution Center", company: "Adventure Works", hiringManager: "Thomas Reyes" },
    paragraphs: [
      "I'm applying for the Operations Manager position at Adventure Works' distribution center. At Circle City Home Products I run a 220,000 sq ft distribution and light assembly site with 140 employees across 2 shifts and a $14M operating budget.",
      "When I started, on-time shipments were at 89%. We redesigned pick paths, tightened inventory management and changed how we plan production each day, and on-time shipments are now at 97%. Over the same period we cut operating costs by $1.1M a year through overtime controls, a carrier rebid and Lean waste reduction — without cutting corners on safety.",
      "I lead improvement work myself. I ran a Six Sigma root cause analysis on packaging damage that reduced customer damage claims by 42%. As an operations supervisor at Hoosier Parts Distribution, I cut OSHA recordable injuries from 7 to 2 a year with job safety analyses and a new-hire training program. I hold the ASQ Certified Six Sigma Green Belt.",
      "I'd welcome the chance to visit your site and talk about what you'd want from this role in the first year. Thank you for your consideration.",
    ],
    annotations: [
      "Sizes the job she runs today in space, people, shifts and budget.",
      "Delivery and cost results told as one story, with a note that safety wasn't traded away.",
      "Adds quality and safety results — covering all four operations measures — plus her certification.",
      "Offers a site visit and asks about the employer's goals.",
    ],
    tips: [
      { t: "Size your operation", d: "Square footage, headcount and budget let the reader picture the job you do now." },
      { t: "Cover safety, quality, delivery and cost", d: "A result in each, across the letter, shows you manage the whole operation." },
      { t: "Name the certifying body", d: "Six Sigma belts vary by provider. Naming ASQ or your provider makes the credential clear." },
    ],
    faqs: [
      { q: "Is a cover letter useful for operations manager roles?", a: "Yes, especially for site leadership roles, where hiring managers want to see how you think about people, safety and cost together." },
      { q: "How do I show leadership in an operations cover letter?", a: "Use results your team achieved under you and say what you changed — the huddle, the training, the planning process — to get there." },
    ],
  },
  {
    slug: "recruiter",
    target: { title: "Senior Recruiter, Clinical Hiring", company: "Lamna Healthcare", hiringManager: "Robert Haines" },
    paragraphs: [
      "I'm applying for the Senior Recruiter role on Lamna Healthcare's clinical hiring team. At Cumberland Health Network I manage 20–25 open requisitions at a time for nursing, IT and corporate roles across 6 hospitals, so I know how hard and how important clinical hiring is.",
      "In 2025 I filled 140 roles and cut our average time to fill from 52 to 38 days. Much of that came from reaching people who weren't applying: I source passive candidates with LinkedIn Recruiter and Boolean search and run employee referral campaigns, and sourced hires rose to 35% of the total.",
      "I also work closely with hiring managers. We rebuilt our interview scorecards in Greenhouse so every interviewer was assessing the same things, and offer acceptance rose from 78% to 90%. Before that, at Music Row Staffing, I placed 90+ candidates, screened 60+ people a week and ran hiring events that filled 45 seasonal roles in 3 weeks.",
      "I'd enjoy talking about your clinical hiring goals for the coming year. Thank you for considering my application.",
    ],
    annotations: [
      "Names the team, her requisition load and her healthcare experience in the first paragraph.",
      "Gives volume and speed, then explains how she achieved them through sourcing.",
      "Shows partnership with hiring managers and earlier high-volume agency work.",
      "A short close focused on the employer's goals.",
    ],
    tips: [
      { t: "Use recruiting metrics", d: "Roles filled, time to fill and offer acceptance are the numbers recruiting leaders compare." },
      { t: "Say who you hire", d: "Clinical, technical or hourly hiring are different specialties. Name yours." },
      { t: "Show how you work with managers", d: "One example of changing the process with hiring managers shows you're a partner, not just a sourcer." },
    ],
    faqs: [
      { q: "Do recruiters need a cover letter?", a: "Not always, but recruiters know good ones when they see them. A short, specific letter is a chance to show you can write the kind of outreach you'd send candidates." },
      { q: "Should I mention agency experience when applying in-house?", a: "Yes. Volume, speed and client service carry over. Explain briefly why you want to move in-house." },
    ],
  },
  {
    slug: "account-manager",
    target: { title: "Senior Account Manager", company: "Fabrikam", hiringManager: "Lisa Moreno" },
    paragraphs: [
      "I'm applying for the Senior Account Manager role at Fabrikam. At Heartland Packaging Supply I manage a book of 60 mid-market manufacturing and food accounts worth $8.5M in annual revenue, and I've kept gross revenue retention at 96% for 3 straight years.",
      "Retention comes from paying attention early. I run quarterly business reviews with each account and start renewal planning well before contracts are due, so problems come up while there's still time to fix them. When 2 accounts worth $650K a year left over repeated late deliveries, I worked with our operations team to fix the cause and won both of them back.",
      "I also grow accounts. In 2025 I grew my book 14% by upselling custom packaging and cross-selling inventory programs to 18 existing accounts. Before Heartland, I handled 150 small-business accounts as an inside sales representative at Plaza Office Supply and reached 112% of my 2021 quota.",
      "I'd welcome the chance to talk about your accounts and how I could help keep and grow them. Thank you for your time.",
    ],
    annotations: [
      "Gives book size and retention in the first two sentences.",
      "Explains how he keeps accounts, with one win-back story and its value.",
      "Shows growth from existing accounts and earlier quota results.",
      "A short close tied to the employer's accounts.",
    ],
    tips: [
      { t: "Lead with your book", d: "Accounts, segment and revenue managed set your level right away." },
      { t: "Tell one save story", d: "An account you kept or won back, and what you fixed, shows how you handle problems." },
      { t: "Show retention and growth", d: "Account managers are judged on both. Give a number for each." },
    ],
    faqs: [
      { q: "Should an account manager cover letter mention quota?", a: "If your role carried a quota, yes. If not, lead with retention and growth in your book instead." },
      { q: "How long should the letter be?", a: "Three or four short paragraphs. Sales leaders read quickly, so put your book size and retention in the first sentences." },
    ],
  },
  {
    slug: "customer-success-manager",
    target: { title: "Customer Success Manager, Mid-Market", company: "Proseware", hiringManager: "Kevin Marsh" },
    paragraphs: [
      "I'm applying for the Customer Success Manager role on Proseware's mid-market team. At Harborview Analytics I own a portfolio of 45 SaaS accounts worth $3.2M in annual recurring revenue, and I've raised net revenue retention for my book from 98% to 112%.",
      "The change that made the biggest difference was seeing risk sooner. I built health scores in Gainsight from product usage and support data, and they now flag at-risk accounts 60 days before renewal. That gives me time to rebuild an adoption plan with the customer instead of trying to save the account in the last week.",
      "I also focus on the start of the relationship. A standard onboarding plan cut our time to value for new customers from 45 to 21 days. Before Harborview, I onboarded 70+ customers at Back Bay Software, wrote 30 help center articles in Zendesk that cut onboarding tickets by 20%, and kept a 95% CSAT across 1,500+ support tickets.",
      "I'd love to hear how your team measures customer health and where I could help. Thank you for considering my application.",
    ],
    annotations: [
      "States portfolio size, segment and the retention result in the opening.",
      "Explains one system she built and why it changes the outcome.",
      "Covers onboarding and her support background, each with numbers.",
      "Closes with a question about the employer's approach.",
    ],
    tips: [
      { t: "Lead with ARR and retention", d: "Portfolio size and a retention metric tell a CS leader your level immediately." },
      { t: "Explain how you spot risk", d: "Health scores, usage signals or renewal playbooks show you work ahead of churn." },
      { t: "Label metrics clearly", d: "Gross and net revenue retention mean different things. Use the one your team tracked." },
    ],
    faqs: [
      { q: "Do customer success managers need a cover letter?", a: "It helps, especially when moving from support or account management into CS. It's a chance to show the communication skills the job depends on." },
      { q: "Should I mention renewals and upsells?", a: "Yes, but be clear about your role — whether you owned them or handed them to sales." },
    ],
  },
  {
    slug: "real-estate-agent",
    target: { title: "Real Estate Sales Associate", company: "Contoso Realty Group", hiringManager: "Angela Ruiz" },
    paragraphs: [
      "I'm writing to ask about joining Contoso Realty Group as a sales associate. I'm a Florida-licensed real estate sales associate and REALTOR® with 5 years in residential real estate, and in 2025 I closed 28 transactions totaling $11.2M in sales volume.",
      "Most of my business comes from people I've already worked with. 70% of my clients are referrals or past clients, and I keep in touch through a monthly email newsletter and client events. I'd bring that sphere and that habit with me.",
      "On listings, I price with a comparative market analysis and walk sellers through it in plain terms; my 2025 listings sold at an average of 98% of list price in 21 days on market. I also manage contracts closely from offer through closing, coordinating inspections, appraisals, lenders and title. Before getting my license, I was a leasing consultant in a 320-unit community, where I turned about 1 in 3 tours into signed leases.",
      "I'd welcome the chance to meet and learn how your agents work together. Thank you for your time.",
    ],
    annotations: [
      "States her license and state, her REALTOR® membership and her production in the opening.",
      "Explains where her business comes from, which is what a broker wants to know about a new agent.",
      "Shows listing results, how she handles transactions and the sales skills she built before licensing.",
      "A short close about the team, not just the role.",
    ],
    tips: [
      { t: "Lead with license and production", d: "Your license, state and last year's transactions and volume are what a broker reads first." },
      { t: "Explain your lead sources", d: "Referrals, past clients or open houses — tell the broker how you'll keep building business." },
      { t: "Use REALTOR® correctly", d: "Only use it if you're a member of the National Association of REALTORS®, and write it in capitals with the ® symbol." },
    ],
    faqs: [
      { q: "Do real estate agents need a cover letter?", a: "When joining a brokerage or team, a short letter or email helps introduce your production, market and how you work. Many brokers also want a conversation first." },
      { q: "Should I mention commission splits in my letter?", a: "No. Save terms for the conversation with the broker. Use the letter to show what you'd bring." },
    ],
  },
  {
    slug: "marketing-coordinator",
    target: { title: "Marketing Coordinator", company: "Alpine Ski House", hiringManager: "Jenna Holt" },
    paragraphs: [
      "I'm applying for the Marketing Coordinator role at Alpine Ski House. I run social media, email and events day to day for Willamette Outdoor Co., another outdoor brand, and I'd like to bring that experience to a brand built around time outdoors.",
      "On social, I schedule and publish 20+ posts a week across Instagram, LinkedIn and Facebook in Hootsuite, and our engagement rate rose from 2.4% to 4.1%. I build and send 8 email campaigns a month in Mailchimp, and segmented lists and A/B testing on subject lines lifted our click-through rate from 1.9% to 3.2%. I also update product pages and blog posts in WordPress, and organic sessions grew 35% year over year.",
      "I keep events on track too: 6 trade shows and in-store events a year, with booth materials, vendors and a $40K budget to manage. Before Willamette, I worked part-time at Hawthorne Coffee Roasters, making social posts and signage for 4 locations and growing the Instagram account from 3,200 to 9,800 followers in 14 months.",
      "I'd be glad to share work samples and talk about your plans for the season. Thank you for considering my application.",
    ],
    annotations: [
      "Names the role and draws a real connection between her current brand and the employer's.",
      "Gives a result for each channel she runs, with the tool she uses.",
      "Shows she can run events and budgets, and uses an earlier part-time job for a growth result.",
      "Offers work samples and asks about the employer's plans.",
    ],
    tips: [
      { t: "Give each channel a result", d: "One number per channel — engagement, click-through, traffic — shows you track what you do." },
      { t: "Connect to the brand", d: "A genuine link between your experience and their products shows you've looked at their marketing." },
      { t: "Offer samples", d: "Mention that you can share posts, emails or event materials, and have a short portfolio ready." },
    ],
    faqs: [
      { q: "Do marketing coordinators need a cover letter?", a: "Often, yes. Marketing teams read the letter as a writing sample, so keep it clear, specific and free of buzzwords." },
      { q: "Should I include links in my letter?", a: "One portfolio link is enough. Write it out in full so it works when printed or parsed." },
    ],
  },
];
