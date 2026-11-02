import type { CoverLetterExample } from "@/lib/cover-letter-examples";

/** Cover letters for the roles in lib/resume-examples-more-f.ts (same fictional person). */
export const MORE_COVER_LETTERS_F: CoverLetterExample[] = [
  // ---------------------------------------------------------- Tech & product
  {
    slug: "frontend-developer",
    target: { title: "Senior Frontend Developer, Digital Banking", company: "Woodgrove Bank", hiringManager: "Priya Raman" },
    paragraphs: [
      "I'm applying for the Senior Frontend Developer role on Woodgrove Bank's digital banking team. At Northstar Ledger I build customer-facing features in React and TypeScript for a budgeting app used by 400,000 people a month, and your posting's focus on fast, accessible account pages is exactly the work I've been doing.",
      "The project I'd point to first is our move to Next.js. I moved the marketing site and account pages to server rendering, and mobile Largest Contentful Paint fell from 4.1s to 1.8s. Around the same time I led an accessibility pass against WCAG 2.1 AA and fixed 120+ issues found with axe and screen reader testing in NVDA and VoiceOver — the kind of work a bank can't treat as optional.",
      "I also try to make the next feature easier to build. I built a shared component library in Storybook that 4 product teams now use, with Playwright end-to-end tests on every pull request. Before Northstar, at Pixelworth Studio, I built 15+ responsive client sites and raised unit test coverage on a checkout widget from 35% to 80% with Jest and React Testing Library.",
      "I'd welcome the chance to talk about Woodgrove Bank's plans for its web app and where I could help. I'm available for a call most afternoons next week.",
    ],
    annotations: [
      "Names the role, gives the scale of the app she works on and ties it to the employer's stated focus.",
      "One project told with its before-and-after, plus an accessibility result framed for a regulated industry.",
      "Shows she builds for other developers too, and uses the agency job for range and testing results.",
      "A short, specific close with availability.",
    ],
    tips: [
      { t: "Lead with one measurable improvement", d: "A load-time, accessibility or bug result with a before-and-after says more than a list of frameworks." },
      { t: "Match their product", d: "If the company is a bank, a store or a media site, pick the result from your resume closest to what their users do." },
      { t: "Mention how you help other developers", d: "Component libraries, tests and code review show you think beyond your own tickets." },
    ],
    faqs: [
      { q: "Do frontend developers need a cover letter?", a: "It's often optional, but a short letter helps when you're changing industries, applying to a smaller team or writing to a hiring manager directly." },
      { q: "Should I link my GitHub in the letter?", a: "Only to something relevant, like a component library or a project close to their product. Link the specific repository, not just your profile." },
    ],
  },

  // ---------------------------------------------------------------- Creative
  {
    slug: "graphic-designer",
    target: { title: "Graphic Designer, Packaging & Brand", company: "Coho Winery", hiringManager: "Laura Bianchi" },
    paragraphs: [
      "I'm applying for the Graphic Designer role on Coho Winery's packaging and brand team. At Harborview Foods I design packaging, labels and in-store displays for 40+ specialty food products sold in 1,200 grocery stores, so I know what it takes for a label to stand out on a crowded shelf and still print cleanly.",
      "Most recently I led the packaging refresh for our 9-product sauce line. I built the system in Adobe Illustrator and InDesign, prepared print-ready files with dielines and Pantone color specs, and attended the press checks. Adding a prepress checklist cut our revision rounds with the printer from 4 to 2 on average.",
      "I also try to make the brand easy for everyone else to use. I wrote our brand guidelines and built Figma and Canva templates so the marketing team can make on-brand social media graphics without waiting for a designer. Before Harborview, at Copperline Creative, I designed logos, brochures, trade show graphics and digital ads for 25+ clients and made motion graphics in After Effects for 6 client campaigns.",
      "My portfolio, with the sauce line refresh and several label projects, is at behance.net/gholloway. I'd be glad to talk about Coho Winery's upcoming releases.",
    ],
    annotations: [
      "Connects her packaging work at scale to the employer's product: labels that compete on a shelf.",
      "One project from brief to press, with a production result an art director will notice.",
      "Brand systems for non-designers, plus agency range across clients and media.",
      "Points to specific portfolio pieces and asks about their work.",
    ],
    tips: [
      { t: "Point to the right portfolio pieces", d: "Name the two or three projects closest to the job so the reader knows where to look first." },
      { t: "Show you can finish the job", d: "Print production, press checks or developer handoff prove your work leaves the screen correctly." },
      { t: "Keep the letter's design simple", d: "Clean type and spacing are enough. The portfolio is where the visual work belongs." },
    ],
    faqs: [
      { q: "Do graphic designers need a cover letter?", a: "Often yes, especially for in-house roles. A short letter explains which portfolio pieces match the job and why." },
      { q: "Should my cover letter match my resume design?", a: "Using the same fonts and header is a nice touch, but keep it simple and easy to read as plain text." },
    ],
  },
  {
    slug: "content-writer",
    target: { title: "Content Writer, SEO", company: "Margie's Travel", hiringManager: "Hannah Clarke" },
    paragraphs: [
      "I'm applying for the SEO Content Writer role at Margie's Travel. I've spent 5 years writing content that ranks and gets read, and before my current B2B role I wrote web copy and blog posts for travel, retail and home services clients at Blue Ridge Media Group, including landing page copy for a regional tourism campaign that lifted newsletter sign-ups by 22%.",
      "At Ledgerly I write 6–8 blog posts and guides a month, from keyword research in Semrush to publishing in WordPress. By building topic clusters and refreshing 60 older posts, I helped grow organic blog traffic from 40,000 to 150,000 monthly sessions in 2 years.",
      "I care just as much about getting things right. I interview experts and customers for quotes, check every statistic against its original source, and edit to AP style and the house style guide. I also wrote 12 downloadable guides and the email sequences behind them, which brought in 3,800 marketing-qualified leads in 2025 — writing that has to earn trust before it asks for anything.",
      "I'd be glad to send travel clips and talk about the destinations Margie's Travel wants to grow next. Thank you for your time.",
    ],
    annotations: [
      "Leads with the travel experience that matches the employer, with a conversion result.",
      "Shows volume and process, then the main SEO result with its before-and-after.",
      "Covers accuracy and editing standards, plus a lead-generation result.",
      "Offers relevant clips and asks about their content plans.",
    ],
    tips: [
      { t: "Treat the letter as a writing sample", d: "Editors read it for clarity and tone. Keep sentences short, specific and free of filler." },
      { t: "Lead with the closest subject", d: "If you've written about their industry, say so first, even if it was an earlier job." },
      { t: "Show standards, not just speed", d: "Fact-checking, interviews and style guides set you apart from writers who only promise volume." },
    ],
    faqs: [
      { q: "Should I attach writing samples?", a: "Link two or three clips close to the job, or attach them if the posting asks. Mention in the letter which ones to read first." },
      { q: "How do I write a cover letter without published clips?", a: "Point to class, personal or volunteer pieces you can share, and offer a short paid or unpaid test only if you're comfortable with the terms." },
    ],
  },
  {
    slug: "social-media-manager",
    target: { title: "Social Media Manager", company: "Adventure Works Cycles", hiringManager: "Marcus Lee" },
    paragraphs: [
      "I'm applying for the Social Media Manager role at Adventure Works Cycles. At Fernway Home Goods I own organic and paid social across Instagram, TikTok, Facebook, Pinterest and LinkedIn for a brand with 650,000 followers, and your posting's push into short-form video is where I've had my biggest results.",
      "I launched our short-form video program on TikTok and Instagram Reels, and average engagement rate rose from 1.8% to 4.6% in 12 months. I also manage a $25K monthly paid social budget in Meta Ads Manager and TikTok Ads Manager and have lowered cost per purchase by 31%.",
      "Some of our best content doesn't come from us. I built an influencer marketing program with 40 micro-creators whose videos now supply about a third of our ad creative. Before Fernway, I ran social for 8 restaurant locations at Southern Table Restaurant Group, answering 300+ comments and messages a week within 2 hours on average and growing Instagram from 12,000 to 48,000 followers.",
      "I'd be glad to share a few campaigns and talk about how Adventure Works Cycles wants to reach riders this season. Thank you for considering my application.",
    ],
    annotations: [
      "Gives the size of the audience she manages and ties it to the employer's stated priority.",
      "Two results: organic engagement and paid efficiency, each with its number.",
      "Creator program and community work, using an earlier job for growth and response time.",
      "Offers examples and asks about their audience.",
    ],
    tips: [
      { t: "Give organic and paid results", d: "Many teams want both. One number for each shows you can grow an audience and spend a budget well." },
      { t: "Mention their channels", d: "Look at where the brand posts and lead with your results on those platforms." },
      { t: "Offer examples", d: "A short link to campaigns or videos you made helps more than describing them." },
    ],
    faqs: [
      { q: "Should a social media cover letter be casual?", a: "It can be warm and direct, but keep it professional. Match the brand's tone without using slang or emojis." },
      { q: "Should I mention follower counts?", a: "Yes, when they show the size of the audience you manage or growth you drove. Pair them with engagement or results." },
    ],
  },

  // ---------------------------------------------------------------- Business
  {
    slug: "supply-chain-analyst",
    target: { title: "Senior Supply Chain Analyst", company: "Wide World Importers", hiringManager: "Jorge Medina" },
    paragraphs: [
      "I'm applying for the Senior Supply Chain Analyst role at Wide World Importers. At Midland Appliance Parts I own demand forecasting for 3,500 SKUs across 3 distribution centers, and your posting's focus on balancing inventory against long supplier lead times is the problem I work on every week.",
      "My biggest result came from rebuilding safety stock and reorder points in SAP around service-level targets. Inventory fell $2.4M while fill rate held at 97%. Over the same period I improved forecast accuracy from 68% to 81%.",
      "I also look hard at suppliers. A lead-time analysis I ran in SQL moved 18 parts to a second supplier and cut stockouts by 22%, and the Power BI dashboards I built on supplier KPIs are now used in our weekly S&OP meeting. Before Midland, as an inventory analyst at Riverbend Distribution, I raised inventory record accuracy to 98.5% and automated buyer reports with Power Query. I hold the ASCM CPIM.",
      "I'd welcome the chance to talk about your supplier base and how Wide World Importers plans inventory for its busiest months. Thank you for your time.",
    ],
    annotations: [
      "Gives the scope of his planning and links it to the employer's stated challenge.",
      "One clear trade-off result — less inventory, same service — plus forecast accuracy.",
      "Supplier analysis, reporting, earlier inventory work and a certification.",
      "Closes on their suppliers and peak season, where an analyst earns their keep.",
    ],
    tips: [
      { t: "Lead with scope", d: "SKUs, sites and suppliers tell a supply chain manager your level in one sentence." },
      { t: "Pair cost with service", d: "Inventory or cost cuts mean more when fill rate or on-time delivery held steady." },
      { t: "Name the systems they use", d: "If the posting names SAP, Oracle or a planning tool, say how you've used it." },
    ],
    faqs: [
      { q: "Should I explain my forecasting method?", a: "Briefly, if it's relevant to the posting. Hiring managers care more about the accuracy you achieved and how planners used it." },
      { q: "How technical should the letter be?", a: "Use the terms in the posting, like S&OP or safety stock, but keep each paragraph focused on a result." },
    ],
  },
  {
    slug: "insurance-agent",
    target: { title: "Licensed Personal Lines Agent", company: "Contoso Insurance", hiringManager: "Denise Walker" },
    paragraphs: [
      "I'm applying for the Licensed Personal Lines Agent position at Contoso Insurance. I hold an Indiana resident producer license for Property & Casualty and Life & Health, with nonresident licenses in Ohio and Kentucky, and I have 6 years in personal lines sales and service.",
      "At Crossroads Insurance Agency I quote and sell auto, home, umbrella and life policies across 9 carriers for a book of 1,100 households. In 2025 I wrote $1.3M in new annual premium, 118% of my production goal, mostly from referrals and prospecting at local business events.",
      "I keep the clients I write. I run an annual policy review with every household, which is where most of my umbrella and life sales come from, and I keep a 91% client retention rate. I manage the book in Applied Epic and run comparative rating in EZLynx. I started on the service side at Statewide Mutual Insurance, answering 60+ calls a day on billing, coverage and policy changes and taking first notice of loss on claims.",
      "I'd be glad to talk about Contoso Insurance's carriers and how your agents build their books. Thank you for considering my application.",
    ],
    annotations: [
      "License, lines of authority and states in the opening, the first thing an agency checks.",
      "Book size, carrier count and a production result against goal.",
      "Retention, how she cross-sells responsibly, systems and a service background.",
      "A practical close about carriers and book-building.",
    ],
    tips: [
      { t: "Open with your license", d: "State the lines of authority and states you're licensed in before anything else." },
      { t: "Use production and retention", d: "Premium written against goal and retention rate are the two numbers agency owners look for." },
      { t: "Show how you sell", d: "One line on needs analysis or policy reviews shows you sell coverage clients need." },
    ],
    faqs: [
      { q: "I'm not licensed yet. Should I still apply?", a: "Yes, if the posting says the agency will sponsor licensing. Say when you plan to take the exam and point to sales or service experience." },
      { q: "Should I mention the carriers I've worked with?", a: "A number is usually enough. Name specific carriers only if the agency appoints with them too." },
    ],
  },
  {
    slug: "construction-project-manager",
    target: { title: "Senior Project Manager, Healthcare", company: "A. Datum Construction", hiringManager: "Robert Chen" },
    paragraphs: [
      "I'm applying for the Senior Project Manager role on A. Datum Construction's healthcare team. At Cumberland Builders I've managed commercial projects from preconstruction to closeout, including a $28M medical office building, and your posting describes the same kind of occupied-campus healthcare work.",
      "I've delivered 9 projects since 2020, 8 of them on or ahead of schedule and all within the owner's contingency. I track budgets, RFIs, submittals and change orders in Procore, and I've kept owner-approved change orders under 3% of contract value.",
      "Safety and coordination go together. I run weekly owner-architect-contractor meetings and coordinate 25+ subcontractors per job, and the medical office building finished with zero lost-time incidents. Before Cumberland, as an assistant project manager at Harpeth Construction Group, I built CPM schedules in Primavera P6 and handled submittals and RFIs for $40M in multifamily and retail work. I hold the PMP, LEED AP BD+C and OSHA 30.",
      "I'd welcome the chance to talk about your upcoming healthcare projects and how A. Datum Construction staffs them. Thank you for your time.",
    ],
    annotations: [
      "Opens with his most relevant project and its value, matched to the employer's sector.",
      "Schedule and cost results, the two things owners ask about first.",
      "Safety, coordination, earlier scheduling work and credentials.",
      "Closes on their pipeline and staffing.",
    ],
    tips: [
      { t: "Match project type", d: "Healthcare, education or multifamily experience matters. Lead with the type the employer builds." },
      { t: "Give schedule, cost and safety", d: "One number for each covers what a contractor needs to know." },
      { t: "List credentials once", d: "Name your PMP, LEED or OSHA training near the end instead of opening with them." },
    ],
    faqs: [
      { q: "Should I list all my projects in the cover letter?", a: "No. Pick one or two that match the job and leave the rest for your resume or a project list." },
      { q: "How do I address a sector I haven't built in?", a: "Point to the closest work, such as occupied buildings or tight schedules, and say what you'd need to learn." },
    ],
  },
  {
    slug: "event-planner",
    target: { title: "Senior Event Planner, Conferences & Groups", company: "Alpine Ski House", hiringManager: "Erin Novak" },
    paragraphs: [
      "I'm applying for the Senior Event Planner role on Alpine Ski House's conferences and groups team. I'm a Certified Meeting Professional, and at Saguaro Hospitality Group I plan and run 45+ corporate meetings, incentive trips and conferences a year for groups of 50 to 1,200 attendees.",
      "I manage event budgets up to $850K, negotiating room blocks, food and beverage and AV. Our 2025 sales conference came in 6% under budget. I build registration sites and attendee emails in Cvent and floor plans in Social Tables, and at a 3-day partner summit I cut no-shows from 14% to 6% with reminder emails and a mobile event app.",
      "I started in nonprofit events at Valley Arts Foundation, coordinating 30+ galas, donor receptions and community events a year and running vendor contracts and run-of-show documents for events of up to 400 guests. I also recruited and scheduled 60 volunteers for the annual gala, which raised $310K. That work taught me to stay calm when a vendor runs late and the doors open on time anyway.",
      "I'd be glad to talk about the groups Alpine Ski House hosts and your busiest seasons. Thank you for considering my application.",
    ],
    annotations: [
      "Credential, event volume and group sizes in the opening.",
      "Budget, software and an attendance result, each with a number.",
      "Earlier nonprofit work for range, a fundraising result and how she handles pressure on site.",
      "Closes on their groups and peak seasons.",
    ],
    tips: [
      { t: "Size your events", d: "Events per year, attendees and budgets tell a hiring manager what you can handle." },
      { t: "Show one result per area", d: "Budget, attendance and fundraising results are easy to compare." },
      { t: "Show how you handle problems", d: "One line about staying calm on site is worth including. Events never go exactly to plan." },
    ],
    faqs: [
      { q: "Should I mention my CMP in the first paragraph?", a: "Yes, if the posting lists it as required or preferred. Otherwise it can go later." },
      { q: "How do I apply for corporate events with a nonprofit background?", a: "Lead with transferable results: budgets, vendor contracts, attendee numbers and money raised." },
    ],
  },

  // ------------------------------------------------------- Trades & logistics
  {
    slug: "plumber",
    target: { title: "Service Plumber (Journeyman)", company: "Northwind Plumbing & Mechanical", hiringManager: "Tony Ramirez" },
    paragraphs: [
      "I'm applying for the journeyman service plumber position at Northwind Plumbing & Mechanical. I hold a Texas Journeyman Plumber License and have 8 years in residential and light commercial plumbing, and at Mission Trail Plumbing Co. I run 6–8 service calls a day on leaks, clogs and water heater failures.",
      "I find the real cause before I start work. I use camera inspection and hydro jetting on main lines, install tank and tankless water heaters with gas connections and venting, and walk homeowners through repair and replacement options so they can decide.",
      "On new construction I rough-in and top-out an average of 4 homes a week with PEX, copper and PVC, and I pass 95% of inspections on the first visit. I came up through Lone Oak Plumbing Services, logging 8,000+ hours as a registered apprentice with no recordable incidents in 4 years.",
      "I'd be glad to talk about your service area and call volume. Thank you for your time.",
    ],
    annotations: [
      "License, experience and daily service volume up front.",
      "How he diagnoses and treats customers, the core of a service role.",
      "New construction speed, inspection record, apprenticeship and safety.",
      "A short close about the job itself.",
    ],
    tips: [
      { t: "Lead with license and state", d: "Say journeyman or master and who issued it in the first sentence." },
      { t: "Use an inspection result", d: "Inspections passed on the first visit is a number contractors trust." },
      { t: "Show how you talk to customers", d: "Service plumbers work in people's homes. One line on explaining options helps." },
    ],
    faqs: [
      { q: "Do plumbers need a cover letter?", a: "Many shops hire from an application or a phone call. A short letter helps for service, lead or commercial roles, or when the posting asks for one." },
      { q: "What should a plumber's cover letter include?", a: "Your license, the type of work you do, a volume or inspection result and your safety record." },
    ],
  },
  {
    slug: "welder",
    target: { title: "Structural Welder (FCAW/SMAW)", company: "Fabrikam Industrial", hiringManager: "Wayne Fischer" },
    paragraphs: [
      "I'm applying for the structural welder position at Fabrikam Industrial. I hold American Welding Society (AWS) Certified Welder qualifications in FCAW and SMAW for structural steel, and at Red Fork Steel Fabricators I weld beams, columns and stair assemblies to AWS D1.1, following each WPS.",
      "I build to pass inspection. I kept my reject rate under 1% on ultrasonically tested complete joint penetration welds in 2025, and I fit up and tack assemblies from shop drawings to tolerances of 1/16 inch. I also train 3 new welders a year on shop safety, fit-up and reading weld symbols. Before that, at Prairie Ag Equipment, I ran GMAW on a production line and GTAW on stainless steel and aluminum, with no lost-time injuries in 2 years.",
      "I'd be glad to come in for a weld test. Thank you for considering my application.",
    ],
    annotations: [
      "Certification with the full society name, processes and code, the first things a shop checks.",
      "Weld quality, fit-up tolerance, training others and range across processes and materials.",
      "A short close offering the practical next step most shops use.",
    ],
    tips: [
      { t: "Keep it short", d: "Two or three short paragraphs are enough. Your weld test will say the rest." },
      { t: "Name processes and code", d: "Say which processes you're certified in and the code you weld to, such as AWS D1.1." },
      { t: "Offer a weld test", d: "Most shops test before hiring. Offering one shows confidence." },
    ],
    faqs: [
      { q: "Do welders need a cover letter?", a: "Usually not. A few lines help when you apply by email, want a specific shop or are moving into structural or pipe work." },
      { q: "Should I write out American Welding Society?", a: "Yes, once. \"AWS\" alone can be confused with a cloud platform by a recruiter or a parser." },
    ],
  },
  {
    slug: "automotive-technician",
    target: { title: "Master Automotive Technician", company: "Contoso Motors", hiringManager: "Steve Kowalski" },
    paragraphs: [
      "I'm applying for the Master Automotive Technician position at Contoso Motors. I'm an ASE certified Master Automobile Technician (A1–A8) with A9 as well, I hold EPA Section 609 certification, and I have 7 years in independent and tire-and-service shops.",
      "Diagnostics is the part of the job I like most. At Blue River Auto Center I diagnose engine performance, electrical and drivability problems with scan tools, a lab scope and wiring diagrams instead of swapping parts, and I road-test every drivability repair. That keeps my comeback rate under 2%.",
      "I also keep work moving. I produce 150+ billed hours in a typical month at about 125% efficiency on flat-rate work, and I write the cause and fix clearly on every repair order so the advisor can explain it. I started as a lube technician at Midway Tire & Service and moved up to general service in 9 months.",
      "I'd be glad to talk about the vehicles you see most and how your shop dispatches diagnostic work. Thank you for your time.",
    ],
    annotations: [
      "Certifications by test number and experience, all a service manager screens for.",
      "How he diagnoses, with a comeback rate that proves it.",
      "Productivity in shop numbers and a quick promotion that shows drive.",
      "A practical close about their work mix.",
    ],
    tips: [
      { t: "Name your ASE tests", d: "Write Master status or the test numbers you hold, plus EPA Section 609." },
      { t: "Give billed hours and comebacks", d: "Productivity and quality together are what service managers compare." },
      { t: "Show how you diagnose", d: "One line about your tools and process sets you apart from parts-swappers." },
    ],
    faqs: [
      { q: "Do automotive technicians need a cover letter?", a: "Many shops don't require one. A short letter helps for dealer, diagnostic or lead roles, or when you're moving to a new area." },
      { q: "Should I mention the tools I own?", a: "If the posting asks, yes. A line saying you have a full professional tool set is enough." },
    ],
  },
  {
    slug: "carpenter",
    target: { title: "Lead Carpenter, Multifamily", company: "Litware Construction", hiringManager: "Greg Thompson" },
    paragraphs: [
      "I'm applying for the lead carpenter position on Litware Construction's multifamily team. I'm a journeyman carpenter with 9 years in framing, formwork and finish work, and at Treasure Valley Builders I lead a crew of 4 that has framed 6 apartment buildings since 2020, all on schedule.",
      "I frame wood and light-gauge steel for buildings up to 4 stories, lay out from the superintendent's control lines with a laser level, and build concrete formwork for footings, walls and stairs. I came up through a 4-year registered apprenticeship at Snake River Construction, framing 50+ homes, and I've worked with fall protection and scaffolding every day with no recordable incidents in 9 years. I hold OSHA 30.",
      "I'd be glad to talk about your upcoming projects and how your crews are set up. Thank you for your time.",
    ],
    annotations: [
      "Experience, crew size and an on-schedule result matched to multifamily work.",
      "Range of carpentry, apprenticeship, safety record and training in one paragraph.",
      "A plain close about their projects and crews.",
    ],
    tips: [
      { t: "Lead with the work that matches", d: "If the job is framing, open with framing. If it's finish work, start there." },
      { t: "Size your projects", d: "Stories, buildings and crew size tell a superintendent what you can handle." },
      { t: "Mention safety", d: "Fall protection, scaffolding and a clean record are worth one sentence." },
    ],
    faqs: [
      { q: "Do carpenters need a cover letter?", a: "Usually not. A short letter helps for lead or foreman roles, union or contractor applications that ask for one, or when you apply by email." },
      { q: "Should I mention my apprenticeship in the letter?", a: "Yes, briefly. A registered apprenticeship shows structured training, and it's quick to say." },
    ],
  },
];
