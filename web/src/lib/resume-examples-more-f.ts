import type { ResumeExample } from "@/lib/resume-examples";

/** More role examples (see lib/resume-examples.ts for the shape and rules). */
export const MORE_EXAMPLES_F: ResumeExample[] = [
  // ─── Tech & product ──────────────────────────────────────────────────
  {
    slug: "frontend-developer",
    role: "Frontend Developer",
    group: "Tech & product",
    photo: { src: "/images/photos/role-frontend-developer.webp", alt: "Developer smiling in front of a whiteboard with a sketched page layout" },
    level: "Mid-level · 5 years experience",
    intro:
      "A frontend developer resume that shows faster pages, accessible interfaces and components other teams reuse — with the React, TypeScript and testing keywords hiring managers search for.",
    resume: {
      name: "Leah Brennan",
      headline: "Frontend Developer",
      contact: "Minneapolis, MN · leah.brennan@email.com · github.com/lbrennan",
      summary:
        "Frontend developer with 5 years building web apps in React and TypeScript. I care about pages that load fast on an inexpensive phone and work with a keyboard and a screen reader, and I write web accessibility and performance into the definition of done.",
      jobs: [
        {
          title: "Frontend Developer",
          company: "Northstar Ledger",
          dates: "Mar 2022 – Present",
          bullets: [
            "Build customer-facing features in React and TypeScript on top of REST APIs for a budgeting app used by 400,000 people a month",
            "Moved the marketing site and account pages to Next.js with server rendering, improving Core Web Vitals; mobile Largest Contentful Paint fell from 4.1s to 1.8s",
            "Led an accessibility pass against WCAG 2.1 AA, fixing 120+ issues found with axe and screen reader testing in NVDA and VoiceOver",
            "Built a shared component library in Storybook now used by 4 product teams, with Playwright end-to-end tests running on every pull request",
          ],
        },
        {
          title: "Junior Frontend Developer",
          company: "Pixelworth Studio",
          dates: "Jun 2020 – Feb 2022",
          bullets: [
            "Built 15+ sites for retail and nonprofit clients in HTML, CSS (Sass) and JavaScript, using responsive design from 320px phones up to wide desktop screens",
            "Wrote unit tests with Jest and React Testing Library, raising coverage on a client's checkout widget from 35% to 80%",
            "Turned Figma designs into accurate, reusable page templates and fixed layout bugs across Chrome, Safari and Firefox",
          ],
        },
      ],
      education: "B.S. Computer Science, University of Minnesota, 2020",
      skills: ["React", "TypeScript", "JavaScript", "Next.js", "HTML", "CSS", "Tailwind CSS", "Jest", "React Testing Library", "Playwright", "Storybook", "Git", "Figma"],
    },
    whyItWorks:
      "Each bullet ties a frontend decision to something users feel — load time, accessibility fixes, fewer bugs — and names the standard or metric behind it, like WCAG 2.1 AA or Largest Contentful Paint. The stack is written in plain words a recruiter can search, and the agency job shows range across many clients.",
    summaries: [
      { level: "Entry level", text: "Computer science graduate with a frontend internship and 3 portfolio projects in React and TypeScript, each tested with Jest and checked for keyboard and screen reader access." },
      { level: "Mid level", text: "Frontend developer with 5 years in React and TypeScript. I moved a fintech site to Next.js, cut mobile Largest Contentful Paint from 4.1s to 1.8s and led a WCAG 2.1 AA accessibility pass." },
      { level: "Senior", text: "Senior frontend engineer who leads a web platform team of 4, owns the design system and sets performance and accessibility budgets for 6 product teams." },
    ],
    bullets: [
      { skill: "Performance", weak: "Made the website faster", strong: "Moved account pages to Next.js with server rendering; mobile Largest Contentful Paint fell from 4.1s to 1.8s" },
      { skill: "Accessibility", weak: "Worked on accessibility", strong: "Fixed 120+ WCAG 2.1 AA issues found with axe and screen reader testing in NVDA and VoiceOver" },
      { skill: "Components", weak: "Built reusable components", strong: "Built a Storybook component library now used by 4 product teams" },
      { skill: "Testing", weak: "Wrote tests", strong: "Raised unit test coverage on a checkout widget from 35% to 80% with Jest and React Testing Library" },
      { skill: "Responsive design", weak: "Made sites mobile-friendly", strong: "Built 15+ client sites with responsive layouts that work from 320px phones to wide desktop screens" },
      { skill: "Collaboration", weak: "Worked with designers", strong: "Turned Figma designs into reusable page templates and fixed cross-browser layout bugs with the design team" },
    ],
    keywords: [
      "React", "TypeScript", "JavaScript", "Next.js", "HTML", "CSS", "Responsive design", "Web accessibility", "WCAG",
      "Core Web Vitals", "REST APIs", "Jest", "React Testing Library", "Playwright", "Storybook", "Git", "Figma",
    ],
    keywordSort: {
      tools: ["Jest", "React Testing Library", "Playwright", "Storybook", "Git", "Figma"],
    },
    tips: [
      { t: "Mirror the framework in the post", d: "React, Vue, Angular and Svelte are searched separately, and so are Next.js and Nuxt. Lead with the ones the job asks for that you've used in production." },
      { t: "Measure performance with real metrics", d: "Core Web Vitals — Largest Contentful Paint, Interaction to Next Paint and Cumulative Layout Shift — or bundle size give a hiring manager something concrete. Google replaced First Input Delay with Interaction to Next Paint in 2024, so use the current names." },
      { t: "Name the accessibility standard", d: "\"WCAG 2.1 AA\" or \"WCAG 2.2 AA\" and the tools you tested with say much more than \"accessibility-minded\"." },
      { t: "Show testing, not just building", d: "Unit, component and end-to-end tests are a common filter. Name the tools — Jest, Testing Library, Playwright or Cypress — in a bullet with a result." },
      { t: "Link code you can talk about", d: "A GitHub profile or a live project is useful, but write it out as plain text and make sure the bullets explain the work without it." },
    ],
    faqs: [
      { q: "What's the difference between a frontend and a full-stack developer resume?", a: "A frontend resume goes deep on the browser: UI frameworks, CSS, accessibility, performance and frontend testing. A full-stack resume adds server code, databases and APIs. Use the title you held and match the focus of the post." },
      { q: "Should I list every JavaScript library I've used?", a: "No. List the framework, language, styling approach and testing tools you know well, and match them to the job post. A short list you can defend in an interview is better than a long one." },
      { q: "Do I need a portfolio?", a: "It helps, especially early in your career. Two or three projects with clean code, tests and a short write-up are worth more than many unfinished ones." },
      { q: "Are certifications useful for frontend developers?", a: "Rarely required. Hiring managers look at your work, your code and how you explain trade-offs. A course can help you learn, but list it only if it's relevant and recent." },
      { q: "How do I show accessibility work on a resume?", a: "Name the standard, the size of the work and how you tested it — for example, \"fixed 120+ WCAG 2.1 AA issues found with axe and screen reader testing\"." },
    ],
    related: ["software-engineer", "ux-designer", "qa-engineer"],
  },

  // ─── Creative ────────────────────────────────────────────────────────
  {
    slug: "graphic-designer",
    role: "Graphic Designer",
    group: "Creative",
    photo: { src: "/images/photos/role-graphic-designer.webp", alt: "Color swatch cards and a tablet with hand-drawn color studies on a designer's desk" },
    level: "Mid-level · 6 years experience",
    intro:
      "A graphic designer resume that shows what you've designed, for whom and how it went to print or to screen — with the Adobe, brand and production keywords art directors look for.",
    resume: {
      name: "Grace Holloway",
      headline: "Graphic Designer",
      contact: "Providence, RI · grace.holloway@email.com · behance.net/gholloway",
      summary:
        "Graphic designer with 6 years in-house and at an agency, working in Adobe Creative Cloud and Figma. I design packaging, brand identity and campaign graphics that hold up from a grocery shelf to a phone screen.",
      jobs: [
        {
          title: "Graphic Designer",
          company: "Harborview Foods",
          dates: "Apr 2022 – Present",
          bullets: [
            "Design packaging, labels and in-store displays for 40+ specialty food products sold in 1,200 grocery stores",
            "Led the packaging design refresh for a 9-product sauce line in Adobe Illustrator and InDesign, preparing print-ready files with dielines and Pantone color specs",
            "Wrote brand guidelines and built templates in Figma and Canva so the marketing team can make on-brand social media graphics without waiting for a designer",
            "Cut print revision rounds from 4 to 2 on average by adding a prepress checklist and attending press checks with our printer",
          ],
        },
        {
          title: "Junior Designer",
          company: "Copperline Creative",
          dates: "Jul 2019 – Mar 2022",
          bullets: [
            "Designed logos, brochures, trade show graphics and digital ads for 25+ clients in healthcare, education and retail",
            "Retouched product photos in Adobe Photoshop and built email and web banners to each client's brand guidelines",
            "Created motion graphics for social ads in After Effects for 6 client campaigns",
          ],
        },
      ],
      education: "B.F.A. Graphic Design, Rhode Island School of Design, 2019",
      skills: ["Adobe Illustrator", "Adobe InDesign", "Adobe Photoshop", "After Effects", "Figma", "Canva", "Typography", "Brand identity", "Logo design", "Layout design", "Print production", "Motion graphics"],
    },
    whyItWorks:
      "Bullets say what was designed, how much of it and where it ended up — on shelves in 1,200 stores, in a client campaign, on press. Production details like dielines, Pantone specs and prepress show the designer can take work all the way to print, and the portfolio link is written out in plain text.",
    summaries: [
      { level: "Entry level", text: "Graphic design graduate with an agency internship designing social ads, flyers and a logo refresh for a local nonprofit. Comfortable in Adobe Illustrator, InDesign, Photoshop and Figma." },
      { level: "Mid level", text: "Graphic designer with 6 years in-house and at an agency. I design packaging and brand identity for 40+ products sold in 1,200 grocery stores and cut print revision rounds from 4 to 2." },
      { level: "Senior / art director", text: "Senior designer who leads a team of 3, sets the visual direction for a national consumer brand and manages printers, photographers and freelance illustrators." },
    ],
    bullets: [
      { skill: "Packaging", weak: "Designed packaging", strong: "Designed packaging and labels for 40+ specialty food products sold in 1,200 grocery stores" },
      { skill: "Print production", weak: "Prepared files for print", strong: "Prepared print-ready files with dielines and Pantone specs, and cut revision rounds from 4 to 2 with a prepress checklist" },
      { skill: "Brand", weak: "Worked on branding", strong: "Wrote brand guidelines and built Figma and Canva templates so marketing could make on-brand graphics without a designer" },
      { skill: "Range", weak: "Did design for clients", strong: "Designed logos, brochures, trade show graphics and digital ads for 25+ clients in healthcare, education and retail" },
      { skill: "Motion", weak: "Made animations", strong: "Created motion graphics for social ads in After Effects for 6 client campaigns" },
      { skill: "Photo editing", weak: "Edited photos", strong: "Retouched product photos in Photoshop and built email and web banners to client brand guidelines" },
    ],
    keywords: [
      "Adobe Creative Cloud", "Adobe Illustrator", "Adobe InDesign", "Adobe Photoshop", "After Effects", "Figma", "Canva",
      "Typography", "Brand identity", "Brand guidelines", "Logo design", "Packaging design", "Layout design", "Print production",
      "Prepress", "Motion graphics", "Social media graphics",
    ],
    keywordSort: {
      tools: ["Adobe Creative Cloud", "Adobe Illustrator", "Adobe InDesign", "Adobe Photoshop", "After Effects", "Figma", "Canva"],
    },
    tips: [
      { t: "Keep the resume plain, put the design in the portfolio", d: "A heavily designed resume can scramble in an applicant tracking system. Use one clean column with good type, and let your portfolio show your range." },
      { t: "Write out the portfolio link", d: "Put a short, readable URL in your contact line as plain text so it survives parsing and printing." },
      { t: "Say what you designed and where it ran", d: "Packaging, signage, ads, books or digital campaigns — plus the scale, like stores, clients or campaigns — tells an art director what you've shipped." },
      { t: "Show you can finish a job", d: "Dielines, color specs, prepress and press checks prove you can take a file to production, not just to a mockup." },
      { t: "Name each app", d: "Recruiters search for Illustrator, InDesign, Photoshop, After Effects and Figma by name. \"Adobe Creative Cloud\" alone may not match." },
    ],
    faqs: [
      { q: "Should a graphic designer's resume be creative?", a: "A little, through clear typography and spacing. Avoid multi-column layouts, text in images and skill bars, which applicant tracking systems often can't read. Save the bold work for your portfolio." },
      { q: "How many portfolio pieces should I show?", a: "Usually 8 to 12 strong projects, matched to the job. Include a line on the brief, your role and the result for each, and only share client work you have permission to show." },
      { q: "Do I need a degree to be a graphic designer?", a: "Many postings ask for a bachelor's degree in graphic design or a related field, but a strong portfolio and relevant experience carry a lot of weight. List any degree, certificate or course that applies." },
      { q: "Are Adobe certifications worth listing?", a: "Adobe Certified Professional exams can help early in your career, especially for in-house or production roles. After a few years, your portfolio matters far more." },
      { q: "Should I list freelance work?", a: "Yes. Treat it like a job with dates, name a few clients if you can, and describe the projects and results the same way you would for an employer." },
    ],
    related: ["ux-designer", "marketing-coordinator", "social-media-manager"],
  },
  {
    slug: "content-writer",
    role: "Content Writer",
    group: "Creative",
    photo: { src: "/images/photos/role-content-writer.webp", alt: "Hands typing on a laptop keyboard with a document open on screen" },
    level: "Mid-level · 5 years experience",
    intro:
      "A content writer resume that shows traffic, leads and the editorial standards behind your work — with the SEO, editing and CMS keywords content managers search for.",
    resume: {
      name: "Owen Fitzgerald",
      headline: "Content Writer (SEO)",
      contact: "Asheville, NC · owen.fitzgerald@email.com · linkedin.com/in/owenfitzgerald",
      summary:
        "Content writer with 5 years in B2B software and agency work. I do content writing that ranks and gets read — long-form content built on keyword research, real interviews and careful fact-checking.",
      jobs: [
        {
          title: "Content Writer",
          company: "Ledgerly",
          dates: "Jan 2022 – Present",
          bullets: [
            "Write 6–8 blog posts and guides a month on small-business accounting, from keyword research in Semrush to publishing in WordPress",
            "Grew organic blog traffic from 40,000 to 150,000 monthly sessions in 2 years by building topic clusters and refreshing 60 older posts, tracked in Google Search Console",
            "Wrote 12 downloadable guides and the email nurture sequences behind them, bringing in 3,800 marketing-qualified leads in 2025",
            "Interview in-house accountants and customers for expert quotes, and check every statistic against its original source before publishing",
          ],
        },
        {
          title: "Copywriter",
          company: "Blue Ridge Media Group",
          dates: "Jun 2019 – Dec 2021",
          bullets: [
            "Wrote web copy, product descriptions and blog posts for 20+ clients in travel, retail and home services",
            "Edited contributor articles to AP style and each client's style guides before publishing",
            "Wrote landing page copy for a regional tourism campaign that lifted newsletter sign-ups by 22%",
          ],
        },
      ],
      education: "B.A. English and Journalism, Appalachian State University, 2019",
      skills: ["SEO writing", "Keyword research", "Content strategy", "Editing", "Proofreading", "AP style", "Email copywriting", "WordPress", "Semrush", "Google Search Console", "Google Analytics 4"],
    },
    whyItWorks:
      "It treats writing as work with results — sessions, leads and sign-ups — while still showing the craft behind it: interviews, fact-checking and AP style. Volume per month tells an editor the writer can keep a schedule, and the SEO tools are named exactly as postings list them.",
    summaries: [
      { level: "Entry level", text: "Journalism graduate with a year of freelance blog writing for 3 local businesses and a campus newspaper column. I write clean copy to AP style and research every claim." },
      { level: "Mid level", text: "Content writer with 5 years in B2B software and agency work. My SEO articles grew organic blog traffic from 40,000 to 150,000 monthly sessions in 2 years." },
      { level: "Senior / content lead", text: "Content lead who runs an editorial calendar for a team of 4 writers and freelancers, owns SEO strategy and reports content-sourced pipeline to the marketing director." },
    ],
    bullets: [
      { skill: "SEO", weak: "Wrote SEO content", strong: "Grew organic blog traffic from 40,000 to 150,000 monthly sessions by building topic clusters and refreshing 60 older posts" },
      { skill: "Lead generation", weak: "Wrote ebooks", strong: "Wrote 12 downloadable guides and nurture emails that brought in 3,800 marketing-qualified leads in a year" },
      { skill: "Volume", weak: "Wrote many blog posts", strong: "Write 6–8 researched blog posts and guides a month, from keyword research to publishing in WordPress" },
      { skill: "Accuracy", weak: "Did research", strong: "Interview accountants and customers for expert quotes and check every statistic against its original source" },
      { skill: "Editing", weak: "Edited articles", strong: "Edited contributor articles to AP style and client style guides before publishing" },
      { skill: "Conversion copy", weak: "Wrote landing pages", strong: "Wrote landing page copy for a tourism campaign that lifted newsletter sign-ups by 22%" },
    ],
    keywords: [
      "Content writing", "SEO writing", "Keyword research", "Content strategy", "Blog posts", "Long-form content", "Copywriting",
      "Email copywriting", "Editing", "Proofreading", "AP style", "Style guides", "Research", "WordPress", "Semrush",
      "Google Search Console", "Google Analytics 4",
    ],
    keywordSort: {
      tools: ["WordPress", "Semrush", "Google Search Console", "Google Analytics 4"],
    },
    tips: [
      { t: "Give your writing a result", d: "Traffic, rankings, leads, sign-ups or time on page show that your work did something. Use what your team actually measured." },
      { t: "Show your volume", d: "Posts a month or words a week tell an editor whether you can keep up with their calendar." },
      { t: "Name your style and tools", d: "AP style, Chicago, a house style guide, WordPress, Semrush or Ahrefs — write the ones you use, since postings often list them." },
      { t: "Link a few clips", d: "Three to five published pieces close to the job's subject work better than a long list. Write the link out in plain text." },
      { t: "Show how you get facts right", d: "Interviews, original sources and fact-checking set your writing apart, especially as editors watch for thin or unverified content." },
    ],
    faqs: [
      { q: "What's the difference between a content writer and a copywriter?", a: "Content writers mostly write longer pieces that inform, like articles and guides. Copywriters mostly write shorter text meant to get an action, like ads, landing pages and emails. Many roles mix both, so mirror the post's title and emphasis." },
      { q: "Should I include writing samples with my resume?", a: "Yes. Link a short portfolio or a few published clips. If your best work was ghostwritten or unbylined, ask permission or describe it without linking." },
      { q: "How do I show SEO skills without inflating them?", a: "Describe what you did — keyword research, topic clusters, refreshes — and the results you can stand behind, such as traffic growth on the posts you wrote." },
      { q: "Do I need a journalism or English degree?", a: "It helps but isn't required. Clear clips, subject knowledge and a record of meeting deadlines often matter more. List any degree you have under education." },
      { q: "How long should a content writer resume be?", a: "One page for most writers. Every line is also a writing sample, so keep it tight and free of errors." },
    ],
    related: ["marketing-coordinator", "marketing-manager", "social-media-manager"],
  },
  {
    slug: "social-media-manager",
    role: "Social Media Manager",
    group: "Creative",
    level: "Mid-level · 6 years experience",
    intro:
      "A social media manager resume that shows audience growth, engagement and paid results — with the platform, content and analytics keywords brand teams look for.",
    resume: {
      name: "Tasha Greene",
      headline: "Social Media Manager",
      contact: "Atlanta, GA · tasha.greene@email.com · linkedin.com/in/tashagreene",
      summary:
        "Social media manager with 6 years in consumer brands and hospitality. I set social media strategy, run short-form video and paid social, and handle analytics and reporting so leadership can see what social media marketing brings in.",
      jobs: [
        {
          title: "Social Media Manager",
          company: "Fernway Home Goods",
          dates: "Feb 2022 – Present",
          bullets: [
            "Own organic and paid social across Instagram, TikTok, Facebook, Pinterest and LinkedIn for a home goods brand with 650,000 followers",
            "Launched a short-form video program on TikTok and Instagram Reels; average engagement rate rose from 1.8% to 4.6% in 12 months",
            "Manage a $25K monthly paid social budget in Meta Ads Manager and TikTok Ads Manager, lowering cost per purchase by 31%",
            "Built an influencer marketing program with 40 micro-creators whose content now supplies about a third of our ad creative",
          ],
        },
        {
          title: "Social Media Specialist",
          company: "Southern Table Restaurant Group",
          dates: "Jun 2019 – Jan 2022",
          bullets: [
            "Ran social channels for 8 restaurant locations, planning a monthly content calendar and scheduling posts in Sprout Social",
            "Handled community management and social listening, answering 300+ comments and messages a week within 2 hours on average",
            "Shot and edited photo and video content on location and grew Instagram followers from 12,000 to 48,000",
          ],
        },
      ],
      education: "B.A. Communication, Georgia State University, 2019 · HubSpot Academy Social Media Marketing Certification",
      skills: ["Social media strategy", "Content calendar", "Short-form video", "Paid social", "Meta Ads Manager", "TikTok Ads Manager", "Sprout Social", "Canva", "CapCut", "Influencer marketing", "Community management", "Copywriting"],
    },
    whyItWorks:
      "Every channel comes with a number — followers, engagement rate, cost per purchase, response time — and the budget shows the level of trust the brand gives her. Organic, paid, creators and community are all covered, which is what most social media manager posts ask for.",
    summaries: [
      { level: "Entry level", text: "Communication graduate who ran Instagram and TikTok for a campus organization and a local bakery, growing the bakery's Instagram from 900 to 6,500 followers in a year." },
      { level: "Mid level", text: "Social media manager with 6 years in consumer brands. I raised average engagement from 1.8% to 4.6% with short-form video and cut paid social cost per purchase by 31%." },
      { level: "Senior / head of social", text: "Head of social who leads a team of 4, owns organic, paid and creator programs for a national brand and reports social's share of revenue to the CMO." },
    ],
    bullets: [
      { skill: "Engagement", weak: "Increased engagement", strong: "Launched a short-form video program; average engagement rate rose from 1.8% to 4.6% in 12 months" },
      { skill: "Paid social", weak: "Ran social ads", strong: "Manage a $25K monthly budget in Meta and TikTok Ads Manager and cut cost per purchase by 31%" },
      { skill: "Creators", weak: "Worked with influencers", strong: "Built a program with 40 micro-creators whose content now supplies about a third of our ad creative" },
      { skill: "Community", weak: "Replied to comments", strong: "Answered 300+ comments and messages a week within 2 hours on average" },
      { skill: "Growth", weak: "Grew followers", strong: "Grew a restaurant group's Instagram from 12,000 to 48,000 followers with on-location photo and video" },
      { skill: "Planning", weak: "Made a content calendar", strong: "Planned a monthly content calendar for 8 locations and scheduled every post in Sprout Social" },
    ],
    keywords: [
      "Social media strategy", "Social media marketing", "Content calendar", "Short-form video", "Instagram", "TikTok", "LinkedIn",
      "Paid social", "Meta Ads Manager", "Sprout Social", "Canva", "Influencer marketing", "Community management",
      "Social listening", "Engagement rate", "Analytics and reporting", "Copywriting", "HubSpot Academy Social Media Marketing Certification",
    ],
    keywordSort: {
      tools: ["Meta Ads Manager", "Sprout Social", "Canva"],
      credentials: ["HubSpot Academy Social Media Marketing Certification"],
    },
    tips: [
      { t: "Report results, not posting", d: "Engagement rate, reach, follower growth, click-through and cost per result show what your work did. \"Managed social accounts\" doesn't." },
      { t: "Name the platforms", d: "Instagram, TikTok, LinkedIn, Pinterest and YouTube audiences are different. List the ones you've grown, and match them to the brand's channels." },
      { t: "Separate organic and paid", d: "If you've run ads, say so with the budget and the result. Many social roles now expect both." },
      { t: "Name your tools", d: "Sprout Social, Hootsuite, Later, Meta Ads Manager, Canva and CapCut are common in postings. List the ones you use every week." },
      { t: "Link examples", d: "A short portfolio of posts, campaigns or videos you made helps a lot. Write the link out and only include work you're allowed to share." },
    ],
    faqs: [
      { q: "What metrics should a social media manager put on a resume?", a: "Use the ones your team tracked: engagement rate, reach, follower growth, click-through, conversions and cost per result for paid work. Include the before and after when you have it." },
      { q: "Do social media certifications matter?", a: "They can help early on, especially if the post names a tool. Free programs such as HubSpot Academy's Social Media Marketing Certification show you know the basics, but results from real accounts matter more." },
      { q: "Should I list follower counts?", a: "Yes, when they show growth you drove or the size of the audience you manage. Pair them with engagement or results so they don't look like vanity numbers." },
      { q: "How do I show crisis or community management?", a: "Describe the volume you handled and your response time, and mention escalation steps in general terms without sharing private details." },
      { q: "What's the difference between a social media manager and a coordinator?", a: "A coordinator mostly schedules, posts and reports. A manager sets strategy, owns budgets and creator programs, and explains results to leadership." },
    ],
    related: ["marketing-coordinator", "marketing-manager", "content-writer", "graphic-designer"],
  },

  // ─── Business ────────────────────────────────────────────────────────
  {
    slug: "supply-chain-analyst",
    role: "Supply Chain Analyst",
    group: "Business",
    photo: { src: "/images/photos/role-supply-chain-analyst.webp", alt: "Container ship being loaded by cranes at a port" },
    level: "Mid-level · 5 years experience",
    intro:
      "A supply chain analyst resume that shows forecast accuracy, inventory dollars and service levels — with the planning, ERP and analytics keywords supply chain managers search for.",
    resume: {
      name: "Kevin Tran",
      headline: "Supply Chain Analyst",
      contact: "Columbus, OH · kevin.tran@email.com · linkedin.com/in/kevintran",
      summary:
        "Supply chain analyst with 5 years in distribution and inventory management. I do supply chain analysis in SAP ERP, SQL and Power BI that helps planners keep the right stock in the right building without tying up cash.",
      jobs: [
        {
          title: "Supply Chain Analyst",
          company: "Midland Appliance Parts",
          dates: "Mar 2022 – Present",
          bullets: [
            "Own demand forecasting for 3,500 SKUs across 3 distribution centers, improving forecast accuracy from 68% to 81%",
            "Rebuilt safety stock and reorder points in SAP using service-level targets; inventory fell $2.4M while fill rate held at 97%",
            "Built Power BI dashboards on supplier KPIs — on-time delivery, lead time and inventory turns — used in the weekly S&OP meeting",
            "Ran a supplier lead-time analysis in SQL that moved 18 parts to a second supplier and cut stockouts by 22%",
          ],
        },
        {
          title: "Inventory Analyst",
          company: "Riverbend Distribution",
          dates: "Jul 2019 – Feb 2022",
          bullets: [
            "Ran ABC analysis and cycle count plans for a 250,000 sq ft warehouse, raising inventory record accuracy to 98.5%",
            "Automated weekly purchase order and backorder reports in Excel with Power Query, saving buyers about 6 hours a week",
            "Cleaned item master data for 9,000 SKUs ahead of a warehouse management system upgrade",
          ],
        },
      ],
      education: "B.S. Supply Chain Management, The Ohio State University, 2019 · ASCM Certified in Planning and Inventory Management (CPIM)",
      skills: ["Demand planning", "Forecasting", "Inventory optimization", "Safety stock", "S&OP", "SAP", "SQL", "Excel", "Power BI", "Power Query", "Supplier performance", "Data analysis"],
    },
    whyItWorks:
      "It sizes the job in SKUs, buildings and inventory dollars, then shows the trade-off a supply chain manager cares about: less inventory without hurting fill rate. The tools are named in the bullets where they were used, and the CPIM is written out in full.",
    summaries: [
      { level: "Entry level", text: "Supply chain management graduate with an inventory planning internship. Built an Excel reorder model for 400 SKUs and a Power BI dashboard of supplier on-time delivery." },
      { level: "Mid level", text: "Supply chain analyst with 5 years in distribution. I improved forecast accuracy from 68% to 81% and cut inventory by $2.4M while holding a 97% fill rate." },
      { level: "Senior / planning manager", text: "Supply planning manager who leads a team of 5 analysts and planners, runs monthly S&OP and owns inventory targets for a $300M product portfolio." },
    ],
    bullets: [
      { skill: "Forecasting", weak: "Made demand forecasts", strong: "Improved forecast accuracy from 68% to 81% across 3,500 SKUs and 3 distribution centers" },
      { skill: "Inventory", weak: "Reduced inventory", strong: "Rebuilt safety stock and reorder points in SAP; inventory fell $2.4M while fill rate held at 97%" },
      { skill: "Suppliers", weak: "Analyzed suppliers", strong: "Ran a lead-time analysis in SQL that moved 18 parts to a second supplier and cut stockouts by 22%" },
      { skill: "Reporting", weak: "Built dashboards", strong: "Built Power BI dashboards on supplier KPIs used in the weekly S&OP meeting" },
      { skill: "Accuracy", weak: "Did cycle counts", strong: "Ran ABC analysis and cycle count plans that raised inventory record accuracy to 98.5%" },
      { skill: "Automation", weak: "Made Excel reports", strong: "Automated weekly purchase order and backorder reports with Power Query, saving buyers about 6 hours a week" },
    ],
    keywords: [
      "Supply chain analysis", "Demand planning", "Forecasting", "Inventory management", "Inventory optimization", "Safety stock",
      "S&OP", "Supplier performance", "KPIs", "ABC analysis", "Data analysis", "SAP", "ERP", "SQL", "Excel", "Power BI",
      "Power Query", "CPIM",
    ],
    keywordSort: {
      tools: ["SAP", "ERP", "SQL", "Excel", "Power BI", "Power Query"],
      credentials: ["CPIM"],
    },
    tips: [
      { t: "Size your scope", d: "SKUs, sites, suppliers and inventory dollars tell a hiring manager the scale you plan for." },
      { t: "Show the trade-off", d: "Lower inventory only counts if service holds. Pair inventory or cost results with fill rate, on-time delivery or stockouts." },
      { t: "Name the ERP and analytics tools", d: "SAP, Oracle, Microsoft Dynamics, SQL, Excel and Power BI or Tableau are common filters. Write the ones you've used, in the bullet where you used them." },
      { t: "Write certifications in full", d: "Use the full name and the acronym, such as \"ASCM Certified in Planning and Inventory Management (CPIM)\", so both forms are searchable." },
      { t: "Use planning vocabulary carefully", d: "S&OP, safety stock, reorder points and ABC analysis are real screening terms. Only use the ones you've actually worked with." },
    ],
    faqs: [
      { q: "Which certifications help a supply chain analyst?", a: "ASCM's CPIM (Certified in Planning and Inventory Management) suits planning and inventory roles, and the CSCP (Certified Supply Chain Professional) covers the end-to-end chain. ASCM is the association that runs the APICS certifications." },
      { q: "Do I need SQL as a supply chain analyst?", a: "Many postings ask for it, along with Excel and a BI tool. If you use SQL, show it in a bullet with what the analysis changed." },
      { q: "How do I move from warehouse or buyer work into an analyst role?", a: "Lead with the analysis you already do — reports you built, counts you planned, data you cleaned — and quantify the result, such as hours saved or accuracy improved." },
      { q: "Should I list the forecasting method I use?", a: "Briefly, if the post asks for it, such as statistical forecasting in SAP or a demand planning tool. The result, like accuracy improved, matters more than the method name." },
      { q: "How long should my resume be?", a: "One page for most analysts with under about 8 years of experience. Keep the skills list focused on tools you use regularly." },
    ],
    related: ["logistics-coordinator", "data-analyst", "operations-manager", "business-analyst"],
  },
  {
    slug: "insurance-agent",
    role: "Insurance Agent",
    group: "Business",
    level: "Experienced · 6 years",
    intro:
      "An insurance agent resume that leads with your producer license and lines of authority, then shows premium written, retention and the size of your book — with the keywords agency owners screen for.",
    resume: {
      name: "Rachel Dunn",
      headline: "Licensed Insurance Agent (Property & Casualty, Life & Health)",
      contact: "Indianapolis, IN · rachel.dunn@email.com · (317) 555-0186",
      summary:
        "Licensed insurance agent with 6 years in personal lines insurance sales and service. I run a needs analysis with every household, explain coverage in plain words and keep clients through annual policy reviews.",
      jobs: [
        {
          title: "Insurance Agent",
          company: "Crossroads Insurance Agency",
          dates: "Apr 2021 – Present",
          bullets: [
            "Quote and sell auto, home, umbrella and life policies across 9 carriers for a book of 1,100 households",
            "Wrote $1.3M in new annual premium in 2025, 118% of my production goal, mostly from referrals and prospecting at local business events",
            "Keep a 91% client retention rate by running annual policy reviews and cross-selling umbrella and life coverage where it fits the client's needs",
            "Manage the book in Applied Epic and run comparative rating in EZLynx, keeping every file ready for carrier audits and compliance reviews",
          ],
        },
        {
          title: "Licensed Customer Service Representative",
          company: "Statewide Mutual Insurance",
          dates: "Jun 2018 – Mar 2021",
          bullets: [
            "Answered 60+ calls a day on billing, coverage questions and policy changes for personal lines customers",
            "Earned the Property & Casualty license in 2018 and the Life & Health license in 2020",
            "Provided claims support by taking first notice of loss for auto and property claims and explaining next steps with the adjuster",
          ],
        },
      ],
      education:
        "B.S. Business Administration, Ball State University, 2018 · Resident insurance producer license, State of Indiana: Property & Casualty, Life & Health · Nonresident licenses: Ohio, Kentucky",
      skills: ["Personal lines", "Property & casualty", "Life & health", "Quoting", "Needs analysis", "Policy reviews", "Cross-selling", "Risk assessment", "Customer retention", "Applied Epic", "EZLynx", "CRM", "Customer service"],
    },
    whyItWorks:
      "The license, lines of authority and states sit in the headline and education where an agency owner checks first. Results are in the numbers agencies run on — premium written, percentage of goal, retention and book size — and the tools are the agency systems named in postings.",
    summaries: [
      { level: "Entry level", text: "Newly licensed property and casualty agent with 2 years in customer service. Comfortable explaining coverage, handling 60+ calls a day and quoting auto and home policies." },
      { level: "Experienced", text: "Licensed P&C and Life & Health agent with 6 years in personal lines. I wrote $1.3M in new premium last year and keep a 91% client retention rate." },
      { level: "Agency manager", text: "Agency manager who leads a team of 6 producers and service staff, owns carrier relationships and grew the agency's book through commercial lines expansion." },
    ],
    bullets: [
      { skill: "Production", weak: "Sold insurance policies", strong: "Wrote $1.3M in new annual premium in 2025, 118% of my production goal" },
      { skill: "Retention", weak: "Kept clients happy", strong: "Keep a 91% client retention rate through annual policy reviews" },
      { skill: "Cross-selling", weak: "Sold additional products", strong: "Added umbrella and life coverage during policy reviews where it fit each client's needs" },
      { skill: "Book", weak: "Managed accounts", strong: "Manage a book of 1,100 households across 9 carriers in Applied Epic" },
      { skill: "Service", weak: "Answered phones", strong: "Answered 60+ calls a day on billing, coverage and policy changes for personal lines customers" },
      { skill: "Claims", weak: "Helped with claims", strong: "Took first notice of loss for auto and property claims and explained next steps with the adjuster" },
    ],
    keywords: [
      "Insurance producer license", "Property & casualty", "Life & health", "Personal lines", "Insurance sales", "Quoting",
      "Needs analysis", "Policy reviews", "Cross-selling", "Risk assessment", "Customer retention", "Prospecting",
      "Claims support", "Compliance", "Applied Epic", "EZLynx", "CRM", "Customer service",
    ],
    keywordSort: {
      tools: ["Applied Epic", "EZLynx", "CRM"],
      credentials: ["Insurance producer license", "Property & casualty", "Life & health"],
      soft: ["Customer service"],
    },
    tips: [
      { t: "Lead with license, lines and states", d: "Producer licenses are issued by each state, by line of authority. Write the lines you hold and the states — resident and nonresident — near the top." },
      { t: "Use production numbers", d: "New premium written, policies sold, percentage of goal and retention rate are the numbers agency owners compare." },
      { t: "Size your book", d: "Households, policies or premium under management shows how much business you can handle." },
      { t: "Say personal or commercial lines", d: "They need different knowledge. Name the kinds of policies you write, such as auto, home, umbrella, life or small business." },
      { t: "Name the agency software", d: "Applied Epic, EZLynx, AMS360 and HawkSoft are common in postings. List the systems you use daily." },
    ],
    faqs: [
      { q: "Do I need a license before applying for insurance agent jobs?", a: "Not always. Some agencies hire and sponsor you through licensing, but you can't sell or quote in a licensed capacity until your state issues the license. If you've passed the exam, say so and give the date." },
      { q: "How do I list nonresident licenses?", a: "Write the states after your resident license. Many states process nonresident applications and renewals through the National Insurance Producer Registry (NIPR), and employers can verify licenses through state insurance departments." },
      { q: "Should I put my license number on my resume?", a: "It's optional. Listing the license type, lines and state is usually enough; applications often ask for the number separately." },
      { q: "Do designations like CIC or CPCU help?", a: "Yes, especially for commercial lines or senior roles. The CIC (Certified Insurance Counselor) comes from The National Alliance for Insurance Education & Research and the CPCU from The Institutes. List them only once you've earned them." },
      { q: "How do I show sales results without bragging?", a: "State the numbers plainly — premium written, goal percentage, retention — and add how you earned them, such as referrals or policy reviews." },
    ],
    related: ["sales-representative", "account-manager", "customer-service-representative", "loan-officer"],
  },
  {
    slug: "construction-project-manager",
    role: "Construction Project Manager",
    group: "Business",
    photo: { src: "/images/photos/role-construction-project-manager.webp", alt: "Construction crew in hard hats and safety vests on a concrete slab at a building site" },
    level: "Senior · 10 years experience",
    intro:
      "A construction project manager resume that shows project size, schedule and budget results and a clean safety record — with the scheduling, cost and software keywords general contractors screen for.",
    resume: {
      name: "Daniel Okafor",
      headline: "Construction Project Manager",
      contact: "Nashville, TN · daniel.okafor@email.com · linkedin.com/in/danielokafor",
      summary:
        "Construction project manager with 10 years at commercial general contractors. I run projects from preconstruction to closeout with tight cost control, honest schedules and safe job sites.",
      jobs: [
        {
          title: "Project Manager",
          company: "Cumberland Builders",
          dates: "Jan 2020 – Present",
          bullets: [
            "Manage commercial projects from preconstruction to closeout, including a $28M medical office building and a $14M school addition",
            "Delivered 9 projects since 2020, 8 of them on or ahead of schedule and all within the owner's contingency",
            "Track budgets, RFIs, submittals and change orders in Procore, keeping owner-approved change orders under 3% of contract value",
            "Run weekly owner-architect-contractor meetings and coordinate 25+ subcontractors per job; the medical office building finished with zero lost-time incidents",
          ],
        },
        {
          title: "Assistant Project Manager",
          company: "Harpeth Construction Group",
          dates: "Jun 2016 – Dec 2019",
          bullets: [
            "Managed submittals and RFIs for $40M in multifamily and retail projects",
            "Built and updated CPM schedules in Primavera P6 with the superintendent, catching slips early in 3-week lookaheads",
            "Prepared quantity takeoffs and bid leveling for 12 subcontract packages in Bluebeam Revu",
          ],
        },
      ],
      education:
        "B.S. Construction Management, Middle Tennessee State University, 2016 · Project Management Professional (PMP) · LEED AP BD+C · OSHA 30-Hour Construction (OSHA 30)",
      skills: ["Preconstruction", "Budget management", "CPM scheduling", "Primavera P6", "Procore", "Bluebeam Revu", "Subcontractor management", "Change orders", "Contract administration", "Safety management"],
    },
    whyItWorks:
      "It leads with project types and dollar values, then gives the three results owners and contractors judge a PM on: schedule, cost and safety. The software and credentials are named exactly, and the earlier job shows the path from submittals and schedules to running whole projects.",
    summaries: [
      { level: "Project engineer", text: "Construction management graduate with 2 years as a project engineer, handling RFIs, submittals and meeting minutes on a $20M multifamily project in Procore." },
      { level: "Project manager", text: "Construction project manager with 10 years in commercial building. I've delivered 9 projects since 2020, 8 on or ahead of schedule, including a $28M medical office building." },
      { level: "Senior PM / director", text: "Senior project manager who oversees 3 PMs and a $90M annual project portfolio, owning client relationships, preconstruction estimates and risk reviews." },
    ],
    bullets: [
      { skill: "Schedule", weak: "Kept projects on time", strong: "Delivered 9 projects since 2020, 8 on or ahead of schedule and all within the owner's contingency" },
      { skill: "Cost control", weak: "Managed budgets", strong: "Kept owner-approved change orders under 3% of contract value by tracking budgets and RFIs in Procore" },
      { skill: "Scale", weak: "Managed large projects", strong: "Managed a $28M medical office building and a $14M school addition from preconstruction to closeout" },
      { skill: "Safety", weak: "Focused on safety", strong: "Coordinated 25+ subcontractors on a medical office building that finished with zero lost-time incidents" },
      { skill: "Scheduling", weak: "Made schedules", strong: "Built CPM schedules in Primavera P6 and caught slips early with 3-week lookaheads" },
      { skill: "Buyout", weak: "Helped with bids", strong: "Prepared quantity takeoffs and bid leveling for 12 subcontract packages in Bluebeam Revu" },
    ],
    keywords: [
      "Construction management", "Project management", "Preconstruction", "Budget management", "Cost control", "CPM scheduling",
      "Change orders", "RFIs", "Submittals", "Subcontractor management", "Contract administration", "Safety management",
      "Procore", "Primavera P6", "Bluebeam Revu", "PMP", "LEED AP", "OSHA 30",
    ],
    keywordSort: {
      tools: ["Procore", "Primavera P6", "Bluebeam Revu"],
      credentials: ["PMP", "LEED AP", "OSHA 30"],
    },
    tips: [
      { t: "Lead with project type and value", d: "\"$28M medical office building\" tells a hiring manager more than \"large commercial projects\". List the types you've built: healthcare, education, multifamily, retail or industrial." },
      { t: "Give schedule, cost and safety results", d: "Projects on schedule, change orders as a share of contract value and lost-time incidents are the numbers contractors and owners trust." },
      { t: "Name your software", d: "Procore, Primavera P6, Microsoft Project, Bluebeam Revu and Autodesk Construction Cloud are common filters. Write the ones you use." },
      { t: "Show who you coordinate", d: "Owners, architects, superintendents and the number of subcontractors show how big a team you hold together." },
      { t: "Write credentials in full once", d: "Use the full name and acronym, like \"Project Management Professional (PMP)\", and call OSHA cards by their course name." },
    ],
    faqs: [
      { q: "Which certifications help a construction project manager?", a: "The PMP from PMI is widely recognized, and with a four-year degree it calls for 36 months of project experience and 35 hours of project management education. The CCM, from CMAA's Construction Manager Certification Institute, is construction-specific and asks for at least 48 months of responsible-in-charge experience. LEED AP helps on green building work." },
      { q: "Is the OSHA 30 a certification?", a: "No. OSHA calls the 10- and 30-hour cards course completion cards, not a certification or license. List it by its name, such as \"OSHA 30-Hour Construction\"." },
      { q: "How do I list LEED credentials?", a: "Write the exact credential, such as \"LEED AP BD+C\". The credentials are earned by exam through GBCI, USGBC's credentialing body, and need continuing education every two years to stay active." },
      { q: "How do I move from project engineer to project manager?", a: "Show the parts of PM work you already own — budgets, schedules, buyout, owner meetings — and the size of the projects. A promotion to assistant PM is worth its own entry." },
      { q: "Should I list every project I've worked on?", a: "No. Pick the largest or most relevant few and give their type, value and result. A short project list under each job works if the post asks for it." },
    ],
    related: ["project-manager", "operations-manager", "electrician", "carpenter"],
  },
  {
    slug: "event-planner",
    role: "Event Planner",
    group: "Business",
    photo: { src: "/images/photos/role-event-planner.webp", alt: "Long banquet table set with wine glasses, white napkins and flower arrangements" },
    level: "Experienced · 7 years",
    intro:
      "An event planner resume that shows the size and number of events you run, the budgets you manage and how they come in — with the logistics, vendor and software keywords event teams search for.",
    resume: {
      name: "Monica Alvarez",
      headline: "Event Planner, CMP",
      contact: "Scottsdale, AZ · monica.alvarez@email.com · linkedin.com/in/monicaalvarez",
      summary:
        "Certified Meeting Professional with 7 years in event planning for corporate events, conferences and nonprofit galas. I handle meeting planning, event logistics and event management from contract to final invoice, so clients can focus on their guests.",
      jobs: [
        {
          title: "Event Planner",
          company: "Saguaro Hospitality Group",
          dates: "Feb 2021 – Present",
          bullets: [
            "Plan and run 45+ corporate meetings, incentive trips and conferences a year for groups of 50 to 1,200 attendees",
            "Manage event budgets up to $850K, negotiating room blocks, food and beverage and AV; brought the 2025 sales conference in 6% under budget",
            "Build registration sites and attendee emails in Cvent and floor plans in Social Tables",
            "Cut no-shows at a 3-day partner summit from 14% to 6% with reminder emails and a mobile event app",
          ],
        },
        {
          title: "Event Coordinator",
          company: "Valley Arts Foundation",
          dates: "May 2018 – Jan 2021",
          bullets: [
            "Coordinated 30+ fundraising galas, donor receptions and community events a year",
            "Managed vendor contracts, timelines and run-of-show documents for events of up to 400 guests",
            "Recruited and scheduled 60 volunteers for the annual gala, which raised $310K",
          ],
        },
      ],
      education: "B.S. Hospitality Management, Northern Arizona University, 2018 · Certified Meeting Professional (CMP), Events Industry Council",
      skills: ["Event planning", "Budget management", "Vendor management", "Contract negotiation", "Hotel room blocks", "Cvent", "Social Tables", "Run of show", "Registration", "On-site management"],
    },
    whyItWorks:
      "It sizes every event — number per year, attendees, budget — and gives results planners are judged on: under budget, fewer no-shows, money raised. The CMP is written out with the body that awards it, and the event software is named exactly.",
    summaries: [
      { level: "Entry level", text: "Hospitality graduate with a year as an event assistant at a downtown hotel, supporting 60+ meetings and weddings with room setup, vendor check-ins and run-of-show updates." },
      { level: "Experienced", text: "Certified Meeting Professional with 7 years in corporate and nonprofit events. I run 45+ events a year for up to 1,200 attendees and manage budgets up to $850K." },
      { level: "Events manager", text: "Events manager who leads a team of 4 planners, owns a multimillion-dollar annual events calendar and negotiates multi-year hotel and venue contracts." },
    ],
    bullets: [
      { skill: "Volume", weak: "Planned many events", strong: "Plan and run 45+ corporate meetings, incentive trips and conferences a year for up to 1,200 attendees" },
      { skill: "Budget", weak: "Managed event budgets", strong: "Brought a sales conference in 6% under an $850K budget by negotiating room blocks, food and beverage and AV" },
      { skill: "Attendance", weak: "Improved attendance", strong: "Cut no-shows at a 3-day partner summit from 14% to 6% with reminders and a mobile event app" },
      { skill: "Technology", weak: "Used event software", strong: "Built registration sites and attendee emails in Cvent and floor plans in Social Tables" },
      { skill: "Fundraising", weak: "Helped with a gala", strong: "Recruited and scheduled 60 volunteers for an annual gala that raised $310K" },
      { skill: "Logistics", weak: "Handled details", strong: "Managed vendor contracts, timelines and run-of-show documents for events of up to 400 guests" },
    ],
    keywords: [
      "Event planning", "Event management", "Corporate events", "Conferences", "Meeting planning", "Event logistics",
      "Budget management", "Vendor management", "Contract negotiation", "Room blocks", "Food and beverage", "Run of show",
      "Registration", "On-site management", "Cvent", "Social Tables", "CMP",
    ],
    keywordSort: {
      tools: ["Cvent", "Social Tables"],
      credentials: ["CMP"],
    },
    tips: [
      { t: "Size every event", d: "Number of events a year, attendees and budget tell a hiring manager what you can handle." },
      { t: "Show how it came in", d: "Under budget, attendance, no-show rate, sponsor revenue or money raised turn \"planned events\" into results." },
      { t: "Name the event type", d: "Corporate meetings, incentive trips, conferences, weddings and galas need different skills. Lead with the kind the employer runs." },
      { t: "List your software", d: "Cvent, Social Tables, Eventbrite and event apps are common in postings. Name the ones you've built events in." },
      { t: "Write the CMP in full", d: "Use \"Certified Meeting Professional (CMP)\" so both forms are searchable, and only list it once you've passed the exam." },
    ],
    faqs: [
      { q: "Do I need the CMP to work as an event planner?", a: "No. It's a respected credential from the Events Industry Council, but it has experience requirements — 36 months of full-time industry work, or 24 with a degree in event management or hospitality — plus continuing education before you can sit the exam. Early in your career, show your event results instead." },
      { q: "How do I show event results on a resume?", a: "Give the size, budget and outcome: attendees, cost against budget, attendance or no-show rates, survey scores or money raised." },
      { q: "Should I include weddings or volunteer events?", a: "Yes, if they show relevant skills like vendor management, budgets or on-site leadership. Describe them like any other job, with numbers." },
      { q: "What skills matter most for event planners?", a: "Budgeting, vendor and contract negotiation, logistics, registration systems and calm problem solving on site. Show each in a bullet with a real example." },
      { q: "How long should my resume be?", a: "One page for most planners. If you've run many events, pick the largest or most relevant and summarize the rest by type and volume." },
    ],
    related: ["marketing-coordinator", "project-manager", "executive-assistant"],
  },

  // ─── Trades & logistics ──────────────────────────────────────────────
  {
    slug: "plumber",
    role: "Plumber",
    group: "Trades & logistics",
    level: "Mid-level · 8 years experience",
    intro:
      "A plumber resume that leads with your license and shows the systems you install and repair, the inspections you pass and how you treat customers — with the keywords plumbing contractors search for.",
    resume: {
      name: "Luis Herrera",
      headline: "Journeyman Plumber",
      contact: "San Antonio, TX · luis.herrera@email.com · (210) 555-0137",
      summary:
        "Licensed journeyman plumber with 8 years in residential and light commercial plumbing. I work to the plumbing codes each city adopts, find the real cause of a leak or clog, and leave job sites clean.",
      jobs: [
        {
          title: "Journeyman Plumber",
          company: "Mission Trail Plumbing Co.",
          dates: "Jul 2021 – Present",
          bullets: [
            "Install and repair water supply and drain, waste and vent systems in new homes and light commercial buildings",
            "Rough-in and top-out an average of 4 new homes a week with PEX, copper and PVC, passing 95% of inspections on the first visit",
            "Diagnose leaks, clogs and water heater failures on 6–8 service calls a day, using camera inspection and hydro jetting on main lines",
            "Install tank and tankless water heaters, including gas connections and venting, and walk homeowners through repair and replacement options",
          ],
        },
        {
          title: "Plumber's Apprentice",
          company: "Lone Oak Plumbing Services",
          dates: "Jun 2017 – Jun 2021",
          bullets: [
            "Logged 8,000+ hours on residential and commercial jobs while registered as a Plumber's Apprentice in Texas",
            "Set underground drain lines, installed fixtures and soldered copper water lines under a licensed master plumber",
            "Worked safely in trenches and crawl spaces with no recordable incidents in 4 years",
          ],
        },
      ],
      education: "Journeyman Plumber License, Texas State Board of Plumbing Examiners · OSHA 10-Hour Construction (OSHA 10)",
      skills: ["Residential plumbing", "Commercial plumbing", "Rough-in", "Water heaters", "Leak detection", "Drain cleaning", "PEX", "Copper piping", "Soldering", "Blueprint reading", "Camera inspection", "Customer service"],
    },
    whyItWorks:
      "The license and the board that issued it are right under the name, bullets name the systems and materials, and results are shown the way contractors measure them: homes per week, first-visit inspection pass rate and calls per day.",
    summaries: [
      { level: "Apprentice", text: "Registered plumber's apprentice with 3 years on residential new construction and service calls. Comfortable with rough-in, PEX and copper, and holding an OSHA 10 card." },
      { level: "Journeyman", text: "Licensed journeyman plumber with 8 years in residential and light commercial work. I rough-in 4 homes a week and pass 95% of inspections on the first visit." },
      { level: "Master / foreman", text: "Master plumber and foreman who runs crews of 8 on multifamily and commercial projects, handling takeoffs, permits and inspector walk-throughs." },
    ],
    bullets: [
      { skill: "Inspections", weak: "Did work to code", strong: "Pass 95% of plumbing inspections on the first visit across 4 new homes a week" },
      { skill: "Service", weak: "Fixed leaks and clogs", strong: "Diagnose leaks, clogs and water heater failures on 6–8 service calls a day with camera inspection" },
      { skill: "Drain cleaning", weak: "Cleared drains", strong: "Cleared main line blockages with hydro jetting after camera inspection to confirm the cause" },
      { skill: "Water heaters", weak: "Installed water heaters", strong: "Install tank and tankless water heaters, including gas connections and venting" },
      { skill: "Customers", weak: "Good with customers", strong: "Walk homeowners through repair and replacement options before starting work" },
      { skill: "Safety", weak: "Followed safety rules", strong: "Worked in trenches and crawl spaces with no recordable incidents in 4 years" },
    ],
    keywords: [
      "Journeyman Plumber License", "Plumbing codes", "Residential plumbing", "Commercial plumbing", "Rough-in",
      "Drain, waste and vent", "Water heaters", "Tankless water heaters", "Leak detection", "Drain cleaning", "Hydro jetting",
      "Camera inspection", "PEX", "Copper piping", "Soldering", "Blueprint reading", "OSHA 10", "Customer service",
    ],
    keywordSort: {
      credentials: ["Journeyman Plumber License", "OSHA 10"],
      soft: ["Customer service"],
    },
    tips: [
      { t: "Put your license first", d: "Plumbing licenses are issued by states and in some places by cities or counties. Write the license level and who issued it — \"Journeyman Plumber, Texas\" — near the top." },
      { t: "Say what kind of work you do", d: "New construction, service and repair, remodels or commercial — plus the systems, like DWV, water supply, gas or water heaters." },
      { t: "Use inspection and volume results", d: "Inspections passed on the first visit, homes per week or calls per day show quality and speed in numbers contractors trust." },
      { t: "Name the materials and equipment", d: "PEX, copper, PVC and cast iron, and tools like drain cameras and jetters, are common screening terms." },
      { t: "Show you're good in people's homes", d: "Service plumbers represent the company. A line on how you explain options or keep job sites clean goes a long way." },
    ],
    faqs: [
      { q: "How do I list my plumbing license?", a: "Write the level (apprentice, journeyman or master), the state or city that issued it and, if the post asks, the license number. Requirements vary: in Texas, for example, the State Board of Plumbing Examiners requires at least 8,000 hours of experience before the journeyman exam." },
      { q: "Should I list apprenticeship hours?", a: "Yes. Hours and the kind of work you did tell a contractor how ready you are. Don't use the journeyman title until you hold the license." },
      { q: "Do I need to name the plumbing code I work to?", a: "It helps when you know it. Many places adopt the International Plumbing Code or the Uniform Plumbing Code, often with local changes, so say which you've worked under." },
      { q: "Is backflow testing a separate credential?", a: "In many places it is, with its own certification or registration. If you hold one, list it with the issuing body." },
      { q: "Should I list OSHA cards as certifications?", a: "List them by name, like \"OSHA 10-Hour Construction\". OSHA describes them as course completion cards, not certifications." },
    ],
    related: ["electrician", "hvac-technician", "maintenance-technician", "carpenter"],
  },
  {
    slug: "welder",
    role: "Welder",
    group: "Trades & logistics",
    photo: { src: "/images/photos/role-welder.webp", alt: "Welder in a welding helmet working with sparks flying" },
    level: "Experienced · 6 years",
    intro:
      "A welder resume that leads with your certifications and processes, then shows the codes you weld to and how your welds pass inspection — with the keywords fabrication shops screen for.",
    resume: {
      name: "Cody Jensen",
      headline: "Structural Welder",
      contact: "Tulsa, OK · cody.jensen@email.com · (918) 555-0153",
      summary:
        "Structural welder with 6 years in steel fabrication and production welding. I hold AWS Certified Welder qualifications from the American Welding Society in FCAW and SMAW, read shop drawings and weld symbols, and build parts that pass inspection.",
      jobs: [
        {
          title: "Structural Welder",
          company: "Red Fork Steel Fabricators",
          dates: "Mar 2021 – Present",
          bullets: [
            "Weld structural steel beams, columns and stair assemblies with FCAW and SMAW to AWS D1.1, following each welding procedure specification (WPS)",
            "Kept the weld reject rate under 1% on ultrasonically tested complete joint penetration welds in 2025",
            "Lay out, fit-up and tack assemblies from shop drawings with grinders, plasma cutters and magnetic drills, holding tolerances to 1/16 inch",
            "Train 3 new welders a year on shop safety, fit-up and reading weld symbols",
          ],
        },
        {
          title: "Production Welder",
          company: "Prairie Ag Equipment",
          dates: "Jun 2019 – Feb 2021",
          bullets: [
            "Welded frames and brackets with GMAW on a production line building 40+ farm equipment units a week",
            "Ran GTAW on stainless steel and aluminum parts for hydraulic tanks",
            "Inspected welds visually and with fillet gauges, with no lost-time injuries in 2 years",
          ],
        },
      ],
      education:
        "Welding Technology Certificate, Tulsa Tech, 2019 · American Welding Society (AWS) Certified Welder: FCAW and SMAW, structural steel (AWS D1.1) · OSHA 10-Hour General Industry (OSHA 10)",
      skills: ["SMAW (stick welding)", "FCAW", "GMAW (MIG welding)", "GTAW (TIG welding)", "Structural steel", "Blueprint reading", "Weld symbols", "Fit-up", "Plasma cutting", "Visual weld inspection"],
    },
    whyItWorks:
      "The certification is written with the full name of the American Welding Society, so no one mistakes it for a cloud credential, and it names the processes and code. Bullets show the code the welds meet, a reject rate on tested welds and the tolerances held.",
    summaries: [
      { level: "Entry level", text: "Welding technology graduate trained in SMAW, GMAW, FCAW and GTAW, with a 1G–3G plate test passed in school and 6 months as a fabrication helper." },
      { level: "Experienced", text: "Structural welder with 6 years and AWS Certified Welder qualifications in FCAW and SMAW. I weld to AWS D1.1 with a reject rate under 1% on tested welds." },
      { level: "Lead / inspector", text: "Lead welder and Certified Welding Inspector (CWI) who runs a shop crew of 8, writes weld procedures with engineering and handles third-party inspections." },
    ],
    bullets: [
      { skill: "Quality", weak: "Made good welds", strong: "Kept the reject rate under 1% on ultrasonically tested complete joint penetration welds" },
      { skill: "Code", weak: "Welded to code", strong: "Weld structural steel with FCAW and SMAW to AWS D1.1, following each WPS" },
      { skill: "Fit-up", weak: "Put parts together", strong: "Fit up and tack assemblies from shop drawings, holding tolerances to 1/16 inch" },
      { skill: "Processes", weak: "Can do TIG", strong: "Ran GTAW on stainless steel and aluminum parts for hydraulic tanks" },
      { skill: "Production", weak: "Worked on a production line", strong: "Welded frames and brackets with GMAW on a line building 40+ units a week" },
      { skill: "Training", weak: "Helped new hires", strong: "Train 3 new welders a year on shop safety, fit-up and reading weld symbols" },
    ],
    keywords: [
      "AWS Certified Welder", "AWS D1.1", "SMAW", "GMAW", "FCAW", "GTAW", "Stick welding", "MIG welding", "TIG welding",
      "Structural steel", "Stainless steel", "Aluminum", "Blueprint reading", "Weld symbols", "WPS", "Fit-up",
      "Plasma cutting", "OSHA 10",
    ],
    keywordSort: {
      credentials: ["AWS Certified Welder", "OSHA 10"],
    },
    tips: [
      { t: "Write out the American Welding Society", d: "\"AWS\" also means a cloud platform. Write \"American Welding Society (AWS) Certified Welder\" once so a recruiter or parser can't confuse them." },
      { t: "List process, position and material", d: "Say which processes you're certified in (SMAW, GMAW, FCAW, GTAW), the positions you've tested in and the materials, like carbon steel, stainless or aluminum." },
      { t: "Name the code", d: "AWS D1.1 for structural steel, API 1104 for pipelines or ASME Section IX for pressure work tells a shop what you're qualified for." },
      { t: "Show weld quality", d: "Reject rates, X-ray or ultrasonic test results and tolerances held are the numbers inspectors and foremen care about." },
      { t: "Keep certifications current", d: "Welder certifications usually need regular proof that you're still using the process. List only the ones that are active." },
    ],
    faqs: [
      { q: "What's the AWS Certified Welder program?", a: "It's the American Welding Society's performance-based certification. You weld a test at an AWS Accredited Test Facility, and to keep it active you send maintenance paperwork every six months showing you still use the process." },
      { q: "Is a company welder qualification the same as AWS certification?", a: "Not exactly. Many employers qualify welders to their own procedures under a code, and those qualifications often stay with that employer. An AWS certification is recorded by the American Welding Society. List both clearly." },
      { q: "What does it take to become a Certified Welding Inspector (CWI)?", a: "The CWI is also from the American Welding Society. It requires work experience and a three-part exam — fundamentals, a hands-on practical, and an open-book code test." },
      { q: "Should I list welding positions like 3G and 4G?", a: "Yes, for the tests you've passed. Positions tell a shop whether you can weld vertical and overhead, not just flat." },
      { q: "Do I need a welding school certificate?", a: "It helps, but it's not the same as a welder certification. List school under education and your welding certifications separately." },
    ],
    related: ["maintenance-technician", "electrician", "carpenter"],
  },
  {
    slug: "automotive-technician",
    role: "Automotive Technician",
    group: "Trades & logistics",
    photo: { src: "/images/photos/role-automotive-technician.webp", alt: "Automotive technician working under the open hood of a car in a repair shop" },
    level: "Experienced · 7 years",
    intro:
      "An automotive technician resume that leads with your ASE certifications and shows what you diagnose, how efficiently you work and how few repairs come back — with the keywords service managers search for.",
    resume: {
      name: "Brandon Hayes",
      headline: "Automotive Technician, ASE Master",
      contact: "Kansas City, MO · brandon.hayes@email.com · (816) 555-0118",
      summary:
        "ASE certified Master Automobile Technician with 7 years in independent and tire-and-service shops. I find drivability and electrical faults with a scan tool, lab scope and wiring diagrams instead of swapping parts.",
      jobs: [
        {
          title: "Automotive Technician",
          company: "Blue River Auto Center",
          dates: "Apr 2021 – Present",
          bullets: [
            "Diagnose engine performance, electrical and drivability problems on domestic and Asian vehicles using scan tools, a lab scope and wiring diagrams from ALLDATA",
            "Produce 150+ billed hours in a typical month at about 125% efficiency on flat-rate work",
            "Keep my comeback rate under 2% by road-testing every drivability repair and writing the cause and fix clearly on the repair orders",
            "Service A/C systems on R-134a and R-1234yf vehicles under EPA Section 609 certification",
          ],
        },
        {
          title: "General Service Technician",
          company: "Midway Tire & Service",
          dates: "Jun 2019 – Mar 2021",
          bullets: [
            "Performed oil changes, brake jobs and multi-point inspections on 12–15 vehicles a day",
            "Moved up from lube technician to general service in 9 months, taking on brakes and suspension and steering repairs",
            "Passed ASE A4 and A5 tests in my first year while working toward Master Technician status",
          ],
        },
      ],
      education:
        "A.A.S. Automotive Technology, Metropolitan Community College, 2019 · ASE Certified Master Automobile Technician (A1–A8) · ASE A9 Light Vehicle Diesel Engines · EPA Section 609 MVAC certification",
      skills: ["Engine diagnostics", "Electrical diagnostics", "Scan tools", "Lab scope", "Wiring diagrams", "Brakes", "Suspension and steering", "A/C service", "Preventive maintenance", "ALLDATA"],
    },
    whyItWorks:
      "The ASE Master status and the EPA Section 609 certification appear where a service manager looks first, and the tests are named by number. Results are in shop language — billed hours, efficiency and comeback rate — and the diagnostic tools show a tech who tests before replacing parts.",
    summaries: [
      { level: "Entry level", text: "Automotive technology graduate with ASE Entry-Level certifications and a year as a lube technician. Comfortable with oil service, tires, brakes and multi-point inspections." },
      { level: "Experienced", text: "ASE certified Master Automobile Technician with 7 years. I bill 150+ hours a month at about 125% efficiency and keep my comeback rate under 2%." },
      { level: "Shop foreman", text: "Shop foreman and ASE Master Technician with L1 Advanced Engine Performance, leading 6 technicians, handling the hardest diagnostics and checking repairs before delivery." },
    ],
    bullets: [
      { skill: "Diagnostics", weak: "Fixed check engine lights", strong: "Diagnose drivability and electrical faults with scan tools, a lab scope and wiring diagrams" },
      { skill: "Productivity", weak: "Worked fast", strong: "Produce 150+ billed hours a month at about 125% efficiency on flat-rate work" },
      { skill: "Quality", weak: "Did quality work", strong: "Keep my comeback rate under 2% by road-testing every drivability repair" },
      { skill: "A/C", weak: "Did AC repairs", strong: "Service R-134a and R-1234yf A/C systems under EPA Section 609 certification" },
      { skill: "Volume", weak: "Did oil changes", strong: "Performed oil changes, brake jobs and multi-point inspections on 12–15 vehicles a day" },
      { skill: "Growth", weak: "Got promoted", strong: "Moved up from lube technician to general service in 9 months" },
    ],
    keywords: [
      "ASE certified", "Master Automobile Technician", "EPA Section 609", "Engine diagnostics", "Electrical diagnostics",
      "Engine performance", "Drivability", "Scan tools", "Lab scope", "Wiring diagrams", "Brakes", "Suspension and steering",
      "A/C service", "Preventive maintenance", "Multi-point inspections", "Repair orders", "ALLDATA",
    ],
    keywordSort: {
      tools: ["Scan tools", "Lab scope", "ALLDATA"],
      credentials: ["ASE certified", "Master Automobile Technician", "EPA Section 609"],
    },
    tips: [
      { t: "Name each ASE test", d: "Write the tests you hold — A1 Engine Repair through A8 Engine Performance, or Master status — instead of only \"ASE certified\"." },
      { t: "Use shop numbers", d: "Billed hours, efficiency and comeback rate are how service managers compare technicians." },
      { t: "Show how you diagnose", d: "Scan tools, a lab scope, wiring diagrams and repair information systems show you test before you replace parts." },
      { t: "List refrigerants and EPA 609", d: "Anyone who services motor vehicle A/C for pay needs EPA Section 609 certification. Mention it with the refrigerants you've worked on." },
      { t: "Mention brands or dealer training", d: "If you're factory-trained or work mostly on certain makes, say so in a bullet or your summary." },
    ],
    faqs: [
      { q: "What does ASE Master Automobile Technician mean?", a: "It means you've passed ASE tests A1 through A8 and have the required hands-on experience. A9 Light Vehicle Diesel Engines isn't required for Master status, but you can list it separately." },
      { q: "Do ASE certifications expire?", a: "Yes. ASE certifications need to be renewed with a recertification test every five years, so list only the ones that are current." },
      { q: "Is EPA Section 609 certification required?", a: "Yes, for anyone who repairs or services motor vehicle air conditioning for pay. It's earned through an EPA-approved training and testing program." },
      { q: "How do I show flat-rate productivity on a resume?", a: "Give billed hours per week or month and your efficiency if your shop tracks it. Pair it with your comeback rate so it shows quality as well as speed." },
      { q: "I'm new to the trade. What should my resume focus on?", a: "Your training, any ASE Entry-Level or student certifications, the tasks you do confidently and your attendance and safety record." },
    ],
    related: ["hvac-technician", "maintenance-technician", "truck-driver"],
  },
  {
    slug: "carpenter",
    role: "Carpenter",
    group: "Trades & logistics",
    photo: { src: "/images/photos/role-carpenter.webp", alt: "Carpenter working at a bench in a wood shop" },
    level: "Journeyman · 9 years",
    intro:
      "A carpenter resume that shows your apprenticeship, the kind of carpentry you do and the size of the projects you build — with the framing, finish and safety keywords contractors search for.",
    resume: {
      name: "Jake Sorensen",
      headline: "Journeyman Carpenter",
      contact: "Boise, ID · jake.sorensen@email.com · (208) 555-0172",
      summary:
        "Journeyman carpenter with 9 years in rough carpentry and finish work on commercial, multifamily and residential projects. I lay out and frame to building codes and the drawings, and I lead small crews that stay on schedule.",
      jobs: [
        {
          title: "Journeyman Carpenter",
          company: "Treasure Valley Builders",
          dates: "Mar 2020 – Present",
          bullets: [
            "Frame wood and light-gauge steel walls, floors and roofs for commercial and multifamily buildings up to 4 stories",
            "Lead a crew of 4 on layout and framing; framed 6 apartment buildings since 2020, all on schedule, using a laser level and the superintendent's control lines",
            "Build concrete formwork for footings, walls and stairs, and hang doors, hardware and finish trim at closeout",
            "Use fall protection and scaffolding every day, with no recordable incidents in 9 years",
          ],
        },
        {
          title: "Carpenter Apprentice",
          company: "Snake River Construction",
          dates: "Jun 2016 – Feb 2020",
          bullets: [
            "Completed a 4-year registered carpentry apprenticeship combining on-the-job training with classroom instruction",
            "Framed and sheathed 50+ custom and production homes, including stairs, decks and roof trusses",
            "Learned blueprint reading and wall layout from plans, and installed cabinets and interior trim on remodels with no callbacks",
          ],
        },
      ],
      education: "Registered Carpentry Apprenticeship, 2016–2020 · OSHA 30-Hour Construction (OSHA 30)",
      skills: ["Framing", "Metal stud framing", "Concrete formwork", "Finish carpentry", "Trim carpentry", "Cabinet installation", "Blueprint reading", "Layout", "Laser level", "Power tools", "Hand tools", "Crew leadership"],
    },
    whyItWorks:
      "It shows range — framing, steel studs, formwork and finish — and sizes the work in stories, buildings and homes. The apprenticeship is listed like a job and under education, the OSHA card is named correctly, and the safety record covers the whole career.",
    summaries: [
      { level: "Apprentice", text: "Second-year carpentry apprentice on residential framing crews. Comfortable with layout, wall framing, sheathing and power tools, and holding an OSHA 10 card." },
      { level: "Journeyman", text: "Journeyman carpenter with 9 years in framing, formwork and finish work. I lead a crew of 4 and have framed 6 apartment buildings since 2020, all on schedule." },
      { level: "Foreman", text: "Carpentry foreman who runs crews of 15 on commercial projects, plans manpower and materials with the superintendent and handles layout from the drawings." },
    ],
    bullets: [
      { skill: "Framing", weak: "Did framing", strong: "Frame wood and light-gauge steel walls, floors and roofs for buildings up to 4 stories" },
      { skill: "Leadership", weak: "Led a crew", strong: "Lead a crew of 4 that framed 6 apartment buildings since 2020, all on schedule" },
      { skill: "Formwork", weak: "Built forms", strong: "Build concrete formwork for footings, walls and stairs" },
      { skill: "Finish work", weak: "Did trim", strong: "Installed cabinets and interior trim on remodels with no callbacks" },
      { skill: "Volume", weak: "Built houses", strong: "Framed and sheathed 50+ custom and production homes, including stairs, decks and roof trusses" },
      { skill: "Safety", weak: "Worked safely", strong: "Use fall protection and scaffolding daily, with no recordable incidents in 9 years" },
    ],
    keywords: [
      "Rough carpentry", "Framing", "Metal stud framing", "Concrete formwork", "Finish carpentry", "Trim carpentry",
      "Cabinet installation", "Blueprint reading", "Layout", "Building codes", "Laser level", "Power tools", "Hand tools",
      "Scaffolding", "Fall protection", "OSHA 30", "Crew leadership",
    ],
    keywordSort: {
      tools: ["Laser level", "Power tools", "Hand tools"],
      credentials: ["OSHA 30"],
      soft: ["Crew leadership"],
    },
    tips: [
      { t: "Say what kind of carpenter you are", d: "Framing, formwork, finish, cabinets or commercial interiors are different jobs. Lead with the work the posting asks for." },
      { t: "Size the projects", d: "Stories, square footage, number of homes or buildings and crew size tell a contractor what you can take on." },
      { t: "List your apprenticeship", d: "Treat a registered apprenticeship like a job with dates, and add it under education too. It shows structured training." },
      { t: "Name your tools", d: "Laser levels, total stations, nail guns and specialty saws are worth a mention if the posting lists them." },
      { t: "Show your safety record", d: "Fall protection, scaffolding and a clean incident record matter on every job site. Name OSHA cards by their course name." },
    ],
    faqs: [
      { q: "Do carpenters need a license?", a: "Usually not as individual workers. Contractor licensing varies by state and city, so if you run your own jobs, check what your area requires and list any license you hold." },
      { q: "How do I list a carpentry apprenticeship?", a: "Give the program, dates and the work you did. Registered apprenticeships combine on-the-job training with classroom instruction, so mention both. Use journeyman only once you've completed the program." },
      { q: "Is the OSHA 30 a certification?", a: "No. OSHA describes the 10- and 30-hour cards as course completion cards, not certifications. List it as \"OSHA 30-Hour Construction\"." },
      { q: "Should I include residential and commercial work?", a: "Yes, if you've done both. Many contractors value range, but lead with the type that matches the job." },
      { q: "How do I move up to foreman?", a: "Show crew leadership, layout from drawings and on-schedule results. A bullet about planning materials or training apprentices helps too." },
    ],
    related: ["electrician", "plumber", "construction-project-manager"],
  },
];
