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
    related: ["software-engineer", "project-manager", "data-analyst"],
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
    related: ["data-scientist", "financial-analyst", "product-manager"],
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
    related: ["accountant", "data-analyst", "marketing-manager"],
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
  {
    slug: "registered-nurse",
    role: "Registered Nurse",
    group: "People & service",
    photo: photo("role-nurse", "Nurse in scrubs with a stethoscope"),
    level: "Experienced · 6 years",
    intro: "A registered nurse resume that shows safe, high-quality patient care — with the licensure, certification and clinical keywords hospital recruiters screen for.",
    resume: {
      name: "Megan Foster",
      headline: "Registered Nurse, Medical-Surgical",
      contact: "Columbus, OH · megan.foster@email.com · (614) 555-0142",
      summary:
        "Registered nurse with 6 years in medical-surgical and telemetry units. I give safe, organized care on busy shifts and help newer nurses find their feet.",
      jobs: [
        {
          title: "Registered Nurse, Medical-Surgical",
          company: "Northwind Health Medical Center",
          dates: "May 2021 – Present",
          bullets: [
            "Care for 5–6 adult patients per shift on a 32-bed medical-surgical unit",
            "Led an hourly rounding project that cut patient falls on the unit by 35% in 12 months",
            "Serve as relief charge nurse 2 shifts a week, managing assignments and bed flow for 8 nurses",
            "Precepted 9 new graduate nurses; all completed orientation on schedule",
          ],
        },
        {
          title: "Registered Nurse, Telemetry",
          company: "Cedar Grove Hospital",
          dates: "Jun 2019 – Apr 2021",
          bullets: [
            "Monitored cardiac rhythms for 4 telemetry patients per shift and escalated changes through rapid response",
            "Helped keep the unit's CAUTI rate at zero for 9 straight months with daily catheter-necessity checks",
          ],
        },
      ],
      education: "B.S. Nursing (BSN), The Ohio State University, 2019 · RN license, Ohio · BLS, ACLS",
      skills: ["Patient assessment", "Medication administration", "Care planning", "Telemetry monitoring", "IV therapy", "Wound care", "Patient education", "Epic", "Fall prevention", "Charge nurse"],
    },
    whyItWorks:
      "It puts licensure and certifications where recruiters check first, names the unit, patient load and specialty in plain words, and shows quality results — falls, infections, orientation — instead of a list of duties.",
    summaries: [
      { level: "New graduate", text: "New graduate RN with a BSN and a 200-hour capstone on a medical-surgical unit. Licensed in Ohio and BLS certified, with clinical rotations in ICU, pediatrics and behavioral health." },
      { level: "Experienced", text: "Registered nurse with 6 years in med-surg and telemetry. I care for 5–6 patients a shift and led a rounding project that cut unit falls by 35%." },
      { level: "Charge nurse", text: "Charge nurse with 10 years in acute care who leads shifts of 10 nurses, manages patient flow for a 36-bed unit and works closely with physicians, case management and rapid response teams." },
    ],
    bullets: [
      { skill: "Safety", weak: "Helped prevent falls", strong: "Led an hourly rounding project that cut unit patient falls by 35% in 12 months" },
      { skill: "Infection control", weak: "Followed infection control policies", strong: "Helped keep the unit's CAUTI rate at zero for 9 months with daily catheter-necessity checks" },
      { skill: "Precepting", weak: "Trained new nurses", strong: "Precepted 9 new graduate nurses through a 12-week orientation; all finished on schedule" },
      { skill: "Patient education", weak: "Educated patients before discharge", strong: "Introduced teach-back discharge teaching that cut follow-up calls about medications by 30%" },
    ],
    keywords: [
      "Registered Nurse (RN)", "BSN", "RN license", "BLS", "ACLS", "Patient assessment", "Medication administration", "Care planning",
      "Patient education", "Telemetry", "IV therapy", "Wound care", "Infection control", "Epic", "Cerner", "Charge nurse", "Med-surg",
    ],
    tips: [
      { t: "Lead with license and certifications", d: "Put your RN license type and state, plus BLS, ACLS or PALS, near the top in plain text — recruiters often check these first." },
      { t: "Name the unit and patient load", d: "\"Med-surg, 32 beds, 5–6 patients\" tells a nurse manager your setting and pace in one line." },
      { t: "Use quality measures", d: "Falls, pressure injuries, infections, readmissions and patient satisfaction show the results of your care." },
      { t: "List the EHR", d: "Epic, Cerner (Oracle Health) and Meditech are common screening terms — name the ones you've charted in." },
    ],
    faqs: [
      { q: "Should I put my RN license number on my resume?", a: "Usually not. List the license type and state; employers verify the number during hiring. Include it only if the posting asks for it." },
      { q: "What should a new grad nurse resume include?", a: "Your BSN or ADN, license status, clinical rotations — unit, hours and skills practiced — and any healthcare jobs such as CNA or patient care tech roles." },
      { q: "Which certifications should I list?", a: "The ones that matter for the role — BLS and ACLS for most acute care, PALS for pediatrics, and specialty certifications like CCRN or CMSRN where they apply." },
    ],
    related: ["teacher", "customer-service-representative", "hr-generalist"],
  },
  {
    slug: "teacher",
    role: "Teacher",
    group: "People & service",
    photo: photo("role-teacher", "Teacher at the board with students raising their hands"),
    level: "Experienced · 7 years",
    intro: "A teacher resume that shows student growth and classroom impact — with the certification, curriculum and instruction keywords school districts search for.",
    resume: {
      name: "Hannah Mitchell",
      headline: "Middle School Math Teacher",
      contact: "Raleigh, NC · hannah.mitchell@email.com · (919) 555-0163",
      summary:
        "Licensed math teacher with 7 years in grades 6–8. I plan data-driven lessons and build classrooms where students who struggle with math start to catch up.",
      jobs: [
        {
          title: "7th Grade Math Teacher",
          company: "Willow Creek Middle School",
          dates: "Aug 2021 – Present",
          bullets: [
            "Teach 5 sections of 7th grade math, about 130 students a year, including inclusion and advanced classes",
            "Raised the share of students meeting grade-level benchmarks from 58% to 71% in two years",
            "Use weekly exit tickets and small-group reteaching to close gaps before unit tests",
            "Lead the 4-teacher math team, building shared unit plans aligned to state standards",
          ],
        },
        {
          title: "6th Grade Math and Science Teacher",
          company: "Lakeside Charter Academy",
          dates: "Aug 2018 – Jun 2021",
          bullets: [
            "Co-taught inclusion classes with special education staff, implementing IEP accommodations for 20+ students",
            "Started an after-school STEM club that grew from 8 to 35 regular members",
          ],
        },
      ],
      education: "B.A. Mathematics Education, North Carolina State University, 2018 · North Carolina teaching license, Mathematics 6–9",
      skills: ["Lesson planning", "Differentiated instruction", "Classroom management", "Formative assessment", "Data-driven instruction", "IEP implementation", "Google Classroom", "Canvas", "Parent communication", "Standards-aligned curriculum"],
    },
    whyItWorks:
      "It leads with license and grade level, measures teaching in student growth rather than duties, and uses the instruction and assessment terms districts write into their job posts.",
    summaries: [
      { level: "New teacher", text: "Newly licensed elementary teacher with a semester of student teaching in a 2nd grade class of 24. Planned and taught a full literacy unit and used reading assessments to group students." },
      { level: "Experienced", text: "Licensed math teacher with 7 years in grades 6–8. The share of my students meeting benchmarks rose from 58% to 71% in two years." },
      { level: "Teacher leader", text: "Instructional lead with 12 years in secondary education who has coached 10 teachers, led a department curriculum adoption and mentored new teachers through licensure." },
    ],
    bullets: [
      { skill: "Student growth", weak: "Helped students improve their scores", strong: "Raised the share of students meeting grade-level benchmarks from 58% to 71% in two years" },
      { skill: "Differentiation", weak: "Differentiated instruction", strong: "Ran weekly small-group reteaching from exit-ticket data, cutting unit test failures by a third" },
      { skill: "Inclusion", weak: "Worked with special education students", strong: "Co-taught inclusion classes and implemented IEP accommodations for 20+ students" },
      { skill: "Engagement", weak: "Ran an after-school club", strong: "Started an after-school STEM club that grew from 8 to 35 regular members" },
    ],
    keywords: [
      "Lesson planning", "Curriculum development", "Differentiated instruction", "Classroom management", "Formative assessment", "Data-driven instruction",
      "Standards-aligned instruction", "IEP", "504 plans", "English language learners (ELL)", "Google Classroom", "Canvas", "Parent communication", "PLC", "Teaching license",
    ],
    tips: [
      { t: "Put your license at the top", d: "State, license type and subject or grade bands should be easy to find — many districts screen on them first." },
      { t: "Measure learning, not tasks", d: "Benchmark results, reading levels, pass rates or attendance gains show what changed for your students." },
      { t: "Match the district's language", d: "If the post mentions PLCs, MTSS or a specific curriculum, use those exact terms where they're true for you." },
      { t: "Keep student details private", d: "Describe classes by grade, size and needs — never names or anything that could identify a student." },
    ],
    faqs: [
      { q: "How long should a teacher resume be?", a: "One page for most teachers. Two pages is fine for experienced teachers with coaching, curriculum or leadership work." },
      { q: "What should a first-year teacher include?", a: "Your license or expected license date, your student teaching placement — grade, subject and class size — and any tutoring, coaching or camp work with young people." },
      { q: "Should I include test scores?", a: "Yes if you can explain them, such as benchmark or end-of-year results for your classes. Use class-level percentages or growth, never individual student data." },
    ],
    related: ["registered-nurse", "hr-generalist", "administrative-assistant"],
  },
  {
    slug: "sales-representative",
    role: "Sales Representative",
    group: "Business",
    photo: photo("handshake-desk", "Sales representative shaking hands with a client"),
    level: "Mid-level · 5 years experience",
    intro: "A sales representative resume that leads with quota attainment and revenue — with the CRM, prospecting and pipeline keywords sales recruiters filter on.",
    resume: {
      name: "Marcus Allen",
      headline: "Sales Representative",
      contact: "Atlanta, GA · marcus.allen@email.com · linkedin.com/in/marcusallen",
      summary:
        "B2B sales representative with 5 years selling software and business services to small and mid-sized companies. I build my own pipeline, follow up with discipline and close above quota.",
      jobs: [
        {
          title: "Sales Representative",
          company: "Fabrikam Software",
          dates: "Feb 2022 – Present",
          bullets: [
            "Closed $1.4M in new annual contract value in 2024, 118% of quota",
            "Ranked in the top 3 of 14 reps for four straight quarters",
            "Sourced 40% of my own pipeline through outbound calls, email and LinkedIn prospecting",
            "Shortened the average sales cycle from 62 to 45 days with a structured discovery and demo process",
          ],
        },
        {
          title: "Sales Development Representative",
          company: "Contoso Office Solutions",
          dates: "Jun 2019 – Jan 2022",
          bullets: [
            "Booked 25+ qualified meetings a month for 4 account executives",
            "Generated $900K in sourced pipeline in 2021 from cold outreach",
          ],
        },
      ],
      education: "B.B.A. Marketing, Georgia State University, 2019",
      skills: ["B2B sales", "Prospecting", "Cold calling", "Discovery calls", "Product demos", "Negotiation", "Pipeline management", "Salesforce", "HubSpot", "Sales forecasting"],
    },
    whyItWorks:
      "It opens with quota attainment and dollar figures, shows how pipeline was built and not just closed, and names the CRM and sales methods recruiters search for.",
    summaries: [
      { level: "Entry level", text: "Competitive retail sales associate moving into B2B sales. Beat monthly sales targets 10 months out of 12 and regularly led the store in add-on sales." },
      { level: "Mid level", text: "B2B sales representative with 5 years in software sales. I closed $1.4M in new business last year at 118% of quota." },
      { level: "Senior", text: "Enterprise account executive with 10 years closing six-figure deals, averaging 110%+ of quota and running territory plans for a $6M book of business." },
    ],
    bullets: [
      { skill: "Quota", weak: "Met sales goals", strong: "Closed $1.4M in new annual contract value, 118% of quota" },
      { skill: "Prospecting", weak: "Made cold calls", strong: "Sourced 40% of my own pipeline through outbound calls, email and LinkedIn" },
      { skill: "Sales process", weak: "Improved the sales process", strong: "Cut the average sales cycle from 62 to 45 days with structured discovery and tailored demos" },
      { skill: "Consistency", weak: "Top performer on the team", strong: "Ranked top 3 of 14 reps for four straight quarters" },
    ],
    keywords: [
      "B2B sales", "Quota attainment", "Prospecting", "Lead generation", "Cold calling", "Pipeline management", "Account management", "Negotiation",
      "Closing", "Salesforce", "HubSpot", "CRM", "Sales forecasting", "Consultative selling", "MEDDIC", "SPIN Selling",
    ],
    tips: [
      { t: "Lead with quota attainment", d: "Percent of quota, revenue closed and rank on the team are the first numbers sales managers look for." },
      { t: "Give your numbers context", d: "Say the deal size, sales cycle and who you sold to — $1M in small-business deals and $1M in enterprise deals are very different jobs." },
      { t: "Name the CRM and methods", d: "Salesforce, HubSpot and methods like MEDDIC or SPIN Selling are common search terms." },
      { t: "Show how you build pipeline", d: "Hiring managers want to know you can find your own deals, not only close inbound leads." },
    ],
    faqs: [
      { q: "What if I missed quota some years?", a: "Show the strongest measurable results you have — rank on the team, year-over-year growth or specific wins — and be ready to explain the context in the interview." },
      { q: "Should I list sales awards?", a: "Yes, if they show consistent performance — President's Club or top-rep rankings — with the year and the size of the team." },
      { q: "How do I move into sales from another job?", a: "Lead with anything that involved targets, persuasion or customers — retail sales, fundraising, upsells in customer service — and quantify it." },
    ],
    related: ["marketing-manager", "customer-service-representative", "project-manager"],
  },
  {
    slug: "project-manager",
    role: "Project Manager",
    group: "Business",
    photo: photo("interview-panel", "Team meeting around a conference table"),
    level: "Mid-level · 8 years experience",
    intro: "A project manager resume that shows projects delivered on time and on budget — with the PMP, methodology and tool keywords recruiters search for.",
    resume: {
      name: "Kevin O'Brien",
      headline: "Project Manager, PMP",
      contact: "Minneapolis, MN · kevin.obrien@email.com · linkedin.com/in/kevinobrien",
      summary:
        "Project manager with 8 years delivering IT and operations projects in logistics and healthcare. I keep scope, budget and stakeholders aligned so projects land on time.",
      jobs: [
        {
          title: "Senior Project Manager",
          company: "Tailspin Logistics",
          dates: "Mar 2021 – Present",
          bullets: [
            "Manage a portfolio of 6 projects worth $4.8M; 5 delivered on or ahead of schedule",
            "Led a warehouse management system rollout across 9 sites, finishing 3 weeks early and 4% under budget",
            "Introduced a weekly RAID log and status report that cut late escalations by half",
            "Coordinate 30+ stakeholders across IT, operations, finance and two vendors",
          ],
        },
        {
          title: "Project Coordinator",
          company: "Lakeshore Health Partners",
          dates: "Aug 2017 – Feb 2021",
          bullets: [
            "Supported an EHR upgrade for 14 clinics, tracking 400+ tasks in Smartsheet",
            "Ran sprint ceremonies for a 7-person Agile team after earning the CSM certification",
          ],
        },
      ],
      education: "B.S. Business Administration, University of Minnesota, 2016 · PMP · Certified ScrumMaster (CSM)",
      skills: ["Project planning", "Scope management", "Budget management", "Risk management", "Stakeholder communication", "Agile / Scrum", "Waterfall", "MS Project", "Jira", "Smartsheet"],
    },
    whyItWorks:
      "It states the size of each project in money, sites or people, reports delivery against schedule and budget, and puts the PMP and methodologies in plain text where a parser can find them.",
    summaries: [
      { level: "Entry level", text: "Project coordinator with 2 years supporting IT projects. Tracked schedules and budgets for 5 concurrent projects and earned the CAPM certification." },
      { level: "Mid level", text: "PMP-certified project manager with 8 years in IT and operations. I led a 9-site system rollout that finished 3 weeks early and under budget." },
      { level: "Senior", text: "Program manager who has led $20M+ portfolios and a team of 5 project managers, setting PMO standards for planning, reporting and risk." },
    ],
    bullets: [
      { skill: "Delivery", weak: "Managed projects", strong: "Delivered a 9-site warehouse system rollout 3 weeks early and 4% under budget" },
      { skill: "Scale", weak: "Handled multiple projects", strong: "Managed 6 concurrent projects worth $4.8M; 5 delivered on or ahead of schedule" },
      { skill: "Risk", weak: "Tracked risks", strong: "Introduced a weekly RAID log that cut late escalations by half" },
      { skill: "Stakeholders", weak: "Worked with stakeholders", strong: "Aligned 30+ stakeholders across IT, operations, finance and 2 vendors on one plan" },
    ],
    keywords: [
      "Project management", "PMP", "Project planning", "Scope management", "Budget management", "Risk management", "Stakeholder management", "Agile",
      "Scrum", "Waterfall", "Change management", "Resource planning", "MS Project", "Jira", "Smartsheet", "Asana",
    ],
    tips: [
      { t: "Size every project", d: "Budget, team size, sites or users tell a recruiter the scale you can handle." },
      { t: "Report against the plan", d: "On time, early, under budget or recovered from a slip — show how delivery compared to the baseline." },
      { t: "Write certifications in full once", d: "Put \"Project Management Professional (PMP)\" once so both the acronym and the full name are matched." },
      { t: "Match the methodology", d: "If the post asks for Agile, Waterfall or hybrid, describe your work in that language where it's true." },
    ],
    faqs: [
      { q: "Do I need a PMP to get a project manager job?", a: "Not always, but many postings list it as preferred. CAPM or Scrum certifications can help earlier in your career." },
      { q: "How do I show project management experience without the title?", a: "Describe projects you led in any role — scope, team, timeline and result — using project terms like schedule, budget and risk." },
      { q: "Should I list every project?", a: "No. Pick 3–4 per role that show the biggest scope or the results closest to the job you want." },
    ],
    related: ["product-manager", "business-analyst", "administrative-assistant"],
  },
  {
    slug: "accountant",
    role: "Accountant",
    group: "Business",
    photo: photo("role-accountant", "Tax forms, receipts and a calculator on a desk"),
    level: "Mid-level · 5 years experience",
    intro: "An accountant resume that shows accurate, on-time closes and clean audits — with the CPA, GAAP and ERP keywords finance recruiters look for.",
    resume: {
      name: "Grace Sullivan",
      headline: "Senior Accountant, CPA",
      contact: "Dallas, TX · grace.sullivan@email.com · linkedin.com/in/gracesullivan",
      summary:
        "CPA with 5 years in corporate accounting for manufacturing and distribution companies. I run a fast, accurate month-end close and keep the books audit-ready.",
      jobs: [
        {
          title: "Senior Accountant",
          company: "Wingtip Manufacturing",
          dates: "Jan 2022 – Present",
          bullets: [
            "Lead month-end close for 3 entities with $180M in combined annual revenue",
            "Cut the close from 9 business days to 5 by standardizing reconciliations and journal entry templates",
            "Prepared schedules for the annual external audit, which closed with no material adjustments",
            "Reconcile 40+ balance sheet accounts monthly; traced and resolved a $250K intercompany variance",
          ],
        },
        {
          title: "Staff Accountant",
          company: "Bluebonnet Distribution",
          dates: "Aug 2019 – Dec 2021",
          bullets: [
            "Managed accounts payable for 600+ vendors and about $3M in monthly payments",
            "Prepared sales tax filings in 12 states with zero penalties",
          ],
        },
      ],
      education: "B.B.A. Accounting, University of Texas at Dallas, 2019 · Certified Public Accountant (CPA), Texas",
      skills: ["General ledger", "Month-end close", "Account reconciliation", "Journal entries", "GAAP", "Financial statements", "Audit preparation", "NetSuite", "Excel (pivot tables, XLOOKUP)", "Accounts payable"],
    },
    whyItWorks:
      "It shows the scale of the books you keep, measures the close in days, points to clean audit results and spells out the CPA, GAAP and ERP terms screening tools look for.",
    summaries: [
      { level: "Entry level", text: "Accounting graduate with a tax-season internship and the credit hours for CPA eligibility. Prepared 60+ individual returns and reconciled client accounts in QuickBooks." },
      { level: "Mid level", text: "CPA with 5 years in corporate accounting. I lead the close for 3 entities and cut it from 9 business days to 5." },
      { level: "Senior", text: "Accounting manager who has led a team of 6, owned consolidated reporting for a $500M company and managed external audits and an ERP migration." },
    ],
    bullets: [
      { skill: "Close", weak: "Did month-end close", strong: "Cut month-end close from 9 business days to 5 by standardizing reconciliations" },
      { skill: "Audit", weak: "Helped with audits", strong: "Prepared schedules for an external audit that closed with no material adjustments" },
      { skill: "Reconciliation", weak: "Reconciled accounts", strong: "Reconciled 40+ balance sheet accounts monthly and resolved a $250K intercompany variance" },
      { skill: "Compliance", weak: "Handled sales tax", strong: "Prepared sales tax filings in 12 states with zero penalties" },
    ],
    keywords: [
      "CPA", "GAAP", "General ledger", "Month-end close", "Account reconciliation", "Journal entries", "Financial statements", "Accounts payable",
      "Accounts receivable", "Audit", "Accruals", "Sales tax", "NetSuite", "QuickBooks", "SAP", "Excel",
    ],
    tips: [
      { t: "Put your CPA status up front", d: "Add \"CPA\" to your headline, or write \"CPA candidate — 2 of 4 exams passed\" if you're on the way." },
      { t: "Measure the close", d: "Days to close, entities covered and accounts reconciled show your speed and scope." },
      { t: "List the ERP and software", d: "NetSuite, SAP, Oracle, QuickBooks and Excel skills like pivot tables are common screening terms." },
      { t: "Describe audit results carefully", d: "\"No material adjustments\" or \"no findings\" is strong — but only if it's accurate and not confidential." },
    ],
    faqs: [
      { q: "Should I list CPA exam progress?", a: "Yes. Show which sections you've passed and when you expect to finish — many employers hire candidates partway through." },
      { q: "How is an accountant resume different from a financial analyst resume?", a: "Accountant resumes focus on accuracy, the close, reconciliations and compliance. Financial analyst resumes focus on forecasting, modeling and planning." },
      { q: "Do I need public accounting experience?", a: "Not for most corporate roles. Show the size and complexity of the books you've handled and the systems you've used." },
    ],
    related: ["financial-analyst", "business-analyst", "administrative-assistant"],
  },
  {
    slug: "data-scientist",
    role: "Data Scientist",
    group: "Tech & product",
    photo: photo("role-data-scientist", "Two data scientists reviewing code on a monitor"),
    level: "Mid-level · 5 years experience",
    intro: "A data scientist resume that ties models to business results — with the machine learning, statistics and tooling keywords hiring teams filter on.",
    resume: {
      name: "Arjun Mehta",
      headline: "Data Scientist",
      contact: "San Francisco, CA · arjun.mehta@email.com · github.com/amehta",
      summary:
        "Data scientist with 5 years in e-commerce and fintech. I build and ship models for ranking, fraud and forecasting — and measure whether they move the business.",
      jobs: [
        {
          title: "Data Scientist",
          company: "Litware Marketplace",
          dates: "Mar 2022 – Present",
          bullets: [
            "Built a gradient-boosted ranking model for recommendations that lifted click-through by 8% in an A/B test",
            "Design and analyze 20+ experiments a year using a shared Python framework for power analysis",
            "Deployed batch and real-time models with MLflow and Docker, with automated drift monitoring",
            "Cut weekly model retraining from 6 hours to 40 minutes by moving feature pipelines to Spark",
          ],
        },
        {
          title: "Junior Data Scientist",
          company: "Pennant Pay",
          dates: "Jul 2020 – Feb 2022",
          bullets: [
            "Built a fraud model that caught 23% more fraudulent transactions at the same false-positive rate",
            "Wrote SQL and Python pipelines feeding 15 production dashboards",
          ],
        },
      ],
      education: "M.S. Statistics, University of California, Berkeley, 2020",
      skills: ["Python", "SQL", "scikit-learn", "XGBoost", "PyTorch", "Spark", "A/B testing", "Causal inference", "MLflow", "AWS SageMaker"],
    },
    whyItWorks:
      "Each bullet names the model or method and the business metric it moved, experiments are described with real rigor, and the tools appear exactly as data science job posts write them.",
    summaries: [
      { level: "Entry level", text: "Statistics graduate with an M.S. and a capstone forecasting hospital admissions. Skilled in Python, SQL and scikit-learn, with two end-to-end modeling projects on GitHub." },
      { level: "Mid level", text: "Data scientist with 5 years in e-commerce and fintech. My ranking and fraud models lifted click-through by 8% and caught 23% more fraud." },
      { level: "Senior", text: "Senior data scientist who has led a team of 4 and set modeling and experimentation standards for a marketplace with millions of monthly users." },
    ],
    bullets: [
      { skill: "Modeling", weak: "Built machine learning models", strong: "Built a ranking model that lifted recommendation click-through by 8% in an A/B test" },
      { skill: "Experiments", weak: "Ran A/B tests", strong: "Designed and analyzed 20+ experiments a year with a shared power-analysis framework" },
      { skill: "Production", weak: "Deployed models", strong: "Deployed batch and real-time models with MLflow and Docker, with automated drift alerts" },
      { skill: "Efficiency", weak: "Improved data pipelines", strong: "Cut model retraining from 6 hours to 40 minutes by moving feature pipelines to Spark" },
    ],
    keywords: [
      "Python", "R", "SQL", "Machine learning", "Statistics", "scikit-learn", "TensorFlow", "PyTorch", "XGBoost", "A/B testing",
      "Causal inference", "Feature engineering", "Deep learning", "NLP", "Spark", "MLflow", "AWS",
    ],
    tips: [
      { t: "Lead with impact, then method", d: "\"Lifted click-through by 8% with a ranking model\" reads better than a list of algorithms." },
      { t: "Show models in production", d: "Deployment, monitoring and retraining set you apart from purely exploratory work." },
      { t: "Match the flavor of the role", d: "Some posts are analytics-heavy, others are closer to ML engineering — mirror the mix of statistics, SQL and engineering they ask for." },
      { t: "Write links as text", d: "GitHub, Kaggle or a blog belong in the contact line as plain URLs, with the results described on the resume itself." },
    ],
    faqs: [
      { q: "How is a data scientist resume different from a data analyst resume?", a: "Data analyst resumes center on SQL, BI and reporting. Data scientist resumes add modeling, experimentation and getting models into production." },
      { q: "Do I need a master's or PhD?", a: "Many roles prefer one, but strong results with models in production can matter as much. Put education first only if it's your strongest point." },
      { q: "Should I list every library I've used?", a: "No. List the ones you'd be comfortable discussing in depth, led by those in the job post." },
    ],
    related: ["data-analyst", "software-engineer", "business-analyst"],
  },
  {
    slug: "business-analyst",
    role: "Business Analyst",
    group: "Business",
    photo: photo("role-business-analyst", "Laptop showing an analytics dashboard"),
    level: "Mid-level · 6 years experience",
    intro: "A business analyst resume that shows the processes you improved and the requirements you delivered — with the analysis, modeling and tool keywords recruiters search for.",
    resume: {
      name: "Natalie Ward",
      headline: "Senior Business Analyst",
      contact: "Boston, MA · natalie.ward@email.com · linkedin.com/in/natalieward",
      summary:
        "Business analyst with 6 years in insurance and financial services. I turn messy business problems into clear requirements and processes that teams can build and run.",
      jobs: [
        {
          title: "Senior Business Analyst",
          company: "Woodgrove Insurance",
          dates: "Apr 2022 – Present",
          bullets: [
            "Gathered and documented requirements for a claims system replacement used by 350 adjusters",
            "Mapped claims intake and removed 4 manual hand-offs, cutting average intake time from 3 days to 1",
            "Wrote 180+ user stories with acceptance criteria and ran UAT with 25 business testers",
            "Built a Power BI claims backlog dashboard that leadership reviews every week",
          ],
        },
        {
          title: "Business Analyst",
          company: "Harborline Credit Union",
          dates: "Jun 2019 – Mar 2022",
          bullets: [
            "Documented current- and future-state loan origination processes across 12 branches",
            "Analyzed member complaint data in SQL, leading to a policy fix that cut complaints by 18%",
          ],
        },
      ],
      education: "B.S. Information Systems, Boston University, 2019 · CBAP",
      skills: ["Requirements gathering", "Process mapping", "User stories", "UAT", "Stakeholder interviews", "Gap analysis", "SQL", "Power BI", "Visio", "Jira"],
    },
    whyItWorks:
      "It shows what each analysis changed — time saved, complaints cut, systems delivered — and uses the requirements, process and testing terms that business analyst job posts list.",
    summaries: [
      { level: "Entry level", text: "Information systems graduate with a business analysis internship. Documented 15 processes for an operations team and wrote the requirements for a new intake form." },
      { level: "Mid level", text: "Business analyst with 6 years in insurance and financial services. My process redesign cut claims intake time from 3 days to 1." },
      { level: "Senior", text: "Lead business analyst who has guided requirements for $10M+ system programs, coached 4 analysts and set BA standards for a 200-person IT department." },
    ],
    bullets: [
      { skill: "Process", weak: "Improved processes", strong: "Removed 4 manual hand-offs from claims intake, cutting average intake time from 3 days to 1" },
      { skill: "Requirements", weak: "Wrote requirements", strong: "Wrote 180+ user stories with acceptance criteria for a system used by 350 adjusters" },
      { skill: "Testing", weak: "Helped with testing", strong: "Planned and ran UAT with 25 business testers, closing 96% of defects before launch" },
      { skill: "Analysis", weak: "Analyzed data", strong: "Analyzed complaint data in SQL, leading to a policy fix that cut complaints by 18%" },
    ],
    keywords: [
      "Business analysis", "Requirements gathering", "Business requirements document (BRD)", "User stories", "Acceptance criteria", "Process mapping",
      "BPMN", "Gap analysis", "UAT", "Stakeholder management", "SQL", "Power BI", "Tableau", "Visio", "Jira", "Agile", "CBAP",
    ],
    tips: [
      { t: "Show what changed", d: "Time saved, errors reduced or systems delivered show that your analysis led somewhere." },
      { t: "Name your deliverables", d: "BRDs, user stories, process maps and use cases tell a hiring manager how you work." },
      { t: "Match the type of BA role", d: "IT business analyst posts stress requirements and UAT; data-focused posts stress SQL and dashboards — lead with what they ask for." },
      { t: "Put your industry in the summary", d: "Domain knowledge like insurance, banking or healthcare is a strong filter for BA roles." },
    ],
    faqs: [
      { q: "How is a business analyst resume different from a data analyst resume?", a: "A business analyst resume centers on requirements, processes and stakeholders. A data analyst resume centers on queries, dashboards and statistics. Many roles mix both." },
      { q: "Is CBAP worth listing?", a: "Yes, if you have it. ECBA or CCBA help earlier in your career, and Agile or product certifications can also be relevant." },
      { q: "How do I move into business analysis?", a: "Highlight times you documented a process, gathered needs from users or helped test a new system — in any role." },
    ],
    related: ["data-analyst", "project-manager", "product-manager"],
  },
  {
    slug: "administrative-assistant",
    role: "Administrative Assistant",
    group: "People & service",
    photo: photo("role-admin-assistant", "Two colleagues meeting at a desk with a laptop"),
    level: "Experienced · 6 years",
    intro: "An administrative assistant resume that proves you keep offices and executives running smoothly — with the software and organization keywords employers screen for.",
    resume: {
      name: "Jasmine Ortiz",
      headline: "Executive Administrative Assistant",
      contact: "San Diego, CA · jasmine.ortiz@email.com · (619) 555-0129",
      summary:
        "Administrative assistant with 6 years supporting executives and busy office teams. I manage calendars, travel and records so leaders can focus on their work.",
      jobs: [
        {
          title: "Executive Administrative Assistant",
          company: "Adventure Works Engineering",
          dates: "Feb 2021 – Present",
          bullets: [
            "Support the COO and 2 vice presidents, managing calendars with 40+ meetings a week",
            "Coordinate domestic and international travel for 15 staff, keeping every trip within policy",
            "Organized a quarterly leadership offsite for 60 people, delivered 8% under budget",
            "Moved paper filing to SharePoint, cutting the time the team spent finding documents by about half",
          ],
        },
        {
          title: "Office Assistant",
          company: "Coastal Smiles Dental Group",
          dates: "Jun 2018 – Jan 2021",
          bullets: [
            "Greeted 50+ patients a day, scheduled appointments and answered a multi-line phone system",
            "Consolidated office supply orders and cut monthly supply spend by 12%",
          ],
        },
      ],
      education: "Associate of Arts, Business Administration, San Diego City College, 2018 · Microsoft Office Specialist (Excel)",
      skills: ["Calendar management", "Travel coordination", "Microsoft 365", "Outlook", "Excel", "SharePoint", "Event planning", "Meeting minutes", "Expense reports", "Typing 75 WPM"],
    },
    whyItWorks:
      "It shows who and how many people you support, measures organization in time and money saved, and names the office software employers ask about.",
    summaries: [
      { level: "Entry level", text: "Organized, detail-focused receptionist moving into an administrative role. Managed a front desk with 50+ visitors a day and kept appointment calendars for 6 providers accurate." },
      { level: "Experienced", text: "Administrative assistant with 6 years supporting executives. I manage calendars with 40+ meetings a week and coordinate travel for a team of 15." },
      { level: "Executive assistant", text: "Executive assistant with 10 years supporting C-suite leaders, managing board meeting logistics, confidential communications and a team of 3 administrative staff." },
    ],
    bullets: [
      { skill: "Scheduling", weak: "Managed calendars", strong: "Managed calendars for the COO and 2 VPs, coordinating 40+ meetings a week across time zones" },
      { skill: "Events", weak: "Planned events", strong: "Organized a 60-person leadership offsite, delivered 8% under budget" },
      { skill: "Organization", weak: "Organized files", strong: "Moved paper filing to SharePoint, cutting the time the team spent finding documents by about half" },
      { skill: "Cost", weak: "Ordered supplies", strong: "Consolidated office supply orders and cut monthly supply spend by 12%" },
    ],
    keywords: [
      "Administrative support", "Calendar management", "Scheduling", "Travel arrangements", "Microsoft Office", "Microsoft 365", "Outlook", "Excel", "Word",
      "PowerPoint", "Google Workspace", "Data entry", "Expense reports", "Meeting minutes", "Office management", "Event planning", "Confidentiality",
    ],
    tips: [
      { t: "Say who you support", d: "\"COO and 2 VPs\" or \"a 25-person sales team\" tells employers your level right away." },
      { t: "Name the software", d: "Microsoft 365, Google Workspace, SharePoint, Concur and Zoom are common screening terms." },
      { t: "Turn tasks into results", d: "Time saved, budgets met and errors avoided show how well you run things, not just what you did." },
      { t: "Show discretion", d: "Mention confidential work in general terms — board materials, HR files — without sharing any details." },
    ],
    faqs: [
      { q: "What skills should an administrative assistant list?", a: "Calendar and travel management, office software, communication and organization, plus any specialty like bookkeeping, HR support or a second language." },
      { q: "Should I include typing speed?", a: "Yes if it's strong — around 60 WPM or higher — especially for roles with heavy data entry or transcription." },
      { q: "How do I move up to an executive assistant role?", a: "Show the seniority of the people you support, the confidential work you handle and the projects you run on their behalf." },
    ],
    related: ["customer-service-representative", "hr-generalist", "project-manager"],
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
