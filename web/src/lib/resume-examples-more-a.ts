import type { ResumeExample } from "@/lib/resume-examples";

/** More role examples (see lib/resume-examples.ts for the shape and rules). */
export const MORE_EXAMPLES_A: ResumeExample[] = [
  {
    slug: "medical-assistant",
    role: "Medical Assistant",
    group: "Healthcare",
    level: "Mid-level · 4 years experience",
    intro:
      "A medical assistant resume that shows smooth patient flow, accurate charting and hands-on clinical skills — with the certification, EHR and procedure keywords clinics screen for.",
    resume: {
      name: "Brianna Hayes",
      headline: "Certified Medical Assistant, CMA (AAMA)",
      contact: "Phoenix, AZ · brianna.hayes@email.com · (602) 555-0118",
      summary:
        "Certified medical assistant with 4 years in family medicine and urgent care. I keep the schedule moving, chart accurately and cover both clinical and front-desk work when the clinic needs it.",
      jobs: [
        {
          title: "Certified Medical Assistant",
          company: "Saguaro Ridge Family Medicine",
          dates: "Mar 2024 – Present",
          bullets: [
            "Room 25–30 patients a day for two family physicians, taking vital signs, histories and medication lists in the athenahealth EHR",
            "Perform venipuncture, injections and EKGs, averaging 15 blood draws a day",
            "Cut the average wait from rooming to provider from 14 to 8 minutes by prepping charts and supplies the day before",
            "Submit prior authorizations and referrals; cleared a 3-week referral backlog in my first month",
            "Trained 3 new medical assistants on clinic workflows, infection control and HIPAA-compliant charting",
          ],
        },
        {
          title: "Medical Assistant",
          company: "Desert Bloom Urgent Care",
          dates: "Jun 2022 – Feb 2024",
          bullets: [
            "Checked in and roomed up to 40 patients a shift at a walk-in urgent care clinic",
            "Ran point-of-care testing — rapid strep, flu and urinalysis — and logged daily quality control checks",
            "Covered the front desk on weekends: scheduling, insurance verification and copay collection",
          ],
        },
      ],
      education: "Medical Assisting Certificate, Sonoran Valley Community College, 2022 · CMA (AAMA) · BLS",
      skills: [
        "Vital signs", "Patient intake", "Venipuncture", "Injections", "EKG", "Point-of-care testing", "Medical terminology",
        "athenahealth", "Insurance verification", "Prior authorizations", "Scheduling", "HIPAA",
      ],
    },
    whyItWorks:
      "The credential sits in the headline, the clinic type and daily patient volume are in plain words, and the bullets mix clinical procedures with front-office results, so a practice manager sees someone who can cover both.",
    summaries: [
      { level: "Entry level", text: "Recent medical assisting graduate with a 160-hour externship in a busy pediatric clinic. Practiced vital signs, injections and venipuncture, and charted in eClinicalWorks. CMA (AAMA) exam scheduled for June." },
      { level: "Mid level", text: "Certified medical assistant with 4 years in family medicine and urgent care. I room 25–30 patients a day and cut rooming-to-provider wait times from 14 to 8 minutes." },
      { level: "Senior", text: "Lead medical assistant with 9 years in multi-provider practices. I train new MAs, build the daily schedule for 6 providers and own the clinic's supply and vaccine inventory." },
    ],
    bullets: [
      { skill: "Patient flow", weak: "Roomed patients", strong: "Roomed 25–30 patients a day for two physicians and cut rooming-to-provider wait from 14 to 8 minutes" },
      { skill: "Clinical skills", weak: "Did blood draws and shots", strong: "Performed venipuncture, injections and EKGs, averaging 15 blood draws a day" },
      { skill: "Testing", weak: "Ran lab tests", strong: "Ran point-of-care testing and logged daily quality control checks with no missed entries in 12 months" },
      { skill: "Authorizations", weak: "Handled referrals", strong: "Submitted prior authorizations and referrals and cleared a 3-week referral backlog in a month" },
      { skill: "Front office", weak: "Helped at the front desk", strong: "Covered weekend front desk: scheduling, insurance verification and copay collection for 40+ patients a shift" },
      { skill: "Training", weak: "Trained new staff", strong: "Trained 3 new medical assistants on clinic workflows, infection control and HIPAA-compliant charting" },
    ],
    keywords: [
      "CMA (AAMA)", "Vital signs", "Patient intake", "Venipuncture", "Injections", "EKG", "Point-of-care testing", "Medical assistant",
      "Medical terminology", "EHR", "athenahealth", "eClinicalWorks", "Insurance verification", "Prior authorizations", "Scheduling",
      "HIPAA", "Infection control", "BLS",
    ],
    keywordSort: {
      tools: ["EHR", "athenahealth", "eClinicalWorks"],
      credentials: ["CMA (AAMA)", "BLS"],
    },
    tips: [
      { t: "Put your credential by your name", d: "Write it the way it's issued — CMA (AAMA), RMA or CCMA — in your headline so it's the first thing a recruiter sees." },
      { t: "Name the setting and volume", d: "\"Family medicine, two physicians, 25–30 patients a day\" tells a practice manager your pace and experience in one line." },
      { t: "List the procedures you're trained to do", d: "Venipuncture, injections, EKGs and point-of-care tests are common screening terms. Include only tasks your training and your state's rules let you perform." },
      { t: "Name the EHR", d: "athenahealth, Epic, eClinicalWorks and similar systems show up in job posts. List the ones you've charted in." },
      { t: "Show front-office skills too", d: "Scheduling, insurance verification and prior authorizations make you useful on days the clinic is short-staffed." },
    ],
    faqs: [
      { q: "Should I write CMA or CMA (AAMA) on my resume?", a: "Write the credential exactly as it's issued: CMA (AAMA) from the American Association of Medical Assistants, RMA from American Medical Technologists, or CCMA from the National Healthcareer Association. The full name avoids confusion between them." },
      { q: "What if I'm not certified yet?", a: "List your program and completion date, and add the exam you plan to take with a date, such as \"CMA (AAMA) exam scheduled for June 2026.\" Your externship hours and the skills you practiced there also count as experience." },
      { q: "Should I separate clinical and administrative skills?", a: "You can, especially if the job post lists both. A short skills line for each — clinical and front office — makes it easy for a manager to see you can cover either side." },
      { q: "How long should a medical assistant resume be?", a: "One page. Put the credential and EHR near the top, then two or three jobs with bullets that show patient volume and results." },
      { q: "Can I include my externship as experience?", a: "Yes. List it like a job with the clinic type, hours and what you did — for example rooming patients, taking vital signs and giving injections under supervision." },
    ],
    related: ["registered-nurse", "certified-nursing-assistant", "medical-billing-specialist", "licensed-practical-nurse"],
  },
  {
    slug: "licensed-practical-nurse",
    role: "Licensed Practical Nurse",
    group: "Healthcare",
    level: "Experienced · 5 years",
    intro:
      "A licensed practical nurse resume that shows safe medication passes, sharp observation and steady resident care — with the license, long-term care and charting keywords employers screen for.",
    resume: {
      name: "Latoya Williams",
      headline: "Licensed Practical Nurse (LPN), Long-Term Care",
      contact: "Memphis, TN · latoya.williams@email.com · (901) 555-0137",
      summary:
        "LPN with 5 years in skilled nursing and outpatient care. I run accurate med passes for 20+ residents a shift, catch changes in condition early and keep families in the loop.",
      jobs: [
        {
          title: "Licensed Practical Nurse",
          company: "Magnolia Bend Rehabilitation & Nursing Center",
          dates: "Apr 2023 – Present",
          bullets: [
            "Complete medication administration for 22–26 residents per shift on a 44-bed skilled nursing unit, documenting in the eMAR",
            "Perform wound care, dressing changes and treatments for 8–10 residents a shift and update the wound care nurse weekly",
            "Report each change in condition to the RN supervisor and provider using SBAR; the unit's 30-day hospital readmissions fell from 22% to 16% in a year",
            "Assign and supervise 3–4 CNAs per shift and check that care plans are followed",
            "Chart vital signs, progress notes and treatments in PointClickCare",
          ],
        },
        {
          title: "Licensed Practical Nurse",
          company: "Cotton Row Internal Medicine",
          dates: "Jun 2021 – Mar 2023",
          bullets: [
            "Took vital signs, histories and medication reconciliation for 30+ patients a day in a 4-provider practice",
            "Gave injections and immunizations and kept the clinic's vaccine storage logs current",
            "Called patients with lab results and care instructions as ordered by providers",
          ],
        },
      ],
      education: "Practical Nursing Diploma, Wolf River Technical College, 2021 · LPN license, Tennessee (NCLEX-PN) · BLS",
      skills: [
        "Medication administration", "Med pass", "Wound care", "Vital signs", "Care plans", "Change in condition", "SBAR",
        "Long-term care", "Skilled nursing", "PointClickCare", "eMAR", "Family communication",
      ],
    },
    whyItWorks:
      "It shows license, state and setting at the top, gives the resident load in numbers, and points to safety and quality results — readmissions, med passes, escalation — instead of a list of nursing duties.",
    summaries: [
      { level: "New graduate", text: "Newly licensed LPN who passed the NCLEX-PN in 2026. Completed clinical rotations in long-term care, rehab and a family practice, with hands-on med passes and dressing changes." },
      { level: "Experienced", text: "LPN with 5 years in skilled nursing and outpatient care. I run med passes for 22–26 residents a shift and escalate changes in condition early using SBAR." },
      { level: "Charge nurse", text: "LPN charge nurse with 10 years in long-term care who leads shifts of 6 CNAs, coordinates admissions and keeps families informed about care plans." },
    ],
    bullets: [
      { skill: "Medication safety", weak: "Passed medications", strong: "Completed med passes for 22–26 residents a shift with no medication errors found in 2 annual state surveys" },
      { skill: "Observation", weak: "Reported changes to the RN", strong: "Escalated changes in condition through SBAR; unit readmissions within 30 days fell from 22% to 16%" },
      { skill: "Wound care", weak: "Did wound care", strong: "Performed wound care and treatments for 8–10 residents a shift and updated the wound care nurse weekly" },
      { skill: "Supervision", weak: "Worked with CNAs", strong: "Assigned and supervised 3–4 CNAs per shift and checked that care plans were followed" },
      { skill: "Clinic care", weak: "Helped in a doctor's office", strong: "Took vital signs and reconciled medications for 30+ patients a day in a 4-provider practice" },
      { skill: "Family communication", weak: "Talked to families", strong: "Gave weekly updates to families of new admissions, cutting after-hours calls to the unit" },
    ],
    keywords: [
      "Licensed Practical Nurse (LPN)", "LPN license", "NCLEX-PN", "Medication administration", "Med pass", "Wound care", "Vital signs",
      "Care plans", "Change in condition", "SBAR", "Long-term care", "Skilled nursing", "IV therapy", "PointClickCare", "eMAR", "BLS",
      "Family communication",
    ],
    keywordSort: {
      tools: ["PointClickCare", "eMAR"],
      credentials: ["Licensed Practical Nurse (LPN)", "LPN license", "NCLEX-PN", "BLS"],
      soft: ["Family communication"],
    },
    tips: [
      { t: "Lead with license and state", d: "\"LPN, Tennessee\" belongs in your headline or right under your name. Add BLS and any other current certifications nearby." },
      { t: "Give the resident or patient load", d: "\"22–26 residents, 44-bed skilled nursing unit\" tells a director of nursing your pace in one line." },
      { t: "Show safety results", d: "Medication accuracy, falls, readmissions and survey results show the quality of your care better than a list of tasks." },
      { t: "Name the charting system", d: "PointClickCare, MatrixCare, Epic and eMAR are common screening terms in long-term care and clinic posts." },
      { t: "Stay inside your scope", d: "Describe what you did the way your state's LPN scope allows — for example, collecting data and reporting to the RN rather than \"completed assessments\" if that's how your role worked." },
    ],
    faqs: [
      { q: "LPN or LVN — which title should I use?", a: "Use the title on your license. California and Texas license vocational nurses (LVNs); most other states use LPN. Both take the NCLEX-PN. If you're applying across states, \"LPN/LVN\" in your headline covers both." },
      { q: "Should I put my LPN license number on my resume?", a: "Usually not. List the license type and state; employers verify the number during hiring. Add it only if the posting asks for it." },
      { q: "Can I list IV therapy?", a: "Only if your state lets LPNs perform it and you've completed any training or certification it requires. LPN scope for IV therapy differs from state to state, so name the certification and the state." },
      { q: "How do I show I'm working toward my RN?", a: "Add the program and expected graduation under education, such as \"LPN-to-RN bridge program, expected May 2027.\" Employers with tuition support often look for this." },
      { q: "How long should an LPN resume be?", a: "One page for most LPNs. Lead with license and setting, then two or three jobs with resident or patient numbers and results." },
    ],
    related: ["registered-nurse", "certified-nursing-assistant", "medical-assistant"],
  },
  {
    slug: "pharmacy-technician",
    role: "Pharmacy Technician",
    group: "Healthcare",
    level: "Mid-level · 5 years experience",
    intro:
      "A pharmacy technician resume that shows accuracy at volume, clean inventory and insurance know-how — with the certification, compounding and dispensing keywords pharmacies screen for.",
    resume: {
      name: "Kevin Tran",
      headline: "Certified Pharmacy Technician (CPhT)",
      contact: "Houston, TX · kevin.tran@email.com · (713) 555-0124",
      summary:
        "PTCB-certified pharmacy technician with 5 years in retail and hospital pharmacy. I fill accurately at high volume and clear insurance rejections before they turn into delays at the counter.",
      jobs: [
        {
          title: "Pharmacy Technician II, Inpatient Pharmacy",
          company: "Bayou Crest Medical Center",
          dates: "Jan 2023 – Present",
          bullets: [
            "Restock Pyxis automated dispensing cabinets on 9 nursing units; nurse-reported stockouts fell 40% after I reworked par levels",
            "Prepare IV admixtures in a USP <797> cleanroom using aseptic technique, about 60 doses a shift for pharmacist verification",
            "Count and reconcile controlled substances with the pharmacist and resolve discrepancies before the end of each shift",
            "Pull expired and recalled drugs during monthly unit inspections as part of inventory management",
          ],
        },
        {
          title: "Pharmacy Technician",
          company: "Lone Oak Pharmacy",
          dates: "Jun 2021 – Dec 2022",
          bullets: [
            "Entered and filled 250–300 prescriptions a day, checking NDC, dose and label before pharmacist review",
            "Resolved insurance claims rejections and started prior authorizations, cutting next-day callbacks by about a third",
            "Ran the register, will-call and drive-through, giving friendly customer service at the busiest store in the district",
          ],
        },
      ],
      education: "Pharmacy Technician Certificate, Brazos Gate Community College, 2021 · CPhT (PTCB) · Pharmacy technician registration, Texas",
      skills: [
        "Prescription filling", "Medication dispensing", "Sterile compounding", "IV admixtures", "Aseptic technique", "Pyxis",
        "Controlled substances", "Inventory management", "Insurance claims", "Pharmacy calculations", "HIPAA", "Customer service",
      ],
    },
    whyItWorks:
      "It leads with the CPhT and the body that issued it, shows prescription and dose volume in numbers, and names compounding standards, dispensing systems and insurance work in the exact terms pharmacy managers search for.",
    summaries: [
      { level: "Entry level", text: "Pharmacy technician program graduate with a retail externship. Filled and labeled prescriptions under pharmacist supervision and passed the PTCE in 2026." },
      { level: "Mid level", text: "PTCB-certified pharmacy technician with 5 years in retail and hospital pharmacy. I prepare about 60 IV doses a shift and filled 250–300 prescriptions a day in retail." },
      { level: "Senior", text: "Lead pharmacy technician with 10 years in hospital pharmacy who trains new technicians, manages a $1.2M drug inventory and coordinates automated dispensing for 14 units." },
    ],
    bullets: [
      { skill: "Accuracy", weak: "Filled prescriptions", strong: "Filled 250–300 prescriptions a day, checking NDC, dose and label before pharmacist review" },
      { skill: "Compounding", weak: "Made IVs", strong: "Prepared about 60 IV admixtures a shift in a USP <797> cleanroom using aseptic technique" },
      { skill: "Automation", weak: "Stocked Pyxis machines", strong: "Reworked Pyxis par levels on 9 units; nurse-reported stockouts fell 40%" },
      { skill: "Insurance", weak: "Handled insurance problems", strong: "Resolved claims rejections and started prior authorizations, cutting next-day callbacks by a third" },
      { skill: "Controlled substances", weak: "Counted narcotics", strong: "Counted and reconciled controlled substances with the pharmacist and resolved discrepancies within the shift" },
      { skill: "Inventory", weak: "Checked for expired drugs", strong: "Pulled expired and recalled drugs in monthly inspections across 9 nursing units" },
    ],
    keywords: [
      "Certified Pharmacy Technician (CPhT)", "PTCB", "Prescription filling", "Medication dispensing", "Sterile compounding",
      "IV admixtures", "USP <797>", "Aseptic technique", "Pyxis", "Controlled substances", "Inventory management", "Insurance claims",
      "Prior authorizations", "NDC", "Pharmacy calculations", "HIPAA", "Customer service",
    ],
    keywordSort: {
      tools: ["Pyxis"],
      credentials: ["Certified Pharmacy Technician (CPhT)", "PTCB"],
      soft: ["Customer service"],
    },
    tips: [
      { t: "Write the credential with its issuer", d: "\"CPhT (PTCB)\" or \"CPhT (NHA)\" tells an employer which exam you passed. Add your state registration or license type next to it." },
      { t: "Quantify your volume", d: "Prescriptions a day, IV doses a shift or units served show the pace you can keep without mistakes." },
      { t: "Name standards and systems", d: "USP <797>, USP <800>, Pyxis, Omnicell and your pharmacy software are common screening terms — use the ones you've worked with." },
      { t: "Show insurance skills", d: "Rejections resolved and prior authorizations started matter a lot in retail, where they decide how fast patients get their medicine." },
      { t: "Keep patient details out", d: "Describe volume and results, never patient names or anything that could identify someone." },
    ],
    faqs: [
      { q: "PTCB or ExCPT — does it matter which I list?", a: "Both lead to the CPhT credential: PTCB through the PTCE exam and the National Healthcareer Association through the ExCPT. Write the credential and the organization that issued it. Some employers and state boards prefer one, so check the posting." },
      { q: "Do I need to list a state license or registration?", a: "If you hold one, yes. Many states require pharmacy technicians to be registered, licensed or certified with the state board of pharmacy, and the rules differ. List the type and state; add the number only if asked." },
      { q: "How do I move from retail to hospital pharmacy?", a: "Lead with what carries over: accuracy at volume, inventory, controlled substances and any sterile compounding training. If you've earned a compounding credential such as PTCB's CSPT, put it next to your CPhT." },
      { q: "Should I include prescription volume?", a: "Yes. A daily or weekly fill count, or IV doses per shift, is one of the clearest ways to show your experience level." },
      { q: "How long should a pharmacy technician resume be?", a: "One page. Credential and registration at the top, then jobs with volume, accuracy and inventory results." },
    ],
    related: ["medical-assistant", "medical-billing-specialist", "registered-nurse"],
  },
  {
    slug: "dental-hygienist",
    role: "Dental Hygienist",
    group: "Healthcare",
    level: "Experienced · 6 years",
    intro:
      "A dental hygienist resume that shows a full hygiene schedule, strong periodontal care and patients who come back — with the license, clinical and software keywords dental offices look for.",
    resume: {
      name: "Emily Carlson",
      headline: "Registered Dental Hygienist (RDH)",
      contact: "Denver, CO · emily.carlson@email.com · (303) 555-0156",
      summary:
        "RDH with 6 years in general and periodontal practices. I run a full hygiene schedule, explain treatment in plain words and help patients stay on track with periodontal maintenance.",
      jobs: [
        {
          title: "Registered Dental Hygienist",
          company: "Front Range Family Dentistry",
          dates: "May 2022 – Present",
          bullets: [
            "See 8–9 adult and child patients a day for prophylaxis, scaling and root planing, periodontal maintenance, fluoride and sealants",
            "Take and review dental radiographs and record periodontal charting and oral cancer screening findings in Dentrix",
            "Raised the practice's hygiene recare rate from 61% to 78% by booking the next visit before patients left the chair",
            "Give local anesthesia for scaling and root planing patients under my Colorado permit",
          ],
        },
        {
          title: "Dental Hygienist",
          company: "Aspen Hollow Periodontics",
          dates: "Jul 2020 – Apr 2022",
          bullets: [
            "Provided periodontal maintenance for 6–8 patients a day in a 2-periodontist practice",
            "Wrote a take-home guide for patients new to periodontal therapy as part of patient education at every recall",
            "Followed OSHA bloodborne pathogens rules and CDC infection control guidance for instrument processing and operatory setup",
          ],
        },
      ],
      education: "A.A.S. Dental Hygiene, Pikes Ridge Community College (CODA-accredited), 2020 · RDH license, Colorado · Local anesthesia permit, Colorado · BLS",
      skills: [
        "Prophylaxis", "Scaling and root planing", "Periodontal charting", "Dental radiographs", "Local anesthesia", "Fluoride and sealants",
        "Oral cancer screening", "Patient education", "Infection control", "Dentrix", "Eaglesoft",
      ],
    },
    whyItWorks:
      "It puts license and permits where a dentist checks first, shows the daily schedule and procedures in plain clinical terms, and proves value with a recare number — the measure practice owners care about most.",
    summaries: [
      { level: "New graduate", text: "Newly licensed RDH from a CODA-accredited program, with clinical rotations treating children, adults and periodontal patients. Passed the NBDHE and my state's clinical exam in 2026." },
      { level: "Experienced", text: "RDH with 6 years in general and periodontal practices. I see 8–9 patients a day and raised the hygiene recare rate from 61% to 78%." },
      { level: "Lead hygienist", text: "Lead hygienist with 12 years in multi-provider practices who trains new hygienists, set up the office's periodontal protocol and coordinates schedules for 4 hygiene chairs." },
    ],
    bullets: [
      { skill: "Recare", weak: "Scheduled patients", strong: "Raised the hygiene recare rate from 61% to 78% by booking the next visit before patients left the chair" },
      { skill: "Periodontal care", weak: "Did deep cleanings", strong: "Performed scaling and root planing and periodontal maintenance for 6–8 patients a day in a periodontal practice" },
      { skill: "Assessment", weak: "Charted patients", strong: "Recorded full periodontal charting and oral cancer screening findings at every recall in Dentrix" },
      { skill: "Radiographs", weak: "Took X-rays", strong: "Took bitewing, periapical and panoramic radiographs and flagged findings for the dentist's exam" },
      { skill: "Patient education", weak: "Taught patients to floss", strong: "Wrote a take-home guide for new periodontal patients that the practice now gives at every first visit" },
      { skill: "Infection control", weak: "Cleaned instruments", strong: "Followed OSHA and CDC infection control guidance for instrument processing and operatory setup" },
    ],
    keywords: [
      "Registered Dental Hygienist (RDH)", "RDH license", "Prophylaxis", "Scaling and root planing", "Periodontal maintenance",
      "Periodontal charting", "Dental radiographs", "Local anesthesia", "Fluoride", "Sealants", "Oral cancer screening", "Patient education",
      "Infection control", "OSHA", "Recare", "Dentrix", "Eaglesoft", "BLS",
    ],
    keywordSort: {
      tools: ["Dentrix", "Eaglesoft"],
      credentials: ["Registered Dental Hygienist (RDH)", "RDH license", "BLS"],
    },
    tips: [
      { t: "Put license and permits up top", d: "RDH, your state, and any local anesthesia or nitrous oxide permits should be easy to find in your headline or right under it." },
      { t: "Show your schedule", d: "Patients a day and the mix — adults, children, periodontal — tell an office manager how you'll fit their book." },
      { t: "Use a practice number", d: "Recare rate, periodontal treatment acceptance or reappointment rate show your value to the practice." },
      { t: "Name the software", d: "Dentrix, Eaglesoft and Open Dental are common in job posts; list the ones you've charted in." },
      { t: "Keep it clinical and clear", d: "Use the standard terms — prophylaxis, scaling and root planing, periodontal maintenance — rather than \"cleanings\" alone." },
    ],
    faqs: [
      { q: "What do I need for a dental hygiene license?", a: "In general: graduation from a CODA-accredited program, a passing score on the National Board Dental Hygiene Examination (NBDHE) from the Joint Commission on National Dental Examinations, a clinical exam your state accepts and the state board's application. Check your state dental board for its exact rules." },
      { q: "Should I list local anesthesia and nitrous oxide permits?", a: "Yes, if you hold them. States differ on whether hygienists can give local anesthesia or nitrous oxide and what permit they need, so name the permit and the state." },
      { q: "What should a new grad hygienist resume include?", a: "Your program, graduation date, license status and clinical experience — the patient types you treated and procedures you performed. Earlier dental assisting or front-office work also helps." },
      { q: "Should I put my license number on my resume?", a: "Usually not. List RDH and the state; offices verify the license with the state board. Add the number only if the posting asks." },
      { q: "How long should a dental hygienist resume be?", a: "One page. License and permits at the top, then a short list of jobs with your daily schedule and one or two practice results." },
    ],
    related: ["medical-assistant", "registered-nurse", "pharmacy-technician"],
  },
  {
    slug: "certified-nursing-assistant",
    role: "Certified Nursing Assistant",
    group: "Healthcare",
    level: "Early career · 3 years",
    intro:
      "A certified nursing assistant resume that shows safe, kind daily care and a sharp eye for changes — with the certification, patient care and safety keywords nursing homes and hospitals look for.",
    resume: {
      name: "Marisol Vega",
      headline: "Certified Nursing Assistant (CNA)",
      contact: "Tampa, FL · marisol.vega@email.com · (813) 555-0171",
      summary:
        "CNA with 3 years in long-term care and a hospital med-surg floor. I help residents with daily care safely and with dignity, and I tell the nurse about changes right away.",
      jobs: [
        {
          title: "Certified Nursing Assistant",
          company: "Palmetto Shores Health & Rehabilitation",
          dates: "Aug 2024 – Present",
          bullets: [
            "Provide resident care — bathing, dressing, toileting and feeding — for 10–12 residents per shift on a 40-bed long-term care unit",
            "Take and record vital signs, weights and intake and output in PointClickCare, flagging changes to the charge nurse",
            "Use Hoyer lifts and gait belts for patient transfers; the unit went 11 months without a transfer-related injury",
            "Support residents living with dementia with calm redirection and consistent routines, as part of the unit's dementia care team",
          ],
        },
        {
          title: "Nursing Assistant",
          company: "Seagrape Community Hospital",
          dates: "Jun 2023 – Jul 2024",
          bullets: [
            "Supported nurses on a 28-bed med-surg floor with hourly rounding, repositioning and walking patients",
            "Followed fall prevention plans, bed alarms and call-light checks for high-risk patients",
            "Collected specimens and kept isolation carts stocked, following infection control and PPE rules",
          ],
        },
      ],
      education: "Nursing Assistant Training Program, Suncoast Technical College, 2023 · CNA certification, Florida (active) · BLS",
      skills: [
        "Activities of daily living (ADLs)", "Vital signs", "Patient transfers", "Hoyer lift", "Fall prevention", "Intake and output",
        "Specimen collection", "Infection control", "Dementia care", "PointClickCare", "Teamwork",
      ],
    },
    whyItWorks:
      "It shows certification and state up front, gives the resident load and setting in numbers, and turns daily care into safety results — transfers, falls, reporting — instead of a list of chores.",
    summaries: [
      { level: "Entry level", text: "Newly certified nursing assistant who completed a state-approved training program with clinical hours in a skilled nursing facility. BLS certified and active on the Florida registry." },
      { level: "Experienced", text: "CNA with 3 years in long-term care and med-surg. I care for 10–12 residents a shift and help keep transfers safe with Hoyer lifts and gait belts." },
      { level: "Senior", text: "Lead CNA with 8 years in long-term care who orients new aides, helps the charge nurse plan assignments and leads the unit's restorative walking program." },
    ],
    bullets: [
      { skill: "Daily care", weak: "Helped residents", strong: "Provided ADL care — bathing, dressing, toileting and feeding — for 10–12 residents per shift" },
      { skill: "Safety", weak: "Moved patients", strong: "Used Hoyer lifts and gait belts for transfers; the unit went 11 months without a transfer-related injury" },
      { skill: "Observation", weak: "Took vitals", strong: "Recorded vital signs, weights and intake and output each shift and flagged changes to the charge nurse the same hour" },
      { skill: "Dementia care", weak: "Worked with dementia patients", strong: "Calmed residents living with dementia through redirection and steady routines, cutting evening agitation episodes on my hall" },
      { skill: "Fall prevention", weak: "Watched high-risk patients", strong: "Followed fall prevention plans with bed alarms and hourly rounding for high-risk patients on a 28-bed floor" },
      { skill: "Infection control", weak: "Followed hygiene rules", strong: "Kept isolation carts stocked and followed PPE and hand hygiene rules on every isolation room entry" },
    ],
    keywords: [
      "Certified Nursing Assistant (CNA)", "CNA certification", "Activities of daily living (ADLs)", "Resident care", "Vital signs",
      "Patient transfers", "Hoyer lift", "Fall prevention", "Intake and output", "Specimen collection", "Infection control", "Dementia care",
      "Long-term care", "Med-surg", "PointClickCare", "BLS", "Teamwork", "Compassionate care",
    ],
    keywordSort: {
      tools: ["PointClickCare", "Hoyer lift"],
      credentials: ["Certified Nursing Assistant (CNA)", "CNA certification", "BLS"],
      soft: ["Teamwork", "Compassionate care"],
    },
    tips: [
      { t: "Show your certification and state", d: "\"Certified Nursing Assistant, Florida (active)\" near the top tells a recruiter you're on the registry and ready to work." },
      { t: "Give your resident load", d: "\"10–12 residents, 40-bed long-term care unit\" shows your pace and setting in one line." },
      { t: "Turn tasks into safety results", d: "Safe transfers, no falls, quick reporting of changes — these show the quality of your care." },
      { t: "Name the equipment and charting system", d: "Hoyer lifts, gait belts and PointClickCare are common in job posts; list the ones you've used." },
      { t: "Keep privacy in mind", d: "Describe residents by setting and needs, never by name or anything that could identify them." },
    ],
    faqs: [
      { q: "How should I list my CNA certification?", a: "Write the title and state, such as \"Certified Nursing Assistant, Florida,\" and make sure your listing on the state nurse aide registry is active. Employers check the registry, so you don't need to add your number unless the posting asks." },
      { q: "Do I need to list my training hours?", a: "Not usually. Federal rules require state-approved nurse aide training programs to include at least 75 clock hours, with at least 16 hours of supervised practical training, and many states require more. Listing your program and passing the state competency exam shows you met your state's standard." },
      { q: "What if I have no paid CNA experience yet?", a: "List your training program and its clinical hours like a job: the setting, how many residents you helped and the skills you practiced. Caregiving, volunteering and customer-facing jobs also count." },
      { q: "How do I move from long-term care to a hospital?", a: "Lead with skills hospitals use every shift: vital signs, specimen collection, fall prevention, infection control and teamwork with nurses. Mention any experience with telemetry, post-surgical or rehab patients." },
      { q: "How long should a CNA resume be?", a: "One page. Certification and state at the top, then your jobs with resident numbers and two or three safety or care results." },
    ],
    related: ["licensed-practical-nurse", "registered-nurse", "medical-assistant"],
  },
  {
    slug: "medical-billing-specialist",
    role: "Medical Billing Specialist",
    group: "Healthcare",
    level: "Mid-level · 6 years experience",
    intro:
      "A medical billing specialist resume that shows clean claims, fast denial work and lower A/R — with the coding, payer and certification keywords revenue cycle managers search for.",
    resume: {
      name: "Andrea Kowalski",
      headline: "Medical Billing Specialist, CPB",
      contact: "Milwaukee, WI · andrea.kowalski@email.com · (414) 555-0189",
      summary:
        "Medical billing specialist with 6 years in multi-specialty and orthopedic billing. I keep clean claim rates high, work denials fast and bring old A/R down.",
      jobs: [
        {
          title: "Senior Medical Billing Specialist",
          company: "Lakecrest Physician Group",
          dates: "Feb 2023 – Present",
          bullets: [
            "Submit 1,200+ professional claims a week on the CMS-1500 (837P) for a 40-provider multi-specialty group",
            "Raised the first-pass clean claim rate from 89% to 96% by adding claim scrubber edits for the top 10 denial reasons",
            "Work denials and appeals for Medicare, Medicaid and commercial payers; recovered $310K in underpaid claims in 2025",
            "Cut A/R over 90 days from 24% to 13% of total accounts receivable in 18 months",
            "Post ERA (835) and manual payments and reconcile daily deposits in Epic",
          ],
        },
        {
          title: "Medical Billing and Coding Specialist",
          company: "Bluff Street Orthopedics",
          dates: "Jun 2020 – Jan 2023",
          bullets: [
            "Checked CPT, ICD-10-CM and HCPCS codes and modifiers against documentation before claims went out for 6 surgeons",
            "Handled insurance verification and prior authorizations for surgeries and imaging",
            "Answered patient billing questions and set up payment plans, following HIPAA rules for every call",
          ],
        },
      ],
      education: "A.A.S. Health Information Technology, Lake Ridge Technical College, 2020 · Certified Professional Biller (CPB), AAPC",
      skills: [
        "Claims submission", "Denial management", "Appeals", "Payment posting", "Accounts receivable (A/R)", "CPT", "ICD-10-CM", "HCPCS",
        "Modifiers", "Insurance verification", "Epic", "Excel",
      ],
    },
    whyItWorks:
      "It measures billing work the way managers do — clean claim rate, A/R over 90 days, dollars recovered — and names the claim forms, code sets, payers and certification in the exact terms used in job posts.",
    summaries: [
      { level: "Entry level", text: "Health information technology graduate with an externship in a hospital billing office. Practiced claim entry, payment posting and ICD-10-CM and CPT code review; preparing for the CPB exam." },
      { level: "Mid level", text: "CPB-certified medical billing specialist with 6 years in physician billing. I raised the clean claim rate from 89% to 96% and cut A/R over 90 days nearly in half." },
      { level: "Senior", text: "Revenue cycle supervisor with 11 years in billing who leads a team of 8, owns payer contract follow-up and reports monthly A/R and denial trends to practice leadership." },
    ],
    bullets: [
      { skill: "Clean claims", weak: "Submitted claims", strong: "Raised the first-pass clean claim rate from 89% to 96% with scrubber edits for the top 10 denial reasons" },
      { skill: "Denials", weak: "Worked on denials", strong: "Worked denials and appeals across Medicare, Medicaid and commercial payers, recovering $310K in a year" },
      { skill: "A/R", weak: "Followed up on old claims", strong: "Cut A/R over 90 days from 24% to 13% of total A/R in 18 months" },
      { skill: "Payment posting", weak: "Posted payments", strong: "Posted ERA and manual payments and reconciled daily deposits with no unresolved variances at month-end" },
      { skill: "Coding review", weak: "Checked codes", strong: "Checked CPT, ICD-10-CM and HCPCS codes and modifiers against documentation for 6 surgeons before submission" },
      { skill: "Patient billing", weak: "Answered patient calls", strong: "Answered 30+ patient billing calls a day and set up payment plans that cut patient balances over 120 days" },
    ],
    keywords: [
      "Medical billing", "Certified Professional Biller (CPB)", "Claims submission", "CMS-1500", "UB-04", "Denial management", "Appeals",
      "Accounts receivable (A/R)", "Payment posting", "ERA", "CPT", "ICD-10-CM", "HCPCS", "Modifiers", "Insurance verification",
      "Prior authorizations", "Medicare", "Medicaid", "HIPAA", "Epic",
    ],
    keywordSort: {
      tools: ["Epic"],
      credentials: ["Certified Professional Biller (CPB)"],
    },
    tips: [
      { t: "Lead with billing metrics", d: "Clean claim rate, denial rate, days in A/R and dollars recovered show your impact better than \"processed claims.\"" },
      { t: "Name forms, code sets and payers", d: "CMS-1500, UB-04, CPT, ICD-10-CM, HCPCS, Medicare and Medicaid are standard screening terms — use the ones you've worked with." },
      { t: "Say professional or facility", d: "Physician (professional) billing and hospital (facility) billing use different forms and rules. Make your side clear." },
      { t: "List your systems", d: "Practice management systems, EHRs and clearinghouses you've used — Epic, athenahealth, eClinicalWorks — help you match the post." },
      { t: "Keep patient data out", d: "Use totals and percentages. Never include patient names, account numbers or anything protected under HIPAA." },
    ],
    faqs: [
      { q: "What's the difference between medical billing and medical coding?", a: "Coders assign CPT, ICD-10-CM and HCPCS codes from clinical documentation; billers submit claims, post payments and work denials and appeals. Many jobs combine both, so lead with the side you do most." },
      { q: "Which certification should I list?", a: "Common ones include the Certified Professional Biller (CPB) and Certified Professional Coder (CPC) from AAPC, the Certified Billing and Coding Specialist (CBCS) from the National Healthcareer Association and the Certified Coding Associate (CCA) from AHIMA. Write the full name and the issuing organization." },
      { q: "Do I need a certification to get hired?", a: "Not always, but many employers prefer one. If you're studying for an exam, write \"CPB exam scheduled for March 2027\" so it still shows up in a search." },
      { q: "How do I show results in billing?", a: "Use the numbers your office tracks: first-pass clean claim rate, denial rate, A/R over 90 days, days in A/R and money recovered from appeals or underpayments." },
      { q: "Should I mention remote work?", a: "Yes, if you've billed remotely. Say so in the job line and mention the systems you used, since many billing roles are fully or partly remote." },
    ],
    related: ["medical-assistant", "bookkeeper", "accountant", "administrative-assistant"],
  },
  {
    slug: "teacher-assistant",
    role: "Teacher Assistant",
    group: "Education",
    level: "Mid-level · 4 years experience",
    intro:
      "A teacher assistant resume that shows real support for students and teachers — small groups, IEP support and calm classrooms — with the keywords school districts use in paraprofessional job posts.",
    resume: {
      name: "Alyssa Reed",
      headline: "Teacher Assistant, Elementary",
      contact: "Indianapolis, IN · alyssa.reed@email.com · (317) 555-0129",
      summary:
        "Teacher assistant with 4 years in pre-K and elementary classrooms, including inclusion and special education settings. I run small reading groups, support students with an IEP and help keep the room calm and on task.",
      jobs: [
        {
          title: "Instructional Assistant, 2nd Grade",
          company: "Maple Hollow Elementary School",
          dates: "Aug 2024 – Present",
          bullets: [
            "Lead daily reading intervention for 3 groups of 4–6 second graders using the teacher's lesson plans",
            "18 of 22 students in my groups moved up at least one reading level by the spring benchmark, based on our progress monitoring data",
            "Support 5 students on an IEP in a co-taught classroom, applying accommodations and tracking behavior goals",
            "Provide classroom support — preparing materials, checking practice work and posting weekly assignments in Google Classroom",
          ],
        },
        {
          title: "Teacher Assistant, Pre-K",
          company: "Bramblewood Early Learning Center",
          dates: "Aug 2022 – Jun 2024",
          bullets: [
            "Assisted the lead teacher in a pre-K classroom of 18, running learning centers and transitions",
            "Used positive behavior supports and visual schedules to help two students join group time every day",
            "Covered lunch, recess and dismissal duty, and shared daily notes with families as part of parent communication",
          ],
        },
      ],
      education: "A.A. Early Childhood Education, Riverbend Community College, 2022 · ParaPro Assessment (passed) · CPR and First Aid",
      skills: [
        "Small-group instruction", "Reading intervention", "IEP support", "Special education", "Classroom management", "Behavior management",
        "Positive behavior supports", "Lesson preparation", "Student supervision", "Progress monitoring", "Google Classroom", "Parent communication",
      ],
    },
    whyItWorks:
      "It shows where and with whom you worked — grade, class size, special education — and measures support in student progress, so a principal sees an assistant who helps students learn, not just one who makes copies.",
    summaries: [
      { level: "Entry level", text: "Early childhood education student with 2 summers as a day camp counselor and 120 hours of classroom observation. Passed the ParaPro Assessment and CPR and First Aid certified." },
      { level: "Mid level", text: "Teacher assistant with 4 years in pre-K and elementary classrooms. I lead small reading groups and support students with an IEP in co-taught classes." },
      { level: "Senior", text: "Special education paraprofessional with 10 years in K–5 resource and inclusion classrooms who trains new assistants and supports students with significant behavior and learning needs." },
    ],
    bullets: [
      { skill: "Small groups", weak: "Helped with reading", strong: "Led daily reading intervention for 3 small groups; 18 of 22 students moved up at least one level by spring" },
      { skill: "IEP support", weak: "Worked with special education students", strong: "Supported 5 students on an IEP in a co-taught class, applying accommodations and tracking behavior goals" },
      { skill: "Behavior", weak: "Helped with behavior", strong: "Used visual schedules and positive behavior supports so two students could join group time every day" },
      { skill: "Classroom support", weak: "Prepared materials", strong: "Prepared materials and posted weekly assignments in Google Classroom, saving the lead teacher about 3 hours a week" },
      { skill: "Supervision", weak: "Did recess duty", strong: "Supervised lunch, recess and dismissal for 60+ students a day with no safety incidents reported" },
      { skill: "Families", weak: "Talked to parents", strong: "Wrote daily notes to families in a pre-K class of 18 and flagged concerns to the lead teacher" },
    ],
    keywords: [
      "Small-group instruction", "Reading intervention", "Classroom management", "Classroom support", "IEP", "Special education", "Inclusion",
      "Behavior management", "Positive behavior supports", "Lesson preparation", "Student supervision", "Progress monitoring",
      "Google Classroom", "ParaPro Assessment", "CPR and First Aid", "Parent communication", "Patience",
    ],
    keywordSort: {
      tools: ["Google Classroom"],
      credentials: ["ParaPro Assessment", "CPR and First Aid"],
      soft: ["Parent communication", "Patience"],
    },
    tips: [
      { t: "Use the district's title", d: "Teacher assistant, paraprofessional, instructional assistant and aide are used interchangeably. Mirror the one in the posting." },
      { t: "Name the grade and setting", d: "\"2nd grade, co-taught inclusion class of 24\" tells a principal exactly where you've worked." },
      { t: "Show student progress", d: "Reading levels, groups led or goals met show the effect of your support. Use group results, never individual students." },
      { t: "List qualifications clearly", d: "Your degree or college credits, ParaPro or state assessment, and CPR and First Aid should be easy to find." },
      { t: "Keep student information private", d: "Describe students by grade and needs only — no names or details that could identify a child." },
    ],
    faqs: [
      { q: "Teacher assistant, paraprofessional or aide — which title should I use?", a: "Use the title from your job, and mirror the posting's wording in your headline or summary. Districts use these titles for similar roles." },
      { q: "Do I need a certification to be a teacher assistant?", a: "It depends on the state and district. In Title I programs, federal law (ESSA) requires instructional paraprofessionals to have a high school diploma plus two years of college, an associate degree or higher, or a passing score on a formal state or local assessment — many districts use the ETS ParaPro Assessment. Some states add their own permit." },
      { q: "What if I have no classroom experience?", a: "List work with children: tutoring, childcare, camps, coaching or volunteering at a school. Say the age group, group size and what you did." },
      { q: "How do I show impact as an assistant?", a: "Use group results and scope: how many students you supported, how many small groups you ran and what changed — reading levels, goals met or time saved for the teacher." },
      { q: "Should I mention plans to become a teacher?", a: "Yes, if it's true. A line such as \"Enrolled in a teacher licensure program, expected 2027\" tells districts you're building a long-term career with them." },
    ],
    related: ["teacher", "school-counselor", "administrative-assistant"],
  },
  {
    slug: "school-counselor",
    role: "School Counselor",
    group: "Education",
    level: "Experienced · 7 years",
    intro:
      "A school counselor resume that shows real outcomes for students — graduation, college and career plans, attendance and well-being — with the certification and counseling keywords districts search for.",
    resume: {
      name: "Andre Coleman",
      headline: "Professional School Counselor, High School",
      contact: "Atlanta, GA · andre.coleman@email.com · (404) 555-0148",
      summary:
        "School counselor with 7 years in middle and high schools, working from the ASCA National Model. I lead college and career readiness for 400+ students, support students in crisis and use data to decide where counseling time goes.",
      jobs: [
        {
          title: "School Counselor, Grades 9–12",
          company: "Red Clay Ridge High School",
          dates: "Jul 2022 – Present",
          bullets: [
            "Manage a caseload of 420 students for academic advising, college and career planning, and social-emotional counseling",
            "Raised FAFSA completion among seniors from 52% to 74% in two years with class workshops and family nights",
            "Coordinate 504 plans for 35 students and attend IEP meetings for students on my caseload",
            "Lead suicide risk screening and crisis intervention with the school psychologist and social worker, following district protocol",
            "Run small-group counseling on test anxiety and grief each semester, plus individual counseling by referral",
          ],
        },
        {
          title: "School Counselor, Grades 6–8",
          company: "Dogwood Trace Middle School",
          dates: "Aug 2019 – Jun 2022",
          bullets: [
            "Taught classroom lessons on study skills, bullying prevention and career exploration to about 650 students a year",
            "Started a check-in mentoring program through MTSS; chronic absenteeism among participants fell by 30%",
            "Built 8th-to-9th grade transition plans with the high school counseling team, including family engagement nights",
          ],
        },
      ],
      education: "M.Ed. School Counseling (CACREP-accredited), Oconee Valley University, 2019 · School counseling certification, Georgia (P–12)",
      skills: [
        "ASCA National Model", "College and career readiness", "Academic advising", "Social-emotional learning (SEL)", "Crisis intervention",
        "504 plans", "MTSS", "Individual counseling", "Naviance", "PowerSchool", "Confidentiality",
      ],
    },
    whyItWorks:
      "It puts degree and certification where principals look first, states caseload and grade levels plainly, and measures counseling with school-wide data — FAFSA completion, attendance, plans — instead of describing a typical day.",
    summaries: [
      { level: "New counselor", text: "Newly certified school counselor with a CACREP-accredited M.Ed. and a 600-hour internship at a high school, where I ran two small groups and helped 90 seniors with college applications." },
      { level: "Experienced", text: "School counselor with 7 years in middle and high schools. I manage a 420-student caseload and raised senior FAFSA completion from 52% to 74%." },
      { level: "Lead counselor", text: "Counseling department chair with 14 years in secondary schools who leads a team of 5, built a data-driven program on the ASCA National Model and coordinates the school's crisis response team." },
    ],
    bullets: [
      { skill: "College access", weak: "Helped seniors with college", strong: "Raised senior FAFSA completion from 52% to 74% in two years with class workshops and family nights" },
      { skill: "Attendance", weak: "Worked on attendance", strong: "Started an MTSS check-in mentoring program that cut chronic absenteeism among participants by 30%" },
      { skill: "Crisis response", weak: "Handled crises", strong: "Led suicide risk screening and crisis intervention with the school psychologist and social worker, following district protocol" },
      { skill: "Student support", weak: "Managed 504 plans", strong: "Coordinated 504 plans for 35 students and joined IEP meetings for students on a 420-student caseload" },
      { skill: "Groups", weak: "Ran counseling groups", strong: "Ran small-group counseling on test anxiety and grief each semester, with pre- and post-surveys to check progress" },
      { skill: "Transitions", weak: "Helped with high school transition", strong: "Built 8th-to-9th grade transition plans with the high school team and hosted family engagement nights" },
    ],
    keywords: [
      "School counseling certification", "ASCA National Model", "College and career readiness", "Academic advising",
      "Social-emotional learning (SEL)", "Crisis intervention", "Suicide risk screening", "504 plans", "IEP", "MTSS", "Small-group counseling",
      "Individual counseling", "FAFSA", "Naviance", "PowerSchool", "Family engagement", "Confidentiality",
    ],
    keywordSort: {
      tools: ["Naviance", "PowerSchool"],
      credentials: ["School counseling certification"],
      soft: ["Confidentiality", "Family engagement"],
    },
    tips: [
      { t: "Lead with certification and degree", d: "Your state school counseling certification and your master's degree should be visible at a glance." },
      { t: "Give caseload and grades", d: "\"420 students, grades 9–12\" tells a principal the scale and setting of your work in one line." },
      { t: "Use school-level data", d: "FAFSA completion, attendance, graduation, course completion or referrals show your program's impact without exposing any student." },
      { t: "Show the three domains", d: "Academic, college and career, and social-emotional work all matter. Include at least one bullet for each." },
      { t: "Name your framework and tools", d: "ASCA National Model, MTSS, Naviance and PowerSchool are common in district postings — use the ones you've really worked with." },
    ],
    faqs: [
      { q: "What credentials should a school counselor resume show?", a: "Your state's school counselor certification or license and your master's degree in school counseling, which most states require. If you also hold the National Certified Counselor (NCC) credential from NBCC or a state counseling license, list them too." },
      { q: "How do I show results without sharing student information?", a: "Use group or school-level data — percentages, totals and changes over time — and never names, cases or details that could identify a student." },
      { q: "Should I mention the ASCA National Model?", a: "Yes, if your program follows it. If your school earned ASCA's Recognized ASCA Model Program (RAMP) designation, say so and describe your part in it." },
      { q: "How do I move from teaching to school counseling?", a: "Lead with your counseling degree, internship hours and certification, then show the teaching experience that carries over: relationships with students, family communication and using data." },
      { q: "How long should a school counselor resume be?", a: "One to two pages. Two is fine if you have leadership, crisis team or program-building work that's relevant to the role." },
    ],
    related: ["teacher", "teacher-assistant", "hr-generalist"],
  },
  {
    slug: "bookkeeper",
    role: "Bookkeeper",
    group: "Finance",
    level: "Experienced · 7 years",
    intro:
      "A bookkeeper resume that shows reconciled accounts, on-time closes and clean books at tax time — with the software, accounting and certification keywords small businesses and firms look for.",
    resume: {
      name: "Rebecca Nguyen",
      headline: "Full-Charge Bookkeeper",
      contact: "Portland, OR · rebecca.nguyen@email.com · (503) 555-0193",
      summary:
        "Full-charge bookkeeper with 7 years keeping books for small businesses in construction, retail and professional services. I close the month on time, keep every account reconciled and hand the CPA clean books at tax time.",
      jobs: [
        {
          title: "Full-Charge Bookkeeper",
          company: "Timberline Mechanical Contractors",
          dates: "Mar 2022 – Present",
          bullets: [
            "Run full-charge bookkeeping in QuickBooks Online for a $9M HVAC contractor, from accounts payable and receivable to month-end close",
            "Reconcile 6 bank and 3 credit card accounts monthly and closed the books by the 7th business day for 30 months straight",
            "Process biweekly payroll for 45 employees in Gusto and file 1099s for 60+ subcontractors each January",
            "Cut overdue receivables from $410K to $180K by starting weekly aging reviews and follow-up calls",
            "Track job costing by project so the owners can see margin on every job before it closes",
          ],
        },
        {
          title: "Bookkeeper",
          company: "Hawthorne Lane Bookkeeping",
          dates: "Jun 2019 – Feb 2022",
          bullets: [
            "Kept the books for 14 small-business clients in QuickBooks Online and Xero",
            "Cleaned up 18 months of uncategorized transactions and missing journal entries for a new client in 6 weeks, ahead of its tax deadline",
            "Prepared monthly financial statements — profit and loss and balance sheet — for owners and their CPAs",
          ],
        },
      ],
      education: "A.A.S. Accounting, Willamette Crest Community College, 2019 · Certified Bookkeeper (CB), AIPB · QuickBooks Online Certified ProAdvisor",
      skills: [
        "Bank reconciliation", "Accounts payable", "Accounts receivable", "General ledger", "Month-end close", "Financial statements",
        "Journal entries", "Job costing", "QuickBooks Online", "Xero", "Gusto", "Excel",
      ],
    },
    whyItWorks:
      "It shows the size and type of the books you keep, measures the close in days and receivables in dollars, and names the software and credential small-business owners and accounting firms screen for.",
    summaries: [
      { level: "Entry level", text: "Accounting certificate graduate with a year of part-time AP and data entry work. Reconciled bank accounts and entered bills in QuickBooks Online for a 20-person nonprofit." },
      { level: "Mid level", text: "Full-charge bookkeeper with 7 years in small-business accounting. I close the books by the 7th business day and cut overdue receivables from $410K to $180K." },
      { level: "Senior", text: "Bookkeeping manager with 12 years who leads a team of 4 serving 40 clients, built the firm's month-end checklist and moved every client from desktop software to QuickBooks Online." },
    ],
    bullets: [
      { skill: "Close", weak: "Did month-end", strong: "Closed the books by the 7th business day for 30 months straight with every account reconciled" },
      { skill: "Receivables", weak: "Followed up on invoices", strong: "Cut overdue receivables from $410K to $180K with weekly aging reviews and follow-up calls" },
      { skill: "Reconciliation", weak: "Reconciled accounts", strong: "Reconciled 6 bank and 3 credit card accounts monthly and traced every difference to source" },
      { skill: "Cleanup", weak: "Fixed messy books", strong: "Cleaned up 18 months of uncategorized transactions for a new client in 6 weeks, ahead of its tax deadline" },
      { skill: "Payroll", weak: "Ran payroll", strong: "Processed biweekly payroll for 45 employees and filed 1099s for 60+ subcontractors on time each year" },
      { skill: "Reporting", weak: "Made reports", strong: "Prepared monthly profit and loss statements, balance sheets and job costing reports owners use to price new work" },
    ],
    keywords: [
      "Full-charge bookkeeping", "Bank reconciliation", "Accounts payable", "Accounts receivable", "General ledger", "Month-end close",
      "Financial statements", "Journal entries", "Payroll", "1099s", "Job costing", "QuickBooks Online", "Xero", "Gusto", "Excel",
      "Certified Bookkeeper (CB)", "Attention to detail",
    ],
    keywordSort: {
      tools: ["QuickBooks Online", "Xero", "Gusto", "Excel"],
      credentials: ["Certified Bookkeeper (CB)"],
      soft: ["Attention to detail"],
    },
    tips: [
      { t: "Say what kind of bookkeeper you are", d: "\"Full-charge\" tells employers you handle the books end to end, not just data entry. Use it only if it's true." },
      { t: "Show the size of the books", d: "Revenue, number of accounts, employees on payroll or clients you serve give scale to your work." },
      { t: "Measure the close and receivables", d: "Days to close and overdue receivables in dollars are clear, easy-to-check results." },
      { t: "Name the software", d: "QuickBooks Online, Xero, Gusto and Excel are common screening terms. List the versions and add-ons you really use." },
      { t: "Keep client details confidential", d: "Describe clients by industry and size, not by name, unless you have permission." },
    ],
    faqs: [
      { q: "Do I need a certification to work as a bookkeeper?", a: "Usually not, but it can help you stand out. Options include the Certified Bookkeeper (CB) from the American Institute of Professional Bookkeepers (AIPB), the Certified Public Bookkeeper from the National Association of Certified Public Bookkeepers (NACPB) and Intuit's QuickBooks ProAdvisor certification." },
      { q: "What is a full-charge bookkeeper?", a: "A bookkeeper who handles the full accounting cycle for a business — payables, receivables, payroll, reconciliations and the month-end close — usually up to the financial statements, with a CPA handling taxes and audits." },
      { q: "How is a bookkeeper resume different from an accountant resume?", a: "Bookkeeper resumes focus on accurate day-to-day records, reconciliations and the close. Accountant resumes add analysis, GAAP reporting, audits and often a CPA license." },
      { q: "Should I list every client I've worked for?", a: "No. Group them, such as \"14 small-business clients in construction, retail and professional services,\" and keep names private unless you have permission." },
      { q: "How long should a bookkeeper resume be?", a: "One page. Put software and any certification near the top, then jobs with close times, account counts and dollar results." },
    ],
    related: ["accountant", "payroll-specialist", "administrative-assistant"],
  },
  {
    slug: "bank-teller",
    role: "Bank Teller",
    group: "Finance",
    level: "Mid-level · 4 years experience",
    intro:
      "A bank teller resume that shows accurate cash handling, sharp fraud awareness and friendly service — with the compliance, branch and customer keywords banks and credit unions screen for.",
    resume: {
      name: "Ashley Morgan",
      headline: "Lead Bank Teller",
      contact: "Charlotte, NC · ashley.morgan@email.com · (704) 555-0114",
      summary:
        "Bank teller with 4 years in branch banking at a bank and a credit union. I handle high cash volumes accurately, spot fraud before it costs customers money and connect people with the right products.",
      jobs: [
        {
          title: "Lead Teller",
          company: "Woodgrove Bank",
          dates: "May 2024 – Present",
          bullets: [
            "Process 100+ transactions a day: deposits, withdrawals, check cashing, loan payments and cashier's checks",
            "Balanced my cash drawer with no outages in 22 of 24 months and help with vault management and ATM balancing",
            "Flagged 14 suspected elder fraud and check fraud cases to the branch manager, stopping about $38K in losses",
            "Made 120+ product referrals to bankers for checking accounts, CDs and loans — top referrer in the branch three quarters running",
            "Complete Currency Transaction Reports and BSA/AML checks, screen against OFAC and place holds under Regulation CC",
          ],
        },
        {
          title: "Teller",
          company: "Catawba Falls Credit Union",
          dates: "Aug 2022 – Apr 2024",
          bullets: [
            "Served 60–80 members a day at the counter and drive-through",
            "Handled account opening for new members and set up online banking and direct deposit",
            "Passed 2 internal cash handling audits with no exceptions",
          ],
        },
      ],
      education: "A.S. Business Administration, Piedmont Crossing Community College, 2022",
      skills: [
        "Cash handling", "Cash drawer balancing", "Vault management", "Customer service", "Fraud prevention", "BSA/AML", "OFAC",
        "Cross-selling", "Account opening", "Banking software", "10-key", "Attention to detail",
      ],
    },
    whyItWorks:
      "It turns teller duties into measurable results — balanced drawers, fraud stopped, referrals — and names the compliance terms (BSA/AML, CTRs, OFAC, Regulation CC) that show a branch manager you can be trusted with cash.",
    summaries: [
      { level: "Entry level", text: "Retail cashier with 2 years of cash handling and a balanced drawer every shift. Fast with 10-key and known for calm, friendly service at the register." },
      { level: "Mid level", text: "Bank teller with 4 years at a bank and a credit union. I process 100+ transactions a day and stopped about $38K in fraud losses last year." },
      { level: "Senior", text: "Head teller with 8 years who supervises 6 tellers, manages the branch vault and cash orders, and trains staff on fraud and BSA/AML procedures." },
    ],
    bullets: [
      { skill: "Accuracy", weak: "Balanced my drawer", strong: "Balanced my cash drawer with no outages in 22 of 24 months while processing 100+ transactions a day" },
      { skill: "Fraud", weak: "Watched for fraud", strong: "Flagged 14 suspected elder and check fraud cases, stopping about $38K in losses" },
      { skill: "Referrals", weak: "Sold bank products", strong: "Made 120+ product referrals to bankers — the branch's top referrer three quarters running" },
      { skill: "Compliance", weak: "Followed bank rules", strong: "Completed Currency Transaction Reports and OFAC checks and placed Regulation CC holds with no audit findings" },
      { skill: "Vault", weak: "Helped with the vault", strong: "Helped manage vault cash, ATM balancing and cash orders for a branch of 6 tellers" },
      { skill: "Service", weak: "Helped members", strong: "Served 60–80 members a day and opened new accounts with online banking and direct deposit set up on the spot" },
    ],
    keywords: [
      "Cash handling", "Cash drawer balancing", "Vault management", "Customer service", "Fraud prevention", "Cross-selling",
      "Product referrals", "Account opening", "BSA/AML", "OFAC", "Currency Transaction Reports", "Regulation CC", "Check cashing",
      "Banking software", "10-key", "Attention to detail",
    ],
    keywordSort: {
      tools: ["Banking software", "10-key"],
      soft: ["Customer service", "Attention to detail"],
    },
    tips: [
      { t: "Prove you're accurate with cash", d: "Drawer balancing record, audit results and daily transaction volume show you can be trusted with money." },
      { t: "Show fraud awareness", d: "Cases you flagged and losses prevented are strong results. Keep customer details out." },
      { t: "Count your referrals", d: "Most teller roles include product referrals. Numbers or branch rankings show you can do it without being pushy." },
      { t: "Use compliance terms you know", d: "BSA/AML, Currency Transaction Reports, OFAC and Regulation CC are common in teller posts — list the ones you've worked with." },
      { t: "Bring retail experience over", d: "If you're new to banking, cashier and customer service jobs show cash handling and service skills that transfer directly." },
    ],
    faqs: [
      { q: "Can I become a bank teller with no banking experience?", a: "Yes. Many tellers start from retail, restaurant or customer service jobs. Lead with cash handling, accuracy and service, and give numbers such as transactions per shift." },
      { q: "Which compliance terms should a teller resume include?", a: "The ones you've used: BSA/AML, Currency Transaction Reports (filed for cash transactions over $10,000), OFAC screening and Regulation CC holds on deposits are the most common in teller job posts." },
      { q: "Should I list my drawer size or cash limits?", a: "Not needed. Transaction volume, balancing record and audit results show your skill without sharing internal cash limits." },
      { q: "Is a teller resume different for a credit union?", a: "Slightly. Credit unions serve \"members\" and use terms like share accounts. Mirror the posting's language and keep the rest the same." },
      { q: "How long should a bank teller resume be?", a: "One page. Two jobs with clear numbers, a short skills section and your education are usually enough." },
    ],
    related: ["loan-officer", "customer-service-representative", "bookkeeper"],
  },
  {
    slug: "loan-officer",
    role: "Loan Officer",
    group: "Finance",
    level: "Senior · 7 years experience",
    intro:
      "A mortgage loan officer resume that shows production, on-time closings and strong referral partnerships — with the NMLS licensing, loan product and compliance keywords lenders search for.",
    resume: {
      name: "Brian Walsh",
      headline: "Senior Mortgage Loan Officer, NMLS licensed",
      contact: "Minneapolis, MN · brian.walsh@email.com · (612) 555-0162",
      summary:
        "Mortgage loan officer with 7 years in purchase and refinance lending. I guide first-time buyers through conventional, FHA and VA loans and close on time by keeping agents, processors and underwriters in the loop.",
      jobs: [
        {
          title: "Senior Mortgage Loan Officer",
          company: "Bluewater Prairie Home Lending",
          dates: "Jan 2022 – Present",
          bullets: [
            "Originate and close 70–85 loans a year, about $24M in annual volume, mostly purchase loans",
            "Built a network of 30+ referral partners, mostly real estate agents; referrals grew to 60% of my pipeline",
            "Issue pre-approval letters through Desktop Underwriter (DU) and Loan Product Advisor (LPA) and structure conventional, FHA, VA and USDA loans",
            "Closed 95% of loans on or before the contract date by tracking every file in Encompass and a CRM",
            "Deliver the Loan Estimate and Closing Disclosure within TRID timelines, with no findings in 3 internal compliance audits",
          ],
        },
        {
          title: "Mortgage Loan Originator",
          company: "Lakeland Federal Savings",
          dates: "Jun 2019 – Dec 2021",
          bullets: [
            "Originated about $11M a year in mortgage, refinance and home equity loans for branch customers",
            "Collected and reviewed income, asset and credit documents up front, reducing underwriting conditions per file",
            "Ran monthly first-time homebuyer workshops at 4 branches that produced 40+ applications a year",
          ],
        },
      ],
      education: "B.S. Finance, North Shore State University, 2019 · Licensed mortgage loan originator, NMLS (Minnesota, Wisconsin)",
      skills: [
        "Mortgage loan origination", "Conventional loans", "FHA loans", "VA loans", "USDA loans", "Pipeline management", "Encompass",
        "TRID", "Credit analysis", "Relationship building", "CRM",
      ],
    },
    whyItWorks:
      "It leads with licensing, then proves production with units, volume and on-time closings, and names the loan programs, underwriting systems and disclosure rules that hiring managers at lenders screen for.",
    summaries: [
      { level: "Entry level", text: "Newly licensed mortgage loan originator with 2 years as a loan processor. Completed the SAFE pre-licensing education, passed the SAFE MLO Test and know conventional and FHA guidelines from the processing side." },
      { level: "Mid level", text: "Mortgage loan officer with 7 years in purchase and refinance lending. I close 70–85 loans a year, about $24M in volume, with 60% of my pipeline from referral partners." },
      { level: "Senior", text: "Branch sales manager and producing loan officer with 15 years in mortgage lending who leads 8 loan officers and built partnerships with 3 local builders." },
    ],
    bullets: [
      { skill: "Production", weak: "Originated loans", strong: "Originated and closed 70–85 loans a year, about $24M in annual volume, mostly purchase loans" },
      { skill: "Referrals", weak: "Worked with realtors", strong: "Built a network of 30+ referral partners; referrals grew to 60% of my pipeline in two years" },
      { skill: "On-time closing", weak: "Closed loans on time", strong: "Closed 95% of loans on or before contract date by tracking every file in Encompass" },
      { skill: "Compliance", weak: "Followed disclosure rules", strong: "Delivered the Loan Estimate and Closing Disclosure within TRID timelines with no findings in 3 audits" },
      { skill: "Loan structure", weak: "Offered different loans", strong: "Structured conventional, FHA, VA and USDA loans after pre-approval through DU and LPA" },
      { skill: "Community", weak: "Did homebuyer events", strong: "Ran monthly first-time homebuyer workshops at 4 branches that produced 40+ applications a year" },
    ],
    keywords: [
      "Mortgage loan origination", "NMLS", "Purchase loans", "Refinance", "Conventional loans", "FHA loans", "VA loans", "USDA loans",
      "Pre-approval", "Desktop Underwriter (DU)", "Loan Product Advisor (LPA)", "Encompass", "TRID", "Loan Estimate",
      "Closing Disclosure", "Pipeline management", "Referral partners", "CRM", "Relationship building",
    ],
    keywordSort: {
      tools: ["Desktop Underwriter (DU)", "Loan Product Advisor (LPA)", "Encompass", "CRM"],
      credentials: ["NMLS"],
      soft: ["Relationship building"],
    },
    tips: [
      { t: "Show your licensing first", d: "Write the states where you're licensed or note that you're NMLS registered. Lenders need to know you can originate in their market." },
      { t: "Lead with production", d: "Units closed, dollar volume and pull-through rate are what sales managers compare first." },
      { t: "Name programs and systems", d: "Conventional, FHA, VA and USDA loans, plus DU, LPA and your loan origination system, are standard screening terms." },
      { t: "Show where your business comes from", d: "Referral partners, builders and repeat clients show you can build a pipeline, not just work leads." },
      { t: "Mention compliance carefully", d: "Clean audit results and TRID timelines are strong points. Don't share borrower details or confidential pricing." },
    ],
    faqs: [
      { q: "Do I need an NMLS license to be a loan officer?", a: "Mortgage loan originators must be in NMLS. Under the SAFE Act, those at banks and credit unions are registered, while those at nonbank lenders and brokers must be state-licensed — which takes at least 20 hours of NMLS-approved pre-licensing education, the SAFE MLO Test, a background check and credit report, and 8 hours of continuing education each year. Some states add their own requirements." },
      { q: "Should I put my NMLS ID on my resume?", a: "Many loan officers do, next to their license states, since employers can look it up on NMLS Consumer Access. The sample leaves it out because the person is fictional." },
      { q: "Is this resume right for commercial or consumer loan officers?", a: "This example is for residential mortgage lending. Commercial and consumer loan officers usually aren't covered by the SAFE Act unless they originate residential mortgages, so focus on credit analysis, portfolio size and loan performance instead." },
      { q: "How do I show production if I'm new?", a: "Use what you have: files processed, applications taken, pre-approvals issued or workshop attendance. Name the loan programs you know and say when you got licensed." },
      { q: "How long should a loan officer resume be?", a: "One page for most loan officers. Two pages is fine for managers with team and branch results." },
    ],
    related: ["bank-teller", "financial-analyst", "sales-representative"],
  },
  {
    slug: "payroll-specialist",
    role: "Payroll Specialist",
    group: "Finance",
    level: "Mid-level · 6 years experience",
    intro:
      "A payroll specialist resume that shows accurate, on-time pay across states and clean tax filings — with the certification, systems and compliance keywords payroll managers search for.",
    resume: {
      name: "Stephanie Ruiz",
      headline: "Payroll Specialist, CPP",
      contact: "Chicago, IL · stephanie.ruiz@email.com · (312) 555-0185",
      summary:
        "Certified Payroll Professional with 6 years running multi-state payroll for hourly and salaried employees. I pay people accurately and on time, keep tax filings clean and answer pay questions in plain words.",
      jobs: [
        {
          title: "Senior Payroll Specialist",
          company: "Prairie Lantern Foods",
          dates: "Apr 2022 – Present",
          bullets: [
            "Run payroll processing for 1,800 weekly and biweekly employees in 14 states in ADP Workforce Now",
            "Cut off-cycle checks from about 30 a month to 8 by adding pre-close audits of timekeeping and HR changes",
            "Reconcile payroll to the general ledger each period and prepare quarterly Form 941 and state unemployment filings",
            "Process wage garnishments, child support orders and tax levies for 120+ employees",
            "Led year-end W-2 processing two years in a row with no corrected W-2s needed",
          ],
        },
        {
          title: "Payroll Specialist",
          company: "Canalside Staffing Group",
          dates: "Jul 2020 – Mar 2022",
          bullets: [
            "Ran weekly payroll for 600+ hourly employees across Illinois, Indiana and Wisconsin, including FLSA overtime",
            "Imported and audited punch data from UKG before each payroll close",
            "Set up new hires' W-4, state withholding, direct deposit and benefits deductions",
          ],
        },
      ],
      education: "B.S. Accounting, Lakeshore Prairie University, 2020 · Certified Payroll Professional (CPP), PayrollOrg · FPC, 2021",
      skills: [
        "Multi-state payroll", "Payroll tax filings", "Form 941", "FLSA", "Garnishments", "General ledger reconciliation", "Benefits deductions",
        "ADP Workforce Now", "UKG", "Excel", "Confidentiality",
      ],
    },
    whyItWorks:
      "It shows payroll scale — employees, states, pay frequencies — measures accuracy in off-cycle checks and corrections, and names the certification, systems and tax forms in the exact terms payroll job posts use.",
    summaries: [
      { level: "Entry level", text: "Accounting graduate with a year as a payroll and AP clerk. Entered time, set up new hires and helped reconcile payroll for 150 employees; earned the FPC in 2026." },
      { level: "Mid level", text: "CPP with 6 years in multi-state payroll. I run payroll for 1,800 employees in 14 states and cut off-cycle checks from about 30 a month to 8." },
      { level: "Senior", text: "Payroll manager with 12 years who leads a team of 5, owns payroll for 6,000 employees and led a move from one payroll system to another with no missed pay dates." },
    ],
    bullets: [
      { skill: "Accuracy", weak: "Fixed payroll errors", strong: "Cut off-cycle checks from about 30 a month to 8 with pre-close audits of time and HR changes" },
      { skill: "Scale", weak: "Ran payroll", strong: "Processed weekly and biweekly payroll for 1,800 employees in 14 states in ADP Workforce Now" },
      { skill: "Tax filings", weak: "Did payroll taxes", strong: "Prepared quarterly Form 941 and state unemployment filings and reconciled payroll to the general ledger each period" },
      { skill: "Year-end", weak: "Did W-2s", strong: "Led year-end W-2 processing two years running with no corrected W-2s needed" },
      { skill: "Garnishments", weak: "Handled garnishments", strong: "Processed wage garnishments, child support orders and tax levies for 120+ employees on time" },
      { skill: "Compliance", weak: "Paid overtime", strong: "Calculated FLSA overtime for 600+ hourly employees across 3 states, auditing punch data before each close" },
    ],
    keywords: [
      "Payroll processing", "Multi-state payroll", "Certified Payroll Professional (CPP)", "FPC", "Payroll tax", "Form 941", "W-2", "W-4",
      "FLSA", "Garnishments", "General ledger reconciliation", "Timekeeping", "Benefits deductions", "ADP Workforce Now", "UKG", "Workday",
      "Excel", "Confidentiality",
    ],
    keywordSort: {
      tools: ["ADP Workforce Now", "UKG", "Workday", "Excel"],
      credentials: ["Certified Payroll Professional (CPP)", "FPC"],
      soft: ["Confidentiality"],
    },
    tips: [
      { t: "Show the scale of your payroll", d: "Employees, states, pay frequencies and pay types (hourly, salaried, union) tell a manager what you can handle." },
      { t: "Measure accuracy", d: "Off-cycle checks, corrections, missed deadlines and audit results are the numbers payroll teams track." },
      { t: "Name the systems", d: "ADP, UKG, Paychex, Workday and Paylocity are common screening terms. List the modules you've used, not just the brand." },
      { t: "Use the forms and rules", d: "Form 941, W-2, W-4, FLSA and garnishments are plain, searchable proof of your experience." },
      { t: "Treat pay data as confidential", d: "Use totals and percentages. Never include employee names, pay rates or anything personal." },
    ],
    faqs: [
      { q: "CPP or FPC — which should I list?", a: "Whichever you hold. Both come from PayrollOrg (formerly the American Payroll Association). The Fundamental Payroll Certification (FPC) is the entry-level credential with no experience requirement; the Certified Payroll Professional (CPP) is for experienced payroll professionals. Write the full name with the abbreviation." },
      { q: "Should I list the number of employees and states?", a: "Yes. Headcount, states and pay frequencies are the quickest way to show the size and complexity of the payroll you've run." },
      { q: "Which payroll systems should I include?", a: "The ones you've used and the post mentions — ADP, UKG, Paychex, Workday or Paylocity — plus any timekeeping system and Excel skills like pivot tables and lookups." },
      { q: "How is a payroll resume different from an HR resume?", a: "Payroll resumes focus on accurate pay, tax filings, reconciliations and compliance. HR resumes focus on hiring, employee relations and policy. If you've done both, lead with the side the job post stresses." },
      { q: "How long should a payroll specialist resume be?", a: "One page for most specialists. Two pages is fine for managers with system implementations or team leadership." },
    ],
    related: ["bookkeeper", "accountant", "hr-generalist"],
  },
];
