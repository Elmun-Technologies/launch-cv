/**
 * Data for /alternatives/jobscan.
 *
 * Every statement about Jobscan below is tied to a page on Jobscan's own site
 * (jobscan.co / app.jobscan.co) and was checked on JOBSCAN_CHECKED. Re-check
 * each source before changing a claim, and bump the date when you do. Where
 * Jobscan's own pages disagree (interview practice), the page says so.
 *
 * Prices: Jobscan's prices are deliberately NOT shown as numbers. Only show a
 * figure after reading it on their official plan page yourself on the day you
 * publish it; until then the table links to that page.
 *
 * LaunchCV facts come from the codebase: prices from PUBLIC_PLANS
 * (lib/monetization.ts), monthly limits from getSettings().planLimits, refund
 * terms from /legal/terms, free features from the /pricing FAQ, templates
 * from lib/resume-templates.ts, interview prep from /features/interview-prep.
 */

export const JOBSCAN_CHECKED = "2026-11-02";
export const JOBSCAN_CHECKED_LABEL = "November 2, 2026";

export type JobscanSourceId =
  | "free"
  | "scanner"
  | "atsTips"
  | "builder"
  | "optimize"
  | "premium"
  | "coverLetter"
  | "interview"
  | "interviewAccess"
  | "linkedin"
  | "tracker"
  | "cancel"
  | "plan";

export type JobscanSource = {
  id: JobscanSourceId;
  /** What we say about Jobscan, in our words. */
  claim: string;
  /** Jobscan page the claim was checked against. */
  url: string;
  /** Human label for the link. */
  page: string;
};

export const JOBSCAN_SOURCES: JobscanSource[] = [
  {
    id: "free",
    claim: "Jobscan's free plan includes 5 resume scans a month with a limited Match Report; Premium removes the scan limit and keeps unlimited scan history.",
    url: "https://www.jobscan.co/video-jobscan-premium",
    page: "Jobscan — What do you get with Jobscan Premium?",
  },
  {
    id: "scanner",
    claim: "Jobscan's resume scanner compares your resume with a job description you paste and gives a Match Rate based on formatting, keywords and relevance.",
    url: "https://www.jobscan.co/resume-scanner",
    page: "Jobscan — Free resume scanner",
  },
  {
    id: "atsTips",
    claim: "Jobscan's ATS Tips read the job's application link to identify the employer's ATS (such as Greenhouse, Taleo or Workday) and show formatting advice for it at the top of the Match Report.",
    url: "https://www.jobscan.co/blog/ats-tips-feature-students-job-search/",
    page: "Jobscan — How Jobscan's ATS Tips work",
  },
  {
    id: "builder",
    claim: "Jobscan's resume builder is free to use and download; its advanced AI writing tools are part of the paid plan.",
    url: "https://www.jobscan.co/resume-builder",
    page: "Jobscan — ATS resume builder",
  },
  {
    id: "optimize",
    claim: "Jobscan's AI Optimize (also called One-Click Optimize) suggests edits to tailor your resume to a job; you accept or reject each one and your Match Rate updates.",
    url: "https://www.jobscan.co/ai-optimize",
    page: "Jobscan — AI Optimize",
  },
  {
    id: "premium",
    claim: "Jobscan Premium adds unlimited resume and cover letter scans, LinkedIn profile optimization, a cover letter builder and AI Optimize.",
    url: "https://www.jobscan.co/resume-fixer",
    page: "Jobscan — Resume fixer (Premium features)",
  },
  {
    id: "coverLetter",
    claim: "Jobscan's AI cover letter generator can be used during the 7-day free trial; after that it's part of Premium.",
    url: "https://www.jobscan.co/cover-letter-generator",
    page: "Jobscan — AI cover letter generator",
  },
  {
    id: "interview",
    claim: "Jobscan describes AI mock interviews built from a job and your resume: you answer by video or audio and get feedback on pace, filler words, pauses and delivery.",
    url: "https://www.jobscan.co/ai-interview-practice",
    page: "Jobscan — AI mock interview practice",
  },
  {
    id: "interviewAccess",
    claim: "A Jobscan comparison article says its Interview Practice tool is currently enterprise-only, so individual job seekers can't use it yet.",
    url: "https://www.jobscan.co/blog/jobscan-vs-rezi/",
    page: "Jobscan — Jobscan vs Rezi",
  },
  {
    id: "linkedin",
    claim: "Jobscan's LinkedIn Optimization scores your profile's headline, summary and experience against job descriptions you add and shows a match score.",
    url: "https://www.jobscan.co/linkedin-optimization",
    page: "Jobscan — LinkedIn optimization tool",
  },
  {
    id: "tracker",
    claim: "Jobscan has a free job tracker, and its Chrome extension adds Scan and Save buttons to job listings on LinkedIn, Indeed and Glassdoor.",
    url: "https://www.jobscan.co/job-tracker",
    page: "Jobscan — Free job application tracker",
  },
  {
    id: "cancel",
    claim: "You cancel Jobscan from your Account page and drop to the free plan when the billing period ends. Refunds are considered case by case, only if requested within 2 calendar days of a billing period starting and the service wasn't used in that period.",
    url: "https://www.jobscan.co/cancellation-policy",
    page: "Jobscan — Cancellation policy",
  },
  {
    id: "plan",
    claim: "Jobscan's current Premium prices and trial terms are listed on its plan page. We link to it instead of quoting a number that can change.",
    url: "https://app.jobscan.co/plan",
    page: "Jobscan — Choose your plan",
  },
];

export const jobscanSource = (id: JobscanSourceId) => JOBSCAN_SOURCES.find((s) => s.id === id)!;
/** 1-based footnote number of a source, as listed on the page. */
export const jobscanSourceNo = (id: JobscanSourceId) => JOBSCAN_SOURCES.findIndex((s) => s.id === id) + 1;

/** Where Jobscan is the better fit. Each point names its source. */
export const JOBSCAN_STRENGTHS: { text: string; src: JobscanSourceId[] }[] = [
  { text: "you want to compare your resume with a specific job post for free — Jobscan's free plan includes 5 scans a month", src: ["free", "scanner"] },
  { text: "you scan against a lot of job posts — Premium has no monthly scan limit", src: ["free"] },
  { text: "you want formatting advice for the employer's own ATS, like Workday or Taleo", src: ["atsTips"] },
  { text: "you want to optimize your LinkedIn profile, which LaunchCV doesn't do", src: ["linkedin", "premium"] },
  { text: "you want a Chrome extension that scans and saves jobs from LinkedIn, Indeed and Glassdoor", src: ["tracker"] },
];

export type CompareRow = {
  label: string;
  /** LaunchCV cell. `null` = filled in by the page from live data. */
  launchcv: string | null;
  /** LaunchCV doesn't offer this. */
  launchcvNo?: boolean;
  jobscan: string;
  src: JobscanSourceId[];
  /** Jobscan cell is a link to its plan page instead of text. */
  link?: boolean;
};

export const COMPARE_ROWS: CompareRow[] = [
  { label: "Free ATS check", launchcv: "Yes, no account needed", jobscan: "5 scans a month on the free plan", src: ["free"] },
  { label: "Checks layout and formatting problems", launchcv: "Yes, free", jobscan: "Yes, as part of the Match Rate", src: ["scanner"] },
  { label: "Match against a specific job post", launchcv: null, jobscan: "Yes — 5 scans a month free, unlimited on Premium", src: ["free", "scanner"] },
  { label: "Advice for a specific ATS (Workday, Taleo…)", launchcv: "No — general rules that hold across ATS", launchcvNo: true, jobscan: "Yes, ATS Tips in the Match Report", src: ["atsTips"] },
  { label: "Resume builder", launchcv: "Free with an account — 4 one-column templates, PDF export", jobscan: "Free to use and download; AI writing tools are paid", src: ["builder"] },
  { label: "AI tailoring to a job", launchcv: "Bullet rewrites and job matching on every paid plan", jobscan: "AI Optimize, on Premium", src: ["optimize", "premium"] },
  { label: "Cover letters", launchcv: "Every paid plan", jobscan: "Premium, and during the 7-day free trial", src: ["coverLetter"] },
  {
    label: "Interview prep",
    launchcv: "10 likely questions with answer outlines from your resume, every paid plan",
    jobscan: "AI mock interviews by video or audio; Jobscan says the tool is enterprise-only for now",
    src: ["interview", "interviewAccess"],
  },
  { label: "LinkedIn profile optimization", launchcv: "Not offered", launchcvNo: true, jobscan: "Yes, on Premium", src: ["linkedin", "premium"] },
  { label: "Job tracker", launchcv: "Free with an account", jobscan: "Free, with a Chrome extension", src: ["tracker"] },
  { label: "Price", launchcv: null, jobscan: "See Jobscan's plan page", src: ["plan"], link: true },
  {
    label: "Cancelling and refunds",
    launchcv: "Cancel anytime; money back within 7 days on monthly plans, 14 days on Lifetime",
    jobscan: "Cancel from your Account page; refunds case by case, if asked within 2 days of a billing period starting and unused",
    src: ["cancel"],
  },
];
