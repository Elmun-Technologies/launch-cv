export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: number;
  category: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    bio: string;
  };
  /** Full article content as structured sections */
  sections: BlogSection[];
  faqs?: { q: string; a: string }[];
};

export type BlogSection = {
  heading: string;
  body: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-write-an-ats-friendly-resume",
    title: "How to Write an ATS-Friendly Resume in 2025 (Complete Guide)",
    description:
      "75% of resumes are filtered out before a human sees them. Learn exactly how Applicant Tracking Systems work and how to optimize your resume to pass every ATS scan.",
    date: "2025-04-10",
    readingTime: 9,
    category: "Resume Tips",
    tags: ["ATS resume", "resume tips", "applicant tracking system", "resume optimization", "job search"],
    author: {
      name: "Launch CV Editorial",
      role: "Career Research Team",
      bio: "The Launch CV editorial team researches job search trends and resume best practices to help job seekers land more interviews.",
    },
    sections: [
      {
        heading: "What is an ATS and why does it matter?",
        body: "An Applicant Tracking System (ATS) is software that companies use to collect, filter, and rank job applications automatically. Research from Jobscan shows that over 98% of Fortune 500 companies use ATS systems, and studies estimate that 75% of resumes are rejected before a recruiter ever reads them. Common platforms include Workday, Greenhouse, Lever, iCIMS, and Taleo. Each has slightly different parsing rules, but all share the same core vulnerability: they rely on keyword matching and structured formatting.",
      },
      {
        heading: "The 7 most common ATS rejection reasons",
        body: "1. Tables and columns: ATS systems cannot parse multi-column layouts. Content inside table cells is often ignored entirely. 2. Headers and footers: Text placed in Word or PDF headers/footers is invisible to most parsers. Keep all key information in the main body. 3. Wrong file format: Always submit PDF unless the job posting specifically asks for DOCX. PDFs preserve formatting while remaining parseable. 4. Missing keywords: ATS software matches your resume against the job description. If critical skills from the JD are absent, your score drops. 5. Non-standard section titles: Use 'Work Experience' not 'Where I've Worked'. ATS expects conventional heading names. 6. Images and graphics: Logos, photos, and icon-based skill bars cannot be read. Remove all decorative graphics. 7. Font issues: Exotic fonts may not render correctly. Stick to Arial, Calibri, or Times New Roman.",
      },
      {
        heading: "How to structure your resume for ATS",
        body: "Use a single-column layout for maximum compatibility. Structure your resume in this order: (1) Contact information at the top — name, email, phone, LinkedIn URL, location. (2) Professional summary — 3–4 sentences incorporating your target job title and top skills. (3) Work experience — reverse chronological, with company name, job title, dates, and 3–5 bullet points per role. (4) Education — degree, institution, graduation year. (5) Skills — a dedicated skills section with explicit keyword matches. Each bullet point should start with an action verb and include a measurable outcome where possible.",
      },
      {
        heading: "How to find and use the right keywords",
        body: "The most reliable method is to analyze the job description directly. Read it carefully and highlight: required skills (both technical and soft), specific tools or technologies, certifications mentioned, and role-specific verbs. Then compare these against your resume. Any gap is a potential rejection flag. Aim to include the top 10–15 keywords from the JD naturally throughout your resume — in your summary, work experience bullets, and skills section. Avoid keyword stuffing: ATS systems and human reviewers both penalize unnatural repetition.",
      },
      {
        heading: "How Launch CV's ATS checker works",
        body: "Launch CV's ATS Score Checker simulates how 15+ major applicant tracking systems parse your resume. Upload your PDF or DOCX and receive an instant score from 0–100, broken into four categories: Formatting (detects tables, columns, images), Keywords (measures density vs. industry benchmarks), Structure (checks for expected sections), and Readability (length, date formats, contact info parsing). The average user improves their score by 43 points after addressing the flagged issues. High-priority fixes are shown first, with specific instructions for each problem.",
      },
      {
        heading: "Quick checklist before submitting any application",
        body: "Before clicking Apply: ✓ Single-column layout, no tables. ✓ All text in the document body (not headers/footers). ✓ File saved as PDF (unless DOCX requested). ✓ At least 8–10 keywords from the job description present. ✓ Section headings use standard names. ✓ No images, logos, or icon-based skill bars. ✓ Dates formatted consistently (e.g., Jan 2022 – Mar 2024). ✓ Contact information includes email, phone, and LinkedIn. ✓ Resume is 1–2 pages maximum.",
      },
    ],
    faqs: [
      { q: "What ATS score should I aim for?", a: "Aim for 80 or above. Resumes scoring 80–100 have the highest likelihood of reaching a human reviewer. Most unoptimized resumes score between 40–65." },
      { q: "Does every company use ATS?", a: "Most companies with more than 50 employees use some form of ATS. Startups and small businesses may review resumes manually, but ATS-friendly formatting never hurts either way." },
      { q: "Can I use a designed/visual resume?", a: "Only for roles in creative fields where you email your portfolio directly. For online applications through job boards, always use a clean ATS-compatible format." },
    ],
  },

  {
    slug: "how-to-tailor-your-resume-for-every-job",
    title: "How to Tailor Your Resume for Every Job Application (AI Method)",
    description:
      "Sending the same resume to every job? That's why you're not getting callbacks. Learn a systematic AI-assisted process to tailor your resume to each job description in under 10 minutes.",
    date: "2025-04-08",
    readingTime: 7,
    category: "Resume Tips",
    tags: ["tailor resume", "job description matching", "AI resume", "resume customization", "JD alignment"],
    author: {
      name: "Launch CV Editorial",
      role: "Career Research Team",
      bio: "The Launch CV editorial team researches job search trends and resume best practices to help job seekers land more interviews.",
    },
    sections: [
      {
        heading: "Why tailoring is non-negotiable",
        body: "A Harvard Business Review study found that tailored applications receive 3× more interview invitations than generic ones. The reason is simple: hiring managers spend an average of 7 seconds scanning a resume before deciding to read or reject it. If the first thing they see doesn't match the role, they move on. Tailoring ensures that the most relevant experience appears prominently, that the keywords match what recruiters are looking for, and that your professional summary sounds like it was written for this exact position.",
      },
      {
        heading: "Step 1 — Deconstruct the job description",
        body: "Before changing a single word on your resume, analyze the job description in three layers. First, identify the required skills (non-negotiable). Second, find the preferred skills (will differentiate you). Third, note the language and tone the company uses. Companies often repeat what they care about most. A JD that mentions 'cross-functional collaboration' three times is signaling that this is a core expectation. Mirror their language where you genuinely have the experience.",
      },
      {
        heading: "Step 2 — Rewrite your professional summary",
        body: "Your professional summary is the highest-impact section for tailoring. It sits at the top and sets the frame for everything that follows. For each application, rewrite 2–3 sentences to: include your target job title, reference the company's core need, and highlight your most relevant qualification. Example for a Product Manager role: 'Product Manager with 5 years of experience driving B2B SaaS growth through data-informed roadmapping and cross-functional execution. Proven track record of shipping features that increased ARR by 40% at a Series B startup.' This takes 3 minutes and significantly increases match score.",
      },
      {
        heading: "Step 3 — Rewrite 2–3 bullet points per role",
        body: "You do not need to rewrite your entire resume for each application. Focus on the 2–3 most recent roles and update 2–3 bullets each. The goal is to: (a) incorporate missing keywords naturally, (b) reframe generic experience in terms of the specific outcomes the role requires, and (c) add metrics if you have them. 'Managed projects' becomes 'Led delivery of 4 concurrent product launches, each shipped within budget and on schedule.' The facts are the same — the language is mapped to what the JD values.",
      },
      {
        heading: "Step 4 — Use AI to check your match score",
        body: "After manually tailoring, run the JD alignment check in Launch CV. Paste the job description and your updated resume. The AI calculates your match percentage and shows any remaining gaps. This takes under 10 seconds and often surfaces 2–3 keywords you missed. Accept the AI-suggested rewrites with one click and your match score typically jumps from the 60s to the 80–90% range. At 85%+, your resume will pass most ATS filters and look highly relevant to a human reviewer.",
      },
    ],
    faqs: [
      { q: "How long does tailoring take?", a: "With AI assistance, 5–10 minutes per application. Without AI, it typically takes 20–40 minutes to do it properly." },
      { q: "Should I have different resume versions?", a: "Yes. Maintain a 'master resume' with all your experience, then create tailored versions for each role or job category. Save each version with the company name and date." },
      { q: "Does tailoring work for career changers?", a: "Especially for career changers. Tailoring helps you emphasize transferable skills and reframe past experience in terms the new industry understands." },
    ],
  },

  {
    slug: "cover-letter-tips-that-actually-work",
    title: "7 Cover Letter Tips That Actually Get You Interviews in 2025",
    description:
      "Most cover letters are ignored. Here are 7 evidence-based tips to write cover letters that hiring managers actually read — plus how AI can generate them in 60 seconds.",
    date: "2025-04-05",
    readingTime: 6,
    category: "Cover Letters",
    tags: ["cover letter tips", "cover letter writing", "job application", "AI cover letter", "hiring"],
    author: {
      name: "Launch CV Editorial",
      role: "Career Research Team",
      bio: "The Launch CV editorial team researches job search trends and resume best practices to help job seekers land more interviews.",
    },
    sections: [
      {
        heading: "Do cover letters still matter?",
        body: "Yes — but differently than most people think. A 2024 survey by ResumeGo found that candidates who submitted cover letters received interview invitations 53% more often than those who did not. However, generic cover letters performed no better than no letter at all. The key is specificity. A cover letter that references the company's actual product, mission, or recent news — and connects it to your specific experience — demonstrates preparation that stands out.",
      },
      {
        heading: "Tip 1: Open with the most compelling thing about you",
        body: "Skip 'I am writing to express my interest in the position of...' This opening appears in millions of applications. Instead, start with a specific accomplishment or relevant connection. Example: 'When I led the migration of 200,000 customer records to a new data platform, I learned that the real challenge was never the technology — it was the people. That's why your Head of Engineering role caught my attention.' This creates immediate curiosity and differentiates you from the first sentence.",
      },
      {
        heading: "Tip 2: Connect your experience to one specific company need",
        body: "Identify the most important challenge the company is trying to solve in this role (usually mentioned first in the JD). Write one paragraph that connects a specific past achievement to that challenge. Use their language. If the JD says 'drive pipeline growth', don't say 'increase sales'. Mirror the exact phrasing. This signals that you understood the job description and thought about how you fit.",
      },
      {
        heading: "Tip 3: Keep it under 400 words",
        body: "Hiring managers read hundreds of applications. A cover letter that goes beyond 400 words is unlikely to be read fully. Structure: paragraph 1 (hook + who you are), paragraph 2 (one specific accomplishment connected to their need), paragraph 3 (why this company specifically), closing line + call to action. That's it. Anything more dilutes the impact.",
      },
      {
        heading: "Tip 4: Personalize the company section with research",
        body: "The paragraph about 'why this company' is where most candidates fail. Generic sentences like 'I admire your innovative culture' say nothing. Instead, reference something specific: a recent product launch, a funding announcement, a company value statement that resonates with your work style, or a challenge in their industry you have relevant experience addressing. Spend 5 minutes on their website and LinkedIn before writing this paragraph.",
      },
      {
        heading: "Tips 5–7: Formatting, tone, and AI assistance",
        body: "Tip 5: Use a professional but human tone. Avoid corporate jargon. Write like you speak in an interview, not like a legal document. Tip 6: End with a specific call to action: 'I would welcome the chance to discuss how my experience with [X] could contribute to [Y goal].' Tip 7: Use AI to generate the first draft. Launch CV's Cover Letter Generator reads your resume and the job description, personalizes the opening hook, selects tone (professional, enthusiastic, concise, creative), and produces a ready-to-send letter in under 60 seconds. Edit 2–3 sentences to add your own voice and it's ready.",
      },
    ],
    faqs: [
      { q: "Should I address the cover letter to a specific person?", a: "Always, if you can find the name. Check LinkedIn for the hiring manager or relevant team lead. 'Dear Sarah Johnson' is more personal than 'Dear Hiring Manager'." },
      { q: "What if the job posting says 'cover letter optional'?", a: "Submit one anyway. It signals initiative and gives you another opportunity to make your case." },
    ],
  },

  {
    slug: "how-to-prepare-for-a-job-interview-with-ai",
    title: "How to Prepare for a Job Interview Using AI (2025 Method)",
    description:
      "AI interview preparation tools generate role-specific questions from your exact resume and job description. Learn how to use AI coaching to walk into every interview fully prepared.",
    date: "2025-04-02",
    readingTime: 8,
    category: "Interview Prep",
    tags: ["interview preparation", "AI interview", "job interview tips", "behavioral interview", "mock interview"],
    author: {
      name: "Launch CV Editorial",
      role: "Career Research Team",
      bio: "The Launch CV editorial team researches job search trends and resume best practices to help job seekers land more interviews.",
    },
    sections: [
      {
        heading: "Why most interview preparation fails",
        body: "The most common preparation mistake is studying generic lists of interview questions. 'Tell me about yourself' and 'What is your greatest weakness' are important, but they represent a small fraction of what you will be asked. The majority of questions in a structured interview are role-specific: they reference the skills listed in the job description, scenarios you might face in this position, and challenges the team is currently navigating. Generic preparation leaves you underprepared for the specific conversation you will actually have.",
      },
      {
        heading: "The STAR method: your answer framework",
        body: "Every behavioral interview question should be answered using the STAR framework: Situation (briefly set the context), Task (describe your specific responsibility), Action (explain what you did and why), Result (quantify the outcome). Example question: 'Tell me about a time you managed a project under a tight deadline.' Poor answer: 'I worked hard and we got it done.' STAR answer: 'In Q3 2023 (Situation), I was tasked with leading a product launch after our lead engineer left unexpectedly (Task). I rebuilt the sprint plan, reduced scope to core features, and coordinated daily standups with 3 teams (Action). We shipped 2 days before the deadline and acquired 500 customers in the first week (Result).' Practice until STAR becomes automatic.",
      },
      {
        heading: "How AI generates role-specific questions",
        body: "Launch CV's Interview Prep reads your resume and the target job description and generates questions in 5 categories: Behavioral (from your own experience), Technical/Role-Specific (pulled from JD requirements), Company & Culture (based on company values and mission), Situational (hypothetical role-relevant scenarios), and Curveballs (common tricky questions like 'What's your greatest weakness'). Each question is scored when you answer it, with feedback on Clarity, Relevance, Impact, and STAR structure. The AI also provides a model answer so you can benchmark your response.",
      },
      {
        heading: "A 3-day interview preparation plan",
        body: "Day 1 — Research: Read the company website, LinkedIn, Glassdoor reviews, and recent news. Write down 3 things you genuinely find interesting about the company. Day 2 — Practice: Run through 10–15 AI-generated questions. Record yourself on video if possible. Review your STAR answers and improve the weak ones. Focus on quantifying outcomes. Day 3 — Simulate: Do a full mock interview with the AI — answer 5–7 questions without pausing or editing. Review the feedback and identify your 2–3 weakest areas. Prepare 5 questions to ask the interviewer.",
      },
      {
        heading: "Questions to ask the interviewer",
        body: "Asking good questions signals preparation and genuine interest. Avoid questions you could have answered with 10 minutes of research. Strong questions: 'What does success look like for this role in the first 90 days?', 'What are the biggest challenges the team is currently navigating?', 'How does this team typically collaborate with [adjacent team]?', 'What do the most successful people in this role have in common?'. Avoid: 'What does your company do?', 'What are the hours?', 'How soon can I be promoted?'",
      },
    ],
    faqs: [
      { q: "How many questions should I practice before an interview?", a: "Aim for 15–20 questions. Cover at least 3 behavioral questions from your own experience, 5 role-specific technical questions, and 2–3 company/culture questions." },
      { q: "Is it okay to bring notes to an interview?", a: "Yes — especially for key metrics and examples you want to reference. Brief notes are professional. Reading from a script is not." },
    ],
  },

  {
    slug: "what-is-ats-and-how-does-it-work",
    title: "What is an ATS? How Applicant Tracking Systems Work (Plain English)",
    description:
      "Applicant Tracking Systems decide whether a human ever sees your resume. Here's exactly how they work, why 75% of resumes fail, and how to beat them every time.",
    date: "2025-03-28",
    readingTime: 6,
    category: "Job Search",
    tags: ["ATS", "applicant tracking system", "resume screening", "job application", "ATS software"],
    author: {
      name: "Launch CV Editorial",
      role: "Career Research Team",
      bio: "The Launch CV editorial team researches job search trends and resume best practices to help job seekers land more interviews.",
    },
    sections: [
      {
        heading: "What is an Applicant Tracking System?",
        body: "An Applicant Tracking System (ATS) is a type of HR software that manages the hiring process from job posting to offer letter. For job seekers, the most important function is the initial resume screening: when you submit an application online, an ATS parses your resume, extracts key information (name, contact details, work history, education, skills), and scores or ranks it based on how well it matches the job requirements. Popular ATS platforms include Workday, Greenhouse, Lever, iCIMS, Taleo, BambooHR, and Jobvite.",
      },
      {
        heading: "How does ATS ranking work?",
        body: "Most ATS systems use a combination of: (1) Keyword matching — the system compares words in your resume to the job description and counts matches. (2) Contextual parsing — newer systems use NLP to understand that 'led' and 'managed' are related, but explicit keywords still matter more. (3) Section recognition — the ATS looks for standard resume sections (Work Experience, Education, Skills) and may ignore content that appears outside expected structures. (4) Formatting parsing — tables, columns, headers, and images often break the parser, causing sections of your resume to disappear.",
      },
      {
        heading: "The most common ATS platforms and their quirks",
        body: "Workday is the most widely used enterprise ATS. It requires very clean formatting and is sensitive to non-standard characters. Greenhouse is popular at tech companies and startups. It parses PDFs well but struggles with graphics. Lever is used by growth-stage tech companies. It has strong LinkedIn import but basic resume parsing. iCIMS is common in healthcare and enterprise settings. It strictly enforces section structure. Taleo (Oracle) is used by large corporations. It is one of the most aggressive ATS systems regarding formatting and keyword matching.",
      },
      {
        heading: "How to know if your resume passes ATS",
        body: "The most reliable method is to use an ATS resume checker before applying. Upload your resume and paste the job description. The checker simulates how the ATS will parse your document and gives you a compatibility score. Launch CV's ATS Score Checker runs your resume against 15+ platform rules and returns a 0–100 score with specific issues: missing keywords, formatting problems, structure gaps, and date inconsistencies. The average unoptimized resume scores 45–60. After addressing the flagged issues, most users reach 80–90+.",
      },
    ],
    faqs: [
      { q: "Do all companies use ATS?", a: "Companies with more than 50 employees almost universally use some form of ATS. Even many smaller companies use basic ATS tools built into job boards like LinkedIn or Indeed." },
      { q: "Can a great resume still fail ATS?", a: "Yes. A beautifully designed resume with infographics, columns, and custom fonts can score 0 in an ATS even if the content is excellent. Design and ATS compatibility are separate goals." },
      { q: "Do human recruiters ever override ATS?", a: "Occasionally — usually for highly referred candidates or senior roles. For most job applications, the ATS filter is the first and often most decisive hurdle." },
    ],
  },

  {
    slug: "ai-resume-builder-complete-guide",
    title: "AI Resume Builder: Complete Guide to Building Your Resume with AI (2025)",
    description:
      "AI resume builders write bullet points, optimize keywords, and format your resume for ATS — in minutes. Here's how they work, what to look for, and how to use one effectively.",
    date: "2025-03-24",
    readingTime: 10,
    category: "Resume Tips",
    tags: ["AI resume builder", "resume builder", "AI resume", "resume writing", "career tools"],
    author: {
      name: "Launch CV Editorial",
      role: "Career Research Team",
      bio: "The Launch CV editorial team researches job search trends and resume best practices to help job seekers land more interviews.",
    },
    sections: [
      {
        heading: "What is an AI resume builder?",
        body: "An AI resume builder is a web application that uses large language models (LLMs) to help job seekers write, format, and optimize resumes. Unlike traditional resume builders that just provide templates, AI resume builders actively generate content: they transform plain-language descriptions of your work into professional, quantified bullet points; analyze job descriptions and align your resume to specific requirements; suggest keywords to improve ATS scores; and provide real-time feedback on formatting, length, and content quality.",
      },
      {
        heading: "How AI generates resume bullet points",
        body: "Modern AI resume builders use GPT-4 class language models trained on large datasets of high-performing resumes and professional writing. When you describe your work experience in plain language ('I managed social media for a startup'), the AI applies several transformations: (1) Adds an action verb ('Managed' → 'Directed and scaled'), (2) Adds specificity using context you provide, (3) Quantifies outcomes where data is available ('growing followers' → '...increasing follower count by 127%'), and (4) Aligns language to the target role's expectations. The result reads as polished, professional, and impactful — even if your input was rough and unstructured.",
      },
      {
        heading: "What to look for in an AI resume builder",
        body: "The best AI resume builders share several key features. ATS optimization: templates must be structurally ATS-safe (no tables, no columns, standard fonts). JD alignment: the ability to paste a job description and get keyword gap analysis. Real-time preview: see exactly what the PDF will look like before downloading. Multiple export formats: PDF and DOCX, both ATS-compatible. Industry-specific templates: different verticals require different resume structures. Voice input: especially useful for professionals who find writing difficult. Privacy: your resume data should be encrypted and never used to train models without consent.",
      },
      {
        heading: "Step-by-step: building a resume with AI",
        body: "Step 1: Choose a template suited to your industry. Tech and finance roles expect clean, information-dense formats. Creative roles can use slightly more visual layouts — but still ATS-safe. Step 2: Enter your basic information — name, contact details, and career objective. Step 3: For each work experience entry, describe what you did in plain language. Let the AI transform it. Review, edit, and accept suggestions. Step 4: Paste the target job description. Check your keyword match score and accept recommended improvements. Step 5: Export as PDF. Run the ATS score checker. Aim for 80+. Step 6: Generate the matching cover letter from the same interface.",
      },
      {
        heading: "AI resume builders vs. human resume writers",
        body: "Professional resume writers charge $200–$700 for a single resume. They bring industry-specific expertise and human judgment. AI resume builders cost $9–$79 per year, produce results in minutes, and can be updated and re-tailored for every application. For most job seekers, AI is the better choice: faster iteration, lower cost, and the ability to tailor for every role. Where human writers add value: very senior executives, career changers making unusual pivots, and situations where personal branding narrative is the primary differentiator.",
      },
      {
        heading: "Common mistakes when using AI resume builders",
        body: "Mistake 1: Accepting every AI suggestion without reviewing. AI may occasionally add metrics or specifics that aren't accurate for your experience. Always verify. Mistake 2: Using the same resume for every job. The AI generates a strong base — you must still tailor it per role. Mistake 3: Ignoring the ATS score. A visually beautiful resume with a 50% ATS score will be filtered before a human reads it. Mistake 4: Over-optimizing. Stuffing keywords unnaturally reads as spam to both ATS and human reviewers. Natural integration is the goal.",
      },
    ],
    faqs: [
      { q: "Can employers tell if I used AI to write my resume?", a: "Not from the content alone. AI-generated text that you've reviewed and personalized reads as professional writing. What matters is that the content accurately represents your experience." },
      { q: "Is it ethical to use AI for resume writing?", a: "Yes. AI is a writing tool, like a grammar checker or a template. The experience and achievements on your resume must be real — AI helps you express them more effectively." },
      { q: "How often should I update my resume?", a: "Update it after every significant achievement or role change. A living resume is much easier to maintain than one you haven't touched in 3 years." },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
