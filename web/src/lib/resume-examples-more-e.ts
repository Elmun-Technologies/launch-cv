import type { ResumeExample } from "@/lib/resume-examples";

/** More role examples (see lib/resume-examples.ts for the shape and rules). */
export const MORE_EXAMPLES_E: ResumeExample[] = [
  // ---------------------------------------------------------------- Healthcare
  {
    slug: "pharmacist",
    role: "Pharmacist",
    group: "Healthcare",
    level: "Experienced · 6 years",
    intro:
      "A pharmacist resume that shows safe verification at volume, clinical checks and patient care — immunizations, MTM and counseling — with the license, exam and controlled-substance keywords pharmacy managers screen for.",
    resume: {
      name: "Daniel Okafor",
      headline: "Pharmacist, PharmD, RPh",
      contact: "Pittsburgh, PA · daniel.okafor@email.com · (412) 555-0128",
      summary:
        "Licensed community pharmacist with 6 years in retail and independent pharmacy, the last 3 as pharmacist-in-charge. I verify prescriptions carefully at a busy counter, catch drug therapy problems before they reach the patient and make time to counsel.",
      jobs: [
        {
          title: "Pharmacist-in-Charge",
          company: "Allegheny Ridge Pharmacy",
          dates: "Mar 2023 – Present",
          bullets: [
            "Verify 250–300 prescriptions a day and complete a drug utilization review (DUR) on each for drug interactions, duplications, allergies and dosing, leading a team of 4 pharmacy technicians",
            "Administered 1,100+ immunizations last season, including flu, COVID-19, shingles and pneumococcal vaccines, and documented each one in the state immunization registry",
            "Completed 180 comprehensive medication reviews for medication therapy management (MTM) patients in 2025 and called prescribers about 60+ drug therapy problems",
            "Check the Pennsylvania PDMP before dispensing controlled substances, keep the Schedule II perpetual inventory and led the store's biennial DEA inventory",
          ],
        },
        {
          title: "Staff Pharmacist",
          company: "Three Rivers Neighborhood Pharmacy",
          dates: "Jul 2020 – Feb 2023",
          bullets: [
            "Counseled patients on new prescriptions, inhaler technique and blood glucose meters at the counter and by phone",
            "Cut average prior authorization turnaround from 5 days to 2 by starting a same-day tracking log and calling prescriber offices directly",
            "Precepted 6 PharmD students on their community APPE rotations",
            "Managed inventory and ordering for a pharmacy filling about 1,400 prescriptions a week, cutting expired-stock returns by reviewing slow movers monthly",
          ],
        },
      ],
      education:
        "PharmD, Monongahela University School of Pharmacy (ACPE-accredited), 2020 · Pennsylvania pharmacist license · NAPLEX and Pennsylvania MPJE · APhA Pharmacy-Based Immunization Delivery certificate · BLS",
      skills: [
        "Prescription verification", "Drug utilization review", "Patient counseling", "Immunizations", "Medication therapy management",
        "Drug interactions", "Controlled substances", "PDMP", "Prior authorization", "Inventory management", "Technician supervision", "HIPAA",
      ],
    },
    whyItWorks:
      "The degree, license and exams are spelled out, the volume and team size are in the first bullet, and the rest proves clinical judgment — DUR, MTM, prescriber calls, PDMP checks — rather than just speed at the counter.",
    summaries: [
      { level: "New graduate", text: "New PharmD graduate from an ACPE-accredited program with community and hospital APPE rotations. NAPLEX and MPJE passed, APhA immunization certificate, and comfortable verifying, counseling and giving vaccines under supervision." },
      { level: "Experienced", text: "Licensed community pharmacist with 6 years in retail and independent pharmacy. I verify 250–300 prescriptions a day and completed 180 comprehensive medication reviews in 2025." },
      { level: "Senior", text: "Pharmacy manager with 12 years in community practice. I run a 3-pharmacist, 9-technician team, own controlled-substance compliance and built the store's clinical services around MTM and immunizations." },
    ],
    bullets: [
      { skill: "Verification", weak: "Checked prescriptions", strong: "Verified 250–300 prescriptions a day with a full drug utilization review on each one" },
      { skill: "Immunizations", weak: "Gave flu shots", strong: "Administered 1,100+ immunizations in one season and documented each in the state registry" },
      { skill: "MTM", weak: "Did medication reviews", strong: "Completed 180 comprehensive medication reviews and called prescribers about 60+ drug therapy problems" },
      { skill: "Controlled substances", weak: "Handled narcotics", strong: "Checked the PDMP before dispensing controlled substances and led the biennial DEA inventory" },
      { skill: "Prior authorization", weak: "Helped with insurance", strong: "Cut prior authorization turnaround from 5 days to 2 with a same-day tracking log and direct prescriber calls" },
      { skill: "Teaching", weak: "Worked with students", strong: "Precepted 6 PharmD students on community APPE rotations" },
    ],
    keywords: [
      "PharmD", "Prescription verification", "Drug utilization review", "Patient counseling", "Immunizations", "Medication therapy management",
      "Comprehensive medication reviews", "Drug interactions", "Controlled substances", "PDMP", "Prior authorization", "Inventory management",
      "Technician supervision", "HIPAA", "Pharmacist license", "NAPLEX", "MPJE", "BLS",
    ],
    keywordSort: {
      tools: ["PDMP"],
      credentials: ["PharmD", "Pharmacist license", "NAPLEX", "MPJE", "BLS"],
      soft: ["Patient counseling"],
    },
    tips: [
      { t: "Put the license where it's seen first", d: "Write PharmD in your headline and name your state license in the education or license section. Managers confirm the license before anything else." },
      { t: "Give the volume and the team", d: "Prescriptions verified a day and the number of technicians you lead tell a manager the pace you're used to." },
      { t: "Show clinical checks, not just speed", d: "DUR catches, prescriber calls and medication reviews show the judgment that makes a pharmacist worth hiring." },
      { t: "List clinical services you actually provide", d: "Immunizations, MTM, comprehensive medication reviews and point-of-care testing are common screening terms. Include the ones you do, with a number if you have one." },
      { t: "Mention controlled-substance work", d: "PDMP checks, perpetual inventory and DEA inventories show you can be trusted with compliance, especially for a pharmacist-in-charge role." },
    ],
    faqs: [
      { q: "Which exams should a pharmacist list?", a: "Most U.S. boards of pharmacy require the NAPLEX and a law exam such as the MPJE, both administered by the National Association of Boards of Pharmacy (NABP). Some states use their own law exam or assessment instead, so list the exams you passed and the state license they led to." },
      { q: "Should I write RPh after my name?", a: "Many pharmacists do, since it signals a license. PharmD is your degree and the license is issued by a state, so the clearest resume names both: PharmD in the headline and the state license spelled out below." },
      { q: "How should a new graduate pharmacist fill a resume?", a: "List your APPE rotations like jobs, with the setting and what you did, such as verification under supervision, counseling, immunizations or rounding with a care team. Add your intern hours, exam status and any immunization certificate." },
      { q: "Should I include my immunization certificate?", a: "Yes, if you hold one. Many community pharmacies require it. Name the program as it appears on the certificate, such as APhA's Pharmacy-Based Immunization Delivery, and check your state's rules for which vaccines and ages pharmacists may give." },
      { q: "How long should a pharmacist resume be?", a: "One page for most staff pharmacists. Two pages is fine for clinical, management or residency-trained pharmacists with research, teaching or board certification to show." },
    ],
    related: ["pharmacy-technician", "registered-nurse", "medical-laboratory-scientist", "medical-assistant"],
  },
  {
    slug: "dental-assistant",
    role: "Dental Assistant",
    group: "Healthcare",
    level: "Mid-level · 4 years experience",
    intro:
      "A dental assistant resume that shows smooth chairside assisting, safe radiographs and strict infection control — with the DANB and state credential keywords dental offices look for.",
    resume: {
      name: "Marisol Vega",
      headline: "Registered Dental Assistant (RDA), CDA (DANB)",
      contact: "Fort Worth, TX · marisol.vega@email.com · (817) 555-0162",
      summary:
        "Certified dental assistant with 4 years in general and pediatric dentistry. I keep the schedule moving, take clear radiographs on the first try and treat infection control as part of every procedure, not an afterthought.",
      jobs: [
        {
          title: "Dental Assistant",
          company: "Trinity Oaks Family Dentistry",
          dates: "Feb 2023 – Present",
          bullets: [
            "Provide chairside assisting for 2 dentists across 14–18 patients a day, including fillings, crowns, root canals and extractions",
            "Take bitewing, periapical and panoramic radiographs and intraoral photos, and import images into Dentrix for the dentist's review",
            "Run instrument sterilization and operatory turnover; weekly spore testing on both autoclaves has passed every week since I took it over",
            "Update medical histories, take blood pressure and chart procedures in Dentrix, then walk patients through post-op instructions",
          ],
        },
        {
          title: "Dental Assistant",
          company: "Lakeview Pediatric Dentistry",
          dates: "Jun 2021 – Jan 2023",
          bullets: [
            "Assisted with exams, cleanings and restorative care for 20+ children a day, using tell-show-do to keep nervous patients calm",
            "Prepared trays and operatories for each procedure and cut turnover between patients to about 10 minutes",
            "Took over supply ordering and cut monthly supply spending by 12% by tracking usage and consolidating orders",
          ],
        },
      ],
      education:
        "Dental Assisting Certificate, Tarrant Hills College (CODA-accredited program), 2021 · Texas Registered Dental Assistant (RDA) · CDA (DANB) · BLS",
      skills: [
        "Chairside assisting", "Dental radiography", "Panoramic imaging", "Infection control", "Sterilization", "Four-handed dentistry",
        "Dentrix", "Charting", "Patient education", "Pediatric dentistry", "OSHA compliance", "HIPAA",
      ],
    },
    whyItWorks:
      "Both credentials sit in the headline, each job gives the practice type and patient load, and the bullets cover the three things a dentist cares about: smooth assisting, good images and infection control.",
    summaries: [
      { level: "Entry level", text: "Recent graduate of a CODA-accredited dental assisting program with an externship in a general practice. BLS certified, trained in four-handed dentistry, sterilization and digital radiography, and working toward my state registration." },
      { level: "Mid level", text: "Certified dental assistant with 4 years in general and pediatric dentistry. I assist 2 dentists across 14–18 patients a day and run sterilization for the office." },
      { level: "Senior", text: "Lead dental assistant with 10 years in multi-dentist practices. I train new assistants, run OSHA and infection control compliance and manage supply ordering for 3 offices." },
    ],
    bullets: [
      { skill: "Chairside", weak: "Assisted the dentist", strong: "Provided chairside assisting for 2 dentists across 14–18 patients a day, from fillings to extractions" },
      { skill: "Radiography", weak: "Took X-rays", strong: "Took bitewing, periapical and panoramic radiographs and imported images into Dentrix" },
      { skill: "Infection control", weak: "Cleaned instruments", strong: "Ran sterilization and weekly autoclave spore testing, with every test passed since I took it over" },
      { skill: "Pediatrics", weak: "Worked with kids", strong: "Assisted 20+ children a day and used tell-show-do to keep nervous patients calm" },
      { skill: "Efficiency", weak: "Set up rooms", strong: "Prepared trays and operatories and cut turnover between patients to about 10 minutes" },
      { skill: "Supplies", weak: "Ordered supplies", strong: "Cut monthly supply spending by 12% by tracking usage and consolidating orders" },
    ],
    keywords: [
      "Chairside assisting", "Dental radiography", "Infection control", "Sterilization", "Four-handed dentistry", "Panoramic imaging",
      "Intraoral photos", "Charting", "Patient education", "Pediatric dentistry", "Operatory turnover", "Dentrix", "OSHA compliance", "HIPAA",
      "CDA (DANB)", "Registered Dental Assistant (RDA)", "BLS",
    ],
    keywordSort: {
      tools: ["Dentrix"],
      credentials: ["CDA (DANB)", "Registered Dental Assistant (RDA)", "BLS"],
      soft: ["Patient education"],
    },
    tips: [
      { t: "Name your state credential", d: "Rules for dental assistants differ by state. In Texas, for example, a dental assistant needs a registration from the Texas State Board of Dental Examiners to position or expose x-rays. Write yours the way your state issues it." },
      { t: "Keep DANB and state credentials separate", d: "The CDA is a national certification from the Dental Assisting National Board (DANB). A state registration or license is a different credential. List each one you hold." },
      { t: "Give the practice type and patient load", d: "\"2 dentists, 14–18 patients a day, general and pediatric\" tells an office manager how you'll fit in." },
      { t: "Show infection control", d: "Sterilization, spore testing and operatory turnover are what keep an office safe and inspection-ready. Put one of them in a bullet." },
      { t: "Name the practice software", d: "Dentrix, Eaglesoft and Open Dental are common. List the one you use, since offices like assistants who can chart and pull images on day one." },
    ],
    faqs: [
      { q: "What does CDA mean on a dental assistant resume?", a: "Certified Dental Assistant, a national certification from DANB. It's earned by passing three component exams: General Chairside Assisting (GC), Radiation Health and Safety (RHS) and Infection Control (ICE). Write it as CDA and name DANB." },
      { q: "Do I need a certification to take x-rays?", a: "It depends on the state. Many states require a radiography credential, and some accept DANB's RHS exam as part of it. Check your state dental board's rules and list the credential exactly as issued." },
      { q: "Should I list expanded functions?", a: "Only the ones your state allows and that you're qualified for, such as coronal polishing or sealants. Name the state permit or training if one is required." },
      { q: "What if I'm a new dental assistant?", a: "Lead with your program, externship and BLS. List the procedures you assisted with, the software you used and whether you've started your state registration or DANB exams." },
      { q: "How long should a dental assistant resume be?", a: "One page. Credentials at the top, then one or two jobs with practice type, patient load and bullets on assisting, radiography and infection control." },
    ],
    related: ["dental-hygienist", "medical-assistant", "receptionist", "pharmacy-technician"],
  },
  {
    slug: "occupational-therapist",
    role: "Occupational Therapist",
    group: "Healthcare",
    level: "Experienced · 5 years",
    intro:
      "An occupational therapist resume that shows function gained — ADLs, safe discharges and caregiver training — across acute care and inpatient rehab, with the NBCOT, license and treatment keywords rehab managers search for.",
    resume: {
      name: "Priya Raman",
      headline: "Occupational Therapist, OTR/L",
      contact: "Raleigh, NC · priya.raman@email.com · (919) 555-0136",
      summary:
        "Licensed occupational therapist with 5 years in acute care and inpatient rehabilitation. I help adults after stroke, brain injury and joint replacement get back to dressing, bathing and cooking on their own, and I train families so the gains last at home.",
      jobs: [
        {
          title: "Occupational Therapist, Inpatient Rehabilitation",
          company: "Crabtree Valley Rehabilitation Hospital",
          dates: "Aug 2023 – Present",
          bullets: [
            "Evaluate and treat a caseload of 8–10 patients a day after stroke, spinal cord injury, brain injury and orthopedic surgery",
            "Write measurable goals and plans of care, then lead ADL retraining, neuromuscular re-education and upper extremity therapeutic exercise",
            "Started a structured caregiver training session in the week before discharge; family-reported confidence with transfers at discharge rose from 58% to 81% on our unit survey",
            "Recommend DME and home modifications and coordinate discharge planning with case management, PT and speech-language pathology",
            "Document evaluations and daily notes in Epic the same day and follow Medicare documentation guidelines",
          ],
        },
        {
          title: "Occupational Therapist, Acute Care",
          company: "Neuse River Medical Center",
          dates: "Jul 2021 – Jul 2023",
          bullets: [
            "Evaluated 10–12 patients a day on medical, surgical, cardiac and ICU units and made discharge recommendations for home, rehab or skilled nursing",
            "Added a MoCA cognitive screen to evaluations for older adults, helping the team catch cognitive deficits before discharge",
            "Fabricated resting hand and wrist orthoses for patients with stroke and burns",
          ],
        },
      ],
      education:
        "Master of Science in Occupational Therapy, Capital Pines University (ACOTE-accredited), 2021 · OTR (NBCOT) · North Carolina occupational therapist license · BLS",
      skills: [
        "Occupational therapy evaluation", "ADL retraining", "Plan of care", "Goal writing", "Neuromuscular re-education", "Therapeutic exercise",
        "Cognitive screening", "Orthotic fabrication", "DME recommendations", "Caregiver training", "Discharge planning", "Epic",
      ],
    },
    whyItWorks:
      "The OTR/L credential, settings and caseload are clear in seconds, and the bullets show outcomes OT managers value — goals, caregiver training, safe discharges — with documentation habits that keep a department compliant.",
    summaries: [
      { level: "New graduate", text: "New occupational therapy graduate from an ACOTE-accredited master's program with Level II fieldwork in inpatient rehab and outpatient hand therapy. NBCOT exam passed and North Carolina license pending." },
      { level: "Experienced", text: "Licensed occupational therapist with 5 years in acute care and inpatient rehab. I treat 8–10 patients a day and built a caregiver training session that raised family confidence with transfers from 58% to 81%." },
      { level: "Senior", text: "Senior occupational therapist with 12 years in neuro rehab. I mentor new graduates, supervise fieldwork students and lead our stroke program's ADL and upper extremity protocols." },
    ],
    bullets: [
      { skill: "Caseload", weak: "Treated patients", strong: "Evaluated and treated 8–10 inpatient rehab patients a day after stroke, brain injury and orthopedic surgery" },
      { skill: "Outcomes", weak: "Helped families", strong: "Raised family-reported confidence with transfers at discharge from 58% to 81% with a structured caregiver training session" },
      { skill: "ADLs", weak: "Worked on daily tasks", strong: "Led ADL retraining and neuromuscular re-education toward measurable goals in each plan of care" },
      { skill: "Discharge", weak: "Helped with discharge", strong: "Recommended DME and home modifications and coordinated discharge planning with case management and PT" },
      { skill: "Cognition", weak: "Checked memory", strong: "Added a MoCA cognitive screen to acute care evaluations for older adults" },
      { skill: "Orthotics", weak: "Made splints", strong: "Fabricated resting hand and wrist orthoses for patients with stroke and burns" },
    ],
    keywords: [
      "Occupational therapy evaluation", "ADL retraining", "Plan of care", "Goal writing", "Neuromuscular re-education", "Therapeutic exercise",
      "Cognitive screening", "MoCA", "Orthotic fabrication", "DME recommendations", "Home modifications", "Caregiver training", "Discharge planning",
      "Epic", "Medicare documentation", "OTR (NBCOT)", "Occupational therapist license", "BLS",
    ],
    keywordSort: {
      tools: ["Epic", "MoCA"],
      credentials: ["OTR (NBCOT)", "Occupational therapist license", "BLS"],
      soft: ["Caregiver training"],
    },
    tips: [
      { t: "Write OTR/L only if you hold both", d: "OTR means you passed the NBCOT exam and keep your certification current; the L means you hold a state license. If your license is pending, write OTR and \"license pending\" instead." },
      { t: "Name your settings", d: "Acute care, inpatient rehab, skilled nursing, outpatient, schools and home health are different jobs. Say which you work in and the diagnoses you treat most." },
      { t: "Show function, not just tasks", d: "Goals met, safe discharges or caregiver confidence show what your treatment changed for the patient." },
      { t: "List assessments and interventions by name", d: "ADL retraining, neuromuscular re-education, orthotic fabrication and cognitive screens like the MoCA are common screening terms." },
      { t: "Mention documentation", d: "Same-day notes, Medicare guidelines and the EHR you use matter to a rehab manager who answers to auditors." },
    ],
    faqs: [
      { q: "What credentials does an occupational therapist need?", a: "An entry-level master's or doctoral degree from an ACOTE-accredited program, a passing score on the NBCOT certification exam and a license in the state where you practice. NBCOT certification and the state license are separate, so list both." },
      { q: "Does it matter whether my degree is a master's or an OTD?", a: "Both are accredited entry-level routes to practice. List your degree as awarded. If you did a doctoral capstone relevant to the job, a short line about it can help." },
      { q: "How should a new graduate OT list fieldwork?", a: "List each Level II fieldwork placement like a job, with the setting, weeks, caseload you reached and the interventions you led." },
      { q: "Should I list continuing education?", a: "Yes, when it's relevant to the role, such as a certification course in hand therapy, neuro rehab or lymphedema. Only list specialty credentials you've earned." },
      { q: "How long should an occupational therapist resume be?", a: "One page for most clinicians. Two is fine with 10+ years, specialty certification, teaching or program development to show." },
    ],
    related: ["physical-therapist-assistant", "registered-nurse", "certified-nursing-assistant", "special-education-teacher"],
  },
  {
    slug: "respiratory-therapist",
    role: "Respiratory Therapist",
    group: "Healthcare",
    level: "Experienced · 6 years",
    intro:
      "A respiratory therapist resume that shows ventilator skill, fast response in codes and protocol-driven care — with the NBRC credential, state license and critical care keywords hospitals screen for.",
    resume: {
      name: "Marcus Bell",
      headline: "Registered Respiratory Therapist, RRT",
      contact: "Denver, CO · marcus.bell@email.com · (303) 555-0139",
      summary:
        "Registered respiratory therapist with 6 years in adult critical care and general floors. I manage ventilators and noninvasive support, respond to every code and rapid response on my shift and work with nursing to get patients off the ventilator safely.",
      jobs: [
        {
          title: "Respiratory Therapist, Adult ICU",
          company: "Front Range Medical Center",
          dates: "May 2022 – Present",
          bullets: [
            "Manage mechanical ventilation for up to 8 ICU patients a shift, adjusting settings from ABG results and physician orders",
            "Run daily spontaneous breathing trials with nursing under the ventilator weaning protocol and report readiness to the ICU team on rounds",
            "Respond to every code blue and rapid response on my shift, manage the airway with bag-valve-mask ventilation and assist with intubation",
            "Set up and titrate BiPAP, CPAP and high-flow nasal cannula, and trained 12 new nurses on noninvasive ventilation alarms",
          ],
        },
        {
          title: "Respiratory Therapist",
          company: "Platte Valley Hospital",
          dates: "Jul 2020 – Apr 2022",
          bullets: [
            "Covered 25–30 floor patients a shift for oxygen therapy, aerosol treatments, airway clearance and incentive spirometry",
            "Applied the RT-driven assessment protocol to stop treatments patients no longer needed, cutting scheduled nebulizer treatments on my units by about 20%",
            "Taught inhaler technique and home oxygen safety to COPD and asthma patients before discharge",
          ],
        },
      ],
      education:
        "A.A.S. Respiratory Therapy, Cherry Creek Community College (CoARC-accredited program), 2020 · RRT (NBRC) · Colorado respiratory therapist license · ACLS · BLS",
      skills: [
        "Mechanical ventilation", "Ventilator weaning", "ABG analysis", "Airway management", "Noninvasive ventilation", "BiPAP", "CPAP",
        "High-flow nasal cannula", "Oxygen therapy", "Aerosol therapy", "Airway clearance", "Patient education", "Epic",
      ],
    },
    whyItWorks:
      "The RRT credential and state license are named, the bullets give ICU census and floor load, and each one ties a skill — vents, weaning, codes, protocols — to how it helps patients and the care team.",
    summaries: [
      { level: "New graduate", text: "New graduate of a CoARC-accredited respiratory therapy program with clinical rotations in adult ICU, NICU and the ED. CRT (NBRC), working toward RRT, with BLS and ACLS." },
      { level: "Experienced", text: "Registered respiratory therapist with 6 years in adult critical care. I manage up to 8 ventilated patients a shift and run daily breathing trials with nursing under our weaning protocol." },
      { level: "Senior", text: "Lead respiratory therapist with 14 years in a Level I trauma center. I schedule a team of 20, train new graduates and helped write our ventilator weaning and high-flow protocols." },
    ],
    bullets: [
      { skill: "Ventilators", weak: "Took care of vents", strong: "Managed mechanical ventilation for up to 8 ICU patients a shift, adjusting settings from ABG results" },
      { skill: "Weaning", weak: "Helped wean patients", strong: "Ran daily spontaneous breathing trials with nursing under the ventilator weaning protocol" },
      { skill: "Codes", weak: "Went to codes", strong: "Responded to code blues and rapid responses, managed the airway and assisted with intubation" },
      { skill: "Noninvasive", weak: "Set up BiPAP", strong: "Set up and titrated BiPAP, CPAP and high-flow nasal cannula and trained 12 nurses on its alarms" },
      { skill: "Protocols", weak: "Followed protocols", strong: "Used the RT-driven protocol to stop unneeded treatments, cutting scheduled nebulizers on my units by about 20%" },
      { skill: "Education", weak: "Taught patients", strong: "Taught inhaler technique and home oxygen safety to COPD and asthma patients before discharge" },
    ],
    keywords: [
      "Mechanical ventilation", "Ventilator weaning", "ABG analysis", "Airway management", "Noninvasive ventilation", "BiPAP", "CPAP",
      "High-flow nasal cannula", "Oxygen therapy", "Aerosol therapy", "Airway clearance", "Code blue", "Rapid response", "Patient education",
      "RRT (NBRC)", "Respiratory therapist license", "ACLS", "BLS",
    ],
    keywordSort: {
      tools: ["BiPAP", "CPAP", "High-flow nasal cannula"],
      credentials: ["RRT (NBRC)", "Respiratory therapist license", "ACLS", "BLS"],
      soft: ["Patient education"],
    },
    tips: [
      { t: "Write the NBRC credential you hold", d: "CRT and RRT are both NBRC credentials, and RRT is the advanced one. Put yours in the headline, and add specialty credentials such as ACCS or NPS only if you've earned them." },
      { t: "Name your state license", d: "Respiratory therapists need a state license in nearly every state. List the state and license by name next to your NBRC credential." },
      { t: "Give your unit and census", d: "\"Up to 8 ventilated ICU patients a shift\" or \"25–30 floor patients\" tells a manager your workload in one line." },
      { t: "List devices and modes", d: "Ventilators, BiPAP, CPAP and high-flow nasal cannula are common screening terms. Name the ones you set up and manage." },
      { t: "Show protocol and team work", d: "Weaning trials with nursing, RT-driven protocols and code response show you work as part of the care team, not just from an order sheet." },
    ],
    faqs: [
      { q: "What's the difference between CRT and RRT?", a: "Both are credentials from the National Board for Respiratory Care (NBRC). Passing the Therapist Multiple-Choice exam at the lower cut score earns the CRT; the RRT is the advanced credential. The NBRC has announced exam changes starting in 2027, so check nbrc.org for the current path." },
      { q: "Should I list ACLS, PALS and NRP?", a: "Yes, list the life support certifications you hold and keep current. Adult ICU roles usually ask for ACLS; neonatal and pediatric roles often ask for NRP and PALS." },
      { q: "How should a new graduate respiratory therapist write a resume?", a: "Lead with your CoARC-accredited program, NBRC credential or exam date and license status. List clinical rotations by unit, with the skills you performed such as ventilator checks, ABGs and aerosol therapy." },
      { q: "Should I mention pulmonary function testing?", a: "Yes, if you run PFTs. It's a separate skill set that outpatient and pulmonary lab jobs look for. Name the tests you perform." },
      { q: "How long should a respiratory therapist resume be?", a: "One page for most therapists. Put your credential and license at the top, then units, patient load and two or three bullets on ventilators, codes and protocols." },
    ],
    related: ["registered-nurse", "emt", "radiologic-technologist", "licensed-practical-nurse"],
  },
  {
    slug: "surgical-technologist",
    role: "Surgical Technologist",
    group: "Healthcare",
    level: "Experienced · 5 years",
    intro:
      "A surgical technologist resume that shows a clean sterile field, accurate counts and a scrub who anticipates the surgeon — with the CST credential and specialty keywords OR managers look for.",
    resume: {
      name: "Tasha Greene",
      headline: "Certified Surgical Technologist, CST",
      contact: "Nashville, TN · tasha.greene@email.com · (615) 555-0157",
      summary:
        "Certified surgical technologist with 5 years in hospital ORs and an ambulatory surgery center. I scrub general, orthopedic and robotic-assisted cases, keep the sterile field tight and have the next instrument ready before the surgeon asks.",
      jobs: [
        {
          title: "Surgical Technologist",
          company: "Stones Ferry Medical Center",
          dates: "Mar 2022 – Present",
          bullets: [
            "Scrub 4–6 cases a day in general, orthopedic, gynecologic and robotic-assisted surgery, including total joints and laparoscopic procedures",
            "Set up the back table and Mayo stand from surgeon preference cards, and perform sponge, sharps and instrument counts with the circulating nurse",
            "Updated 40+ surgeon preference cards with the OR team, cutting supplies opened but not used on those cases",
            "Take call for trauma and emergency cases, and pass instruments, handle specimens and maintain sterile technique through each case",
          ],
        },
        {
          title: "Surgical Technologist",
          company: "Old Hickory Surgery Center",
          dates: "Aug 2020 – Feb 2022",
          bullets: [
            "Scrubbed 6–8 outpatient cases a day in orthopedics, ENT and general surgery",
            "Cut average room turnover from 25 to 18 minutes by opening the next case's supplies in a set order with the circulator",
            "Checked instrument trays from sterile processing and flagged missing or damaged instruments before each case",
          ],
        },
      ],
      education:
        "A.A.S. Surgical Technology, Davidson Bend Community College (CAAHEP-accredited program), 2020 · CST (NBSTSA) · BLS",
      skills: [
        "Sterile technique", "Aseptic technique", "Surgical counts", "Back table setup", "Preference cards", "Instrumentation",
        "Robotic-assisted surgery", "Laparoscopic surgery", "Orthopedic surgery", "Specimen handling", "Room turnover", "Time-out", "Patient safety",
      ],
    },
    whyItWorks:
      "The CST credential is in the headline, each job gives case volume and specialties, and the bullets show what keeps an OR safe and on time: counts, sterile technique, preference cards and turnover.",
    summaries: [
      { level: "New graduate", text: "New graduate of a CAAHEP-accredited surgical technology program with clinical cases in general, orthopedic and OB surgery. CST (NBSTSA) certified and BLS trained." },
      { level: "Experienced", text: "Certified surgical technologist with 5 years in hospital ORs and an ambulatory surgery center. I scrub 4–6 cases a day, including robotic-assisted and total joint cases." },
      { level: "Senior", text: "Lead surgical technologist with 12 years in a Level I trauma center. I precept students, run our orthopedic service line's preference cards and scrub complex spine and trauma cases." },
    ],
    bullets: [
      { skill: "Case volume", weak: "Scrubbed in on surgeries", strong: "Scrubbed 4–6 cases a day in general, orthopedic, gynecologic and robotic-assisted surgery" },
      { skill: "Counts", weak: "Helped with counts", strong: "Performed sponge, sharps and instrument counts with the circulating nurse on every case" },
      { skill: "Preference cards", weak: "Updated cards", strong: "Updated 40+ surgeon preference cards, cutting supplies opened but not used" },
      { skill: "Turnover", weak: "Helped turn rooms over", strong: "Cut average room turnover from 25 to 18 minutes by opening supplies in a set order" },
      { skill: "Trauma", weak: "Took call", strong: "Took call for trauma and emergency cases and maintained sterile technique through each one" },
      { skill: "Instruments", weak: "Checked trays", strong: "Checked trays from sterile processing and flagged missing or damaged instruments before each case" },
    ],
    keywords: [
      "Sterile technique", "Aseptic technique", "Surgical counts", "Back table setup", "Preference cards", "Instrumentation",
      "Robotic-assisted surgery", "Laparoscopic surgery", "Orthopedic surgery", "General surgery", "Specimen handling", "Room turnover",
      "Sterile processing", "Time-out", "Patient safety", "CST (NBSTSA)", "BLS",
    ],
    keywordSort: {
      credentials: ["CST (NBSTSA)", "BLS"],
    },
    tips: [
      { t: "Name the credential and who issued it", d: "CST comes from the National Board of Surgical Technology and Surgical Assisting (NBSTSA). Write CST in your headline and list NBSTSA next to it." },
      { t: "List your specialties", d: "General, orthopedic, robotic-assisted, cardiac, neuro and OB cases need different instruments. Say which ones you scrub most and which you can cover." },
      { t: "Give a case volume", d: "\"4–6 cases a day\" or \"6–8 outpatient cases\" shows a manager your pace." },
      { t: "Show safety habits", d: "Counts, time-outs and sterile technique are what OR leaders worry about most. Put them in a bullet, not just your skills list." },
      { t: "Check your state's rules", d: "Some states require surgical technologists to be certified or registered. If yours does, list that credential too." },
    ],
    faqs: [
      { q: "How do I become eligible for the CST exam?", a: "The NBSTSA's main route is graduating from a surgical technology program accredited by CAAHEP or ABHES. It also lists routes for military-trained technologists and for recertification. Check nbstsa.org for current eligibility." },
      { q: "Should I list robotic surgery experience?", a: "Yes, if you scrub robotic-assisted cases. Say which service lines and what you do, such as draping and docking, so it's clear how much you've done." },
      { q: "What should a new surgical tech put on a resume?", a: "Your accredited program, CST status and clinical cases: the specialties you rotated through and whether you scrubbed first or assisted. Add BLS and any sterile processing experience." },
      { q: "Should I include call experience?", a: "Yes. Taking trauma and emergency call shows you can scrub cases you didn't plan for. Many hospital jobs require it." },
      { q: "How long should a surgical technologist resume be?", a: "One page. CST at the top, then one or two jobs with case volume, specialties and bullets on counts, sterile technique and turnover." },
    ],
    related: ["registered-nurse", "certified-nursing-assistant", "radiologic-technologist", "medical-assistant"],
  },
  {
    slug: "veterinary-technician",
    role: "Veterinary Technician",
    group: "Healthcare",
    level: "Mid-level · 4 years experience",
    intro:
      "A veterinary technician resume that shows safe anesthesia, solid lab work and calm patient handling — with the VTNE, state credential and clinical keywords animal hospitals look for.",
    resume: {
      name: "Emily Novak",
      headline: "Licensed Veterinary Technician, LVT",
      contact: "Buffalo, NY · emily.novak@email.com · (716) 555-0184",
      summary:
        "Licensed veterinary technician with 4 years in small animal general practice and emergency care. I run anesthesia, dentistry and in-house lab work, handle anxious patients gently and send clients home knowing exactly what to do next.",
      jobs: [
        {
          title: "Veterinary Technician",
          company: "Elmwood Village Animal Hospital",
          dates: "Apr 2023 – Present",
          bullets: [
            "Induce and monitor anesthesia for 5–7 surgical and dental patients a day, recording heart rate, blood pressure, SpO2 and ETCO2 every 5 minutes",
            "Perform dental cleanings and take full-mouth dental radiographs for the veterinarian to diagnose and treat",
            "Run in-house lab work, including CBCs, chemistry panels, urinalysis, fecals and cytology prep, and flag abnormal results to the veterinarian",
            "Place IV catheters, give medications and fluids as ordered and go over discharge instructions with clients",
          ],
        },
        {
          title: "Veterinary Technician",
          company: "Niagara Frontier Veterinary Emergency",
          dates: "Jun 2021 – Mar 2023",
          bullets: [
            "Triaged walk-in emergencies on overnight shifts and set up oxygen, IV access and monitoring for critical patients",
            "Assisted with CPR and trauma stabilization, and kept the crash cart checked and stocked at the start of every shift",
            "Monitored 8–12 hospitalized patients a night and updated treatment sheets and the medical record in Cornerstone",
          ],
        },
      ],
      education:
        "A.A.S. Veterinary Technology, Lake Erie State College (AVMA-accredited program), 2021 · VTNE passed · New York Licensed Veterinary Technician (LVT)",
      skills: [
        "Anesthesia monitoring", "Dental radiography", "Dental cleanings", "Laboratory diagnostics", "IV catheter placement", "Triage",
        "Emergency and critical care", "Patient restraint", "Client education", "Cornerstone", "Surgical assisting", "Medication administration",
      ],
    },
    whyItWorks:
      "The state credential is in the headline, the VTNE and accredited program are listed, and the bullets cover the skills a practice relies on a credentialed technician for: anesthesia, dentistry, lab work and emergency care.",
    summaries: [
      { level: "New graduate", text: "New graduate of an AVMA-accredited veterinary technology program with externships in general practice and emergency care. VTNE passed and state credential application in progress." },
      { level: "Mid level", text: "Licensed veterinary technician with 4 years in general practice and emergency care. I monitor anesthesia for 5–7 patients a day and run the hospital's in-house lab work." },
      { level: "Senior", text: "Lead veterinary technician with 11 years in a multi-doctor hospital. I train new technicians and assistants, run the surgical suite and keep our controlled drug logs audit-ready." },
    ],
    bullets: [
      { skill: "Anesthesia", weak: "Watched patients in surgery", strong: "Monitored anesthesia for 5–7 patients a day, recording vitals every 5 minutes" },
      { skill: "Dentistry", weak: "Helped with dentals", strong: "Performed dental cleanings and took full-mouth dental radiographs for the veterinarian" },
      { skill: "Lab work", weak: "Ran lab tests", strong: "Ran CBCs, chemistry panels, urinalysis and fecals in-house and flagged abnormal results" },
      { skill: "Emergency", weak: "Worked in the ER", strong: "Triaged overnight emergencies and set up oxygen, IV access and monitoring for critical patients" },
      { skill: "Hospitalized care", weak: "Took care of patients", strong: "Monitored 8–12 hospitalized patients a night and kept treatment sheets current" },
      { skill: "Client education", weak: "Talked to owners", strong: "Went over discharge instructions with clients so they knew medications, restrictions and warning signs" },
    ],
    keywords: [
      "Anesthesia monitoring", "Surgical assisting", "Dental radiography", "Dental cleanings", "Laboratory diagnostics", "IV catheter placement",
      "Medication administration", "Triage", "Emergency and critical care", "CPR", "Patient restraint", "Client education", "Cornerstone",
      "VTNE", "Licensed Veterinary Technician (LVT)", "AVMA-accredited program",
    ],
    keywordSort: {
      tools: ["Cornerstone"],
      credentials: ["VTNE", "Licensed Veterinary Technician (LVT)", "AVMA-accredited program"],
      soft: ["Client education"],
    },
    tips: [
      { t: "Use your state's title", d: "Depending on the state, the credential may be LVT, RVT or CVT. Write the exact title your state issues, since some states protect these titles by law." },
      { t: "List the VTNE and your program", d: "Most states require a passing VTNE score, and many require graduation from an AVMA-accredited program. Put both near your credential." },
      { t: "Show the skills only a technician does", d: "Anesthesia monitoring, dental radiographs, catheter placement and lab work separate a credentialed technician from an assistant." },
      { t: "Give your practice type and pace", d: "General practice, emergency, specialty or shelter medicine each need different skills. Add patient numbers where you can." },
      { t: "Name the practice software", d: "Cornerstone, AVImark and ezyVet are common. List the one you use for records and treatment sheets." },
    ],
    faqs: [
      { q: "What's the difference between LVT, RVT and CVT?", a: "They're state titles for a credentialed veterinary technician: licensed, registered or certified. Which one you hold depends on the state. The American Association of Veterinary State Boards (AAVSB) runs the VTNE, but the credential itself comes from your state." },
      { q: "Should I list the VTNE on my resume?", a: "Yes. Write that you passed the Veterinary Technician National Examination, along with your state credential. A practice hiring across state lines will want to know you can transfer your score." },
      { q: "How should a new veterinary technician write a resume?", a: "Lead with your AVMA-accredited program, VTNE status and state credential status. List externships like jobs, with the practice type and the skills you performed, such as anesthesia monitoring, venipuncture and dental radiographs." },
      { q: "Should I mention specialty interests?", a: "Yes, briefly, if they fit the job, such as emergency and critical care, dentistry or anesthesia. Only list a Veterinary Technician Specialist (VTS) credential if you've earned it." },
      { q: "How long should a veterinary technician resume be?", a: "One page. Credential at the top, then one or two jobs with practice type, patient volume and bullets on anesthesia, dentistry, lab work and client care." },
    ],
    related: ["medical-laboratory-scientist", "medical-assistant", "phlebotomist", "receptionist"],
  },
  {
    slug: "medical-laboratory-scientist",
    role: "Medical Laboratory Scientist",
    group: "Healthcare",
    level: "Experienced · 6 years",
    intro:
      "A medical laboratory scientist resume that shows accurate results on time, solid quality control and blood bank skill — with the ASCP credential and lab keywords hospital laboratories screen for.",
    resume: {
      name: "Kevin Tran",
      headline: "Medical Laboratory Scientist, MLS(ASCP)CM",
      contact: "Minneapolis, MN · kevin.tran@email.com · (612) 555-0119",
      summary:
        "Certified medical laboratory scientist with 6 years in hospital core labs and an outpatient clinic lab. I rotate through chemistry, hematology, coagulation, urinalysis and blood bank, and I treat quality control as the part of the job that makes every result trustworthy.",
      jobs: [
        {
          title: "Medical Laboratory Scientist, Core Laboratory",
          company: "Minnehaha Falls Medical Center",
          dates: "Jan 2022 – Present",
          bullets: [
            "Run and verify chemistry, hematology, coagulation and urinalysis results for a 300-bed hospital on evening shift, including stat ED and ICU samples",
            "Perform ABO/Rh typing, antibody screens and crossmatching in blood bank and issue products during massive transfusion events",
            "Review daily QC with Westgard rules, troubleshoot analyzer failures and document corrective action before releasing patient results",
            "Helped validate a new coagulation analyzer, running precision, accuracy and reportable range studies for the lab director's sign-off",
            "Call critical values to nurses and providers with read-back and log each call in the LIS",
          ],
        },
        {
          title: "Medical Laboratory Scientist",
          company: "Lake Nokomis Clinic Laboratory",
          dates: "Jun 2020 – Dec 2021",
          bullets: [
            "Processed and tested 400+ outpatient samples a day across chemistry, hematology and urinalysis",
            "Cut average turnaround time for routine morning chemistry from 3 hours to under 2 by reorganizing the order of batch runs",
            "Kept maintenance logs and QC records ready for the lab's CAP inspection and trained 5 MLS students on hematology",
          ],
        },
      ],
      education:
        "B.S. Medical Laboratory Science, University of the North Star (NAACLS-accredited program), 2020 · MLS(ASCP)CM",
      skills: [
        "Clinical chemistry", "Hematology", "Coagulation", "Urinalysis", "Blood bank", "Immunohematology", "Quality control",
        "Westgard rules", "Method validation", "Instrument troubleshooting", "Critical values", "LIS", "CAP", "CLIA",
      ],
    },
    whyItWorks:
      "The credential is written the way ASCP issues it, the bullets name every department the scientist covers, and quality work — QC, validation, critical values, CAP readiness — gets as much space as test volume.",
    summaries: [
      { level: "New graduate", text: "New graduate of a NAACLS-accredited MLS program with clinical rotations in chemistry, hematology, microbiology and blood bank. MLS(ASCP) exam passed, comfortable with QC and LIS workflows." },
      { level: "Experienced", text: "Certified medical laboratory scientist with 6 years in hospital and clinic labs. I rotate through 5 core departments, including blood bank, and helped validate a new coagulation analyzer." },
      { level: "Senior", text: "Lead medical laboratory scientist with 13 years in a hospital lab. I run the QC program, lead instrument validations and prepare the department for CAP inspections." },
    ],
    bullets: [
      { skill: "Core lab", weak: "Ran lab tests", strong: "Ran and verified chemistry, hematology, coagulation and urinalysis results for a 300-bed hospital" },
      { skill: "Blood bank", weak: "Worked in blood bank", strong: "Performed ABO/Rh typing, antibody screens and crossmatches and issued products during massive transfusions" },
      { skill: "Quality control", weak: "Did QC", strong: "Reviewed daily QC with Westgard rules and documented corrective action before releasing results" },
      { skill: "Validation", weak: "Helped with a new analyzer", strong: "Ran precision, accuracy and reportable range studies to validate a new coagulation analyzer" },
      { skill: "Turnaround", weak: "Worked faster", strong: "Cut routine morning chemistry turnaround from 3 hours to under 2 by reorganizing batch runs" },
      { skill: "Critical values", weak: "Reported results", strong: "Called critical values to nurses and providers with read-back and logged each call in the LIS" },
    ],
    keywords: [
      "Clinical chemistry", "Hematology", "Coagulation", "Urinalysis", "Blood bank", "Immunohematology", "Crossmatching", "Quality control",
      "Westgard rules", "Method validation", "Instrument troubleshooting", "Critical values", "Turnaround time", "LIS", "CAP", "CLIA",
      "MLS(ASCP)CM",
    ],
    keywordSort: {
      tools: ["LIS"],
      credentials: ["MLS(ASCP)CM"],
    },
    tips: [
      { t: "Write the ASCP credential as issued", d: "ASCP's format is MLS(ASCP), with CM added for certificants in its Credential Maintenance Program. Put it in your headline exactly as it appears on your certificate." },
      { t: "Name every department you cover", d: "Chemistry, hematology, coagulation, urinalysis, microbiology and blood bank are separate benches. List the ones you're trained and signed off on." },
      { t: "Show quality, not just volume", d: "QC review, validations, critical value calls and inspection readiness are what lab managers trust you with." },
      { t: "Check state licensure", d: "A handful of states, including California, Florida and New York, license laboratory personnel. If you work in one, list your state license with your ASCP credential." },
      { t: "Mention the regulations you work under", d: "CLIA and CAP requirements shape every lab. A bullet on inspection readiness or documentation shows you know them." },
    ],
    faqs: [
      { q: "How do I list MLS(ASCP) on my resume?", a: "Write it as MLS(ASCP), followed by CM if you participate in ASCP's Credential Maintenance Program. Put it after your name in the headline and again with your education." },
      { q: "What's the difference between an MLS and an MLT?", a: "Both are ASCP Board of Certification credentials. The MLS route usually requires a bachelor's degree and an accredited MLS program; the MLT route usually requires an associate degree. List the one you hold, and if you're moving from MLT to MLS, say so in your summary." },
      { q: "How should a new graduate MLS write a resume?", a: "Lead with your NAACLS-accredited program, ASCP exam status and clinical rotations. List each department with the instruments and tests you ran under supervision." },
      { q: "Should I list the analyzers I've used?", a: "Yes, by type or by manufacturer and model if you know them well. Labs that use the same platforms can train you faster. Keep it to the ones you've run independently." },
      { q: "How long should a medical laboratory scientist resume be?", a: "One page for most scientists. Two pages is fine for lead, supervisor or specialist roles with validation, teaching or inspection work to show." },
    ],
    related: ["phlebotomist", "radiologic-technologist", "registered-nurse", "pharmacist"],
  },

  // --------------------------------------------------------- People & service
  {
    slug: "social-worker",
    role: "Social Worker",
    group: "People & service",
    level: "Mid-level · 5 years experience",
    intro:
      "A social worker resume that shows assessment, safe discharge planning and real connections to community resources — with the MSW, license and practice keywords hospitals and agencies screen for.",
    resume: {
      name: "Angela Brooks",
      headline: "Medical Social Worker, LMSW",
      contact: "Rochester, NY · angela.brooks@email.com · (585) 555-0147",
      summary:
        "Licensed master social worker with 5 years in hospital and community settings. I complete psychosocial assessments, plan safe discharges for patients with complex needs and connect families with the benefits and services that keep them stable at home.",
      jobs: [
        {
          title: "Medical Social Worker",
          company: "Genesee Valley Hospital",
          dates: "Mar 2023 – Present",
          bullets: [
            "Carry a caseload of 18–22 patients on medical-surgical units, completing psychosocial assessments and discharge plans with the care team",
            "Arrange discharges to skilled nursing, home health, hospice and shelters, and help patients apply for Medicaid and community benefits",
            "Provide crisis intervention and safety planning for patients disclosing intimate partner violence, and file reports as a mandated reporter when required",
            "Started a weekly huddle with case management for patients without a safe discharge plan; average days from referral to placement on my units fell from 6 to 4",
          ],
        },
        {
          title: "Social Worker",
          company: "Lilac City Family Services",
          dates: "Aug 2021 – Feb 2023",
          bullets: [
            "Provided case management and care coordination for 30 families with children at risk of out-of-home placement",
            "Completed home visits, needs assessments and service plans using motivational interviewing and a trauma-informed approach",
            "Built a resource guide of 60+ local food, housing and child care programs that the whole team used for referrals",
          ],
        },
      ],
      education:
        "Master of Social Work (MSW), Finger Lakes University (CSWE-accredited), 2021 · LMSW (New York) · ASWB Masters exam",
      skills: [
        "Psychosocial assessment", "Discharge planning", "Case management", "Care coordination", "Crisis intervention", "Safety planning",
        "Motivational interviewing", "Trauma-informed care", "Community resources", "Medicaid applications", "Documentation", "Epic",
      ],
    },
    whyItWorks:
      "The license is in the headline and the MSW, accreditation and ASWB exam are listed, while the bullets show caseload, settings and outcomes — safe discharges, faster placements, families connected to help.",
    summaries: [
      { level: "New graduate", text: "New MSW graduate from a CSWE-accredited program with field placements in a hospital and a family services agency. ASWB Masters exam scheduled, with experience in psychosocial assessment and care coordination." },
      { level: "Mid level", text: "Licensed master social worker with 5 years in hospital and community settings. I carry 18–22 patients, plan complex discharges and cut days from referral to placement on my units from 6 to 4." },
      { level: "Senior", text: "Licensed clinical social worker with 12 years in health care. I supervise a team of 6 social workers, provide clinical supervision toward licensure and lead our hospital's complex discharge committee." },
    ],
    bullets: [
      { skill: "Caseload", weak: "Worked with patients", strong: "Carried 18–22 patients on medical-surgical units with psychosocial assessments and discharge plans" },
      { skill: "Discharge", weak: "Helped patients leave", strong: "Arranged discharges to skilled nursing, home health, hospice and shelters and helped with Medicaid applications" },
      { skill: "Outcomes", weak: "Sped up placements", strong: "Cut average days from referral to placement from 6 to 4 with a weekly case management huddle" },
      { skill: "Crisis", weak: "Handled crises", strong: "Provided crisis intervention and safety planning for patients disclosing intimate partner violence" },
      { skill: "Community", weak: "Did case management", strong: "Coordinated care for 30 families at risk of out-of-home placement with home visits and service plans" },
      { skill: "Resources", weak: "Made referrals", strong: "Built a resource guide of 60+ local programs that the whole team used for referrals" },
    ],
    keywords: [
      "Psychosocial assessment", "Discharge planning", "Case management", "Care coordination", "Crisis intervention", "Safety planning",
      "Motivational interviewing", "Trauma-informed", "Community resources", "Home visits", "Mandated reporter", "Medicaid", "Documentation",
      "Epic", "MSW", "LMSW", "ASWB",
    ],
    keywordSort: {
      tools: ["Epic"],
      credentials: ["MSW", "LMSW", "ASWB"],
      soft: ["Motivational interviewing"],
    },
    tips: [
      { t: "Write your license the way your state does", d: "License titles differ by state — LMSW, LCSW, LISW, LSW and others. Use your state's exact title, and write \"license pending\" if you've applied but haven't received it." },
      { t: "List the MSW and accreditation", d: "Most licenses require a degree from a CSWE-accredited program. Put the degree, school and year with your license." },
      { t: "Give setting and caseload", d: "Hospital, child welfare, schools, behavioral health and hospice are different jobs. Say where you work and how many clients you carry." },
      { t: "Show outcomes you can stand behind", d: "Safe discharges, faster placements or families connected to benefits show what changed because of your work. Keep client details out." },
      { t: "Name your methods", d: "Motivational interviewing, trauma-informed care and crisis intervention are common screening terms. Use the ones you practice." },
    ],
    faqs: [
      { q: "What's the difference between an LMSW and an LCSW?", a: "In states that use these titles, the LMSW is the master's-level license and the LCSW is the clinical license, which usually requires supervised clinical experience and the ASWB Clinical exam. Titles and rules differ by state, so check your state board." },
      { q: "Which ASWB exam should I list?", a: "List the one you passed. The Association of Social Work Boards (ASWB) offers Bachelors, Masters, Advanced Generalist and Clinical exams, and your state decides which one a license requires." },
      { q: "How do I list field placements as a new MSW?", a: "List each placement like a job: the agency type, hours, the populations you worked with and what you did, such as assessments, groups or care coordination." },
      { q: "How do I keep client information private on a resume?", a: "Describe the population and the work in general terms — \"families at risk of out-of-home placement\" — and never include names, case details or anything that could identify a client." },
      { q: "How long should a social worker resume be?", a: "One page for most social workers. Two pages is fine for clinical, supervisory or program roles with groups, trainings or research to show." },
    ],
    related: ["school-counselor", "home-health-aide", "caregiver", "registered-nurse"],
  },
  {
    slug: "police-officer",
    role: "Police Officer",
    group: "People & service",
    level: "Experienced · 4 years on patrol",
    intro:
      "A police officer resume that shows safe, well-documented patrol work, de-escalation and community ties — with the state license, training and patrol keywords departments look for.",
    resume: {
      name: "Andre Wallace",
      headline: "Police Officer, TCOLE Peace Officer License",
      contact: "Austin, TX · andre.wallace@email.com · (512) 555-0152",
      summary:
        "Licensed Texas peace officer with 4 years on patrol and 2 years in county detention before that. I handle calls calmly, write reports that hold up in court and know the neighborhoods on my beat by name.",
      jobs: [
        {
          title: "Patrol Officer",
          company: "Pecan Hollow Police Department",
          dates: "Feb 2022 – Present",
          bullets: [
            "Respond to 10–15 calls for service a shift, including disturbances, crashes, mental health crises and in-progress crimes",
            "Use de-escalation and crisis intervention training on mental health calls, connecting people with the county mobile crisis team instead of jail where appropriate",
            "Write incident and arrest reports in the RMS before the end of each shift and review body-worn camera footage for accuracy",
            "Conduct traffic enforcement and DWI investigations using standardized field sobriety testing (SFST); made 35 DWI arrests in 2025",
            "Joined 12 neighborhood association meetings a year as a community policing liaison for my beat",
          ],
        },
        {
          title: "Detention Officer",
          company: "Lone Oak County Sheriff's Office",
          dates: "Jun 2019 – Jul 2021",
          bullets: [
            "Supervised housing units of up to 48 inmates, ran headcounts and searches and kept logs for every shift",
            "Booked and processed new arrests, including property, fingerprints and classification paperwork",
            "Defused conflicts between inmates with verbal de-escalation; used force only within policy and documented each incident",
          ],
        },
      ],
      education:
        "Basic Peace Officer Course, Hill Country Regional Police Academy, 2021 · TCOLE Peace Officer License · TCOLE County Jailer License · Crisis Intervention Training · SFST · A.A.S. Criminal Justice, Lone Oak College, 2019 · CPR",
      skills: [
        "Patrol operations", "Community policing", "De-escalation", "Crisis intervention", "Report writing", "Traffic enforcement", "DWI investigations",
        "SFST", "Body-worn camera", "Evidence collection", "Firearms qualification", "Defensive tactics", "Spanish (conversational)",
      ],
    },
    whyItWorks:
      "The state license and academy are named plainly, call volume and report habits are in the first bullets, and de-escalation and community work sit next to enforcement, which is the balance most departments now hire for.",
    summaries: [
      { level: "Entry level", text: "Recent police academy graduate with a state peace officer license and 2 years as a detention officer. Trained in de-escalation, defensive tactics and report writing, and ready for field training." },
      { level: "Experienced", text: "Licensed peace officer with 4 years on patrol. I answer 10–15 calls a shift, file reports before shift end and serve as a community policing liaison for my beat." },
      { level: "Senior", text: "Patrol sergeant with 12 years of service. I supervise a squad of 8 officers, serve as a field training officer and lead our department's crisis intervention team training." },
    ],
    bullets: [
      { skill: "Patrol", weak: "Answered calls", strong: "Responded to 10–15 calls for service a shift, from disturbances to mental health crises" },
      { skill: "De-escalation", weak: "Calmed people down", strong: "Used crisis intervention training to connect people in crisis with the county mobile crisis team" },
      { skill: "Report writing", weak: "Wrote reports", strong: "Filed incident and arrest reports in the RMS before shift end and checked them against body-worn camera footage" },
      { skill: "Traffic", weak: "Did traffic stops", strong: "Made 35 DWI arrests in one year using standardized field sobriety testing (SFST)" },
      { skill: "Community", weak: "Did community policing", strong: "Attended 12 neighborhood association meetings a year as my beat's community policing liaison" },
      { skill: "Detention", weak: "Worked in the jail", strong: "Supervised housing units of up to 48 inmates and documented every use-of-force incident within policy" },
    ],
    keywords: [
      "Patrol", "Community policing", "De-escalation", "Crisis intervention", "Report writing", "Traffic enforcement", "DWI investigations",
      "SFST", "Body-worn camera", "Evidence collection", "Firearms qualification", "Defensive tactics", "Calls for service", "RMS",
      "Peace Officer License", "Basic Peace Officer Course", "CPR",
    ],
    keywordSort: {
      tools: ["Body-worn camera", "RMS"],
      credentials: ["Peace Officer License", "Basic Peace Officer Course", "CPR"],
      soft: ["De-escalation"],
    },
    tips: [
      { t: "Name your state's certification exactly", d: "Each state has its own Peace Officer Standards and Training (POST) agency and title. In Texas it's the TCOLE Peace Officer License; elsewhere it may be a POST certificate. Use the official name." },
      { t: "Give call volume and assignment", d: "Calls for service per shift and your assignment — patrol, traffic, school resource — tell a hiring board what you've handled." },
      { t: "Show de-escalation and community work", d: "Crisis intervention, mental health calls and neighborhood meetings belong next to arrests and enforcement numbers." },
      { t: "Highlight report quality", d: "Departments care about reports that are accurate, on time and match the camera footage. Say how you make sure yours do." },
      { t: "Keep it factual and public", d: "Don't include case details, suspect information or anything confidential. Describe the type of work and the result in general terms." },
    ],
    faqs: [
      { q: "What credentials should a police officer list?", a: "Your state POST certification or license, the academy and year, and in-service training that fits the job, such as crisis intervention, SFST or field training officer. Names differ by state, so use your state's official titles." },
      { q: "Should I list my firearms qualification?", a: "You can list that you're current on qualification without scores. Many departments ask about it on the application anyway." },
      { q: "How do I apply as a lateral officer from another state?", a: "Lead with your current certification and years of service, and check the new state's POST rules. Many states have a separate process, such as a supplemental course and licensing exam, for officers licensed elsewhere." },
      { q: "Should I mention a second language?", a: "Yes. Spanish or another language spoken in the community is a real asset, and some departments offer incentive pay for it. Be honest about your level." },
      { q: "How long should a police officer resume be?", a: "One page for most officers. Two pages is fine for supervisors and specialists with many trainings, assignments and commendations to show." },
    ],
    related: ["security-officer", "firefighter", "emt", "truck-driver"],
  },
  {
    slug: "firefighter",
    role: "Firefighter",
    group: "People & service",
    level: "Experienced · 5 years on the line",
    intro:
      "A firefighter resume that shows fireground skill, steady EMS care and a crew that can count on you — with the Firefighter I and II, EMT and incident command keywords fire departments screen for.",
    resume: {
      name: "Ryan Kowalski",
      headline: "Firefighter/EMT",
      contact: "Mesa, AZ · ryan.kowalski@email.com · (480) 555-0166",
      summary:
        "Firefighter/EMT with 5 years on an engine company and 2 years on a 911 ambulance before that. I work fireground and EMS calls with the same care, keep the rig ready and spend my off-call time training and teaching fire safety in schools.",
      jobs: [
        {
          title: "Firefighter/EMT",
          company: "Saguaro Flats Fire Department",
          dates: "Mar 2021 – Present",
          bullets: [
            "Respond to 12–18 calls per 24-hour shift on a busy engine company; most are EMS calls, with structure fires, vehicle crashes and hazmat calls",
            "Perform fire suppression, search and rescue, forcible entry and ventilation on interior attack crews wearing SCBA",
            "Operate hydraulic rescue tools for vehicle extrication and provide BLS patient care until transport",
            "Complete daily apparatus, SCBA and equipment checks, and taught fire safety and hands-only CPR to 1,200+ students in school visits",
          ],
        },
        {
          title: "EMT",
          company: "Copper Basin Ambulance",
          dates: "Jun 2019 – Feb 2021",
          bullets: [
            "Ran 8–12 calls per shift on a BLS ambulance in a 911 system and gave structured handoffs to emergency department staff",
            "Completed ePCR documentation for every call before going back in service",
            "Moved patients safely with stair chairs and stretchers, with no lifting injuries to me or my partners",
          ],
        },
      ],
      education:
        "A.A.S. Fire Science, Superstition Mountain Community College, 2020 · Firefighter I and II (NFPA 1001, IFSAC) · EMT (NREMT) · Hazardous Materials Operations · ICS-100, ICS-200 and IS-700 (FEMA) · CPAT",
      skills: [
        "Fire suppression", "Search and rescue", "Forcible entry", "Ventilation", "SCBA", "Vehicle extrication", "Hydraulic rescue tools",
        "BLS patient care", "Hazmat operations", "Incident Command System", "Apparatus checks", "Public education",
      ],
    },
    whyItWorks:
      "The certifications are listed with the standards behind them, call volume and the EMS share are stated honestly, and the bullets cover fireground work, EMS care, readiness and community education — the full job, not just the fire part.",
    summaries: [
      { level: "Entry level", text: "Fire academy graduate with Firefighter I and II, EMT (NREMT) and Hazardous Materials Operations. CPAT passed and 2 years of 911 ambulance experience." },
      { level: "Experienced", text: "Firefighter/EMT with 5 years on an engine company. I run 12–18 calls per 24-hour shift, work interior attack and extrication, and teach fire safety in schools." },
      { level: "Senior", text: "Fire engineer with 12 years of service. I drive and pump the engine, act as company officer when needed and lead my shift's hose and ladder training." },
    ],
    bullets: [
      { skill: "Call volume", weak: "Went on calls", strong: "Responded to 12–18 calls per 24-hour shift, mostly EMS, plus structure fires, crashes and hazmat calls" },
      { skill: "Fireground", weak: "Fought fires", strong: "Performed fire suppression, search and rescue, forcible entry and ventilation on interior attack crews" },
      { skill: "Rescue", weak: "Did extrications", strong: "Operated hydraulic rescue tools for vehicle extrication and gave BLS care until transport" },
      { skill: "Readiness", weak: "Checked equipment", strong: "Completed daily apparatus, SCBA and equipment checks at the start of every shift" },
      { skill: "Community", weak: "Did school visits", strong: "Taught fire safety and hands-only CPR to 1,200+ students in school visits" },
      { skill: "EMS", weak: "Worked on an ambulance", strong: "Ran 8–12 calls per shift on a 911 BLS ambulance and completed every ePCR before going back in service" },
    ],
    keywords: [
      "Fire suppression", "Search and rescue", "Forcible entry", "Ventilation", "SCBA", "Vehicle extrication", "Hydraulic rescue tools",
      "BLS patient care", "Hazmat operations", "Incident Command System", "Apparatus checks", "Public education", "ePCR",
      "Firefighter I and II", "EMT (NREMT)", "CPAT",
    ],
    keywordSort: {
      tools: ["SCBA", "Hydraulic rescue tools", "ePCR"],
      credentials: ["Firefighter I and II", "EMT (NREMT)", "CPAT"],
      soft: ["Public education"],
    },
    tips: [
      { t: "List certifications with the standard behind them", d: "Firefighter I and II are built on NFPA professional qualification standards and are usually issued by your state with IFSAC or Pro Board accreditation. Write who issued yours." },
      { t: "Be honest about the call mix", d: "Most calls in many departments are EMS. Saying so, with your volume, shows you understand the job." },
      { t: "Show EMS as a real skill", d: "Your EMT or paramedic certification, call volume and handoffs matter as much as fireground work to most departments." },
      { t: "Include incident command training", d: "ICS-100, ICS-200 and IS-700 from FEMA are common requirements. List the courses you've completed." },
      { t: "Add community work", d: "School visits, smoke alarm installs and public education show the side of the job that builds trust with the community." },
    ],
    faqs: [
      { q: "How should I list Firefighter I and II?", a: "Name the level, the issuing agency and the accreditation, such as \"Firefighter I and II, state fire training, IFSAC.\" The National Fire Protection Association (NFPA) has folded NFPA 1001 into a consolidated standard, NFPA 1010, so newer certificates may cite that instead." },
      { q: "Do firefighters need EMT certification?", a: "Many departments require EMT at hire or within a set time after, and some require paramedic. List your National Registry and state EMS credentials with expiration dates if the posting asks." },
      { q: "Should I include the CPAT?", a: "Yes, if you've passed it and it's current for the department you're applying to. Some departments use a different physical ability test, so check the posting." },
      { q: "What should a new firefighter put on a resume?", a: "Your academy, certifications, EMT and any ride-alongs, volunteer firefighting, wildland work or EMS jobs. Jobs that show teamwork and staying calm under pressure count too." },
      { q: "How long should a firefighter resume be?", a: "One page for most firefighters. Put certifications near the top, then one or two jobs with call volume and the skills you use most." },
    ],
    related: ["emt", "police-officer", "security-officer", "truck-driver"],
  },
  {
    slug: "security-officer",
    role: "Security Officer",
    group: "People & service",
    level: "Mid-level · 4 years experience",
    intro:
      "A security officer resume that shows alert patrols, clean incident reports and calm handling of people — with the state license and access control keywords security companies screen for.",
    resume: {
      name: "Jamal Price",
      headline: "Security Officer, California BSIS Guard Card",
      contact: "San Jose, CA · jamal.price@email.com · (408) 555-0171",
      summary:
        "Licensed security officer with 4 years at a corporate campus and a shopping center. I keep entrances secure, write clear incident reports and handle upset visitors calmly, so small problems don't turn into big ones.",
      jobs: [
        {
          title: "Security Officer",
          company: "Bayline Protective Services (corporate campus post)",
          dates: "Apr 2023 – Present",
          bullets: [
            "Staff the main lobby and run access control for a 3-building campus, checking badges and registering 80–100 visitors a day in the visitor management system",
            "Patrol buildings and parking structures on foot and by vehicle, checking doors, alarms and fire life safety equipment on each round",
            "Monitor CCTV and the access control system, respond to door-forced and door-held alarms and log each response",
            "Write incident reports the same shift; my supervisor uses them as examples for new officers' report training",
          ],
        },
        {
          title: "Security Officer",
          company: "Almaden Square Shopping Center",
          dates: "Jun 2021 – Mar 2023",
          bullets: [
            "Patrolled a 40-store open-air center and parking lots, assisting customers, store staff and police when called",
            "De-escalated disputes and removed trespassers following post orders, with no use-of-force incidents in 2 years",
            "Gave first aid and called 911 for medical emergencies, then met responders and directed them to the scene",
          ],
        },
      ],
      education: "High school diploma, Coyote Creek High School, 2020 · California BSIS Guard Card · CPR/AED and First Aid",
      skills: [
        "Access control", "Patrol", "CCTV monitoring", "Incident reports", "De-escalation", "Alarm response", "Visitor management",
        "Post orders", "Emergency response", "Fire life safety", "Report writing", "First aid", "Customer service", "Spanish (conversational)",
      ],
    },
    whyItWorks:
      "The state license is in the headline, the post types and size are clear, and the bullets show what a client site wants: controlled entrances, steady patrols, alarm response, good reports and calm people skills.",
    summaries: [
      { level: "Entry level", text: "Newly licensed security officer with a state guard card, CPR/AED and First Aid. Two years of retail customer service, comfortable on my feet and calm with upset customers." },
      { level: "Mid level", text: "Licensed security officer with 4 years at a corporate campus and a shopping center. I run lobby access control for 80–100 visitors a day and write same-shift incident reports." },
      { level: "Senior", text: "Security shift supervisor with 10 years in corporate and health care security. I lead a team of 9 officers, write post orders and train new hires on report writing and de-escalation." },
    ],
    bullets: [
      { skill: "Access control", weak: "Worked the front desk", strong: "Ran access control for a 3-building campus and registered 80–100 visitors a day" },
      { skill: "Patrol", weak: "Did rounds", strong: "Patrolled buildings and parking structures and checked doors, alarms and fire life safety equipment on each round" },
      { skill: "Alarms", weak: "Watched cameras", strong: "Monitored CCTV and the access control system and responded to door-forced and door-held alarms" },
      { skill: "Reports", weak: "Wrote reports", strong: "Wrote incident reports the same shift that my supervisor uses to train new officers" },
      { skill: "De-escalation", weak: "Handled problems", strong: "De-escalated disputes and removed trespassers per post orders, with no use-of-force incidents in 2 years" },
      { skill: "Emergencies", weak: "Helped in emergencies", strong: "Gave first aid, called 911 and directed responders to the scene" },
    ],
    keywords: [
      "Access control", "Patrol", "CCTV monitoring", "Incident reports", "De-escalation", "Alarm response", "Visitor management", "Post orders",
      "Emergency response", "Fire life safety", "Report writing", "First aid", "Customer service", "Guard card", "CPR/AED",
    ],
    keywordSort: {
      credentials: ["Guard card", "CPR/AED"],
      soft: ["De-escalation", "Customer service"],
    },
    tips: [
      { t: "Name your state license", d: "Most states license security officers, and names differ. In California it's a Guard Card from the Bureau of Security and Investigative Services (BSIS). Write your state's exact title." },
      { t: "Describe each post", d: "\"Corporate campus, 3 buildings\" or \"40-store shopping center\" tells an employer what kind of site you can cover." },
      { t: "Show report writing", d: "Clear, same-shift incident reports are one of the most valued skills in security. Put it in a bullet." },
      { t: "List permits only if you hold them", d: "Armed posts need extra permits, such as a firearms or baton permit. Only list ones that are current." },
      { t: "Balance service and safety", d: "Most of the job is helping people. A line about visitor service or calming disputes shows you can represent the client well." },
    ],
    faqs: [
      { q: "What license does a security officer need?", a: "Most states require a security officer license or registration, often called a guard card, with training and a background check. Rules vary by state, so check your state's licensing agency and list the credential by name." },
      { q: "Should I list my training hours?", a: "You can, if the posting asks or if you've done more than the minimum, such as extra courses in de-escalation or first aid. Otherwise your current license and certifications are enough." },
      { q: "How do I move from contract security to an in-house role?", a: "Show the sites you've covered, your report quality and any systems you use, such as access control and CCTV. In-house teams want officers who already know corporate or health care routines." },
      { q: "Should I include customer service jobs?", a: "Yes, especially early in your career. Retail, hospitality and front desk work show the people skills security jobs depend on." },
      { q: "How long should a security officer resume be?", a: "One page. License at the top, then one or two posts with the site type and bullets on access control, patrols, reports and handling people." },
    ],
    related: ["police-officer", "front-desk-agent", "customer-service-representative", "firefighter"],
  },

  // ----------------------------------------------------------------- Business
  {
    slug: "paralegal",
    role: "Paralegal",
    group: "Business",
    level: "Experienced · 6 years",
    intro:
      "A paralegal resume that shows organized discovery, accurate filings and deadlines that never slip — with the certification, legal research and e-discovery keywords law firms and legal departments search for.",
    resume: {
      name: "Rachel Kim",
      headline: "Litigation Paralegal, Certified Paralegal (CP)",
      contact: "Chicago, IL · rachel.kim@email.com · (312) 555-0193",
      summary:
        "Certified litigation paralegal with 6 years in insurance defense and civil litigation. I keep discovery organized, file accurately in state and federal courts and make sure the attorneys I support never miss a deadline.",
      jobs: [
        {
          title: "Litigation Paralegal",
          company: "Halsted & Monroe LLP",
          dates: "Apr 2022 – Present",
          bullets: [
            "Support 3 attorneys on 40+ active insurance defense and commercial cases, from pleadings through trial",
            "Draft discovery requests and responses, subpoenas and deposition notices for attorney review, and summarize deposition transcripts",
            "Manage document productions in Relativity, running searches, applying privilege tags and preparing privilege logs",
            "E-file in state court and federal court through CM/ECF, and docket every deadline in the firm's calendaring system the day it's set",
            "Built trial binders and exhibit lists for 4 trials and 2 arbitrations, and checked citations in briefs against the Bluebook",
          ],
        },
        {
          title: "Legal Assistant",
          company: "Lakeshore Claims Law Group",
          dates: "Jul 2019 – Mar 2022",
          bullets: [
            "Handled new-file intake and conflict checks, and set up matters in Clio for a 6-attorney practice",
            "Requested and organized medical and employment records, cutting the average wait for records from 6 weeks to 4 with a 2-week follow-up routine",
            "Ran legal research in Westlaw for attorneys and pulled case law and statutes into short research memos",
          ],
        },
      ],
      education:
        "B.A. Political Science, Prairie State University, 2018 · Paralegal Certificate, Lakefront College (ABA-approved program), 2019 · Certified Paralegal (CP), NALA",
      skills: [
        "Litigation support", "Discovery", "Document review", "Relativity", "E-filing", "CM/ECF", "Docketing", "Legal research", "Westlaw",
        "Deposition summaries", "Trial preparation", "Bluebook", "Clio", "Privilege logs", "Legal writing",
      ],
    },
    whyItWorks:
      "The certification and practice area lead, every bullet names a task attorneys rely on paralegals for, and the tools — Relativity, CM/ECF, Westlaw, Clio — are written exactly as they appear in job posts.",
    summaries: [
      { level: "Entry level", text: "Paralegal certificate graduate from an ABA-approved program with an internship in a civil litigation firm. Trained in legal research, Westlaw, e-filing and document review." },
      { level: "Experienced", text: "Certified litigation paralegal with 6 years in insurance defense and civil litigation. I support 3 attorneys on 40+ active cases and have prepared trial binders for 4 trials." },
      { level: "Senior", text: "Senior paralegal with 14 years in complex litigation. I manage e-discovery for multi-party cases, train junior paralegals and run the trial team's exhibit and witness preparation." },
    ],
    bullets: [
      { skill: "Caseload", weak: "Helped attorneys", strong: "Supported 3 attorneys on 40+ active insurance defense and commercial cases from pleadings through trial" },
      { skill: "Discovery", weak: "Worked on discovery", strong: "Drafted discovery requests and responses and summarized deposition transcripts for attorney review" },
      { skill: "E-discovery", weak: "Reviewed documents", strong: "Managed document productions in Relativity with privilege tags and privilege logs" },
      { skill: "Filing", weak: "Filed documents", strong: "E-filed in state and federal court through CM/ECF and docketed every deadline the day it was set" },
      { skill: "Trial", weak: "Helped with trials", strong: "Built trial binders and exhibit lists for 4 trials and 2 arbitrations" },
      { skill: "Records", weak: "Requested records", strong: "Cut the average wait for medical records from 6 weeks to 4 with a 2-week follow-up routine" },
    ],
    keywords: [
      "Litigation support", "Discovery", "Document review", "Relativity", "E-filing", "CM/ECF", "Docketing", "Legal research", "Westlaw",
      "Deposition summaries", "Trial preparation", "Privilege logs", "Bluebook", "Clio", "Conflict checks", "Legal writing", "Certified Paralegal (CP)",
    ],
    keywordSort: {
      tools: ["Relativity", "CM/ECF", "Westlaw", "Clio"],
      credentials: ["Certified Paralegal (CP)"],
    },
    tips: [
      { t: "Name the practice area first", d: "Litigation, corporate, real estate, immigration and family law are different jobs. Put yours in the headline." },
      { t: "Write certifications with their full names", d: "NALA awards the Certified Paralegal (CP). The National Federation of Paralegal Associations awards the CRP and RP through its PCCE and PACE exams. Spell out the organization, since \"NFPA\" can be confused with other groups." },
      { t: "List the legal tech by name", d: "Relativity, Westlaw, Lexis, CM/ECF, Clio and iManage are common screening terms. Name the ones you use." },
      { t: "Show deadlines and accuracy", d: "Docketing, filing and citation checks are where a paralegal saves attorneys from costly mistakes. Put one in a bullet." },
      { t: "Stay within your role", d: "Paralegals work under an attorney's supervision. Write \"drafted for attorney review\" rather than claiming you gave legal advice." },
    ],
    faqs: [
      { q: "Is paralegal certification required?", a: "Generally not. Most states don't require a paralegal certification, but many employers value one. Common national options are NALA's Certified Paralegal (CP) and the National Federation of Paralegal Associations' CRP and RP credentials." },
      { q: "What's the difference between NALA's CP and the RP?", a: "The CP is awarded by NALA after its Knowledge and Skills exams. The RP is awarded by the National Federation of Paralegal Associations after its Paralegal Advanced Competency Exam (PACE), which is aimed at experienced paralegals. Both list education and experience requirements." },
      { q: "Should I list my paralegal program?", a: "Yes. Name the school, the year and whether it's ABA-approved, which many firms look for." },
      { q: "How do I move from legal assistant to paralegal?", a: "Highlight the substantive work you've done, such as drafting, research, discovery or e-filing, and consider a paralegal certificate or certification to back it up." },
      { q: "How long should a paralegal resume be?", a: "One page for most paralegals. Two pages is fine for senior paralegals with long case lists, trials or e-discovery projects to show." },
    ],
    related: ["administrative-assistant", "executive-assistant", "office-manager", "business-analyst"],
  },
];
