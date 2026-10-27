/**
 * Cover letter examples (/cover-letter-examples/[slug]), one per resume example and
 * written by the same fictional person, so each pair reads as one application.
 * Names, companies and numbers are illustrative.
 */

export type CoverLetterExample = {
  /** Same slug as the matching resume example. */
  slug: string;
  /** Job the letter applies for (fictional employer). */
  target: { title: string; company: string; hiringManager: string };
  /** Letter body, one string per paragraph, without greeting or sign-off. */
  paragraphs: string[];
  /** What each paragraph is doing, shown next to the letter. */
  annotations: string[];
  tips: { t: string; d: string }[];
  faqs: { q: string; a: string }[];
};

export const COVER_LETTER_EXAMPLES: CoverLetterExample[] = [
  {
    slug: "software-engineer",
    target: { title: "Staff Software Engineer, Payments", company: "Relecloud", hiringManager: "Elena Park" },
    paragraphs: [
      "I'm applying for the Staff Software Engineer role on Relecloud's payments team. For the last three years I've owned the billing service at Cascade Cloud, which now handles 3 million requests a day at 99.99% uptime — the kind of reliability your posting says the new payments platform has to start with.",
      "The work I'm proudest of is the move from REST polling to event streaming for invoicing. Invoices used to take 40 seconds to appear for customers; after the change they take 2. I wrote the design, ran the migration in stages behind feature flags and kept both paths live until the numbers matched. In the same period I rightsized our Kubernetes clusters and cut infrastructure costs by $420K a year.",
      "You mention that the payments team is growing quickly. At Cascade I've mentored five engineers, and two have since been promoted to senior. Before that, at Parcelly, I split a monolith into 12 services with zero-downtime deploys and raised test coverage from 41% to 83%, which halved our production incidents. I care about systems that are easy for the next engineer to change safely, not just fast on day one.",
      "I'd welcome the chance to talk about how Relecloud plans to scale payments over the next year and where I could help. I'm available for a call any afternoon next week.",
    ],
    annotations: [
      "Names the exact role and leads with the most relevant number: uptime at scale.",
      "One project told properly — the problem, what he did, the result — plus a cost saving.",
      "Answers the employer's stated need (a growing team) with mentoring and engineering-quality results.",
      "A short, specific close with a clear next step and availability.",
    ],
    tips: [
      { t: "Pick one system to explain", d: "A short story about one service you designed or rescued says more than a list of languages. Include the scale and the before-and-after." },
      { t: "Match their stack, briefly", d: "If the posting names Go, Kafka or AWS, mention the ones you've used in production in one sentence — the resume carries the full list." },
      { t: "Show how you work with people", d: "Code reviews, mentoring and incident ownership matter more at senior levels. One concrete example is enough." },
    ],
    faqs: [
      { q: "Do software engineers need a cover letter?", a: "Many applications make it optional, but a short, specific letter helps when you're changing domains, applying to a smaller company or reaching out to a hiring manager directly." },
      { q: "Should I link to GitHub in my cover letter?", a: "Only if there's something relevant to show, such as a project close to the team's work. Point to the specific repository rather than your whole profile." },
    ],
  },
  {
    slug: "product-manager",
    target: { title: "Senior Product Manager, Patient Experience", company: "Proseware Health", hiringManager: "David Osei" },
    paragraphs: [
      "I'm applying for the Senior Product Manager role on Proseware Health's patient experience team. At Brightpath Health I launched patient self-scheduling across 41 clinics and cut no-shows by 23% — and your posting describes a very similar problem in your appointment flow.",
      "That launch started with listening. I ran more than 30 interviews with front-desk staff, clinicians and patients, and found that most no-shows came from people who couldn't easily reschedule. We built rescheduling into the reminder message first, shipped in three releases with a team of 9 engineers and 2 designers, and measured each step before expanding it.",
      "Healthcare products also live or die on trust. I've worked closely with clinical, legal and sales teams to ship HIPAA-compliant messaging, and I'm comfortable making the trade-offs that come with regulated data. Earlier, as an associate PM at Fieldnote, I raised week-1 activation from 38% to 57% and set up an A/B testing practice that four other product teams adopted — habits I'd bring to Proseware's growth goals.",
      "I'd love to hear where the patient experience roadmap is headed and talk about how I could help. Thank you for considering my application.",
    ],
    annotations: [
      "Connects her biggest result directly to the problem named in the posting.",
      "Shows how she works — research, scoping, staged releases — not just the outcome.",
      "Addresses a domain concern (regulated data) and adds a second, different kind of result.",
      "Invites a conversation about their roadmap, which keeps the focus on the employer.",
    ],
    tips: [
      { t: "Lead with an outcome, not a title", d: "\"Cut no-shows by 23%\" tells a hiring manager more than \"6 years of product experience.\"" },
      { t: "Show your process once", d: "One short example of how you found and scoped a problem shows judgment better than listing frameworks." },
      { t: "Mirror the company's problem", d: "Read the posting and their product, then pick the result from your resume that's closest to what they're trying to fix." },
    ],
    faqs: [
      { q: "How long should a product manager cover letter be?", a: "Three or four short paragraphs, well under a page. Hiring managers skim — make the first two sentences carry your strongest point." },
      { q: "Should I mention specific features of their product?", a: "Yes, if you can do it accurately and briefly. A sentence showing you've used the product and noticed something real beats general praise." },
    ],
  },
  {
    slug: "data-analyst",
    target: { title: "Senior Data Analyst, Merchandising", company: "Tailwind Traders", hiringManager: "Sarah Lindqvist" },
    paragraphs: [
      "I'm applying for the Senior Data Analyst role on Tailwind Traders' merchandising team. At Northfield Retail I built a demand forecast in Python that reduced stockouts by 17% across 120 stores, and your posting's focus on inventory planning is exactly the work I want to keep doing.",
      "The forecast mattered because people used it. Before it, store managers planned from 30 separate weekly spreadsheets. I replaced them with a single Tableau dashboard that 85 managers now open every week, and I added automated SQL checks upstream that cut reporting errors by 70% — so the numbers in the dashboard are ones people trust.",
      "I also look for money hiding in the data. Comparing regional prices against competitor and cost data, I found a pricing gap that added $1.2 million in annual margin once the team adjusted it. Earlier, at Streamly, I built a churn model that flagged at-risk subscribers; the retention offers it triggered saved about 4% of monthly revenue.",
      "I'd be glad to walk you through how I built the forecast and what I'd look at first in Tailwind's merchandising data. Thank you for your time.",
    ],
    annotations: [
      "Opens with the result closest to the job — inventory and stockouts.",
      "Shows adoption and data quality, which separate useful analysts from report builders.",
      "Adds two money results from different businesses to show range.",
      "Offers to walk through the work — a natural, low-pressure next step.",
    ],
    tips: [
      { t: "Name the decision your work changed", d: "Analysts are hired for decisions, not dashboards. Say who used your work and what they did differently." },
      { t: "Keep tools to one line", d: "Mention SQL, Python or Tableau where they fit the story; the resume can carry the full list." },
      { t: "Quantify carefully", d: "Use numbers you can explain in an interview, and say how you measured them if it isn't obvious." },
    ],
    faqs: [
      { q: "What should a data analyst cover letter focus on?", a: "One or two analyses that changed a business decision, who used them, and the result. Tools matter less than impact and communication." },
      { q: "Should I include a portfolio link?", a: "If you have a relevant, public project or dashboard, yes — link it once with a sentence on what it shows." },
    ],
  },
  {
    slug: "marketing-manager",
    target: { title: "Head of Demand Generation", company: "Trey Research", hiringManager: "Tom Ashford" },
    paragraphs: [
      "I'm applying for the Head of Demand Generation role at Trey Research. In 18 months at Loop & Co I grew marketing-sourced pipeline from £1.1M to £3.4M, and I'd like to build the same engine for a company at your stage.",
      "Most of that growth came from fixing the basics before spending more. I rebuilt our paid search and LinkedIn campaigns around fewer, better-targeted audiences and cut cost per lead by 38%. At the same time I launched a content program focused on the questions our buyers actually search for; it now brings in 45% of our organic sign-ups.",
      "Your posting says you want someone who can own budget and build a team. I manage a £600K annual budget and a team of three, and I report pipeline to sales leadership every month. Before Loop & Co, at Brightwave, I built HubSpot nurture flows that lifted trial-to-paid conversion by 14% and ran more than 40 landing page tests that raised conversion from 2.1% to 3.6%.",
      "I'd welcome a conversation about Trey Research's pipeline goals for next year and how I'd approach the first 90 days. Thank you for reading.",
    ],
    annotations: [
      "States the headline result in the currency of the role: pipeline.",
      "Explains how the growth happened, which shows strategy rather than luck.",
      "Answers the leadership requirements directly, then adds conversion results.",
      "Points to the first 90 days — a confident close for a leadership role.",
    ],
    tips: [
      { t: "Talk pipeline, not activity", d: "Leaders hiring marketers want revenue impact. Lead with pipeline, conversion or cost per acquisition rather than impressions." },
      { t: "Explain one campaign end to end", d: "A short account of what you changed and why it worked shows how you think." },
      { t: "Match their channel mix", d: "If the posting stresses paid, content or lifecycle, lead with your strongest result in that channel." },
    ],
    faqs: [
      { q: "Should a marketing cover letter be creative?", a: "Clear beats clever. A well-structured letter with real results shows the same judgment you'd use in a campaign." },
      { q: "How do I show results if numbers are confidential?", a: "Use percentages or relative changes instead of absolute figures, and be ready to explain the context in an interview." },
    ],
  },
  {
    slug: "financial-analyst",
    target: { title: "FP&A Manager", company: "Wide World Importers", hiringManager: "Michael Grant" },
    paragraphs: [
      "I'm applying for the FP&A Manager role at Wide World Importers. At Harbor Brands I own the operating budget model for six business units — $240 million a year — and I'm ready to lead the planning process rather than just build the model behind it.",
      "Forecast accuracy is where I've made the biggest difference. When I joined, our revenue forecast was regularly off by ±9%. I rebuilt it around volume and price drivers that business-unit leaders could see and challenge, and accuracy improved to ±3%. Leadership now uses the model to set quarterly targets instead of treating it as a finance-only exercise.",
      "I also look for ways to make finance faster. I automated our variance reports and cut month-end reporting from six days to three, which gave the team time for analysis instead of formatting. Working with procurement on a cost review, I identified $3.1 million in vendor savings. Earlier, at Metro Software, I built the pricing model behind three new subscription tiers and prepared monthly board packs for the CFO.",
      "I'd appreciate the chance to discuss how Wide World plans its budget cycle and where I could add value. I'm currently a CFA Level II candidate and happy to share more about my modeling work.",
    ],
    annotations: [
      "Frames the move to management: from building the model to leading the process.",
      "One problem solved in depth, with a clear before-and-after and business adoption.",
      "Adds efficiency and savings, then experience close to the board and CFO.",
      "Closes with an invitation and a credential that supports the application.",
    ],
    tips: [
      { t: "Quantify scale and accuracy", d: "Budget size, forecast accuracy and close time are the numbers finance leaders compare first." },
      { t: "Show business partnership", d: "Mention how leaders outside finance used your work — that's what separates analysts from managers." },
      { t: "Name your systems only if relevant", d: "If the posting lists NetSuite or a planning tool you know, say so in a phrase." },
    ],
    faqs: [
      { q: "Should I mention CFA progress in a cover letter?", a: "Yes, briefly. A line about your current level shows commitment without taking space from your results." },
      { q: "How technical should a financial analyst cover letter be?", a: "Enough to show you understand the model, not a methods section. Focus on what changed because of your analysis." },
    ],
  },
  {
    slug: "ux-designer",
    target: { title: "Senior Product Designer, Onboarding", company: "Margie's Travel", hiringManager: "Lucy Chen" },
    paragraphs: [
      "I'm applying for the Senior Product Designer role on the onboarding team at Margie's Travel. At Northcoin I redesigned account sign-up and raised completion from 54% to 78%, and onboarding is the problem I most enjoy working on.",
      "That redesign started with watching people fail. In usability sessions I saw new users stall at identity verification because they didn't know what documents they'd need. We moved that information to the start, split one long form into short steps and added clear progress. I tested each version with real users before engineering built it, and we measured completion weekly after launch.",
      "I also think about the work around the screens. I built a Figma design system of 120 components that four product teams now use, and partnered with engineers to ship components that meet WCAG 2.1 AA. Before Northcoin, at Tradepost, I cut the seller listing flow from nine steps to four, which increased new listings by 22%.",
      "My portfolio walks through the sign-up project in more detail. I'd love to hear what you're seeing in your own onboarding data and talk about how I could help.",
    ],
    annotations: [
      "Opens with the result that matches the team she's applying to.",
      "Shows research leading to design decisions, then measurement after launch.",
      "Adds systems and accessibility work, then a second flow simplification with a number.",
      "Points to the portfolio for depth and invites a conversation about their data.",
    ],
    tips: [
      { t: "Let the letter point to the portfolio", d: "Use the letter to explain why one project matters; let the case study show the screens." },
      { t: "Include a metric for every claim", d: "Completion rates, task time or support tickets make design impact concrete." },
      { t: "Mention collaboration", d: "Hiring managers want to know you can work with engineering and product. One sentence is enough." },
    ],
    faqs: [
      { q: "Do UX designers need a cover letter if they have a portfolio?", a: "A short letter still helps. It tells the reader which project to look at first and why it's relevant to their team." },
      { q: "Should I describe my design process in the letter?", a: "Briefly, through one example. Save the full process for the case study and the interview." },
    ],
  },
  {
    slug: "customer-service-representative",
    target: { title: "Senior Customer Support Specialist", company: "Alpine Ski House", hiringManager: "Rosa Delgado" },
    paragraphs: [
      "I'm applying for the Senior Customer Support Specialist role at Alpine Ski House. I handle 60+ calls, chats and emails a day at Desertline Telecom and keep a 94% customer satisfaction score, and I'm looking for a team where I can help shape how support works.",
      "My favorite part of the job is fixing problems so they don't come back. When I noticed agents were escalating the same billing and connection issues, I wrote a shared troubleshooting guide with the fixes that worked. First-contact resolution on our team rose from 71% to 86%, and customers stopped having to call twice.",
      "Your posting mentions training and busy seasons. I've trained eight new hires on Zendesk, billing systems and escalation steps, and I was the top retention agent two quarters in a row, saving more than 120 accounts that called to cancel. Before Desertline, at Cactus Goods, I cut our average email response time from 18 hours to 5 during the holiday rush.",
      "I'd love to talk about how your team handles peak season and where I could help. Thank you for considering my application.",
    ],
    annotations: [
      "Leads with volume and satisfaction — the two numbers support managers check first.",
      "Shows initiative with a fix that improved results for the whole team.",
      "Matches the posting's needs: training, retention and handling peak volume.",
      "A warm, simple close that asks for a conversation.",
    ],
    tips: [
      { t: "Lead with CSAT and resolution", d: "Satisfaction, first-contact resolution and response time are the numbers support managers recognize instantly." },
      { t: "Show you improve the process", d: "A guide you wrote or a fix you suggested shows you're ready for a senior or lead role." },
      { t: "Match their channels and tools", d: "Mention phone, chat or email and tools like Zendesk only where they match the posting." },
    ],
    faqs: [
      { q: "How do I write a customer service cover letter with no experience?", a: "Use examples from retail, hospitality or volunteering where you calmed someone down or solved a problem, and mention any support tools you've learned." },
      { q: "Should I include my CSAT score?", a: "Yes, if it's strong and recent. Say what it measures and over what period if it isn't obvious." },
    ],
  },
  {
    slug: "hr-generalist",
    target: { title: "Senior HR Business Partner", company: "Coho Winery", hiringManager: "Andrea Walsh" },
    paragraphs: [
      "I'm applying for the Senior HR Business Partner role at Coho Winery. At Summit Manufacturing I support 450 employees across three sites, and I've seen how much the right onboarding and clear processes matter in seasonal, multi-site operations like yours.",
      "My biggest result has been on turnover. A third of our new hires were leaving in their first year, so I built a structured 90-day onboarding plan with site managers — clear check-ins, training milestones and a buddy for every new hire. First-year turnover dropped from 34% to 21%.",
      "I also make HR easier to run. I moved our employee records to Workday, which saves about 10 hours a week of manual data entry, and I led open enrollment with 96% participation and no compliance findings. Earlier, at Peak Health Clinics, I coordinated hiring for 120 roles a year and cut time-to-fill from 42 to 29 days, while running I-9 and licensing audits for 300 clinical staff.",
      "I'd welcome the chance to learn about the people challenges at Coho Winery and talk about how I could support your managers. Thank you for your time.",
    ],
    annotations: [
      "Connects her multi-site experience to the employer's kind of operation.",
      "One problem, the program she built and the measured result.",
      "Adds systems, compliance and recruiting results to show breadth.",
      "Frames the close around supporting managers — the core of a business partner role.",
    ],
    tips: [
      { t: "Lead with a people outcome", d: "Turnover, time-to-fill or engagement results show HR impact better than a list of responsibilities." },
      { t: "Show compliance calmly", d: "Mention clean audits or enrollment results in a sentence — reassuring, not dramatic." },
      { t: "Name the HRIS you know", d: "If the posting lists Workday, ADP or another system you've used, say so briefly." },
    ],
    faqs: [
      { q: "Should I mention my SHRM certification in the cover letter?", a: "Only if it's relevant to the role or not obvious from your resume. It usually fits best in the resume's education section." },
      { q: "How do I write about employee relations without sharing confidential details?", a: "Describe the type of issue and the outcome in general terms, with no names or identifying details." },
    ],
  },
  {
    slug: "registered-nurse",
    target: { title: "Registered Nurse, Medical-Surgical (Days)", company: "VanArsdel Medical Center", hiringManager: "Patricia Moore" },
    paragraphs: [
      "I'm applying for the day-shift Registered Nurse position on your medical-surgical unit. I'm an Ohio-licensed RN with six years in med-surg and telemetry, currently caring for 5–6 adult patients a shift on a 32-bed unit at Northwind Health Medical Center.",
      "Patient safety is the part of my work I'm proudest of. Our unit had a falls problem, so I led an hourly rounding project with our nurse educator: a simple checklist, bedside toileting schedules and a quick handoff at every shift change. Patient falls on the unit dropped by 35% within 12 months, and the checklist is still in use.",
      "I also enjoy helping the people around me. I work as relief charge nurse two shifts a week, managing assignments and bed flow for eight nurses, and I've precepted nine new graduate nurses — all of them finished orientation on schedule. Before Northwind, on a telemetry unit at Cedar Grove Hospital, I helped keep our CAUTI rate at zero for nine straight months with daily catheter-necessity checks. I hold current BLS and ACLS certifications and chart in Epic.",
      "I'd welcome the chance to meet your team and learn more about the unit. Thank you for considering my application.",
    ],
    annotations: [
      "States license, specialty and patient load up front — what nurse recruiters check first.",
      "One quality-improvement project with a clear, measurable patient outcome.",
      "Shows leadership and teaching, a second quality result, and current certifications.",
      "A short, professional close.",
    ],
    tips: [
      { t: "Name your license and unit type", d: "Put your RN license state, specialty and typical patient ratio in the first paragraph." },
      { t: "Use quality outcomes", d: "Falls, infections, pressure injuries or patient satisfaction show the results of your care better than duties do." },
      { t: "Mention shift and certifications", d: "If the posting is for a specific shift or needs ACLS or PALS, confirm you meet it in one line." },
    ],
    faqs: [
      { q: "Do nurses need a cover letter?", a: "Many hospital applications don't require one, but a short letter helps when you're changing specialty, relocating or applying to a competitive unit." },
      { q: "Should a new graduate nurse write a cover letter?", a: "Yes. Use it to highlight your clinical rotations, capstone unit and any patient-care jobs, since your work history is short." },
    ],
  },
  {
    slug: "teacher",
    target: { title: "Math Instructional Coach", company: "Alder Creek Unified School District", hiringManager: "Dr. Angela Brooks" },
    paragraphs: [
      "I'm applying for the Math Instructional Coach position for your middle schools. I've taught grades 6–8 math for seven years, and for the past two I've led the four-teacher math team at Willow Creek Middle School, which is the part of my job I want to do full time.",
      "In those two years, the share of our students meeting grade-level benchmarks rose from 58% to 71%. The change came from small, consistent habits rather than a new program: weekly exit tickets, quick data reviews and small-group reteaching before each unit test. I built shared unit plans aligned to state standards so every teacher on the team could use the same checks.",
      "Coaching means supporting teachers in very different classrooms. I teach inclusion and advanced sections, and at Lakeside Charter Academy I co-taught inclusion classes with special education staff, implementing IEP accommodations for more than 20 students. I also started an after-school STEM club there that grew from 8 to 35 regular members — a reminder that students engage when the work feels doable.",
      "I'd be glad to share the unit plans and data routines our team uses and to talk about your district's goals for math. Thank you for your consideration.",
    ],
    annotations: [
      "Names the new role and shows the leadership experience that prepares her for it.",
      "Gives a student-outcome result and explains the routines behind it.",
      "Shows she can support teachers across different classrooms and student needs.",
      "Offers concrete materials to discuss, which suits a coaching role.",
    ],
    tips: [
      { t: "Lead with student outcomes", d: "Benchmark growth, test results or attendance changes show your impact more clearly than philosophy statements." },
      { t: "Name your license and grades", d: "State your license area and the grade levels you're certified for early in the letter." },
      { t: "Show collaboration", d: "Principals and districts look for teachers who work well with colleagues, special education staff and families." },
    ],
    faqs: [
      { q: "Should a teaching cover letter include my teaching philosophy?", a: "Keep it to one sentence, shown through an example. A full philosophy statement belongs in a separate document if the district asks for one." },
      { q: "How do I address a teaching cover letter?", a: "Use the principal's or hiring manager's name if the posting gives it; otherwise \"Dear Hiring Committee\" is fine." },
    ],
  },
  {
    slug: "sales-representative",
    target: { title: "Account Executive, Mid-Market", company: "Fourth Coffee Systems", hiringManager: "Brian Novak" },
    paragraphs: [
      "I'm applying for the Mid-Market Account Executive role at Fourth Coffee Systems. Last year I closed $1.4 million in new annual contract value at Fabrikam Software — 118% of quota — and I've ranked in the top three of 14 reps for four straight quarters.",
      "I don't wait for leads. About 40% of my pipeline comes from my own outbound calls, email and LinkedIn prospecting, which means my number doesn't depend on how busy marketing is that quarter. I also rebuilt my discovery and demo process around the buyer's problem instead of our feature list, and my average sales cycle dropped from 62 to 45 days.",
      "I started as an SDR at Contoso Office Solutions, booking 25+ qualified meetings a month for four account executives and generating $900K in sourced pipeline in 2021. That background is why I respect the hand-off from SDRs and keep Salesforce clean enough that a manager can forecast from it.",
      "I'd like to learn more about your territory and targets for next year. I'm free for a call this week and happy to walk through my pipeline approach.",
    ],
    annotations: [
      "Opens with quota attainment and ranking — the first numbers sales managers look for.",
      "Shows self-sourced pipeline and a process change with a measurable result.",
      "Turns his SDR background into a strength for the team and the forecast.",
      "A confident, direct close with a specific offer.",
    ],
    tips: [
      { t: "Put quota attainment first", d: "Percentage of quota, revenue closed and ranking are the numbers sales leaders compare." },
      { t: "Show how you build pipeline", d: "Say how much of your pipeline you source yourself and which channels work for you." },
      { t: "Keep it short and confident", d: "A sales letter is a sample of how you write to buyers. Three or four tight paragraphs is plenty." },
    ],
    faqs: [
      { q: "What should a sales cover letter include?", a: "Quota attainment, deal sizes, sales cycle and how you build pipeline — plus one sentence on why this product or market interests you." },
      { q: "Is it okay to follow up after sending a sales cover letter?", a: "Yes. A short, polite follow-up after about a week is normal in sales and shows the persistence the role needs." },
    ],
  },
  {
    slug: "project-manager",
    target: { title: "Program Manager, Supply Chain Technology", company: "Lucerne Logistics Group", hiringManager: "Karen Whitfield" },
    paragraphs: [
      "I'm applying for the Program Manager role on Lucerne Logistics Group's supply chain technology team. I'm a PMP-certified project manager with eight years in IT and operations projects, and I currently manage a $4.8 million portfolio of six projects at Tailspin Logistics — five delivered on or ahead of schedule.",
      "My largest recent project was a warehouse management system rollout across nine sites. I staged the go-lives so each site learned from the last, kept a single plan across IT, operations and two vendors, and we finished three weeks early and 4% under budget. Your posting describes a similar multi-site rollout next year.",
      "I also try to make problems visible early. I introduced a weekly RAID log and a one-page status report at Tailspin, which cut late escalations by half because issues reached decision-makers while they were still small. Before Tailspin, at Lakeshore Health Partners, I tracked more than 400 tasks for an EHR upgrade across 14 clinics and ran sprint ceremonies for a seven-person Agile team after earning my CSM.",
      "I'd welcome the chance to talk about your rollout plans and how I'd approach the first phase. Thank you for your time.",
    ],
    annotations: [
      "Opens with certification, scope and on-time delivery — the core of a PM's track record.",
      "One project told in enough detail to show method, tied to the employer's own plans.",
      "Shows how he manages risk and communication, then range across Agile and Waterfall.",
      "Closes on the employer's upcoming project.",
    ],
    tips: [
      { t: "Quantify scope and delivery", d: "Budget, number of projects or sites, and on-time or under-budget results are what hiring managers compare." },
      { t: "Show how you manage risk", d: "A tool or habit that surfaced problems early says more than \"strong communication skills.\"" },
      { t: "Match their methodology", d: "If the team runs Agile, Waterfall or hybrid, show you've delivered that way." },
    ],
    faqs: [
      { q: "Should I mention my PMP in a project manager cover letter?", a: "Yes, in the first paragraph — many postings require or prefer it, and it saves the reader from searching your resume." },
      { q: "How do I show results if my projects were confidential?", a: "Describe scope and outcomes in general terms — number of sites, budget range, timeline — without naming the client." },
    ],
  },
  {
    slug: "accountant",
    target: { title: "Accounting Manager", company: "Southridge Industries", hiringManager: "Robert Haynes" },
    paragraphs: [
      "I'm applying for the Accounting Manager role at Southridge Industries. I'm a Texas CPA with five years in manufacturing and distribution accounting, and at Wingtip Manufacturing I lead the month-end close for three entities with $180 million in combined annual revenue.",
      "When I took over the close it took nine business days. I standardized our reconciliations and journal entry templates, set a clear calendar with owners for each task and reviewed the slowest steps every month. We now close in five days, and our last external audit closed with no material adjustments.",
      "I'm careful with the details that cause audit findings. I reconcile more than 40 balance sheet accounts every month, and last year I traced and resolved a $250,000 intercompany variance that had carried over from a prior period. Earlier, at Bluebonnet Distribution, I managed accounts payable for 600+ vendors and about $3 million in monthly payments, and filed sales tax in 12 states with no penalties.",
      "I'd welcome the chance to discuss your close process and how I could help the team. Thank you for considering my application.",
    ],
    annotations: [
      "Leads with license, industry and the size of the books she runs.",
      "A clear before-and-after on the close, plus a clean audit.",
      "Shows attention to detail with a specific, resolved variance and broader experience.",
      "A brief, professional close focused on their process.",
    ],
    tips: [
      { t: "Put CPA status up front", d: "If you're licensed or close to it, say so in the first sentence — many roles require it." },
      { t: "Use close and audit results", d: "Days to close, audit adjustments and reconciliation accuracy are the numbers controllers look for." },
      { t: "Match their systems", d: "Mention the ERP or GL system you know if it appears in the posting." },
    ],
    faqs: [
      { q: "Should I mention I'm studying for the CPA exam?", a: "Yes. Say which sections you've passed or when you expect to finish — it shows progress and commitment." },
      { q: "How formal should an accounting cover letter be?", a: "Professional and plain. Clear structure and accurate numbers matter more than formal phrasing." },
    ],
  },
  {
    slug: "data-scientist",
    target: { title: "Senior Data Scientist, Personalization", company: "Lamna Commerce", hiringManager: "Wei Zhang" },
    paragraphs: [
      "I'm applying for the Senior Data Scientist role on Lamna Commerce's personalization team. At Litware Marketplace I built the gradient-boosted ranking model behind our recommendations, which lifted click-through by 8% in a controlled A/B test, and personalization is where I want to keep working.",
      "I care as much about shipping a model as building it. I deploy batch and real-time models with MLflow and Docker, with automated drift monitoring so we know when a model needs attention. When retraining started taking six hours a week, I moved our feature pipelines to Spark and brought it down to 40 minutes, which let us retrain more often.",
      "Good decisions also need good experiments. I design and analyze more than 20 experiments a year using a shared Python framework for power analysis, so teams know how long to run a test before they start it. Before Litware, at Pennant Pay, I built a fraud model that caught 23% more fraudulent transactions at the same false-positive rate.",
      "I'd enjoy talking about how Lamna measures personalization today and where a stronger ranking model could help. Thank you for your time.",
    ],
    annotations: [
      "Opens with a model that matches the team's focus and a result measured properly.",
      "Shows production skills — deployment, monitoring and pipeline speed.",
      "Adds experimentation rigor and a second model result in a different domain.",
      "Invites a technical conversation about their measurement, not a generic interview.",
    ],
    tips: [
      { t: "Say how results were measured", d: "\"Lifted click-through by 8% in an A/B test\" is more credible than \"improved recommendations.\"" },
      { t: "Show you ship", d: "Mention deployment, monitoring or pipelines — teams want models in production, not just notebooks." },
      { t: "Keep the methods light", d: "Name the approach in a few words; save the technical depth for the interview." },
    ],
    faqs: [
      { q: "Should a data scientist cover letter include technical details?", a: "Some, but briefly — the model type, how you measured impact and how it was deployed. The interview is the place for depth." },
      { q: "Should I link to Kaggle or GitHub?", a: "Only if the project is relevant and well documented. Link the specific repository rather than your whole profile." },
    ],
  },
  {
    slug: "business-analyst",
    target: { title: "Lead Business Analyst, Claims Transformation", company: "Humongous Insurance", hiringManager: "Christine Ford" },
    paragraphs: [
      "I'm applying for the Lead Business Analyst role on your claims transformation program. I'm a CBAP with six years in insurance and financial services, and I'm currently gathering requirements for a claims system replacement at Woodgrove Insurance that will be used by 350 adjusters.",
      "Before writing a single requirement, I mapped how claims intake actually worked. Sitting with adjusters and intake staff, I found four manual hand-offs that added days to every claim. Removing them cut average intake time from three days to one — before any new software went live.",
      "I also make sure what we build matches what the business needs. I've written more than 180 user stories with acceptance criteria and ran UAT with 25 business testers, and I built a Power BI dashboard of the claims backlog that leadership reviews every week. Earlier, at Harborline Credit Union, I analyzed member complaint data in SQL and recommended a policy fix that cut complaints by 18%.",
      "I'd welcome the chance to hear where your claims program is today and talk about how I could help it succeed. Thank you for considering my application.",
    ],
    annotations: [
      "Connects her current project directly to the program she's applying to.",
      "Shows analysis that delivered value before any system change.",
      "Covers requirements, testing and reporting, plus a data-driven result.",
      "Closes on the employer's program and how she'd contribute.",
    ],
    tips: [
      { t: "Show the problem behind the requirements", d: "Explain what you discovered and changed, not just that you \"gathered requirements.\"" },
      { t: "Include process and data results", d: "Time saved, errors reduced or complaints cut make analysis work tangible." },
      { t: "Name your delivery artifacts", d: "User stories, process maps and UAT show you can carry work from discovery to launch." },
    ],
    faqs: [
      { q: "What should a business analyst cover letter focus on?", a: "One project where your analysis changed a process or decision, the result, and how you worked with stakeholders and delivery teams." },
      { q: "Should I list tools like Jira or Visio?", a: "Only those named in the posting, in a phrase. Your resume can carry the full list." },
    ],
  },
  {
    slug: "administrative-assistant",
    target: { title: "Executive Assistant to the CEO", company: "Graphic Design Institute", hiringManager: "Laura Simmons" },
    paragraphs: [
      "I'm applying for the Executive Assistant to the CEO position at the Graphic Design Institute. I currently support the COO and two vice presidents at Adventure Works Engineering, managing calendars with more than 40 meetings a week and keeping their days running on time.",
      "Much of my work happens before anyone notices it. I coordinate domestic and international travel for 15 staff and keep every trip within policy, and I plan around time zones and last-minute changes so executives arrive prepared. Last spring I organized a quarterly leadership offsite for 60 people and delivered it 8% under budget.",
      "I also look for ways to make the office run more smoothly. I moved our team's paper filing to SharePoint, which cut the time spent finding documents by about half. Before Adventure Works, at Coastal Smiles Dental Group, I greeted 50+ patients a day, managed scheduling on a busy phone line and consolidated supply orders to cut monthly spend by 12%.",
      "I'd welcome the chance to learn how your CEO likes to work and how I could help. Thank you for your time and consideration.",
    ],
    annotations: [
      "States who she supports today and the volume she manages.",
      "Shows judgment and planning with travel and a measurable event result.",
      "Adds process improvements and earlier front-office experience.",
      "Closes on the executive's needs — the heart of an assistant role.",
    ],
    tips: [
      { t: "Say who you support", d: "Name the level of executives you work for and how many — it tells the reader the scope of your role." },
      { t: "Show results, not just tasks", d: "Under-budget events, time saved or costs cut turn routine work into achievements." },
      { t: "Mention discretion briefly", d: "If you handle confidential information, say so in a phrase — it matters for executive roles." },
    ],
    faqs: [
      { q: "How do I write an administrative assistant cover letter with no experience?", a: "Use examples from school, volunteering or retail where you organized schedules, handled customers or kept records accurate, and list the office software you know." },
      { q: "Should I mention typing speed or software skills?", a: "Mention the software named in the posting, such as Microsoft 365 or Google Workspace. Typing speed only matters if they ask for it." },
    ],
  },
];

export function getCoverLetterExample(slug: string): CoverLetterExample | undefined {
  return COVER_LETTER_EXAMPLES.find((c) => c.slug === slug);
}
