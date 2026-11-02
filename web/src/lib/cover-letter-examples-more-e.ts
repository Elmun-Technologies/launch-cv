import type { CoverLetterExample } from "@/lib/cover-letter-examples";

/** Cover letters for the roles in lib/resume-examples-more-e.ts (same fictional person). */
export const MORE_COVER_LETTERS_E: CoverLetterExample[] = [
  // ---------------------------------------------------------------- Healthcare
  {
    slug: "pharmacist",
    target: { title: "Pharmacist, Community Pharmacy", company: "Northwind Pharmacy", hiringManager: "Gregory Hale" },
    paragraphs: [
      "I'm applying for the Pharmacist position at Northwind Pharmacy. I'm a PharmD with a Pennsylvania pharmacist license and 6 years in community pharmacy, the last 3 as pharmacist-in-charge at Allegheny Ridge Pharmacy, where I verify 250–300 prescriptions a day with a team of 4 pharmacy technicians.",
      "Speed matters at a busy counter, but I don't let it replace the clinical check. I complete a drug utilization review on every prescription, and in 2025 I completed 180 comprehensive medication reviews for MTM patients and called prescribers about 60+ drug therapy problems. I also administered 1,100+ immunizations last season and documented each one in the state registry.",
      "Your posting mentions controlled-substance compliance. I check the Pennsylvania PDMP before dispensing controlled substances, keep our Schedule II perpetual inventory and led the store's biennial DEA inventory. Earlier, at Three Rivers Neighborhood Pharmacy, I cut prior authorization turnaround from 5 days to 2 with a same-day tracking log and precepted 6 PharmD students on community rotations.",
      "I'd welcome the chance to talk about your pharmacy's patient services and how I could support your team. Thank you for considering my application.",
    ],
    annotations: [
      "Degree, license, experience and daily volume in the opening.",
      "Shows clinical judgment and patient services with numbers from his resume.",
      "Answers the posting's compliance concern and adds a workflow result and teaching.",
      "A short close focused on the pharmacy's services and team.",
    ],
    tips: [
      { t: "Lead with your license", d: "Name your degree and the state license you hold, or your exam dates if you're a new graduate, in the first paragraph." },
      { t: "Show the clinical side", d: "One line on DUR catches, MTM or immunizations shows you're more than a fast verifier." },
      { t: "Match the role's priorities", d: "If the posting stresses compliance, immunizations or leading technicians, answer that need with your own example." },
    ],
    faqs: [
      { q: "Do pharmacists need a cover letter?", a: "Not always. Many chains hire from an application. A short letter helps for independent pharmacies, pharmacist-in-charge roles and moves between community and hospital practice." },
      { q: "What should a new graduate pharmacist write about?", a: "Your PharmD program, exam and license status and one or two APPE rotations, with what you did there, such as verification under supervision, counseling or immunizations." },
    ],
  },
  {
    slug: "dental-assistant",
    target: { title: "Dental Assistant", company: "Contoso Family Dental", hiringManager: "Paula Grant" },
    paragraphs: [
      "I'm applying for the Dental Assistant position at Contoso Family Dental. I'm a Texas Registered Dental Assistant and CDA (DANB) with 4 years in general and pediatric dentistry, and at Trinity Oaks Family Dentistry I provide chairside assisting for 2 dentists across 14–18 patients a day.",
      "I take bitewing, periapical and panoramic radiographs and intraoral photos and import them into Dentrix so the dentist can review them right away. I also run sterilization for the office, and weekly spore testing on both autoclaves has passed every week since I took it over.",
      "Your practice sees a lot of families, and I've spent much of my career with children. At Lakeview Pediatric Dentistry I assisted 20+ children a day and used tell-show-do to keep nervous patients calm. I also cut turnover between patients to about 10 minutes and cut monthly supply spending by 12% after I took over ordering.",
      "I'd be glad to meet your team and talk about how your schedule runs. Thank you for considering my application.",
    ],
    annotations: [
      "State registration, national certification, experience and patient load up front.",
      "Radiography and infection control, the two skills an office checks first.",
      "Ties pediatric experience to a family practice and adds two efficiency results.",
      "A short, friendly close.",
    ],
    tips: [
      { t: "Name both credentials", d: "Put your state registration or license and any DANB certification in the first sentence." },
      { t: "Mention radiography and infection control", d: "These are the skills a dentist relies on every day and the ones regulators check." },
      { t: "Match the patients", d: "If the practice sees families or children, say how you work with nervous or young patients." },
    ],
    faqs: [
      { q: "Do dental assistants need a cover letter?", a: "Often not. Many offices hire from a resume and a working interview. A short letter helps when the posting asks for one or you're moving into a new specialty." },
      { q: "What if I'm a new dental assistant?", a: "Mention your program, externship, BLS and whether you've started your state registration or DANB exams, plus the procedures you assisted with." },
    ],
  },
  {
    slug: "occupational-therapist",
    target: { title: "Occupational Therapist, Inpatient Rehabilitation", company: "Lamna Healthcare", hiringManager: "Denise Carver" },
    paragraphs: [
      "I'm applying for the Occupational Therapist position on Lamna Healthcare's inpatient rehabilitation unit. I'm an OTR/L licensed in North Carolina with 5 years in acute care and inpatient rehab, and at Crabtree Valley Rehabilitation Hospital I treat a caseload of 8–10 patients a day after stroke, spinal cord injury, brain injury and orthopedic surgery.",
      "The work I'm proudest of is getting families ready for discharge. I noticed caregivers were going home unsure how to help with transfers, so I started a structured caregiver training session in the week before discharge. On our unit survey, family-reported confidence with transfers at discharge rose from 58% to 81%.",
      "I write measurable goals, lead ADL retraining and neuromuscular re-education and coordinate discharge planning with case management, PT and speech-language pathology. Before inpatient rehab, I worked in acute care at Neuse River Medical Center, evaluating 10–12 patients a day and added a MoCA cognitive screen to evaluations for older adults. I document in Epic the same day and follow Medicare documentation guidelines.",
      "I'd welcome the chance to meet your rehab team and hear how you plan care for your patients. Thank you for your time.",
    ],
    annotations: [
      "Credential, license, settings and caseload in the opening.",
      "One outcome, with the problem she noticed and what she changed.",
      "Treatment skills, team coordination, acute care background and documentation.",
      "Closes on the team and its patients.",
    ],
    tips: [
      { t: "Lead with credential and setting", d: "Name OTR/L or your license status and the settings you've worked in, especially if you're changing settings." },
      { t: "Pick one outcome", d: "Goals met, safe discharges or caregiver confidence show what your treatment changes for patients." },
      { t: "Show you work as a team", d: "Rehab units want therapists who coordinate with PT, speech, nursing and case management." },
    ],
    faqs: [
      { q: "Do occupational therapists need a cover letter?", a: "Many employers don't require one, but a short letter helps when you're changing settings, applying to a specialty program or graduating with mostly fieldwork experience." },
      { q: "What should a new graduate OT write about?", a: "Your ACOTE-accredited program, NBCOT and license status and your Level II fieldwork: the settings, the caseload you reached and one patient outcome you contributed to." },
    ],
  },
  {
    slug: "respiratory-therapist",
    target: { title: "Respiratory Therapist, Critical Care", company: "Fabrikam Medical Center", hiringManager: "Alan Whitfield" },
    paragraphs: [
      "I'm applying for the Respiratory Therapist position on Fabrikam Medical Center's critical care team. I'm a registered respiratory therapist, RRT (NBRC), with a Colorado respiratory therapist license and 6 years in adult critical care and general floors. At Front Range Medical Center I manage mechanical ventilation for up to 8 ICU patients a shift.",
      "I work closely with nursing to get patients off the ventilator safely. I run daily spontaneous breathing trials under our weaning protocol and report readiness to the ICU team on rounds. I also respond to every code blue and rapid response on my shift, manage the airway and assist with intubation.",
      "Noninvasive support is a big part of my work. I set up and titrate BiPAP, CPAP and high-flow nasal cannula, and I trained 12 new nurses on noninvasive ventilation alarms. Before the ICU, I covered 25–30 floor patients a shift at Platte Valley Hospital, where I used the RT-driven protocol to cut scheduled nebulizer treatments on my units by about 20%.",
      "I'd be glad to talk about how your team staffs the ICU and where I could help. Thank you for considering my application.",
    ],
    annotations: [
      "Credential, license, experience and ICU workload up front.",
      "Weaning and code response, the teamwork ICU managers look for.",
      "Noninvasive skills, teaching nurses and a protocol result from floor work.",
      "A brief close on staffing.",
    ],
    tips: [
      { t: "Name your NBRC credential and license", d: "Write CRT or RRT and your state license in the first paragraph." },
      { t: "Give your unit and workload", d: "Ventilated patients per shift or floor census tells a manager how ready you are for their unit." },
      { t: "Show protocol work", d: "Weaning trials, RT-driven protocols and teaching nurses show judgment, not just following orders." },
    ],
    faqs: [
      { q: "Do respiratory therapists need a cover letter?", a: "Often not. Many hospitals hire from the application. A short letter helps when you're moving into critical care, neonatal or pediatric work, or when the posting asks for one." },
      { q: "What should a new graduate respiratory therapist mention?", a: "Your CoARC-accredited program, NBRC credential or exam date, license status and clinical rotations, with the units you worked on and the skills you practiced." },
    ],
  },
  {
    slug: "surgical-technologist",
    target: { title: "Certified Surgical Technologist", company: "Proseware Surgical Hospital", hiringManager: "Linda Okoro" },
    paragraphs: [
      "I'm applying for the Certified Surgical Technologist position at Proseware Surgical Hospital. I'm a CST (NBSTSA) with 5 years in hospital ORs and an ambulatory surgery center, and at Stones Ferry Medical Center I scrub 4–6 cases a day in general, orthopedic, gynecologic and robotic-assisted surgery.",
      "I set up the back table and Mayo stand from surgeon preference cards and perform sponge, sharps and instrument counts with the circulating nurse on every case. When our cards fell out of date, I worked with the OR team to update 40+ of them, which cut supplies opened but not used on those cases.",
      "Your posting mentions a busy orthopedic schedule. I scrub total joints now and scrubbed 6–8 outpatient cases a day at Old Hickory Surgery Center, mostly orthopedics, ENT and general surgery. There I helped cut average room turnover from 25 to 18 minutes by opening the next case's supplies in a set order with the circulator. I also take call for trauma and emergency cases.",
      "I'd welcome the chance to talk about your service lines and how your OR team works together. Thank you for your consideration.",
    ],
    annotations: [
      "Credential, experience and case mix in the opening.",
      "Safety habits plus one result that saved the OR waste.",
      "Matches the posting's orthopedic focus and adds a turnover result and call.",
      "A short close about the team.",
    ],
    tips: [
      { t: "Name your credential and specialties", d: "Write CST (NBSTSA) and the service lines you scrub most in the first paragraph." },
      { t: "Show safety habits", d: "Counts, sterile technique and time-outs are what OR leaders care about most." },
      { t: "Give one efficiency result", d: "Turnover time or preference card work shows you help the whole room run better." },
    ],
    faqs: [
      { q: "Do surgical technologists need a cover letter?", a: "Not always. Many hospitals hire from the application. A short letter helps when you're moving into a new specialty, such as robotics or cardiac, or the posting asks for one." },
      { q: "What should a new surgical tech write about?", a: "Your accredited program, CST status and clinical cases: the specialties you rotated through and the cases you scrubbed." },
    ],
  },
  {
    slug: "veterinary-technician",
    target: { title: "Veterinary Technician, Surgery and Dentistry", company: "Tailspin Animal Hospital", hiringManager: "Karen Lindgren" },
    paragraphs: [
      "I'm applying for the Veterinary Technician position on Tailspin Animal Hospital's surgery and dentistry team. I'm a New York Licensed Veterinary Technician with 4 years in small animal general practice and emergency care. At Elmwood Village Animal Hospital I induce and monitor anesthesia for 5–7 surgical and dental patients a day.",
      "Anesthesia safety is the part of the job I take most seriously. I record heart rate, blood pressure, SpO2 and ETCO2 every 5 minutes and tell the veterinarian right away when a trend changes. I also perform dental cleanings and take full-mouth dental radiographs, and I run our in-house lab work, from CBCs and chemistry panels to urinalysis and cytology prep.",
      "Before general practice, I worked overnight at Niagara Frontier Veterinary Emergency, triaging walk-in emergencies, assisting with CPR and trauma stabilization and monitoring 8–12 hospitalized patients a night. That work taught me to stay calm with critical patients and worried owners, and I still go over every discharge with clients so they know what to do at home.",
      "I'd be glad to talk about your surgical schedule and how your technicians and veterinarians share the work. Thank you for considering my application.",
    ],
    annotations: [
      "State credential, experience and anesthesia load in the opening.",
      "Anesthesia monitoring, dentistry and lab skills that match the role.",
      "Emergency experience and client care, told briefly.",
      "A short close about the team.",
    ],
    tips: [
      { t: "Use your state's credential title", d: "Write LVT, RVT or CVT exactly as your state issues it, in the first paragraph." },
      { t: "Match the department", d: "For surgery and dentistry, lead with anesthesia and dental radiographs. For emergency, lead with triage and critical care." },
      { t: "Mention clients", d: "A line on discharge instructions or calming owners shows you can represent the practice well." },
    ],
    faqs: [
      { q: "Do veterinary technicians need a cover letter?", a: "Often not. Many practices hire from an application and a working interview. A short letter helps for specialty or emergency hospitals and when you're changing practice types." },
      { q: "What should a new veterinary technician write about?", a: "Your AVMA-accredited program, VTNE and credential status and your externships, with the skills you practiced, such as anesthesia monitoring and dental radiographs." },
    ],
  },
  {
    slug: "medical-laboratory-scientist",
    target: { title: "Medical Laboratory Scientist, Core Lab and Blood Bank", company: "Trey Research Medical Center", hiringManager: "Howard Lin" },
    paragraphs: [
      "I'm applying for the Medical Laboratory Scientist position in Trey Research Medical Center's core lab and blood bank. I'm certified as MLS(ASCP)CM, with 6 years in hospital and outpatient labs. At Minnehaha Falls Medical Center I run and verify chemistry, hematology, coagulation and urinalysis results for a 300-bed hospital on evening shift.",
      "Your posting asks for blood bank experience. I perform ABO/Rh typing, antibody screens and crossmatching and issue products during massive transfusion events. I also review daily QC with Westgard rules, troubleshoot analyzer failures and document corrective action before any patient result goes out, and I call critical values with read-back and log each call in the LIS.",
      "I've also helped bring new instruments into service. I ran precision, accuracy and reportable range studies to validate our new coagulation analyzer for the lab director's sign-off. Earlier, at Lake Nokomis Clinic Laboratory, I cut average turnaround time for routine morning chemistry from 3 hours to under 2 by reorganizing batch runs, and I trained 5 MLS students on hematology.",
      "I'd welcome the chance to talk about how your lab covers its evening and weekend shifts. Thank you for considering my application.",
    ],
    annotations: [
      "Credential in ASCP's format, experience and current departments.",
      "Answers the posting's blood bank need, then shows quality habits.",
      "Validation work, a turnaround result and teaching.",
      "A practical close about shift coverage.",
    ],
    tips: [
      { t: "Write your credential as issued", d: "Use ASCP's format, such as MLS(ASCP)CM, and add a state license if your state requires one." },
      { t: "Name the departments", d: "Say which benches you're signed off on, especially any the posting asks for, such as blood bank or microbiology." },
      { t: "Show quality work", d: "QC review, validations and critical value calls tell a lab manager you can be trusted with results." },
    ],
    faqs: [
      { q: "Do medical laboratory scientists need a cover letter?", a: "Not always. Many hospital labs hire from the application. A short letter helps when you're moving into a new department, such as blood bank, or into a lead role." },
      { q: "What should a new graduate MLS write about?", a: "Your NAACLS-accredited program, ASCP exam status and clinical rotations, with the departments and instruments you trained on." },
    ],
  },

  // --------------------------------------------------------- People & service
  {
    slug: "social-worker",
    target: { title: "Medical Social Worker, Inpatient Units", company: "Woodgrove Community Hospital", hiringManager: "Theresa Nolan" },
    paragraphs: [
      "I'm applying for the Medical Social Worker position at Woodgrove Community Hospital. I'm a licensed master social worker (LMSW) in New York with an MSW from a CSWE-accredited program and 5 years in hospital and community settings. At Genesee Valley Hospital I carry a caseload of 18–22 patients on medical-surgical units.",
      "Much of my work is making sure patients leave the hospital safely. I complete psychosocial assessments, plan discharges to skilled nursing, home health, hospice and shelters, and help patients apply for Medicaid and community benefits. When patients without a safe plan were staying longer than they needed to, I started a weekly huddle with case management, and average days from referral to placement on my units fell from 6 to 4.",
      "I also provide crisis intervention and safety planning, including for patients disclosing intimate partner violence. Before the hospital, I worked at Lilac City Family Services, coordinating care for 30 families with children at risk of out-of-home placement, and built a resource guide of 60+ local programs that the whole team used.",
      "I'd welcome the chance to talk about your patients and how your social work and case management teams work together. Thank you for your time.",
    ],
    annotations: [
      "License, degree, experience and caseload in the opening.",
      "Discharge planning with one result and what she changed to get it.",
      "Crisis work and community experience, described without client details.",
      "Closes on the team she'd be joining.",
    ],
    tips: [
      { t: "Name your license and setting", d: "Write your state's license title and the setting you work in now, especially if you're changing settings." },
      { t: "Show one outcome", d: "Faster placements, safe discharges or families connected to benefits show your impact." },
      { t: "Protect client privacy", d: "Describe populations and the type of work, never names or details that could identify someone." },
    ],
    faqs: [
      { q: "Do social workers need a cover letter?", a: "Often, yes. Many agencies and hospitals ask for one, and it's a good place to show your approach and why the population matters to you." },
      { q: "What should a new MSW write about?", a: "Your CSWE-accredited program, license or exam status and your field placements, with the populations you served and the skills you used." },
    ],
  },
  {
    slug: "police-officer",
    target: { title: "Police Officer (Lateral)", company: "Contoso Police Department", hiringManager: "Lt. Victor Ramos" },
    paragraphs: [
      "I'm applying for the lateral Police Officer position with the Contoso Police Department. I hold a TCOLE Peace Officer License and have 4 years on patrol with the Pecan Hollow Police Department, after 2 years as a detention officer. On a typical shift I respond to 10–15 calls for service, from disturbances and crashes to mental health crises.",
      "Your department's focus on crisis response fits how I work. I've completed Crisis Intervention Training, and on mental health calls I use de-escalation and connect people with the county mobile crisis team instead of jail where appropriate. I write incident and arrest reports in the RMS before the end of each shift and check them against body-worn camera footage.",
      "I also take traffic safety seriously. Using standardized field sobriety testing, I made 35 DWI arrests in 2025. And I joined 12 neighborhood association meetings a year as the community policing liaison for my beat, because the calls go better when people already know you.",
      "I'd be glad to talk about your lateral process and the needs of your patrol division. Thank you for your consideration.",
    ],
    annotations: [
      "License, years of service and call volume up front.",
      "Matches the department's crisis focus and shows report habits.",
      "Enforcement and community work side by side.",
      "A short close about the hiring process.",
    ],
    tips: [
      { t: "Name your state license", d: "Write your state's certification by its official name, such as a POST certificate or the TCOLE Peace Officer License." },
      { t: "Balance enforcement and service", d: "Pair an enforcement result with de-escalation or community work." },
      { t: "Keep it factual", d: "Don't include case details or names. Describe the type of work and the result in general terms." },
    ],
    faqs: [
      { q: "Do police officers need a cover letter?", a: "Many departments hire through an application, testing and interviews, so a letter isn't always required. It helps for lateral moves, specialty assignments and departments that ask for one." },
      { q: "What should a new academy graduate write about?", a: "Your academy, state certification status and any jobs that show you handle people calmly, such as detention, security, military or EMS work." },
    ],
  },
  {
    slug: "firefighter",
    target: { title: "Firefighter/EMT", company: "Fabrikam Fire Rescue", hiringManager: "Captain Laura Benson" },
    paragraphs: [
      "I'm applying for the Firefighter/EMT position with Fabrikam Fire Rescue. I hold Firefighter I and II and EMT (NREMT) certifications and have 5 years on an engine company with the Saguaro Flats Fire Department, where we run 12–18 calls per 24-hour shift. Most are EMS calls, with structure fires, vehicle crashes and hazmat calls in between.",
      "On the fireground I work interior attack, search and rescue, forcible entry and ventilation, and I operate hydraulic rescue tools for vehicle extrication. I start every shift with apparatus, SCBA and equipment checks, because a crew is only as ready as its gear.",
      "EMS has been part of my work from the start. Before the fire service, I spent 2 years on a 911 BLS ambulance at Copper Basin Ambulance, running 8–12 calls per shift and completing every ePCR before going back in service. I also enjoy the community side of the job and have taught fire safety and hands-only CPR to 1,200+ students in school visits.",
      "I'd welcome the chance to talk about your department and the crews I'd be joining. Thank you for your consideration.",
    ],
    annotations: [
      "Certifications, experience and an honest call mix up front.",
      "Fireground skills and readiness habits.",
      "EMS depth and community education.",
      "A short close about the crews.",
    ],
    tips: [
      { t: "Name your certifications", d: "Firefighter I and II, EMT or paramedic and Hazardous Materials Operations belong in the first paragraph." },
      { t: "Be honest about EMS", d: "Most departments run more EMS than fire calls. Show you're good at both." },
      { t: "Show you're part of a crew", d: "Readiness, training and community work show how you'll fit in at the station." },
    ],
    faqs: [
      { q: "Do firefighters need a cover letter?", a: "Many departments hire through an application, written test, physical ability test and interviews. A short letter helps for lateral moves or when the posting asks for one." },
      { q: "What should a new firefighter write about?", a: "Your academy, certifications, EMT and any volunteer, wildland or EMS work, plus jobs that show teamwork and calm under pressure." },
    ],
  },
  {
    slug: "security-officer",
    target: { title: "Security Officer, Corporate Campus", company: "Litware", hiringManager: "Derek Saunders" },
    paragraphs: [
      "I'm applying for the Security Officer position on Litware's corporate campus team. I hold a California BSIS Guard Card and CPR/AED and First Aid certification, and I have 4 years in security. At Bayline Protective Services I run lobby access control for a 3-building corporate campus and register 80–100 visitors a day.",
      "I patrol buildings and parking structures on foot and by vehicle, monitor CCTV and the access control system and respond to every door-forced and door-held alarm. I write incident reports the same shift, and my supervisor uses them as examples in new officers' report training.",
      "Before the campus, I worked at Almaden Square Shopping Center, patrolling a 40-store center and helping customers, store staff and police. I de-escalated disputes and removed trespassers following post orders, with no use-of-force incidents in 2 years, and gave first aid in medical emergencies until responders arrived.",
      "I'd be glad to talk about your posts and the shifts you need covered. Thank you for considering me.",
    ],
    annotations: [
      "License, certifications and current post in the opening.",
      "Patrol, alarm response and report quality.",
      "Earlier post with de-escalation and emergency response.",
      "A short, practical close.",
    ],
    tips: [
      { t: "Name your license", d: "Write your state guard card or license by name in the first sentence." },
      { t: "Describe the site", d: "Say what kind of post you work now and how large it is." },
      { t: "Show report writing and calm", d: "Good reports and de-escalation are what clients and supervisors value most." },
    ],
    faqs: [
      { q: "Do security officers need a cover letter?", a: "Usually not. Most security companies hire from an application and interview. A short letter helps for in-house corporate, hospital or supervisor roles." },
      { q: "What if I'm new to security?", a: "Mention your license and certifications, plus customer service or other jobs that show you're reliable and calm with people." },
    ],
  },

  // ----------------------------------------------------------------- Business
  {
    slug: "paralegal",
    target: { title: "Litigation Paralegal, Legal Department", company: "Humongous Insurance", hiringManager: "Margaret Ellison" },
    paragraphs: [
      "I'm applying for the Litigation Paralegal position in Humongous Insurance's legal department. I'm a Certified Paralegal (CP) through NALA with 6 years in insurance defense and civil litigation. At Halsted & Monroe LLP I support 3 attorneys on 40+ active insurance defense and commercial cases, from pleadings through trial.",
      "I draft discovery requests and responses, subpoenas and deposition notices for attorney review, and I summarize deposition transcripts. I manage document productions in Relativity, including privilege tags and privilege logs, and I e-file in state and federal court through CM/ECF. Every deadline goes on the firm's calendar the day it's set.",
      "I've also helped take cases to trial, building trial binders and exhibit lists for 4 trials and 2 arbitrations and checking citations in briefs against the Bluebook. Before Halsted & Monroe, I was a legal assistant at Lakeshore Claims Law Group, where I handled intake and conflict checks, ran Westlaw research and cut the average wait for medical records from 6 weeks to 4.",
      "I'd welcome the chance to talk about how your legal department manages its caseload. Thank you for considering my application.",
    ],
    annotations: [
      "Certification, practice area and caseload in the opening.",
      "Discovery, e-discovery, filing and docketing, the work attorneys rely on.",
      "Trial experience, citation checking and earlier insurance work.",
      "A short close about the department.",
    ],
    tips: [
      { t: "Lead with practice area", d: "Insurance defense, corporate or family law paralegals do different work. Say which you do." },
      { t: "Name the tools", d: "Relativity, CM/ECF and Westlaw in one sentence show you can start without much training." },
      { t: "Show you work for attorneys", d: "Phrases like \"for attorney review\" show you understand where a paralegal's work ends." },
    ],
    faqs: [
      { q: "Do paralegals need a cover letter?", a: "Often, yes. Many firms and legal departments ask for one, and attorneys notice clear, careful writing." },
      { q: "What should a new paralegal write about?", a: "Your paralegal program, any internship and the skills you've practiced, such as legal research, drafting and e-filing." },
    ],
  },
];
