/**
 * Cover letters for the healthcare, education, finance, trades and retail &
 * hospitality resume examples in resume-examples-more-a.ts and -more-b.ts.
 * Each letter is written by the same fictional person as the matching resume
 * and only uses facts and numbers from that resume. Target employers and
 * hiring managers are fictional.
 */

import type { CoverLetterExample } from "@/lib/cover-letter-examples";

export const MORE_COVER_LETTERS: CoverLetterExample[] = [
  // ---------------------------------------------------------------- Healthcare
  {
    slug: "medical-assistant",
    target: { title: "Certified Medical Assistant, Primary Care", company: "Lamna Healthcare", hiringManager: "Denise Alvarez" },
    paragraphs: [
      "I'm applying for the Certified Medical Assistant position in Lamna Healthcare's primary care clinic. I've spent 4 years in family medicine and urgent care, and at Saguaro Ridge Family Medicine I room 25–30 patients a day for two family physicians, taking vital signs, histories and medication lists in athenahealth.",
      "The change I'm proudest of is a simple one. Patients were waiting an average of 14 minutes between rooming and seeing the provider, so I started prepping charts and supplies the day before. The average wait dropped to 8 minutes, which keeps both physicians' schedules on track.",
      "I'm comfortable on both the clinical and the front-desk side. I average 15 blood draws a day, give injections and run EKGs, and in my first month I cleared a 3-week referral backlog. I've also trained 3 new medical assistants on clinic workflows, infection control and HIPAA-compliant charting. Before that, at Desert Bloom Urgent Care, I roomed up to 40 patients a shift, ran point-of-care testing with daily quality control checks and covered scheduling, insurance verification and copays on weekends.",
      "I'd welcome the chance to meet your team and learn how your clinic runs its day. Thank you for considering my application.",
    ],
    annotations: [
      "Names the role and gives patient volume and the EHR she uses in the first two sentences.",
      "One workflow fix with a before-and-after that a clinic manager can picture.",
      "Shows range: clinical skills, admin work, training new staff and urgent care pace.",
      "A short, friendly close.",
    ],
    tips: [
      { t: "Say clinical, admin or both", d: "Many medical assistant roles mix rooming, procedures and front-desk work. Say which ones you do so the reader doesn't have to guess." },
      { t: "Name your credential and EHR", d: "Mention your CMA, RMA or similar certification and the EHR you chart in, especially if the posting names one." },
      { t: "Use one patient-flow result", d: "A shorter wait, a cleared backlog or your daily rooming volume shows how you help the clinic stay on time." },
    ],
    faqs: [
      { q: "Do medical assistants need a cover letter?", a: "Not always. Many clinics hire from the application alone, but a short letter helps when you're moving to a new specialty or the posting asks for one." },
      { q: "Should I mention my certification if it's already on my resume?", a: "Yes, briefly. Clinics often screen for certified medical assistants, so naming it in the first paragraph saves the reader a step." },
    ],
  },
  {
    slug: "licensed-practical-nurse",
    target: { title: "Licensed Practical Nurse, Skilled Nursing", company: "Fabrikam Residences", hiringManager: "Gloria Banks" },
    paragraphs: [
      "I'm applying for the Licensed Practical Nurse position on Fabrikam Residences' skilled nursing unit. I'm a Tennessee-licensed LPN with 5 years in skilled nursing and outpatient care, and at Magnolia Bend Rehabilitation & Nursing Center I complete medication administration for 22–26 residents a shift on a 44-bed unit, documenting in the eMAR.",
      "The part of the job I take most seriously is catching changes early. I report every change in condition to the RN supervisor and provider using SBAR, and over the past year our unit's 30-day hospital readmissions fell from 22% to 16%. That was a unit-wide result, and timely reporting from the floor is the piece I own every shift.",
      "I also do wound care, dressing changes and treatments for 8–10 residents a shift and update the wound care nurse weekly. I assign and supervise 3–4 CNAs per shift and check that care plans are followed, and I chart in PointClickCare. Before long-term care, I worked at Cotton Row Internal Medicine, a 4-provider practice, handling vital signs, medication reconciliation and immunizations for 30+ patients a day.",
      "I'd be glad to talk about your unit and how I could support your residents and their families. Thank you for your time.",
    ],
    annotations: [
      "States license, setting and resident load up front, which is what a director of nursing checks first.",
      "Shows clinical judgment and credits a shared result honestly while naming her part in it.",
      "Adds wound care, CNA supervision, the charting systems she knows and outpatient experience.",
      "Closes on residents and families, which matter most in long-term care.",
    ],
    tips: [
      { t: "Lead with license and setting", d: "Put your LPN license state, the type of unit and your typical resident or patient load in the first paragraph." },
      { t: "Show how you catch changes", d: "Long-term care managers want to know you notice a change in condition and report it clearly. Mention SBAR or whatever tool your unit uses." },
      { t: "Be accurate about shared results", d: "If a number belongs to the whole unit, say so and explain your part. Claiming a team result as your own is easy to spot in an interview." },
    ],
    faqs: [
      { q: "Do LPNs need a cover letter?", a: "Many long-term care facilities don't require one. A short letter is still useful when you're changing settings, such as moving from a clinic to skilled nursing, or applying for a specific unit or shift." },
      { q: "How do I mention a result my whole unit achieved?", a: "Say it was a unit result and describe what you did toward it, such as how you reported changes in condition or followed the care plan." },
    ],
  },
  {
    slug: "pharmacy-technician",
    target: { title: "Pharmacy Technician, Sterile Compounding", company: "VanArsdel Medical Center", hiringManager: "Michael Okafor" },
    paragraphs: [
      "I'm applying for the Pharmacy Technician position on VanArsdel Medical Center's sterile compounding team. I'm a PTCB-certified technician with 5 years in retail and hospital pharmacy, and at Bayou Crest Medical Center I prepare about 60 IV admixture doses a shift in a USP <797> cleanroom for pharmacist verification.",
      "I also restock Pyxis automated dispensing cabinets on 9 nursing units. After I reworked the par levels, nurse-reported stockouts fell 40%. I count and reconcile controlled substances with the pharmacist and resolve any discrepancy before the shift ends, and I pull expired and recalled drugs during monthly unit inspections.",
      "Before the hospital, I worked at Lone Oak Pharmacy, entering and filling 250–300 prescriptions a day and checking NDC, dose and label before pharmacist review. I resolved insurance rejections and started prior authorizations, which cut next-day callbacks by about a third. I still work that way: fix the problem before it reaches the patient or the nurse.",
      "I'd welcome the chance to talk about your compounding workload and how I could help. Thank you for considering my application.",
    ],
    annotations: [
      "Leads with certification and the compounding work that matches the posting.",
      "An inventory fix with a measured result, plus the controlled-substance work hospitals screen for.",
      "Uses retail experience to show accuracy at volume and problem-solving.",
      "A brief close focused on the team's workload.",
    ],
    tips: [
      { t: "Name your certification and registration", d: "Put your CPhT or ExCPT status and your state registration near the top. Many pharmacies screen for them." },
      { t: "Match the setting", d: "For hospital roles, lead with sterile compounding, automated dispensing and controlled substances. For retail, lead with fill volume and insurance work." },
      { t: "Show accuracy, not just speed", d: "Mention the checks you do before pharmacist review. Volume means more when the reader can see you get it right." },
    ],
    faqs: [
      { q: "Do pharmacy technicians need a cover letter?", a: "Retail pharmacies often don't ask for one. Hospitals and specialty pharmacies more often do, and a short letter helps when you're moving from retail to inpatient work." },
      { q: "How do I move from retail to hospital pharmacy?", a: "Lead with what carries over: accuracy checks, controlled substance handling, inventory and any sterile compounding training. Say plainly that you want inpatient experience." },
    ],
  },
  {
    slug: "dental-hygienist",
    target: { title: "Registered Dental Hygienist", company: "Proseware Dental", hiringManager: "Karen Holt" },
    paragraphs: [
      "I'm applying for the Registered Dental Hygienist position at Proseware Dental. I'm a Colorado RDH with 6 years in general and periodontal practices, and I hold a Colorado local anesthesia permit. At Front Range Family Dentistry I see 8–9 adult and child patients a day for prophylaxis, scaling and root planing, periodontal maintenance, fluoride and sealants.",
      "I care about patients coming back. I raised our hygiene recare rate from 61% to 78% by booking each patient's next visit before they left the chair. It's a small habit, but it keeps the hygiene schedule full and keeps patients on track with periodontal maintenance.",
      "Periodontal patients are where I've learned the most. At Aspen Hollow Periodontics, a 2-periodontist practice, I provided periodontal maintenance for 6–8 patients a day and wrote a take-home guide for patients new to periodontal therapy. I take and review radiographs and record periodontal charting and oral cancer screening findings in Dentrix, I've also used Eaglesoft, and I follow OSHA bloodborne pathogens rules and CDC infection control guidance on every setup.",
      "I'd welcome the chance to meet the team and talk about your hygiene schedule. Thank you for your time.",
    ],
    annotations: [
      "Gives license, permit, experience and daily patient load in the first paragraph.",
      "One result that helps the practice, with the habit that produced it.",
      "Shows periodontal depth, patient education and the software the office may use.",
      "A short close that points to the next step.",
    ],
    tips: [
      { t: "State your license and permits", d: "Name your RDH state and any local anesthesia or other permits in the first paragraph." },
      { t: "Show patient retention", d: "A recare or reappointment result shows you help the practice, not just the patient in the chair." },
      { t: "Mention the software", d: "Practices like hygienists who already know their practice management system. Name it if it matches the posting." },
    ],
    faqs: [
      { q: "Do dental hygienists need a cover letter?", a: "Many practices hire after a working interview and don't require one. A short letter helps with group practices and specialty offices, or when you're new to the area." },
      { q: "What should a new graduate hygienist put in a cover letter?", a: "Your program, license status, clinical experience in school and any work as a dental assistant or in a dental front office." },
    ],
  },
  {
    slug: "certified-nursing-assistant",
    target: { title: "Certified Nursing Assistant, Memory Care", company: "Contoso Senior Living", hiringManager: "Teresa Flores" },
    paragraphs: [
      "I'm applying for the Certified Nursing Assistant position in Contoso Senior Living's memory care unit. I'm a Florida-certified CNA with 3 years in long-term care and hospital med-surg, and I currently care for 10–12 residents a shift on a 40-bed long-term care unit at Palmetto Shores Health & Rehabilitation.",
      "I'm part of our unit's dementia care team, and I use calm redirection and consistent routines to help residents through the day. I record vital signs, weights and intake and output in PointClickCare and tell the charge nurse right away when something changes.",
      "Safety comes first in every transfer. I use Hoyer lifts and gait belts, and our unit went 11 months without a transfer-related injury. Before long-term care, I worked on a 28-bed med-surg floor at Seagrape Community Hospital, following fall prevention plans, bed alarms and call-light checks for high-risk patients.",
      "I'd be glad to talk about your residents and the shifts you need covered. Thank you for considering me.",
    ],
    annotations: [
      "Certification, setting and resident load in two sentences.",
      "Connects her dementia care experience to the memory care unit and shows she reports changes.",
      "Shows safe transfers and fall prevention, both central to resident safety.",
      "A short, practical close.",
    ],
    tips: [
      { t: "Lead with certification and setting", d: "Say you're a certified nursing assistant, in which state, and whether you've worked in long-term care, a hospital or both." },
      { t: "Match the unit", d: "If the job is in memory care, rehab or a hospital floor, mention the experience you have that fits it." },
      { t: "Keep it short", d: "Three or four plain paragraphs are enough. The reader wants to see that you're safe, reliable and kind with residents." },
    ],
    faqs: [
      { q: "Do CNAs need a cover letter?", a: "Often not. Many facilities hire from the application and an interview. Write one when the posting asks for it, when you're applying to a specialty unit like memory care, or when you're new to the area." },
      { q: "What if I'm a new CNA with no work experience?", a: "Use your clinical hours from training, your certification and any caregiving, volunteer or customer service work that shows patience and reliability." },
    ],
  },
  {
    slug: "medical-billing-specialist",
    target: { title: "Medical Billing Lead, Denials and Appeals", company: "A. Datum Medical Group", hiringManager: "Jennifer Lindgren" },
    paragraphs: [
      "I'm applying for the Medical Billing Lead role on A. Datum Medical Group's denials and appeals team. I'm a Certified Professional Biller with 6 years in multi-specialty and orthopedic billing, and at Lakecrest Physician Group I submit 1,200+ professional claims a week for a 40-provider group.",
      "Much of my best work starts with the denial report. I added claim scrubber edits for our top 10 denial reasons, and our first-pass clean claim rate went from 89% to 96%. Fewer bad claims going out leaves more time to work the ones that come back, and in 2025 I recovered $310K in underpaid claims through denials and appeals with Medicare, Medicaid and commercial payers.",
      "I also keep old balances from piling up. Over 18 months, A/R over 90 days fell from 24% to 13% of total receivables. I post ERA and manual payments and reconcile daily deposits in Epic. Earlier, at Bluff Street Orthopedics, I checked CPT, ICD-10-CM and HCPCS codes and modifiers against documentation for 6 surgeons and handled prior authorizations for surgeries and imaging.",
      "I'd welcome the chance to talk about your denial trends and where I could help first. Thank you for considering my application.",
    ],
    annotations: [
      "Leads with certification, specialty mix and claim volume.",
      "Shows she fixes denials at the source, then adds a dollar result from appeals.",
      "Adds an A/R result, payment posting and the coding background behind clean claims.",
      "Offers to start with their biggest problem, which suits a lead role.",
    ],
    tips: [
      { t: "Lead with clean claims and A/R", d: "Clean claim rate, denial rate and aged A/R are the numbers revenue cycle managers look for first." },
      { t: "Explain how you found the problem", d: "One sentence on how you traced denials to their cause shows judgment, not just volume." },
      { t: "Name payers and systems", d: "Mention the payer types and practice management or EHR systems you've worked in, especially if the posting lists them." },
    ],
    faqs: [
      { q: "Should I mention my billing certification?", a: "Yes. If you hold a CPB, CPC or similar credential, name it in the first paragraph." },
      { q: "How do I show results without sharing patient information?", a: "Use rates and totals, such as clean claim rate or aged A/R, and leave out patient names, account details and anything else covered by HIPAA." },
    ],
  },

  // ----------------------------------------------------------------- Education
  {
    slug: "teacher-assistant",
    target: { title: "Special Education Instructional Assistant", company: "Alder Creek Unified School District", hiringManager: "Monica Barnes" },
    paragraphs: [
      "I'm applying for the Special Education Instructional Assistant position with Alder Creek Unified School District. I've worked for 4 years in pre-K and elementary classrooms, including inclusion and special education settings, and I've passed the ParaPro Assessment. Right now I support 5 students on an IEP in a co-taught second-grade classroom at Maple Hollow Elementary School.",
      "Most of my day is small-group reading. I lead daily reading intervention for 3 groups of 4–6 second graders using the teacher's lesson plans, and I keep progress monitoring data so we can see who's moving. By the spring benchmark, 18 of 22 students in my groups had moved up at least one reading level.",
      "For students on an IEP, I apply accommodations and track behavior goals. In pre-K at Bramblewood Early Learning Center, I used positive behavior supports and visual schedules to help two students join group time every day. I also covered lunch, recess and dismissal duty and shared daily notes with families.",
      "I'd be glad to talk about the students you serve and how I could support your teachers. Thank you for considering my application.",
    ],
    annotations: [
      "Names the role, her settings and the credential many districts require.",
      "Gives a student-outcome result from work she leads under the teacher's plans.",
      "Shows IEP and behavior support, the core of a special education assistant role.",
      "Closes on students and teachers, the two groups she works for.",
    ],
    tips: [
      { t: "Show how you support the teacher", d: "Say what you run yourself, such as small groups or centers, and that you work from the teacher's plans." },
      { t: "Mention IEP and behavior work", d: "Accommodations, behavior goals and positive behavior supports are what special education teams look for." },
      { t: "Confirm the requirements", d: "If the posting asks for the ParaPro Assessment, an associate degree or CPR training, confirm you have it in one line." },
    ],
    faqs: [
      { q: "Do teacher assistants need a cover letter?", a: "Many districts include an optional letter field. It's worth using: a few specific sentences about the students and settings you've worked with help a principal picture you in the room." },
      { q: "How do I write a teacher assistant cover letter with no classroom experience?", a: "Draw on tutoring, coaching, camp, childcare or volunteering, and say which age group you've worked with and what you did with them." },
    ],
  },
  {
    slug: "school-counselor",
    target: { title: "School Counselor, College and Career Readiness", company: "Fabrikam High School", hiringManager: "Alan Whitfield" },
    paragraphs: [
      "I'm applying for the School Counselor position focused on college and career readiness at Fabrikam High School. I'm a Georgia-certified school counselor with 7 years in middle and high schools, and at Red Clay Ridge High School I manage a caseload of 420 students in grades 9–12, working from the ASCA National Model.",
      "FAFSA completion is the result I'm proudest of. Over two years, the share of our seniors completing the FAFSA rose from 52% to 74% after I added class workshops and family nights. For many students, that form decides which options are open to them after graduation.",
      "I use data to decide where counseling time goes, and I take crisis work seriously. I lead suicide risk screening and crisis intervention with our school psychologist and social worker under district protocol, coordinate 504 plans for 35 students and run small groups on test anxiety and grief each semester. At Dogwood Trace Middle School I started a check-in mentoring program through MTSS, and chronic absenteeism among participants fell by 30%.",
      "I'd welcome the chance to talk about your seniors' plans after graduation and how your counseling team divides its work. Thank you for your consideration.",
    ],
    annotations: [
      "Certification, experience, caseload and framework in the opening.",
      "One student-outcome result that matches the role's focus, with the program behind it.",
      "Shows crisis readiness, 504 coordination and a second data result from middle school.",
      "Asks about the students and the team, which is how a counselor would start the job.",
    ],
    tips: [
      { t: "Lead with caseload and model", d: "Give your caseload size, grade levels and whether you work from the ASCA National Model." },
      { t: "Use one student-outcome result", d: "FAFSA completion, attendance, course placement or graduation data show the effect of your program better than a list of duties." },
      { t: "Mention crisis work calmly", d: "Say you follow district protocol and work with the school psychologist or social worker. Don't share details about individual students." },
    ],
    faqs: [
      { q: "Should a school counselor cover letter mention the ASCA National Model?", a: "Yes, if you use it. A sentence on how you plan your program or use data is more useful than naming the model alone." },
      { q: "How do I write about crisis work without sharing student details?", a: "Describe your role and the protocol you follow in general terms. Leave out names, dates and anything that could identify a student." },
    ],
  },

  // ------------------------------------------------------------------- Finance
  {
    slug: "bookkeeper",
    target: { title: "Full-Charge Bookkeeper", company: "Trey Research", hiringManager: "Tom Gallagher" },
    paragraphs: [
      "I'm applying for the Full-Charge Bookkeeper position at Trey Research. I've kept the books for small businesses in construction, retail and professional services for 7 years, and I'm a Certified Bookkeeper and QuickBooks Online Certified ProAdvisor. At Timberline Mechanical Contractors I run the books for a $9M HVAC contractor, from payables and receivables to the month-end close.",
      "I close on time. I reconcile 6 bank and 3 credit card accounts every month and have closed the books by the 7th business day for 30 months straight. I also process biweekly payroll for 45 employees in Gusto and file 1099s for 60+ subcontractors each January.",
      "Collections are where I've made the biggest difference. I started weekly aging reviews and follow-up calls, and overdue receivables fell from $410K to $180K. Before Timberline, at Hawthorne Lane Bookkeeping, I kept the books for 14 clients in QuickBooks Online and Xero and cleaned up 18 months of uncategorized transactions for a new client in 6 weeks, ahead of its tax deadline.",
      "I'd be glad to talk about how your books are set up today and what your CPA needs at year-end. Thank you for your time.",
    ],
    annotations: [
      "Says full-charge, gives credentials and the size of the business she keeps books for.",
      "Proves reliability with close timing and the payroll and 1099 work she handles.",
      "A cash result owners care about, plus cleanup work for multiple clients.",
      "Closes on their setup and their CPA, which shows she thinks about the whole year.",
    ],
    tips: [
      { t: "Say full-charge if you are", d: "It tells the reader you handle the whole cycle, from payables to the close, not just data entry." },
      { t: "Give your close timing", d: "The business day you close by, and how consistently you hit it, is easy for an owner or controller to judge." },
      { t: "Name the software", d: "QuickBooks Online, Xero or a payroll system named in the posting should appear once in your letter." },
    ],
    faqs: [
      { q: "How is a bookkeeper cover letter different from an accountant's?", a: "A bookkeeper letter should focus on accurate, on-time records: reconciliations, payables, receivables and the close. An accountant letter usually leans more on analysis, reporting and audits." },
      { q: "Should I mention certifications like QuickBooks ProAdvisor?", a: "Yes, if the job uses that software. One line is enough." },
    ],
  },
  {
    slug: "bank-teller",
    target: { title: "Head Teller", company: "Contoso Bank", hiringManager: "Renee Jackson" },
    paragraphs: [
      "I'm applying for the Head Teller position at Contoso Bank. I've worked in branch banking for 4 years at a bank and a credit union, and as lead teller at Woodgrove Bank I process 100+ transactions a day and help with vault management and ATM balancing.",
      "Accuracy is the first thing a head teller has to model. My cash drawer has balanced with no outages in 22 of 24 months, and at Catawba Falls Credit Union I passed 2 internal cash handling audits with no exceptions. I complete Currency Transaction Reports and BSA/AML checks, screen against OFAC and place holds under Regulation CC.",
      "I also watch out for customers. I've flagged 14 suspected elder fraud and check fraud cases to the branch manager, stopping about $38K in losses. And I like connecting people with the right accounts: I've made 120+ referrals to bankers for checking accounts, CDs and loans and was the top referrer in the branch three quarters running.",
      "I'd welcome the chance to talk about your branch and the team I'd be supporting. Thank you for considering my application.",
    ],
    annotations: [
      "Names the role and her current lead responsibilities, including the vault.",
      "Leads with balancing and audit results, then the compliance work head tellers oversee.",
      "Shows fraud prevention and referrals, the two results branch managers value beyond accuracy.",
      "Closes on the team she'd lead.",
    ],
    tips: [
      { t: "Lead with accuracy", d: "Drawer outages, audit results and cash limits you've handled tell a branch manager you can be trusted with the vault." },
      { t: "Mention fraud and compliance", d: "A sentence on fraud you've caught and the reports you file, such as CTRs or BSA/AML checks, shows judgment." },
      { t: "Show referrals without sounding salesy", d: "Frame referrals as matching customers with the right product, and give the count if you have it." },
    ],
    faqs: [
      { q: "Do bank tellers need a cover letter?", a: "Many banks make it optional. A short one is worth writing for lead or head teller roles, or when you're moving from retail into banking." },
      { q: "How do I write a bank teller cover letter with no banking experience?", a: "Use cash handling, customer service and accuracy examples from retail or food service, and mention any 10-key or banking software you've used." },
    ],
  },
  {
    slug: "loan-officer",
    target: { title: "Senior Mortgage Loan Officer", company: "Woodgrove Bank", hiringManager: "Kathleen Byrne" },
    paragraphs: [
      "I'm applying for the Senior Mortgage Loan Officer position at Woodgrove Bank. I'm an NMLS-licensed loan originator in Minnesota and Wisconsin with 7 years in purchase and refinance lending, and at Bluewater Prairie Home Lending I close 70–85 loans a year, about $24M in annual volume, mostly purchase loans.",
      "Most of my business comes from relationships. I've built a network of 30+ referral partners, mostly real estate agents, and referrals now make up 60% of my pipeline. Those partners count on closings happening when promised, and 95% of my loans close on or before the contract date because I track every file in Encompass and a CRM.",
      "Many of my clients are first-time buyers, and I guide them through conventional, FHA, VA and USDA options. I deliver the Loan Estimate and Closing Disclosure within TRID timelines, with no findings in 3 internal compliance audits. At Lakeland Federal Savings I ran monthly first-time homebuyer workshops at 4 branches that produced 40+ applications a year, and originated about $11M a year in mortgage, refinance and home equity loans.",
      "I'd welcome the chance to talk about your purchase business and how I could build a referral pipeline for your team. Thank you for your time.",
    ],
    annotations: [
      "License, experience and production volume, the first things a sales manager checks.",
      "Explains where his loans come from and why partners keep sending them.",
      "Shows product range, a clean compliance record and a first-time buyer program he ran.",
      "Closes on growing their business, which is the job.",
    ],
    tips: [
      { t: "Lead with license and volume", d: "Name the states you're licensed in and give your annual units or volume in the first paragraph." },
      { t: "Show where your loans come from", d: "Referral partners, workshops or branch traffic tell the reader whether your pipeline will follow you." },
      { t: "Mention compliance in a sentence", d: "Clean audits and on-time disclosures reassure a lender without turning the letter into a checklist." },
    ],
    faqs: [
      { q: "Should I include my NMLS number in a cover letter?", a: "You can add it under your name or in the first paragraph. Many lenders also ask for it on the application." },
      { q: "Do loan officers need a cover letter?", a: "Not always, but a short letter helps when you're changing lenders and want to explain your referral network and the loan types you close." },
    ],
  },
  {
    slug: "payroll-specialist",
    target: { title: "Senior Payroll Specialist", company: "Wingtip Toys", hiringManager: "Daniel Kim" },
    paragraphs: [
      "I'm applying for the Senior Payroll Specialist position at Wingtip Toys. I'm a Certified Payroll Professional with 6 years running multi-state payroll, and at Prairie Lantern Foods I process weekly and biweekly payroll for 1,800 employees in 14 states in ADP Workforce Now.",
      "Off-cycle checks were the first problem I went after. We used to issue about 30 a month. I added pre-close audits of timekeeping and HR changes, and we're now down to 8, which means fewer people waiting on money they were owed.",
      "I also handle the parts of payroll that need extra care. I reconcile payroll to the general ledger each period, prepare quarterly Form 941 and state unemployment filings, and process garnishments, child support orders and tax levies for 120+ employees. I've led year-end W-2 processing two years in a row with no corrected W-2s needed. Before that, at Canalside Staffing Group, I ran weekly payroll for 600+ hourly employees across Illinois, Indiana and Wisconsin, including FLSA overtime, and audited UKG punch data before each close.",
      "I'd be glad to talk about your payroll calendar and where the pressure points are. Thank you for considering my application.",
    ],
    annotations: [
      "Credential, headcount, number of states and system in one opening paragraph.",
      "One error-reduction result, told in terms of the employees it helps.",
      "Covers compliance, tax filings, year-end and high-volume hourly payroll.",
      "Closes on their calendar, which is where payroll problems start.",
    ],
    tips: [
      { t: "Give headcount, states and frequency", d: "Those three numbers tell a payroll manager the complexity you're used to." },
      { t: "Show error reduction", d: "Off-cycle checks, corrections or W-2 reissues show accuracy better than saying you're detail-oriented." },
      { t: "Mention year-end and compliance", d: "Quarterly filings, W-2s and garnishments are where payroll goes wrong. One clean result is reassuring." },
    ],
    faqs: [
      { q: "Should I mention my CPP or FPC in a payroll cover letter?", a: "Yes, in the first paragraph. It's a quick signal that you know payroll law and tax filing." },
      { q: "How do I talk about confidential pay data in a cover letter?", a: "Use counts and process results, such as headcount or off-cycle checks, and never share individual pay or employee details." },
    ],
  },

  // -------------------------------------------------------- Trades & logistics
  {
    slug: "electrician",
    target: { title: "Lead Journeyman Electrician, Commercial", company: "Litware Construction", hiringManager: "Rick Sandoval" },
    paragraphs: [
      "I'm applying for the Lead Journeyman Electrician position on Litware Construction's commercial team. I'm a Colorado-licensed journeyman with 7 years in residential and commercial wiring, and at Ridgeview Electrical Services I install power, panels and lighting for retail and office build-outs up to 60,000 sq ft, working to the NEC and local amendments.",
      "I lead a 3-person crew on tenant improvements, and in 2025 we finished 14 of 15 projects on or ahead of schedule. I bend and run EMT and rigid conduit from blueprints and keep the as-built drawings up to date for the project manager.",
      "I build work to pass inspection the first time. I troubleshoot motor controls and 480V three-phase distribution with a multimeter and megohmmeter, and I've passed 40+ inspections with no failed items. I came up through a 4-year registered apprenticeship at Bluestem Electric, wiring 120+ new homes from rough-in through trim-out, and I followed lockout/tagout and NFPA 70E procedures there with no recordable safety incidents in 4 years. I also hold OSHA 30.",
      "I'd be glad to talk about your upcoming projects and how your crews are set up. Thank you for your time.",
    ],
    annotations: [
      "License, experience and the size of jobs he works on, up front.",
      "Shows crew leadership with a schedule result a project manager will notice.",
      "Inspection record, troubleshooting skills, apprenticeship and safety training.",
      "A plain close about their projects and crews.",
    ],
    tips: [
      { t: "Lead with license and work type", d: "Say journeyman or master, the state and whether you do residential, commercial or industrial work." },
      { t: "Use schedule and inspection results", d: "Projects finished on time and inspections passed are the numbers contractors trust." },
      { t: "Mention safety training", d: "OSHA 10 or 30, NFPA 70E and a clean safety record are worth one sentence." },
    ],
    faqs: [
      { q: "Do electricians need a cover letter?", a: "Many contractors hire from an application or a phone call. A short letter helps for lead, foreman or facility roles, or when the posting asks for one." },
      { q: "Should I list every code and tool I know?", a: "No. Mention the code work and systems that match the posting, such as the NEC or three-phase power, and leave the full list to your resume." },
    ],
  },
  {
    slug: "hvac-technician",
    target: { title: "Senior HVAC Service Technician", company: "Southridge Home Services", hiringManager: "Paul Novak" },
    paragraphs: [
      "I'm applying for the Senior HVAC Service Technician position at Southridge Home Services. I'm EPA 608 Universal and NATE certified with 5 years in residential and light commercial service, and at Lakewood Comfort Heating & Air I run 5–6 service calls a day on heat pumps, gas furnaces and split systems with a 91% first-visit fix rate.",
      "I try to find the real fault on the first visit and then explain the fix in plain words. Walking homeowners through the diagnostics and their repair options is also how I sold 110 maintenance plans in 2025.",
      "I'm current on refrigerants, handling recovery, leak checks and charging on R-410A systems and newer A2L refrigerants such as R-454B. I also do preventive maintenance on 30+ commercial rooftop units under quarterly service agreements. Before moving to service, I was an installer at Tri-County Mechanical Services, where I installed 70+ residential systems, brazed and nitrogen pressure-tested line sets and ran Manual J load calculations with the lead tech.",
      "I'd welcome the chance to talk about your service area and call volume. Thank you for considering my application.",
    ],
    annotations: [
      "Certifications, experience, call volume and a first-visit fix rate in the opening.",
      "Shows how he talks to customers, with a sales result that came from it.",
      "Refrigerant knowledge, commercial work and installation background.",
      "A short close about their day-to-day work.",
    ],
    tips: [
      { t: "Lead with certifications", d: "EPA 608 and any NATE certifications belong in the first paragraph. Many shops screen for them." },
      { t: "Use a first-visit fix rate", d: "If you track it, it's the clearest single number for a service manager." },
      { t: "Show how you talk to customers", d: "Service techs represent the company in people's homes. One line on how you explain repairs goes a long way." },
    ],
    faqs: [
      { q: "Do HVAC technicians need a cover letter?", a: "Many shops don't require one. A short letter helps when you're applying for a senior or commercial role, or moving to a new company or area." },
      { q: "Should I mention A2L refrigerant experience?", a: "Yes, if you've worked with A2L refrigerants or completed training on them. Say what you've handled in one line." },
    ],
  },
  {
    slug: "maintenance-technician",
    target: { title: "Maintenance Technician III, Roasting and Packaging", company: "Fourth Coffee", hiringManager: "Greg Halvorsen" },
    paragraphs: [
      "I'm applying for the Maintenance Technician III position at Fourth Coffee's roasting and packaging plant. I have 6 years in packaging and food manufacturing, and at Harborline Packaging I troubleshoot and repair conveyor systems, case packers and palletizers across 3 high-speed lines.",
      "My focus is keeping lines running. I moved 40 assets onto a preventive maintenance schedule in our CMMS, and unplanned downtime fell 27% in a year. I also led root cause analysis on repeat gearbox failures that had been stopping Line 2 six times a quarter, and those failures stopped.",
      "On the electrical side, I diagnose Allen-Bradley PLC faults, motors and drives and swap VFDs to restore production. At Kestrel Foods I repaired hydraulics and pneumatics on fillers and cappers, fabricated guards and brackets with MIG welding from blueprints, and trained 6 new operators on our lockout/tagout energy control procedure. I hold OSHA 30 for general industry.",
      "I'd be glad to talk about your equipment and how your maintenance team splits planned and reactive work. Thank you for your time.",
    ],
    annotations: [
      "Industry, experience and the equipment he works on, matched to a packaging plant.",
      "Two results: a downtime cut from preventive maintenance and a repeat failure he solved.",
      "Electrical, mechanical and safety skills, including training others.",
      "Closes on how their team works, a natural first conversation.",
    ],
    tips: [
      { t: "Name the equipment", d: "Say what you've maintained, such as conveyors, fillers or palletizers, so the reader can match it to their floor." },
      { t: "Use a downtime result", d: "Unplanned downtime, repeat failures or preventive maintenance completion show your effect on production." },
      { t: "Cover electrical and mechanical", d: "Many plants want both. Mention PLCs or drives alongside hydraulics, pneumatics or welding if you do both." },
    ],
    faqs: [
      { q: "Do maintenance technicians need a cover letter?", a: "Plants often hire from the application and a skills interview. A short letter helps when you're moving to a new industry or applying for a higher technician level." },
      { q: "Should I mention specific PLC brands?", a: "Yes, if they match the posting. Name the brand and what you do with it, such as reading logic or diagnosing faults." },
    ],
  },
  {
    slug: "warehouse-associate",
    target: { title: "Warehouse Associate, Forklift", company: "Wide World Importers", hiringManager: "Darnell Price" },
    paragraphs: [
      "I'm applying for the forklift warehouse associate position at Wide World Importers. I have 3 years in e-commerce and retail distribution, I'm forklift certified on sit-down counterbalance and reach truck, and I'm comfortable lifting 50 lbs through 10-hour shifts.",
      "At Northgate Distribution I pick and pack 140+ units an hour with an RF scanner and have held 99.8% order accuracy over 18 months. I also handle receiving for 25+ inbound trailers a week, checking counts against purchase orders in the WMS, and I've run a forklift, reach truck and electric pallet jack with no incidents.",
      "I'd be glad to come in for an interview or an equipment check. Thank you for considering me.",
    ],
    annotations: [
      "Gives certifications and physical requirements, the first things a warehouse supervisor screens for.",
      "Pick rate, accuracy, receiving and a clean equipment record in one paragraph.",
      "A short close with a practical next step.",
    ],
    tips: [
      { t: "Keep it short", d: "Three short paragraphs are plenty. Supervisors want to know you're certified, accurate and ready to work." },
      { t: "Lead with certifications", d: "Name the equipment you're certified on and confirm you meet the lifting and shift requirements in the posting." },
      { t: "Give rate and accuracy", d: "Units per hour and order accuracy are numbers every warehouse tracks, so they're easy to compare." },
    ],
    faqs: [
      { q: "Do warehouse jobs need a cover letter?", a: "Usually not. Most warehouse applications are a quick online form, and some don't have a place for a letter. Write a few lines when the posting asks for one, when you apply by email, or when you're going for a lead or equipment role." },
      { q: "What should a short warehouse cover letter include?", a: "The role, your equipment certifications, your pick rate or accuracy and the shifts you can work." },
    ],
  },
  {
    slug: "truck-driver",
    target: { title: "Regional CDL-A Driver, Tanker", company: "Northwind Traders", hiringManager: "Frank Morales" },
    paragraphs: [
      "I'm applying for the regional tanker driver position at Northwind Traders. I hold a Class A CDL with Hazmat and Tanker endorsements, I have 8 years of OTR and regional driving with 850,000+ accident-free miles, and my DOT medical card is current.",
      "At Lone Prairie Freight I run regional routes across Texas, Oklahoma and Louisiana in dry van and tanker equipment, about 2,500 miles a week. I've kept a 98% on-time delivery rate across 600+ loads while staying within hours of service, and I plan fuel stops and rest breaks with dispatch to protect delivery windows.",
      "I don't cut corners on safety. I do a full pre-trip inspection and DVIR every shift and have passed 11 roadside inspections with no violations. Before that, at Redline Transport Co., I hauled dry van and flatbed freight in the lower 48, secured steel, lumber and machinery to load securement rules and earned the carrier's safety award 3 years in a row.",
      "I'd be glad to talk about your lanes and equipment. Thank you for considering my application.",
    ],
    annotations: [
      "CDL class, endorsements, experience and safe miles, everything a recruiter checks first.",
      "Shows the regional work he does now and an on-time result within hours of service.",
      "Backs up the safety claim with inspections, securement and an award.",
      "A short close about the job itself.",
    ],
    tips: [
      { t: "Lead with CDL, endorsements and miles", d: "Put your CDL class, endorsements and safe miles in the first two sentences." },
      { t: "Give on-time and inspection results", d: "On-time delivery and clean roadside inspections show you're reliable and safe at the same time." },
      { t: "Keep it short", d: "A few plain paragraphs are enough. Recruiters will check your MVR and work history anyway." },
    ],
    faqs: [
      { q: "Do truck drivers need a cover letter?", a: "Usually not. Most carriers hire from an application, your driving record and a phone call. A short letter helps when you apply by email, want a specific lane or equipment type, or are moving from OTR to regional or local work." },
      { q: "What should a driver cover letter include?", a: "Your CDL class, endorsements, years and type of driving, safety record and the equipment you've run." },
    ],
  },
  {
    slug: "logistics-coordinator",
    target: { title: "Senior Logistics Coordinator", company: "Tailspin Toys", hiringManager: "Megan Fischer" },
    paragraphs: [
      "I'm applying for the Senior Logistics Coordinator role at Tailspin Toys. I have 5 years in freight brokerage and consumer goods distribution, and at Oakhurst Home Goods I schedule 150+ outbound LTL and FTL loads a week from 2 distribution centers in our TMS.",
      "I keep freight spend under control. I rebid 6 lanes and shifted low-volume freight to consolidated LTL, which cut freight cost per order by 9%. I also run a weekly freight audit that caught $38K in duplicate and incorrect carrier invoices in 2025, and I build Excel KPI reports on on-time pickup, transit time and damage claims for our supply chain director.",
      "I've worked the carrier side, too. At Meridian Freight Solutions I booked and tracked 40+ truckloads a day, ran check calls from pickup to delivery and prepared bills of lading and import/export documents for cross-border shipments to Mexico. When weather delays hit, I rerouted freight to protect customer delivery dates. I'm ASCM CLTD certified.",
      "I'd welcome the chance to talk about your carrier mix and your busiest shipping periods. Thank you for your time.",
    ],
    annotations: [
      "Experience, shipment volume and systems in the opening.",
      "Two cost results and the reporting a director relies on.",
      "Brokerage experience, cross-border paperwork and a certification.",
      "Closes on their carriers and busiest periods, where a coordinator is tested most.",
    ],
    tips: [
      { t: "Give load volume and modes", d: "Loads per week and whether you handle LTL, FTL, parcel or international tell the reader your scope." },
      { t: "Show a cost result", d: "Freight cost per order, audit recoveries or lane rebids show you manage money, not just schedules." },
      { t: "Name the systems", d: "Mention your TMS, WMS or ERP experience if the posting lists one." },
    ],
    faqs: [
      { q: "Should I mention brokerage experience when applying to a shipper?", a: "Yes. Knowing how carriers and brokers work helps you negotiate and solve problems from the shipper side. One sentence is enough." },
      { q: "How technical should a logistics cover letter be?", a: "Use the terms the posting uses, such as LTL, TMS or Incoterms, but keep the focus on results and how you handle problems." },
    ],
  },

  // ------------------------------------------------------ Retail & hospitality
  {
    slug: "retail-sales-associate",
    target: { title: "Sales Associate, Footwear and Camping", company: "Adventure Works", hiringManager: "Jake Sorensen" },
    paragraphs: [
      "I'm applying for the Sales Associate position in Adventure Works' footwear and camping department. I have 3 years in retail, most recently at Trailhead Outdoor Supply, where I beat my monthly sales goal in 10 of 12 months in 2025 and averaged 112% of target.",
      "I sell by knowing the product. I learned our footwear and camping gear well enough to fit customers properly and suggest add-ons that make sense, which raised my average sale by 15%. I also signed up 300+ customers for our loyalty program, the most in the store two quarters running.",
      "I help keep the store running, too. I set up seasonal displays and handle opening and closing duties 3 days a week. At Cedar & Pine Home I ran the POS for sales, returns and exchanges with accurate cash handling, supported inventory counts and followed loss prevention procedures.",
      "I'd love to talk about the department and the hours you need covered. Thank you for considering me.",
    ],
    annotations: [
      "Leads with a sales result in the same product category.",
      "Shows how she sells, with a second result and loyalty sign-ups.",
      "Adds store operations and cash handling, so the manager sees more than sales.",
      "A short close about the team's schedule.",
    ],
    tips: [
      { t: "Lead with a sales number", d: "Goals beaten, average sale or loyalty sign-ups give a store manager something concrete." },
      { t: "Show product knowledge", d: "If you're applying to a specialty store, say what you know about the products they sell." },
      { t: "Keep it to a few short paragraphs", d: "Store managers read quickly. Three or four short paragraphs are enough." },
    ],
    faqs: [
      { q: "Do retail jobs need a cover letter?", a: "Most store applications don't require one. A short letter helps when you apply to a specialty store or a lead or key holder role, or when you're emailing a store manager directly." },
      { q: "What if I don't have sales numbers?", a: "Use what you do have, such as loyalty sign-ups, customer compliments, opening and closing duties or how you learned the products." },
    ],
  },
  {
    slug: "store-manager",
    target: { title: "Store Manager", company: "Tailwind Traders", hiringManager: "Lisa Romero" },
    paragraphs: [
      "I'm applying for the Store Manager position at Tailwind Traders. I have 9 years in specialty retail, the last 4 running a $4.2M store at Brightwell Home & Kitchen, where we've grown sales 14% over 2 years against a district average of 5%.",
      "I spend most of my time on the team. I lead 22 people through hiring, training, scheduling and weekly coaching, and we cut turnover from 68% to 41%. Keeping good people longer is what makes the rest of the store easier to run.",
      "I also watch the numbers that don't show up in sales. Shrink fell from 2.1% to 1.2% of sales after we tightened receiving, ran loss prevention audits and improved cash controls, and I hit the labor budget 10 of 12 months by matching schedules to traffic data in Excel. Before Brightwell, as assistant store manager at Fernway Apparel, I ran daily operations for a $2.8M store, rolled out a visual merchandising reset across 3 stores before the holidays and raised customer experience scores from 78 to 89.",
      "I'd welcome the chance to talk about your store's goals and the team I'd be leading. Thank you for your time.",
    ],
    annotations: [
      "Store size and sales growth against a benchmark, the result district managers ask about first.",
      "Shows how she leads people, with a turnover result.",
      "Adds shrink, labor and earlier operations results to cover the whole P&L.",
      "Closes on goals and the team.",
    ],
    tips: [
      { t: "Lead with store size and growth", d: "Annual sales volume and growth compared with the district or company give your results context." },
      { t: "Cover people and the P&L", d: "Turnover, shrink and labor show you can run the whole store, not just the sales floor." },
      { t: "Keep each result to one line", d: "A district manager should be able to scan your letter and find three or four numbers quickly." },
    ],
    faqs: [
      { q: "Should a store manager cover letter mention P&L responsibility?", a: "Yes. Say how large the store is and which lines you manage, such as sales, labor and shrink." },
      { q: "How do I apply for a store manager role as an assistant manager?", a: "Lead with the parts of the store you already run, such as scheduling, inventory or the team on your shifts, and any results from times you covered for the manager." },
    ],
  },
  {
    slug: "cashier",
    target: { title: "Cashier", company: "Contoso Market", hiringManager: "Amanda Liu" },
    paragraphs: [
      "I'm applying for the cashier position at Contoso Market. I have 2 years of cashier experience in grocery and pharmacy retail, and I speak English and Spanish.",
      "At Sunbay Grocery I check out 250+ customers a shift and keep the line moving during peak hours. My drawer has balanced to the penny on 98% of shifts and has never been off by more than $1. I handle returns, coupons and loyalty sign-ups, adding 80+ new members a month, and I check ID on every alcohol and tobacco sale.",
      "I'd be glad to come in and talk about the shifts you need covered. Thank you for considering me.",
    ],
    annotations: [
      "The role, experience and a useful extra (a second language) in two sentences.",
      "Speed, drawer accuracy and the other checkout tasks a manager depends on.",
      "A short, practical close.",
    ],
    tips: [
      { t: "Keep it to three short paragraphs", d: "Store managers read these quickly. Say who you are, what you're good at and when you can talk." },
      { t: "Lead with accuracy", d: "How often your drawer balances is the number cashier managers care about most." },
      { t: "Mention languages and availability", d: "If you speak a second language or can work the hours in the posting, say so plainly." },
    ],
    faqs: [
      { q: "Do cashiers need a cover letter?", a: "Usually not. Most cashier jobs are filled from a short online application or an in-store interview. If there's an optional field or you're emailing a manager, a few lines like this example are plenty." },
      { q: "What should I write if this is my first job?", a: "Mention your availability, reliability at school or in activities, any experience handling money and any languages you speak." },
    ],
  },
  {
    slug: "server",
    target: { title: "Server, Winery Restaurant", company: "Coho Winery", hiringManager: "Isabel Grant" },
    paragraphs: [
      "I'm applying for the server position at Coho Winery's restaurant. I have 5 years in casual and fine dining, and I'm ServSafe Food Handler and TIPS certified.",
      "At Lantern & Oak Kitchen I run a 6-table section in a 140-seat fine dining restaurant, serving 60–80 guests on a typical weekend night. I've raised my average check 12% through menu knowledge, wine pairing suggestions and desserts, and wine is a big reason a winery restaurant appeals to me.",
      "I take food allergies seriously, confirming every request with the kitchen and flagging the ticket in Toast. I also trained 7 new servers on steps of service in 2025. At Marigold Trattoria, guests mentioned me by name in reviews 30+ times.",
      "I'd love to come in for an interview or a trail shift. Thank you for considering me.",
    ],
    annotations: [
      "Experience and the certifications most restaurants require.",
      "Section size, volume and a check-average result tied to wine, which fits this employer.",
      "Allergy care, training new servers and guest feedback.",
      "Offers a trail shift, the normal next step in restaurants.",
    ],
    tips: [
      { t: "Give section size and volume", d: "Tables, seats and covers on a busy night tell a manager what pace you're used to." },
      { t: "Use your check average", d: "If you track it, a higher check average shows you sell without being pushy." },
      { t: "Mention allergies and certifications", d: "Food safety and responsible alcohol service matter to every manager. One sentence covers both." },
    ],
    faqs: [
      { q: "Do servers need a cover letter?", a: "Most restaurants don't ask for one. A short note helps for fine dining, hotel or winery restaurants, or when you're emailing a manager directly." },
      { q: "Should I mention tips or sales in a server cover letter?", a: "Mention check average or upselling results if you have them. Leave out how much you earn in tips." },
    ],
  },
  {
    slug: "line-cook",
    target: { title: "Line Cook, Lodge Restaurant", company: "Alpine Ski House", hiringManager: "Sam Whitaker" },
    paragraphs: [
      "I'm applying for the line cook position at Alpine Ski House's lodge restaurant. I have 4 years in high-volume and scratch kitchens on grill, sauté and fryer, a culinary arts certificate and a ServSafe Food Handler card.",
      "At Salt & Ember I run the grill and sauté stations in a 180-cover scratch kitchen and keep ticket times under 12 minutes on busy nights. I set my mise en place from the daily prep list, cut end-of-night food waste by about 20% with better portion control, and follow FIFO, labeling and temperature logs. Before that, at Riverbend Grill, I worked fryer and flat-top on weekend lunch rushes of 300+ covers.",
      "I'd be glad to come in for a stage or working interview. Thank you for your time.",
    ],
    annotations: [
      "Stations, experience and food safety certification in two sentences.",
      "Volume, ticket times, waste and food safety, the things a chef checks on a stage.",
      "Offers a stage, which is how most kitchens hire.",
    ],
    tips: [
      { t: "Name your stations", d: "Grill, sauté, fryer or garde manger tells a chef where you can start on day one." },
      { t: "Give covers and ticket times", d: "The volume you've cooked for and how fast you keep tickets moving show your pace." },
      { t: "Keep it short", d: "A chef will judge you on the line. A few lines are enough to get you a stage." },
    ],
    faqs: [
      { q: "Do line cooks need a cover letter?", a: "Rarely. Most kitchens hire from a short application and a working interview or stage. A few lines help when you email a chef directly or the application asks for a letter." },
      { q: "What do chefs want to see from a line cook?", a: "The stations you've worked, the volume you're used to, food safety certification and when you can work." },
    ],
  },
  {
    slug: "front-desk-agent",
    target: { title: "Lead Front Desk Agent", company: "Contoso Hotels", hiringManager: "Rachel Stein" },
    paragraphs: [
      "I'm applying for the Lead Front Desk Agent position at Contoso Hotels. I have 3 years in resort and business hotels, and at Palmetto Bay Resort I handle check-in and check-out for a 420-room property, often 150+ arrivals a shift during peak season.",
      "I like solving guest problems at the desk before they grow. I handle complaints on the spot, and guests named me in 50+ reviews and survey comments in 2025. I also upsell room upgrades and late check-outs, adding about $4,500 a month in room revenue.",
      "I'm comfortable with the systems side, too. I manage reservations, room assignments and billing in Opera PMS and balance my cash at the end of each shift. At Lakeside Suites I covered night audit 2 nights a week and enrolled 40+ guests a month in the loyalty program at check-in. I speak English and Korean.",
      "I'd welcome the chance to talk about your front office team and the shifts you need covered. Thank you for considering my application.",
    ],
    annotations: [
      "Hotel types, property size and arrival volume up front.",
      "Guest recovery and upsell results, the two things front office managers track.",
      "Systems, night audit, loyalty sign-ups and a second language.",
      "Closes on the team and schedule.",
    ],
    tips: [
      { t: "Give property size and volume", d: "Room count and arrivals per shift tell a front office manager what pace you're used to." },
      { t: "Show upsell and guest results", d: "Upgrade revenue, loyalty sign-ups or guest mentions are concrete ways to show you're good at the desk." },
      { t: "Name your PMS", d: "If you've used Opera or another property management system in the posting, say so in one line." },
    ],
    faqs: [
      { q: "Do front desk agents need a cover letter?", a: "Many hotels make it optional. A short letter helps for lead roles, resorts and luxury properties, or when you're moving from another customer-facing job into hotels." },
      { q: "Should I mention night audit experience?", a: "Yes, if the posting includes overnight shifts or you're applying for a lead role. It shows you understand how the hotel's day is closed out." },
    ],
  },
];
