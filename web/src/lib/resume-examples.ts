/**
 * Role-specific resume example pages (/resume-examples/[slug]). Every page is
 * real, crawlable text: a full sample resume, summary and bullet examples,
 * keywords, ATS tips and an FAQ. Names, companies and numbers in the samples
 * are illustrative.
 */

export type ExampleJob = { title: string; company: string; dates: string; bullets: string[] };

export type ResumeExample = {
  slug: string;
  role: string;
  /** Group shown in the breadcrumb and on the index page. */
  group: "Tech & product" | "Business" | "Creative" | "People & service";
  photo: { src: string; alt: string };
  /** One-line level label shown on the photo. */
  level: string;
  intro: string;
  resume: {
    name: string;
    headline: string;
    contact: string;
    summary: string;
    jobs: ExampleJob[];
    education: string;
    skills: string[];
  };
  whyItWorks: string;
  summaries: { level: string; text: string }[];
  bullets: { skill: string; weak: string; strong: string }[];
  keywords: string[];
  tips: { t: string; d: string }[];
  faqs: { q: string; a: string }[];
  related: string[];
};

const photo = (name: string, alt: string) => ({ src: `/images/photos/${name}.webp`, alt });

export const RESUME_EXAMPLES: ResumeExample[] = [
  {
    slug: "software-engineer",
    role: "Software Engineer",
    group: "Tech & product",
    photo: photo("role-software-engineer", "Software engineer working at a laptop"),
    level: "Senior · 7 years experience",
    intro:
      "A software engineer resume that shows scale, reliability and cost impact — plus the languages and tools recruiters filter for.",
    resume: {
      name: "James Carter",
      headline: "Senior Software Engineer",
      contact: "Seattle, WA · james.carter@email.com · github.com/jcarter",
      summary:
        "Backend engineer with 7 years building payment and logistics systems. I design services that stay fast under load and cheap to run.",
      jobs: [
        {
          title: "Senior Software Engineer",
          company: "Cascade Cloud",
          dates: "Apr 2021 – Present",
          bullets: [
            "Scaled the billing service to 3M daily requests at 99.99% uptime",
            "Cut infrastructure costs by $420K a year by rightsizing Kubernetes clusters",
            "Led the move from REST polling to event streaming, reducing invoice latency from 40s to 2s",
            "Mentored 5 engineers; 2 were promoted to senior",
          ],
        },
        {
          title: "Software Engineer",
          company: "Parcelly",
          dates: "Jul 2018 – Mar 2021",
          bullets: [
            "Built a route optimizer that saved drivers an average of 11 minutes per shift",
            "Split a monolith into 12 services on Kubernetes with zero-downtime deploys",
            "Raised test coverage from 41% to 83% and halved production incidents",
          ],
        },
      ],
      education: "B.S. Computer Science, University of Washington, 2018",
      skills: ["Go", "Python", "TypeScript", "PostgreSQL", "Kafka", "AWS", "Kubernetes", "Terraform", "gRPC", "CI/CD"],
    },
    whyItWorks:
      "Every bullet pairs an engineering decision with a measurable result, the stack is named in plain words a recruiter can search, and the layout is a single column the parser reads in order.",
    summaries: [
      {
        level: "Entry level",
        text: "Computer science graduate with two internships in backend development. Built a REST API used by 3,000 students and cut its response time by 60%.",
      },
      {
        level: "Mid level",
        text: "Full-stack engineer with 4 years in e-commerce. I ship features end to end in React and Node.js — most recently a checkout rewrite that lifted conversion by 9%.",
      },
      {
        level: "Senior",
        text: "Staff-level backend engineer who has led platform teams of 6. Designed systems handling 50K requests per second and reduced cloud spend by 30%.",
      },
    ],
    bullets: [
      { skill: "Performance", weak: "Improved API speed", strong: "Cut p95 API latency from 900ms to 180ms by adding caching and query indexes" },
      { skill: "Reliability", weak: "Worked on uptime", strong: "Raised service uptime from 99.5% to 99.99% with retries, health checks and canary deploys" },
      { skill: "Cost", weak: "Reduced AWS costs", strong: "Saved $420K a year by rightsizing clusters and moving batch jobs to spot instances" },
      { skill: "Leadership", weak: "Mentored juniors", strong: "Mentored 5 engineers through code review and pairing; 2 promoted within a year" },
    ],
    keywords: [
      "Python", "Java", "Go", "JavaScript", "TypeScript", "React", "Node.js", "SQL", "PostgreSQL", "AWS",
      "Docker", "Kubernetes", "Microservices", "REST APIs", "CI/CD", "System design", "Unit testing", "Git",
    ],
    tips: [
      { t: "Mirror the stack in the job post", d: "If it says PostgreSQL and AWS, write PostgreSQL and AWS — not just \"databases\" and \"cloud\"." },
      { t: "Put projects in plain text", d: "GitHub links are fine, but describe what the project does and its result in the bullet itself." },
      { t: "Quantify scale", d: "Requests per second, users, data volume or cost — numbers show the level you work at." },
      { t: "Keep the skills section scannable", d: "One line of comma-separated skills reads better to a parser than a grid of logos or rating bars." },
    ],
    faqs: [
      { q: "How long should a software engineer resume be?", a: "One page for under about 8 years of experience. Senior and staff engineers can use two pages if every line is relevant to the role." },
      { q: "Should I list every programming language I know?", a: "No. List the languages and tools you'd be comfortable being interviewed on, and lead with the ones the job post asks for." },
      { q: "Do I need a summary?", a: "It helps when it says your level, your focus and one result. Skip it if it would only repeat generic claims like \"passionate developer\"." },
    ],
    related: ["data-analyst", "product-manager", "ux-designer"],
  },
  {
    slug: "product-manager",
    role: "Product Manager",
    group: "Tech & product",
    photo: photo("role-product-manager", "Product manager at work"),
    level: "Mid-level · 6 years experience",
    intro: "A product manager resume built around outcomes — activation, retention and revenue — plus the keywords recruiters search for.",
    resume: {
      name: "Maria Lopez",
      headline: "Senior Product Manager",
      contact: "Austin, TX · maria.lopez@email.com · linkedin.com/in/marialopez",
      summary:
        "Product manager with 6 years in B2B SaaS and healthcare. I turn customer research into shipped features that move retention and revenue.",
      jobs: [
        {
          title: "Product Manager",
          company: "Brightpath Health",
          dates: "Mar 2022 – Present",
          bullets: [
            "Launched patient self-scheduling, cutting no-shows by 23% across 41 clinics",
            "Led a cross-functional team of 9 engineers and 2 designers through 3 major releases",
            "Ran 30+ customer interviews that shaped the 2024 roadmap and 2 new revenue features",
            "Managed stakeholders across clinical, legal and sales to ship HIPAA-compliant messaging",
          ],
        },
        {
          title: "Associate Product Manager",
          company: "Fieldnote",
          dates: "Jun 2019 – Feb 2022",
          bullets: [
            "Owned onboarding for a B2B app; raised week-1 activation from 38% to 57%",
            "Introduced an A/B testing practice later adopted by 4 product teams",
            "Defined OKRs and pricing tests that lifted trial-to-paid conversion by 11%",
          ],
        },
      ],
      education: "B.B.A. Business Analytics, University of Texas at Austin, 2019",
      skills: ["Product strategy", "Roadmapping", "Stakeholder management", "Go-to-market", "SQL", "Amplitude", "A/B testing", "User research", "Jira", "Figma"],
    },
    whyItWorks:
      "Every bullet has a result, the keywords match real product manager job posts, and it's one column with standard headings that any tracking system can read top to bottom.",
    summaries: [
      { level: "Entry level", text: "Analytical associate product manager with 2 years in consumer apps. Ran 40+ user interviews and shipped an onboarding redesign that lifted activation by 12%." },
      { level: "Mid level", text: "Product manager with 6 years in B2B SaaS. I turn customer research into shipped features — most recently a scheduling launch that cut no-shows by 23%." },
      { level: "Senior", text: "Product leader who has managed teams of 5 PMs across two platforms, growing ARR from $8M to $31M through pricing and expansion products." },
    ],
    bullets: [
      { skill: "Shipping", weak: "Worked on new features", strong: "Shipped 3 releases in 9 months, growing weekly active users by 18%" },
      { skill: "Research", weak: "Talked to customers", strong: "Ran 30+ interviews that shaped the roadmap and 2 revenue features" },
      { skill: "Experiments", weak: "Did A/B tests", strong: "Ran 24 pricing and onboarding tests; 7 shipped for +11% conversion" },
      { skill: "Leadership", weak: "Managed a team", strong: "Led 9 engineers and 2 designers; cut cycle time from 3 weeks to 9 days" },
    ],
    keywords: [
      "Product roadmap", "Product strategy", "Stakeholder management", "A/B testing", "SQL", "Go-to-market", "OKRs",
      "Pricing", "User research", "Agile / Scrum", "PRDs", "Jira", "Amplitude", "Figma", "Product analytics",
    ],
    tips: [
      { t: "Use the exact job title", d: "Write \"Senior Product Manager\" if that's the post — not \"Product Lead\" or \"Product Owner\"." },
      { t: "Name your tools", d: "Recruiters search for Jira, Amplitude or SQL by name." },
      { t: "Lead with outcomes", d: "Revenue, activation, retention and cycle time say more than a list of responsibilities." },
      { t: "Skip tables and icons", d: "Keep dates and titles as plain text so the parser keeps them with the right job." },
    ],
    faqs: [
      { q: "How long should a product manager resume be?", a: "One page under about 8 years of experience; two pages is fine for senior and leadership roles." },
      { q: "Should I include a portfolio?", a: "A short link to case studies helps, but the resume itself should already show the problem, what you shipped and the result." },
      { q: "How do I move into product from another role?", a: "Lead with work that looks like product work — customer research, prioritization, launches you drove — and quantify it the same way a PM would." },
    ],
    related: ["software-engineer", "data-analyst", "marketing-manager"],
  },
  {
    slug: "data-analyst",
    role: "Data Analyst",
    group: "Tech & product",
    photo: photo("role-data-analyst", "Data analyst reviewing charts on a laptop"),
    level: "Mid-level · 4 years experience",
    intro: "A data analyst resume that shows the decisions your analysis changed — with the SQL, BI and statistics keywords hiring teams filter on.",
    resume: {
      name: "Daniel Kim",
      headline: "Data Analyst",
      contact: "Chicago, IL · daniel.kim@email.com · linkedin.com/in/danielkim",
      summary:
        "Data analyst with 4 years in retail and subscription businesses. I build the dashboards and analyses that teams use to set prices, plan stock and cut churn.",
      jobs: [
        {
          title: "Data Analyst",
          company: "Northfield Retail",
          dates: "Feb 2022 – Present",
          bullets: [
            "Built a demand forecast in Python that reduced stockouts by 17% across 120 stores",
            "Replaced 30 weekly spreadsheets with a Tableau dashboard used by 85 managers",
            "Found a pricing gap in regional data that added $1.2M in annual margin",
            "Automated SQL data checks that cut reporting errors by 70%",
          ],
        },
        {
          title: "Junior Data Analyst",
          company: "Streamly",
          dates: "Aug 2020 – Jan 2022",
          bullets: [
            "Built a churn model that flagged at-risk subscribers; retention offers saved 4% of monthly revenue",
            "Wrote 200+ SQL queries for product, finance and marketing requests",
          ],
        },
      ],
      education: "B.S. Statistics, University of Illinois Urbana-Champaign, 2020",
      skills: ["SQL", "Python (pandas)", "Tableau", "Power BI", "Excel", "dbt", "A/B testing", "Regression", "Snowflake", "Data visualization"],
    },
    whyItWorks:
      "Each bullet ends with the business result of the analysis, not just the tool used, and the skills line matches the exact tool names in data analyst job posts.",
    summaries: [
      { level: "Entry level", text: "Statistics graduate with SQL, Python and Tableau experience from two internships. Built a sales dashboard now used weekly by a 12-person team." },
      { level: "Mid level", text: "Data analyst with 4 years in retail. My forecasting and pricing work has cut stockouts by 17% and added $1.2M in annual margin." },
      { level: "Senior", text: "Analytics lead who has built BI functions from scratch at two companies, owning metrics, data quality and experimentation for teams of 200+." },
    ],
    bullets: [
      { skill: "Dashboards", weak: "Made dashboards in Tableau", strong: "Replaced 30 weekly spreadsheets with one Tableau dashboard used by 85 managers" },
      { skill: "Modeling", weak: "Built predictive models", strong: "Built a churn model whose retention offers saved 4% of monthly revenue" },
      { skill: "Insight", weak: "Analyzed pricing data", strong: "Found a regional pricing gap that added $1.2M in annual margin" },
      { skill: "Data quality", weak: "Checked data accuracy", strong: "Automated SQL data checks that cut reporting errors by 70%" },
    ],
    keywords: [
      "SQL", "Python", "R", "Excel", "Tableau", "Power BI", "Looker", "Data visualization", "Statistical analysis",
      "A/B testing", "ETL", "dbt", "Snowflake", "BigQuery", "Forecasting", "Stakeholder reporting",
    ],
    tips: [
      { t: "Name the BI tool", d: "Tableau, Power BI and Looker are searched separately — list the ones you've actually used." },
      { t: "Show the decision", d: "\"Analysis led to X\" beats \"performed analysis\". Say what changed because of your work." },
      { t: "Avoid charts on the resume", d: "Graphs and skill bars can't be read by a parser. Put the numbers in the text." },
      { t: "Link a portfolio carefully", d: "A GitHub or Tableau Public link is useful, but write it out as plain text." },
    ],
    faqs: [
      { q: "What skills should a data analyst put on a resume?", a: "SQL first, then the analysis language (Python or R), the BI tool, and statistics or experimentation — matched to what the job post lists." },
      { q: "Should I include personal projects?", a: "Yes if you have under two years of experience. Describe the question, the data and the result in one or two bullets." },
      { q: "Do certifications help?", a: "Tool certifications like Tableau or Google Data Analytics can help at entry level. Experience with results matters more after that." },
    ],
    related: ["software-engineer", "financial-analyst", "product-manager"],
  },
  {
    slug: "marketing-manager",
    role: "Marketing Manager",
    group: "Business",
    photo: photo("role-marketing", "Marketing manager planning a campaign"),
    level: "Mid-level · 6 years experience",
    intro: "A marketing manager resume that ties every campaign to pipeline or revenue — with the channel and tool keywords recruiters look for.",
    resume: {
      name: "Priya Nair",
      headline: "Marketing Manager",
      contact: "London, UK · priya.nair@email.com · linkedin.com/in/priyanair",
      summary:
        "Growth-focused marketer with 6 years in B2B SaaS. I plan and run campaigns across paid, content and lifecycle that turn into qualified pipeline.",
      jobs: [
        {
          title: "Marketing Manager",
          company: "Loop & Co",
          dates: "Jan 2022 – Present",
          bullets: [
            "Grew marketing-sourced pipeline from £1.1M to £3.4M in 18 months",
            "Cut cost per lead by 38% by rebuilding paid search and LinkedIn campaigns",
            "Launched a content program that now brings 45% of organic sign-ups",
            "Managed a £600K annual budget and a team of 3",
          ],
        },
        {
          title: "Digital Marketing Specialist",
          company: "Brightwave",
          dates: "Mar 2019 – Dec 2021",
          bullets: [
            "Built email nurture flows in HubSpot that lifted trial-to-paid conversion by 14%",
            "Ran 40+ landing page tests, raising average conversion from 2.1% to 3.6%",
          ],
        },
      ],
      education: "B.A. Marketing, University of Leeds, 2018",
      skills: ["Demand generation", "Paid search", "LinkedIn Ads", "SEO", "Content strategy", "HubSpot", "Google Analytics 4", "Marketing automation", "A/B testing", "Budget management"],
    },
    whyItWorks:
      "It reports results in the currency the business cares about — pipeline, cost per lead and conversion — and names the channels and platforms exactly as job posts do.",
    summaries: [
      { level: "Entry level", text: "Marketing graduate with hands-on experience running social and email campaigns for two startups. Grew an Instagram account from 2K to 18K followers in a year." },
      { level: "Mid level", text: "B2B marketer with 6 years in SaaS. I grew marketing-sourced pipeline 3x in 18 months while cutting cost per lead by 38%." },
      { level: "Senior", text: "Marketing leader who has built and led teams of 12 across demand gen, content and product marketing, supporting growth from $5M to $40M ARR." },
    ],
    bullets: [
      { skill: "Paid", weak: "Ran Google Ads campaigns", strong: "Cut cost per lead by 38% by restructuring paid search and LinkedIn campaigns" },
      { skill: "Content", weak: "Wrote blog posts", strong: "Launched a content program that now drives 45% of organic sign-ups" },
      { skill: "Lifecycle", weak: "Managed email marketing", strong: "Built HubSpot nurture flows that lifted trial-to-paid conversion by 14%" },
      { skill: "Budget", weak: "Responsible for budget", strong: "Managed a £600K budget, reallocating 30% to channels with the best payback" },
    ],
    keywords: [
      "Demand generation", "Digital marketing", "SEO", "SEM", "Paid social", "Content marketing", "Email marketing",
      "Marketing automation", "HubSpot", "Salesforce", "Google Analytics", "Campaign management", "Conversion rate optimization", "Brand strategy", "Budget management",
    ],
    tips: [
      { t: "Report pipeline, not impressions", d: "Leads, pipeline, revenue and cost per acquisition are what hiring managers compare." },
      { t: "Name the platforms", d: "HubSpot, Marketo, Salesforce and GA4 are common filters." },
      { t: "Match B2B or B2C language", d: "Use the vocabulary of the job post — \"demand gen\" and \"pipeline\" for B2B, \"acquisition\" and \"retention\" for B2C." },
      { t: "Keep design simple", d: "A creative layout can be shared as a portfolio link; the resume itself should be one clean column." },
    ],
    faqs: [
      { q: "What should a marketing manager resume include?", a: "Channels you've owned, budgets you've managed, the tools you use and the results in pipeline, revenue or conversion." },
      { q: "Should a marketing resume be creative?", a: "Keep the resume itself ATS-friendly and show creativity through a portfolio or case-study link." },
      { q: "How do I show results without exact numbers?", a: "Use percentages or ranges you can explain, like \"roughly doubled qualified leads\". Never invent figures." },
    ],
    related: ["product-manager", "ux-designer", "customer-service-representative"],
  },
  {
    slug: "financial-analyst",
    role: "Financial Analyst",
    group: "Business",
    photo: photo("role-finance", "Financial analyst reviewing figures"),
    level: "Mid-level · 5 years experience",
    intro: "A financial analyst resume that shows forecasting accuracy and savings — with the modeling and reporting keywords finance recruiters screen for.",
    resume: {
      name: "Olivia Bennett",
      headline: "Senior Financial Analyst",
      contact: "New York, NY · olivia.bennett@email.com · linkedin.com/in/oliviabennett",
      summary:
        "Financial analyst with 5 years in FP&A for consumer and tech companies. I build the models leadership uses to plan budgets, price products and allocate capital.",
      jobs: [
        {
          title: "Senior Financial Analyst",
          company: "Harbor Brands",
          dates: "May 2022 – Present",
          bullets: [
            "Own the $240M annual operating budget model for 6 business units",
            "Improved revenue forecast accuracy from ±9% to ±3% by adding driver-based modeling",
            "Identified $3.1M in vendor savings through a cost review with procurement",
            "Cut month-end reporting time from 6 days to 3 by automating variance reports",
          ],
        },
        {
          title: "Financial Analyst",
          company: "Metro Software",
          dates: "Jul 2019 – Apr 2022",
          bullets: [
            "Built a pricing model used to launch 3 new subscription tiers",
            "Prepared monthly board reporting packs and variance analysis for the CFO",
          ],
        },
      ],
      education: "B.S. Finance, New York University, 2019 · CFA Level II candidate",
      skills: ["Financial modeling", "FP&A", "Budgeting", "Forecasting", "Variance analysis", "Excel", "SQL", "NetSuite", "Power BI", "DCF valuation"],
    },
    whyItWorks:
      "It quantifies the size of what you manage and the accuracy or savings you delivered, and uses the same finance terms — FP&A, variance analysis, DCF — that appear in job posts.",
    summaries: [
      { level: "Entry level", text: "Finance graduate with internship experience in corporate FP&A. Built a three-statement model for a $40M business unit and automated weekly cash reporting." },
      { level: "Mid level", text: "Financial analyst with 5 years in FP&A. I own a $240M budget model and improved forecast accuracy from ±9% to ±3%." },
      { level: "Senior", text: "Finance manager who has led FP&A teams of 4, partnering with executives on planning, M&A models and capital allocation for a $1B business." },
    ],
    bullets: [
      { skill: "Forecasting", weak: "Prepared forecasts", strong: "Improved revenue forecast accuracy from ±9% to ±3% with driver-based models" },
      { skill: "Savings", weak: "Helped reduce costs", strong: "Identified $3.1M in vendor savings through a cost review with procurement" },
      { skill: "Reporting", weak: "Did monthly reporting", strong: "Cut month-end reporting from 6 days to 3 by automating variance reports" },
      { skill: "Pricing", weak: "Worked on pricing", strong: "Built the pricing model behind 3 new subscription tiers" },
    ],
    keywords: [
      "Financial modeling", "FP&A", "Budgeting", "Forecasting", "Variance analysis", "Excel", "Financial reporting",
      "DCF", "Valuation", "SQL", "Power BI", "NetSuite", "SAP", "GAAP", "KPI reporting",
    ],
    tips: [
      { t: "State the scale", d: "Budget size, revenue covered or number of business units shows your level instantly." },
      { t: "Spell out acronyms once", d: "Write \"Financial Planning & Analysis (FP&A)\" so both versions are matched." },
      { t: "List systems by name", d: "SAP, NetSuite, Oracle and Hyperion are common screening terms." },
      { t: "Put certifications in plain text", d: "CFA, CPA or progress toward them belongs in education, not in a badge image." },
    ],
    faqs: [
      { q: "What skills matter most for a financial analyst resume?", a: "Financial modeling, forecasting and Excel are expected. SQL, BI tools and ERP systems help you stand out." },
      { q: "Should I include my GPA?", a: "Include it in your first two years after graduating if it's 3.5 or higher, or if the employer asks for it." },
      { q: "How do I show impact in a support role?", a: "Describe the decisions your analysis informed and any time saved, accuracy gained or costs found." },
    ],
    related: ["data-analyst", "hr-generalist", "marketing-manager"],
  },
  {
    slug: "ux-designer",
    role: "UX Designer",
    group: "Creative",
    photo: photo("role-designer", "UX designer at work"),
    level: "Mid-level · 5 years experience",
    intro: "A UX designer resume that pairs a clean, parseable layout with measurable design outcomes — and the research and tool keywords teams search for.",
    resume: {
      name: "Sofia Martins",
      headline: "Product Designer (UX)",
      contact: "Toronto, ON · sofia.martins@email.com · sofiamartins.design",
      summary:
        "Product designer with 5 years in fintech and marketplaces. I combine research and interaction design to make complex flows simple — and measure whether they worked.",
      jobs: [
        {
          title: "Product Designer",
          company: "Northcoin",
          dates: "Jun 2021 – Present",
          bullets: [
            "Redesigned account sign-up, raising completion from 54% to 78%",
            "Ran 25 usability sessions that cut support tickets about transfers by 31%",
            "Built a Figma design system of 120 components used by 4 product teams",
            "Partnered with engineering to ship accessible components meeting WCAG 2.1 AA",
          ],
        },
        {
          title: "UX Designer",
          company: "Tradepost",
          dates: "Aug 2019 – May 2021",
          bullets: [
            "Simplified the seller listing flow from 9 steps to 4, increasing new listings by 22%",
            "Introduced quarterly user interviews that informed 6 roadmap decisions",
          ],
        },
      ],
      education: "B.Des. Interaction Design, OCAD University, 2019",
      skills: ["User research", "Usability testing", "Interaction design", "Wireframing", "Prototyping", "Figma", "Design systems", "Accessibility (WCAG)", "Information architecture", "UX writing"],
    },
    whyItWorks:
      "The resume stays single-column and text-based so it parses cleanly, while each bullet shows a design change and its measurable effect. The visual work lives in the portfolio link.",
    summaries: [
      { level: "Entry level", text: "UX designer with a bootcamp certificate and two freelance projects. Redesigned a local nonprofit's donation flow, increasing online donations by 30%." },
      { level: "Mid level", text: "Product designer with 5 years in fintech. My sign-up redesign lifted completion from 54% to 78%, and my design system is used by 4 teams." },
      { level: "Senior", text: "Design lead who has managed teams of 5 designers and set research and design system practice for a product used by 2M people." },
    ],
    bullets: [
      { skill: "Conversion", weak: "Redesigned onboarding", strong: "Redesigned sign-up, raising completion from 54% to 78%" },
      { skill: "Research", weak: "Conducted user research", strong: "Ran 25 usability sessions that cut transfer support tickets by 31%" },
      { skill: "Systems", weak: "Made a design system", strong: "Built a 120-component Figma design system used by 4 product teams" },
      { skill: "Simplicity", weak: "Improved the listing flow", strong: "Cut the seller listing flow from 9 steps to 4, increasing new listings by 22%" },
    ],
    keywords: [
      "User research", "Usability testing", "Interaction design", "Wireframes", "Prototyping", "Figma", "Design systems",
      "Information architecture", "User flows", "Accessibility", "WCAG", "Journey mapping", "A/B testing", "UX writing",
    ],
    tips: [
      { t: "Let the portfolio carry visuals", d: "Graphic resume layouts often break parsers. Keep the resume plain and link your portfolio as text." },
      { t: "Measure design outcomes", d: "Completion rates, task time, support tickets and conversion show your design worked." },
      { t: "Match title variants", d: "Posts say UX Designer, Product Designer or UI/UX Designer — use the one in the post." },
      { t: "Name methods, not just tools", d: "Usability testing and journey mapping are searched as often as Figma." },
    ],
    faqs: [
      { q: "Should a designer's resume be visually designed?", a: "Keep it clean and one column so applicant tracking systems can read it. Show visual skill in your portfolio." },
      { q: "How do I link my portfolio?", a: "Put the URL in plain text in your contact line, and make sure it works without a password or note the password." },
      { q: "What if my projects have no metrics?", a: "Describe the problem, what you changed and any qualitative evidence — fewer errors in testing, clearer feedback, adoption by other teams." },
    ],
    related: ["product-manager", "marketing-manager", "software-engineer"],
  },
  {
    slug: "customer-service-representative",
    role: "Customer Service Representative",
    group: "People & service",
    photo: photo("role-customer-service", "Customer service representatives with headsets"),
    level: "Experienced · 4 years",
    intro: "A customer service resume that proves you resolve problems fast and keep customers happy — with the CSAT, CRM and support keywords employers filter on.",
    resume: {
      name: "Aisha Johnson",
      headline: "Customer Service Representative",
      contact: "Phoenix, AZ · aisha.johnson@email.com · (602) 555-0187",
      summary:
        "Customer service representative with 4 years in e-commerce and telecom support. I resolve issues on the first contact and keep satisfaction scores high under heavy volume.",
      jobs: [
        {
          title: "Customer Service Representative",
          company: "Desertline Telecom",
          dates: "Mar 2022 – Present",
          bullets: [
            "Handle 60+ calls, chats and emails a day with a 94% customer satisfaction (CSAT) score",
            "Raised first-contact resolution from 71% to 86% by building a shared troubleshooting guide",
            "Trained 8 new hires on Zendesk, billing systems and escalation steps",
            "Recognized as top retention agent two quarters in a row, saving 120+ cancelling accounts",
          ],
        },
        {
          title: "Customer Support Associate",
          company: "Cactus Goods",
          dates: "Jun 2020 – Feb 2022",
          bullets: [
            "Answered order, return and shipping questions for an online store with 40K monthly orders",
            "Cut average response time on email from 18 hours to 5",
          ],
        },
      ],
      education: "Associate of Arts, Phoenix College, 2020",
      skills: ["Customer support", "Conflict resolution", "Zendesk", "Salesforce Service Cloud", "Live chat", "Billing inquiries", "De-escalation", "Data entry", "Bilingual English/Spanish", "Typing 70 WPM"],
    },
    whyItWorks:
      "It uses the metrics support managers track — CSAT, first-contact resolution and response time — and lists the help-desk tools and languages that are common screening questions.",
    summaries: [
      { level: "Entry level", text: "Friendly, reliable retail associate moving into customer service. Handled 100+ customers a shift and resolved returns and complaints without manager escalation." },
      { level: "Experienced", text: "Customer service representative with 4 years in telecom and e-commerce. I keep a 94% CSAT while handling 60+ contacts a day." },
      { level: "Team lead", text: "Support team lead who has coached 12 agents, raised team CSAT from 82% to 93% and cut average handle time by 20%." },
    ],
    bullets: [
      { skill: "Satisfaction", weak: "Provided great customer service", strong: "Kept a 94% CSAT score while handling 60+ calls, chats and emails a day" },
      { skill: "Resolution", weak: "Solved customer problems", strong: "Raised first-contact resolution from 71% to 86% with a shared troubleshooting guide" },
      { skill: "Retention", weak: "Helped keep customers", strong: "Saved 120+ cancelling accounts as top retention agent two quarters in a row" },
      { skill: "Speed", weak: "Answered emails quickly", strong: "Cut average email response time from 18 hours to 5" },
    ],
    keywords: [
      "Customer service", "Customer satisfaction", "CSAT", "First-contact resolution", "Conflict resolution", "De-escalation",
      "Zendesk", "Salesforce", "Freshdesk", "CRM", "Live chat", "Call center", "Order management", "Bilingual",
    ],
    tips: [
      { t: "Use the metrics", d: "CSAT, first-contact resolution, average handle time and volume are what support managers compare." },
      { t: "List languages clearly", d: "\"Bilingual English/Spanish\" is a common filter — put it in skills, in plain text." },
      { t: "Name the help-desk tools", d: "Zendesk, Freshdesk and Salesforce Service Cloud show you can start quickly." },
      { t: "Show reliability", d: "Awards, attendance records or being chosen to train others signal trust." },
    ],
    faqs: [
      { q: "What should a customer service resume include?", a: "Your volume, satisfaction or resolution metrics, the tools you've used, languages you speak and any training or leadership." },
      { q: "I have no customer service job yet. What should I write?", a: "Use retail, hospitality or volunteer work where you dealt with people, and describe volume and problem-solving." },
      { q: "Should I include typing speed?", a: "Yes for call center and chat roles, if it's 50 WPM or higher." },
    ],
    related: ["hr-generalist", "marketing-manager", "data-analyst"],
  },
  {
    slug: "hr-generalist",
    role: "HR Generalist",
    group: "People & service",
    photo: photo("role-hr", "HR professional in a meeting"),
    level: "Mid-level · 5 years experience",
    intro: "An HR generalist resume that shows impact on hiring, retention and compliance — with the HRIS and employment keywords recruiters look for.",
    resume: {
      name: "Rachel Thompson",
      headline: "HR Generalist",
      contact: "Denver, CO · rachel.thompson@email.com · linkedin.com/in/rachelthompson",
      summary:
        "HR generalist with 5 years supporting 300–600 employee companies. I handle the full employee lifecycle and build processes that cut turnover and keep the company compliant.",
      jobs: [
        {
          title: "HR Generalist",
          company: "Summit Manufacturing",
          dates: "Apr 2021 – Present",
          bullets: [
            "Support 450 employees across 3 sites on onboarding, benefits, leave and employee relations",
            "Reduced first-year turnover from 34% to 21% with a structured 90-day onboarding plan",
            "Moved HR records to Workday, cutting time spent on manual data entry by 10 hours a week",
            "Led annual open enrollment with 96% participation and zero compliance findings",
          ],
        },
        {
          title: "HR Coordinator",
          company: "Peak Health Clinics",
          dates: "Jan 2019 – Mar 2021",
          bullets: [
            "Coordinated hiring for 120 roles a year, reducing time-to-fill from 42 to 29 days",
            "Ran I-9 and licensing audits for 300 clinical staff",
          ],
        },
      ],
      education: "B.S. Human Resource Management, Colorado State University, 2018 · SHRM-CP",
      skills: ["Employee relations", "Onboarding", "Benefits administration", "Workday", "HRIS", "Recruiting", "FMLA", "Compliance", "Performance management", "Payroll support"],
    },
    whyItWorks:
      "It sizes the population you support, shows results in turnover and time-to-fill, and uses compliance and HRIS terms exactly as HR job posts write them.",
    summaries: [
      { level: "Entry level", text: "HR coordinator with 2 years of recruiting and onboarding support. Scheduled 400+ interviews a year and built an onboarding checklist used company-wide." },
      { level: "Mid level", text: "HR generalist supporting 450 employees across 3 sites. My onboarding program cut first-year turnover from 34% to 21%." },
      { level: "Senior", text: "HR business partner who has advised leadership teams of 1,000+ employee organizations on workforce planning, performance and employee relations." },
    ],
    bullets: [
      { skill: "Retention", weak: "Improved onboarding", strong: "Cut first-year turnover from 34% to 21% with a structured 90-day onboarding plan" },
      { skill: "Recruiting", weak: "Helped with hiring", strong: "Coordinated 120 hires a year and cut time-to-fill from 42 to 29 days" },
      { skill: "Systems", weak: "Used HR software", strong: "Moved HR records to Workday, saving 10 hours of data entry a week" },
      { skill: "Compliance", weak: "Handled compliance", strong: "Ran open enrollment with 96% participation and zero compliance findings" },
    ],
    keywords: [
      "Employee relations", "Onboarding", "Benefits administration", "HRIS", "Workday", "BambooHR", "ADP", "Recruiting",
      "Talent acquisition", "Performance management", "FMLA", "Compliance", "Policy development", "Payroll", "SHRM",
    ],
    tips: [
      { t: "Say how many people you support", d: "Headcount and number of sites tell a recruiter your scope right away." },
      { t: "Name the HRIS", d: "Workday, ADP, BambooHR and UKG are common filters." },
      { t: "Show people outcomes", d: "Turnover, engagement scores and time-to-fill turn HR work into results." },
      { t: "List certifications in text", d: "SHRM-CP, SHRM-SCP or PHR should appear in plain words, not as a logo." },
    ],
    faqs: [
      { q: "What should an HR generalist resume highlight?", a: "The size of the workforce you support, the HR areas you own, your HRIS experience and results in retention, hiring or compliance." },
      { q: "Is SHRM certification required?", a: "Rarely required, but often preferred. List it if you have it or note that you're studying for it." },
      { q: "How do I keep employee relations work confidential?", a: "Describe the type and volume of cases and the outcome in general terms — never names or identifying details." },
    ],
    related: ["customer-service-representative", "financial-analyst", "marketing-manager"],
  },
];

export function getResumeExample(slug: string): ResumeExample | undefined {
  return RESUME_EXAMPLES.find((e) => e.slug === slug);
}

/** Plain-text version of the sample resume for the "Copy text" button. */
export function exampleResumeText(e: ResumeExample): string {
  const r = e.resume;
  return [
    r.name,
    `${r.headline} · ${r.contact}`,
    "",
    "SUMMARY",
    r.summary,
    "",
    "EXPERIENCE",
    ...r.jobs.flatMap((j) => [`${j.title}, ${j.company} — ${j.dates}`, ...j.bullets.map((b) => `• ${b}`), ""]),
    "EDUCATION",
    r.education,
    "",
    "SKILLS",
    r.skills.join(", "),
  ].join("\n");
}
