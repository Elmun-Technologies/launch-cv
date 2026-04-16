export type CompanyRequirement = {
  id: string;
  name: string;
  logo: string;
  industry: string;
  tier: "faang" | "tech" | "finance" | "consulting" | "startup";
  keywords: string[];
  culture: string[];
  formatTips: string[];
  mustHave: string[];
  avoid: string[];
  exampleBullet: string;
};

export const COMPANIES: CompanyRequirement[] = [
  // ── FAANG+ ──
  { id: "google", name: "Google", logo: "G", industry: "Technology", tier: "faang",
    keywords: ["distributed systems", "scalability", "data structures", "algorithms", "machine learning", "cloud", "API design", "code review", "testing", "agile"],
    culture: ["Innovation-driven", "Data-informed decisions", "20% projects", "Flat hierarchy", "Psychological safety"],
    formatTips: ["Keep to 1 page unless 10+ years", "Use XYZ formula: Accomplished X by doing Y, resulting in Z", "Quantify everything"],
    mustHave: ["Education section", "Technical skills list", "Impact metrics in bullets", "Links to projects/GitHub"],
    avoid: ["Objective statements", "Generic soft skills", "Unquantified achievements", "More than 2 pages"],
    exampleBullet: "Reduced API latency by 40% by redesigning the caching layer, serving 2M+ daily requests with 99.99% uptime" },

  { id: "apple", name: "Apple", logo: "A", industry: "Technology", tier: "faang",
    keywords: ["user experience", "privacy", "performance optimization", "iOS", "macOS", "Swift", "hardware-software integration", "design thinking", "attention to detail"],
    culture: ["Secrecy & focus", "Design excellence", "Cross-functional collaboration", "Perfectionism"],
    formatTips: ["Clean, minimal design", "Focus on product impact", "Highlight design sensibility even in engineering roles"],
    mustHave: ["Product impact stories", "Technical depth", "Collaboration examples"],
    avoid: ["Flashy resume designs", "Buzzword stuffing", "Vague descriptions"],
    exampleBullet: "Led privacy-preserving ML pipeline for on-device photo classification, processing 10K images/sec with zero cloud dependency" },

  { id: "meta", name: "Meta", logo: "M", industry: "Technology", tier: "faang",
    keywords: ["move fast", "social impact", "React", "GraphQL", "infrastructure", "scale", "A/B testing", "growth", "engagement metrics", "open source"],
    culture: ["Move fast", "Be bold", "Focus on impact", "Build social value", "Be open"],
    formatTips: ["Emphasize scale and speed", "Show growth metrics", "Mention open-source contributions"],
    mustHave: ["Scale numbers (users, requests)", "Speed of delivery", "Cross-team collaboration"],
    avoid: ["Slow/waterfall methodology references", "Individual-only achievements"],
    exampleBullet: "Shipped React component library used by 500+ engineers, reducing UI development time by 35% across 12 product teams" },

  { id: "amazon", name: "Amazon", logo: "Am", industry: "Technology", tier: "faang",
    keywords: ["leadership principles", "customer obsession", "ownership", "bias for action", "frugality", "earn trust", "dive deep", "deliver results", "AWS", "microservices"],
    culture: ["14 Leadership Principles", "Customer obsession", "Day 1 mentality", "Two-pizza teams", "Write narratives not slides"],
    formatTips: ["Align bullets with Leadership Principles", "STAR format strongly preferred", "Quantify customer impact"],
    mustHave: ["Leadership Principles alignment", "Customer impact metrics", "Ownership examples", "STAR formatted bullets"],
    avoid: ["Team-only credit without personal contribution", "Vague impact", "No metrics"],
    exampleBullet: "Owned end-to-end migration of payment service to microservices (Ownership), reducing checkout failures by 23% and saving $2.1M annually (Deliver Results)" },

  { id: "netflix", name: "Netflix", logo: "N", industry: "Entertainment", tier: "faang",
    keywords: ["freedom and responsibility", "context not control", "highly aligned", "loosely coupled", "innovation", "streaming", "content delivery", "personalization", "A/B testing"],
    culture: ["Freedom & Responsibility", "High performance", "Candor", "Context not control", "Keeper test"],
    formatTips: ["Show independent decision-making", "Highlight high-impact individual contributions", "Demonstrate learning agility"],
    mustHave: ["Independent ownership", "High-impact results", "Innovation examples"],
    avoid: ["Micromanagement examples", "Process-heavy descriptions", "Low-impact tasks"],
    exampleBullet: "Independently designed and launched recommendation algorithm improvement, increasing member engagement by 8% across 230M accounts" },

  { id: "microsoft", name: "Microsoft", logo: "Ms", industry: "Technology", tier: "faang",
    keywords: ["growth mindset", "Azure", "cloud", "enterprise", "AI", "accessibility", "inclusion", "platform", "developer tools", ".NET"],
    culture: ["Growth mindset", "Diversity & inclusion", "One Microsoft", "Customer success", "AI-first"],
    formatTips: ["Show growth and learning", "Emphasize enterprise scale", "Include accessibility awareness"],
    mustHave: ["Growth examples", "Enterprise-scale impact", "Collaboration across teams"],
    avoid: ["Fixed mindset language", "Only consumer product focus"],
    exampleBullet: "Migrated 3 legacy services to Azure microservices, improving deployment frequency from monthly to daily while reducing infrastructure costs by 30%" },

  { id: "openai", name: "OpenAI", logo: "OA", industry: "AI Research", tier: "faang",
    keywords: ["AI safety", "large language models", "alignment", "research", "Python", "PyTorch", "distributed training", "RLHF", "scaling laws", "API design"],
    culture: ["Safety-first", "Research excellence", "Democratize AI", "Move thoughtfully"],
    formatTips: ["Highlight research publications", "Show ML engineering depth", "Demonstrate safety awareness"],
    mustHave: ["ML/AI expertise", "Publications or research", "Safety consideration"],
    avoid: ["Overpromising AI capabilities", "Ignoring safety concerns"],
    exampleBullet: "Developed RLHF training pipeline that improved model helpfulness scores by 15% while maintaining safety alignment metrics above 98%" },

  { id: "stripe", name: "Stripe", logo: "St", industry: "Fintech", tier: "faang",
    keywords: ["payments", "API design", "developer experience", "reliability", "financial infrastructure", "Ruby", "TypeScript", "distributed systems", "compliance"],
    culture: ["Users first", "Move with urgency", "Meticulous craft", "Global thinking"],
    formatTips: ["Show API/developer tool experience", "Emphasize reliability and uptime", "Financial domain knowledge helps"],
    mustHave: ["System reliability metrics", "API design experience", "Payment/fintech knowledge"],
    avoid: ["Ignoring compliance/security", "Consumer-only focus"],
    exampleBullet: "Designed idempotent payment processing API handling $2B+ monthly volume with 99.999% uptime and PCI DSS Level 1 compliance" },

  // ── FINANCE ──
  { id: "goldman", name: "Goldman Sachs", logo: "GS", industry: "Investment Banking", tier: "finance",
    keywords: ["financial modeling", "risk management", "trading", "derivatives", "Python", "quantitative analysis", "Bloomberg", "Excel", "VBA", "compliance"],
    culture: ["Client service", "Excellence", "Integrity", "Partnership"],
    formatTips: ["Conservative format", "Reverse chronological strictly", "GPA if above 3.5", "Include relevant certifications"],
    mustHave: ["GPA (if strong)", "Financial certifications (CFA, FRM)", "Quantitative skills", "Deal experience"],
    avoid: ["Casual language", "Creative resume formats", "Gaps without explanation"],
    exampleBullet: "Executed 15+ M&A transactions totaling $8.2B in deal value, leading financial modeling and due diligence for cross-border acquisitions" },

  { id: "jpmorgan", name: "JPMorgan Chase", logo: "JP", industry: "Banking", tier: "finance",
    keywords: ["risk management", "regulatory compliance", "Java", "Python", "cloud migration", "digital transformation", "blockchain", "payment systems"],
    culture: ["First-class business", "Exceptional people", "Fortress balance sheet"],
    formatTips: ["Formal tone", "Include regulatory knowledge", "Highlight digital transformation work"],
    mustHave: ["Compliance awareness", "Technical + business blend", "Scale metrics"],
    avoid: ["Startup-casual tone", "Ignoring regulatory context"],
    exampleBullet: "Led cloud migration of trade settlement system processing $500M daily, achieving 40% cost reduction while maintaining SOX compliance" },

  { id: "morgan-stanley", name: "Morgan Stanley", logo: "MS", industry: "Investment Banking", tier: "finance",
    keywords: ["wealth management", "equity research", "fixed income", "derivatives", "risk", "Python", "SQL", "financial analysis"],
    culture: ["Doing first-class business", "Client focus", "Innovation in finance"],
    formatTips: ["Traditional format", "Emphasize analytical rigor", "Include relevant licenses"],
    mustHave: ["Analytical achievements", "Client-facing experience", "Financial modeling"],
    avoid: ["Informal tone", "Non-traditional format"],
    exampleBullet: "Managed $150M equity portfolio, outperforming benchmark by 320bps through proprietary quantitative screening model" },

  { id: "blackrock", name: "BlackRock", logo: "BR", industry: "Asset Management", tier: "finance",
    keywords: ["Aladdin", "portfolio management", "risk analytics", "ESG", "ETF", "quantitative", "Python", "data science"],
    culture: ["Fiduciary mindset", "Innovation", "One BlackRock", "Sustainability"],
    formatTips: ["Highlight risk management", "Show data-driven decision making", "ESG awareness"],
    mustHave: ["Risk analytics", "Portfolio metrics", "Technology skills"],
    avoid: ["Ignoring fiduciary duty", "Pure tech without finance context"],
    exampleBullet: "Built risk attribution model for $50B fixed income portfolio on Aladdin platform, enabling real-time factor decomposition for 200+ funds" },

  { id: "citadel", name: "Citadel", logo: "Ci", industry: "Hedge Fund", tier: "finance",
    keywords: ["quantitative trading", "low latency", "C++", "Python", "statistics", "market microstructure", "alpha generation", "backtesting"],
    culture: ["Intellectual rigor", "Meritocracy", "Urgency", "Excellence"],
    formatTips: ["Focus on quantitative achievements", "Show competitive programming", "Include publications"],
    mustHave: ["Quantitative skills", "Programming proficiency", "Research methodology"],
    avoid: ["Qualitative-only descriptions", "Lack of technical depth"],
    exampleBullet: "Developed statistical arbitrage strategy generating 18% annual alpha with Sharpe ratio >2.5, deployed on low-latency C++ execution framework" },

  { id: "two-sigma", name: "Two Sigma", logo: "2S", industry: "Quantitative Finance", tier: "finance",
    keywords: ["machine learning", "distributed computing", "Python", "Spark", "time series", "signal processing", "research"],
    culture: ["Scientific method", "Innovation", "Collaboration", "Intellectual curiosity"],
    formatTips: ["Emphasize research and publications", "Show ML/data science depth", "Academic tone acceptable"],
    mustHave: ["Research experience", "ML/statistics skills", "Large-scale data processing"],
    avoid: ["Pure software without quantitative context", "Vague methodology"],
    exampleBullet: "Engineered feature pipeline processing 50TB daily market data using Spark, discovering 3 novel alpha signals with combined IC >0.05" },

  // ── CONSULTING ──
  { id: "mckinsey", name: "McKinsey", logo: "Mc", industry: "Management Consulting", tier: "consulting",
    keywords: ["problem solving", "structured thinking", "client impact", "transformation", "strategy", "operations", "analytics", "stakeholder management"],
    culture: ["Client impact", "Obligation to dissent", "One firm", "Develop people"],
    formatTips: ["Action-impact format", "Quantify client outcomes", "Show leadership progression", "1 page strictly"],
    mustHave: ["Client impact with numbers", "Leadership examples", "Problem-solving methodology"],
    avoid: ["Internal-only achievements", "Process without outcome", "More than 1 page"],
    exampleBullet: "Led 6-person team on $200M cost transformation program for Fortune 100 retailer, identifying $45M in savings through supply chain optimization" },

  { id: "bcg", name: "BCG", logo: "BC", industry: "Management Consulting", tier: "consulting",
    keywords: ["digital transformation", "strategy", "innovation", "BCG X", "analytics", "change management", "growth strategy"],
    culture: ["Grow by growing others", "Deliver impact", "Intellectual curiosity"],
    formatTips: ["Results-oriented bullets", "Show analytical rigor", "Highlight team leadership"],
    mustHave: ["Impact metrics", "Team leadership", "Strategic thinking examples"],
    avoid: ["Tactical-only work", "No leadership examples"],
    exampleBullet: "Designed digital go-to-market strategy for healthcare client, launching 3 digital products that generated $25M in new revenue within 12 months" },

  { id: "bain", name: "Bain & Company", logo: "Ba", industry: "Management Consulting", tier: "consulting",
    keywords: ["private equity", "due diligence", "performance improvement", "customer strategy", "results delivery", "NPS"],
    culture: ["Results not reports", "True north", "Bainie spirit", "One team"],
    formatTips: ["Focus on tangible results", "PE due diligence experience valued", "Show collaborative achievements"],
    mustHave: ["Measurable results", "PE/investment context", "Teamwork"],
    avoid: ["Report-focused descriptions", "Solo achievements only"],
    exampleBullet: "Conducted commercial due diligence for $3B PE acquisition, identifying 15% revenue upside through pricing optimization and market expansion" },

  { id: "deloitte", name: "Deloitte", logo: "De", industry: "Professional Services", tier: "consulting",
    keywords: ["audit", "tax", "advisory", "technology consulting", "SAP", "cloud", "cybersecurity", "risk", "compliance"],
    culture: ["Purpose-driven", "Inclusion", "Collaboration", "Integrity"],
    formatTips: ["Show breadth across service lines", "Include certifications", "Regulatory awareness"],
    mustHave: ["Professional certifications", "Client engagement metrics", "Technical + advisory blend"],
    avoid: ["Narrow technical-only focus", "Ignoring client relationship"],
    exampleBullet: "Led SAP S/4HANA migration for $5B manufacturing client across 12 countries, completing 3 months ahead of schedule with 99.5% data accuracy" },

  { id: "accenture", name: "Accenture", logo: "Ac", industry: "Technology Consulting", tier: "consulting",
    keywords: ["digital transformation", "cloud", "AI", "automation", "change management", "agile", "DevOps", "Salesforce", "ServiceNow"],
    culture: ["Client value creation", "One global network", "Innovation", "Integrity"],
    formatTips: ["Emphasize technology implementation", "Show transformation outcomes", "Large program management"],
    mustHave: ["Technology platform experience", "Program scale metrics", "Client outcomes"],
    avoid: ["Small-scale projects only", "No technology context"],
    exampleBullet: "Managed $15M digital transformation program for insurance client, implementing AI-powered claims processing that reduced cycle time by 60%" },

  // ── TECH ──
  { id: "uber", name: "Uber", logo: "Ub", industry: "Mobility", tier: "tech",
    keywords: ["marketplace", "real-time systems", "Go", "Java", "microservices", "geospatial", "pricing", "matching algorithms", "scale"],
    culture: ["Great minds don't think alike", "Make big bets", "Build with heart"],
    formatTips: ["Show real-time system experience", "Marketplace/platform thinking", "Scale metrics"],
    mustHave: ["Real-time processing", "Scale experience", "Platform thinking"],
    avoid: ["Batch-only processing", "Small-scale examples"],
    exampleBullet: "Optimized ride matching algorithm reducing average wait time by 18% across 10M daily trips in 60+ countries" },

  { id: "airbnb", name: "Airbnb", logo: "Ab", industry: "Travel Tech", tier: "tech",
    keywords: ["marketplace", "trust & safety", "search ranking", "React", "Ruby", "payments", "localization", "community"],
    culture: ["Belong anywhere", "Host mentality", "Champion the mission", "Embrace the adventure"],
    formatTips: ["Show community/platform impact", "Trust and safety awareness", "International experience valued"],
    mustHave: ["Platform/marketplace experience", "Community impact", "Trust systems"],
    avoid: ["B2B-only examples", "Ignoring user safety"],
    exampleBullet: "Designed trust scoring system for 7M+ listings, reducing fraudulent bookings by 45% while maintaining host conversion rates" },

  { id: "spotify", name: "Spotify", logo: "Sp", industry: "Music Tech", tier: "tech",
    keywords: ["recommendation systems", "audio", "machine learning", "Java", "Python", "microservices", "A/B testing", "personalization", "content delivery"],
    culture: ["Band mentality", "Think it, build it, ship it", "Autonomous squads"],
    formatTips: ["Show personalization/recommendation experience", "Autonomous team contributions", "Creative problem solving"],
    mustHave: ["ML/recommendation experience", "Autonomous delivery", "Creative solutions"],
    avoid: ["Waterfall/hierarchical examples", "No personalization context"],
    exampleBullet: "Built collaborative filtering model for podcast recommendations, increasing discovery listens by 25% across 500M+ monthly active users" },

  { id: "salesforce", name: "Salesforce", logo: "Sf", industry: "Enterprise SaaS", tier: "tech",
    keywords: ["CRM", "Apex", "Lightning", "platform", "enterprise", "trust", "multi-tenant", "API", "integration"],
    culture: ["Trust", "Customer success", "Innovation", "Equality", "Sustainability"],
    formatTips: ["Enterprise platform experience", "Show multi-tenant architecture knowledge", "Customer success metrics"],
    mustHave: ["Enterprise scale", "Platform/SaaS experience", "Customer success examples"],
    avoid: ["Consumer-only focus", "Ignoring enterprise complexity"],
    exampleBullet: "Architected multi-tenant data isolation framework for 150K+ enterprise customers, achieving SOC2 compliance with zero data leakage incidents" },

  { id: "adobe", name: "Adobe", logo: "Ad", industry: "Creative Tech", tier: "tech",
    keywords: ["creative tools", "cloud", "AI", "content management", "experience platform", "JavaScript", "React", "design systems"],
    culture: ["Create the future", "Own the outcome", "Raise the bar", "Be genuine"],
    formatTips: ["Show creative + technical blend", "Platform experience", "Design system contributions"],
    mustHave: ["Creative technology experience", "Platform thinking", "User experience focus"],
    avoid: ["Pure backend without user context", "Ignoring creative workflows"],
    exampleBullet: "Led development of AI-powered content generation feature in Creative Cloud, reducing design iteration time by 40% for 25M+ creative professionals" },

  { id: "databricks", name: "Databricks", logo: "Db", industry: "Data & AI", tier: "tech",
    keywords: ["Spark", "Delta Lake", "MLflow", "data engineering", "lakehouse", "Python", "Scala", "distributed computing", "SQL"],
    culture: ["Customer-obsessed", "Ownership", "Open source", "Data-driven"],
    formatTips: ["Show data engineering at scale", "Open source contributions valued", "Distributed systems experience"],
    mustHave: ["Large-scale data processing", "Distributed systems", "Open source"],
    avoid: ["Small data examples", "No distributed context"],
    exampleBullet: "Optimized Delta Lake compaction pipeline processing 50PB data lake, reducing query latency by 70% for 5,000+ enterprise analytics teams" },

  { id: "figma", name: "Figma", logo: "Fi", industry: "Design Tools", tier: "tech",
    keywords: ["real-time collaboration", "WebGL", "WASM", "TypeScript", "design tools", "multiplayer", "performance", "canvas rendering"],
    culture: ["Make design accessible", "Craft matters", "Play as a team"],
    formatTips: ["Show real-time systems experience", "Performance optimization", "Design tool knowledge"],
    mustHave: ["Real-time/collaborative systems", "Performance optimization", "Creative tooling"],
    avoid: ["No performance context", "Ignoring user creativity"],
    exampleBullet: "Implemented CRDT-based real-time collaboration engine supporting 100+ concurrent editors per document with <50ms sync latency" },

  { id: "snowflake", name: "Snowflake", logo: "Sn", industry: "Cloud Data", tier: "tech",
    keywords: ["cloud data warehouse", "SQL", "distributed query engine", "multi-cloud", "data sharing", "performance", "Go", "Java"],
    culture: ["Put customers first", "Integrity always", "Think big", "Be excellent"],
    formatTips: ["Show database/query engine experience", "Cloud-native architecture", "Performance optimization"],
    mustHave: ["Database internals knowledge", "Cloud architecture", "Performance metrics"],
    avoid: ["No database context", "Single-cloud only"],
    exampleBullet: "Designed adaptive query optimization engine reducing average query execution time by 55% across 8,000+ enterprise data warehouse customers" },

  // ── STARTUP STAGES ──
  { id: "yc-startup", name: "YC Startup (Seed)", logo: "YC", industry: "Startup", tier: "startup",
    keywords: ["full-stack", "MVP", "rapid iteration", "customer development", "product-market fit", "growth hacking", "wearing many hats"],
    culture: ["Move fast", "Talk to users", "Launch quickly", "Iterate"],
    formatTips: ["Show breadth of skills", "Highlight speed of execution", "Startup experience valued over big company"],
    mustHave: ["Full-stack capability", "Speed examples", "0-to-1 experience"],
    avoid: ["Only big-company experience", "Slow delivery examples"],
    exampleBullet: "Built and launched MVP in 3 weeks as sole engineer, acquiring first 500 users through direct outreach and iterating based on daily user feedback" },

  { id: "series-a", name: "Series A Startup", logo: "A", industry: "Startup", tier: "startup",
    keywords: ["product-market fit", "scaling", "hiring", "process building", "metrics-driven", "agile", "CI/CD"],
    culture: ["Scale what works", "Build the team", "Data-driven decisions"],
    formatTips: ["Show scaling experience", "Team building/hiring", "Process creation"],
    mustHave: ["Scaling from small to medium", "Hiring experience", "Process establishment"],
    avoid: ["Only maintenance work", "No growth context"],
    exampleBullet: "Scaled engineering team from 3 to 15 while growing platform from 1K to 50K users, establishing CI/CD pipeline and code review practices" },

  { id: "series-b", name: "Series B Startup", logo: "B", industry: "Startup", tier: "startup",
    keywords: ["growth", "unit economics", "platform", "infrastructure", "reliability", "hiring", "culture building"],
    culture: ["Sustainable growth", "Build to last", "Excellence in execution"],
    formatTips: ["Show growth metrics", "Infrastructure scaling", "Team culture contributions"],
    mustHave: ["Growth metrics", "Infrastructure experience", "Culture building"],
    avoid: ["Only early-stage chaos", "No structure examples"],
    exampleBullet: "Led platform reliability initiative reducing downtime from 99.5% to 99.99% uptime, supporting 10x revenue growth from $2M to $20M ARR" },

  { id: "growth-stage", name: "Growth Stage Startup", logo: "Gr", industry: "Startup", tier: "startup",
    keywords: ["enterprise sales", "international expansion", "compliance", "SOC2", "platform maturity", "developer experience"],
    culture: ["Scale responsibly", "Enterprise readiness", "Global thinking"],
    formatTips: ["Show enterprise readiness work", "International experience", "Compliance/security"],
    mustHave: ["Enterprise features", "Compliance work", "International expansion"],
    avoid: ["Only consumer focus", "No enterprise context"],
    exampleBullet: "Achieved SOC2 Type II certification and launched GDPR compliance framework, enabling expansion into 15 European markets and $50M enterprise pipeline" },

  { id: "pre-ipo", name: "Pre-IPO Company", logo: "IP", industry: "Startup", tier: "startup",
    keywords: ["SOX readiness", "financial controls", "scalable architecture", "documentation", "process maturity", "board reporting"],
    culture: ["IPO readiness", "Governance", "Predictable execution", "Transparency"],
    formatTips: ["Show governance and process maturity", "Financial controls experience", "Board-level reporting"],
    mustHave: ["Compliance/governance", "Process maturity", "Predictable delivery"],
    avoid: ["Cowboy coding", "No process examples"],
    exampleBullet: "Led SOX readiness program for engineering org, implementing automated audit trails and financial controls across 200+ microservices pre-IPO" },
];

export function getCompanyById(id: string): CompanyRequirement | undefined {
  return COMPANIES.find((c) => c.id === id);
}

export function getCompaniesByTier(tier: string): CompanyRequirement[] {
  return COMPANIES.filter((c) => c.tier === tier);
}

export function searchCompanies(query: string): CompanyRequirement[] {
  const q = query.toLowerCase();
  return COMPANIES.filter((c) =>
    c.name.toLowerCase().includes(q) ||
    c.industry.toLowerCase().includes(q) ||
    c.keywords.some((k) => k.toLowerCase().includes(q))
  );
}
