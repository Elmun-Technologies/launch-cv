import type { ResumeExample } from "@/lib/resume-examples";

/** More role examples (see lib/resume-examples.ts for the shape and rules). */
export const MORE_EXAMPLES_C: ResumeExample[] = [
  // ---------------------------------------------------------------- Healthcare
  {
    slug: "phlebotomist",
    role: "Phlebotomist",
    group: "Healthcare",
    photo: { src: "/images/photos/role-phlebotomist.webp", alt: "Phlebotomist in gloves drawing blood from a donor's arm" },
    level: "Mid-level · 3 years experience",
    intro:
      "A phlebotomist resume that shows safe, accurate draws at volume — correct patient ID, clean labels and the right order of draw — with the certification and specimen keywords labs and hospitals screen for.",
    resume: {
      name: "Renee Castillo",
      headline: "Phlebotomy Technician, CPT (NHA)",
      contact: "San Antonio, TX · renee.castillo@email.com · (210) 555-0143",
      summary:
        "Certified phlebotomy technician with 3 years in a hospital and a high-volume patient service center. I draw adults, children and older patients calmly, label every tube at the chair and keep specimens moving to the lab on time.",
      jobs: [
        {
          title: "Phlebotomy Technician",
          company: "Mission Trail Diagnostic Laboratories",
          dates: "Jan 2025 – Present",
          bullets: [
            "Perform specimen collection for 45–60 patients a shift at a walk-in patient service center, including pediatric and geriatric draws",
            "Confirm identity with two patient identifiers and label every tube at the chair; no labeling rejections on my specimens in the last 12 months",
            "Follow the CLSI order of draw on multi-tube orders, then centrifuge, aliquot and package specimens for courier pickup",
            "Run glucose tolerance tests and timed draws, and enter requisitions and collection times in the LIS",
          ],
        },
        {
          title: "Phlebotomist",
          company: "Cibolo Creek Medical Center",
          dates: "Jun 2023 – Dec 2024",
          bullets: [
            "Completed early-morning inpatient rounds on 4 medical-surgical units, drawing 30–40 patients before the lab's morning cutoff",
            "Collected blood cultures with aseptic technique; our team's contamination rate fell from 3% to under 2% after I helped rewrite the skin prep checklist",
            "Performed venipuncture and capillary collection (fingersticks and heel sticks) and followed isolation precautions and infection control on every unit",
            "Covered stat draws for the emergency department on evening shifts",
          ],
        },
      ],
      education: "Phlebotomy Technician Certificate, Mission Valley Career Institute, 2023 · CPT (NHA) · BLS",
      skills: [
        "Venipuncture", "Capillary collection", "Order of draw", "Specimen processing", "Blood cultures", "Patient identification",
        "Pediatric draws", "Centrifuge", "LIS", "Infection control", "HIPAA", "Customer service",
      ],
    },
    whyItWorks:
      "The credential sits in the headline, each job gives the setting and draw volume, and the bullets prove accuracy — patient ID, labeling, order of draw, contamination — which is what a lab supervisor worries about most.",
    summaries: [
      { level: "Entry level", text: "Recent phlebotomy program graduate with a hospital externship drawing adults and children under supervision. CPT (NHA) certified and BLS trained, comfortable with venipuncture, capillary collection and the order of draw." },
      { level: "Mid level", text: "Certified phlebotomy technician with 3 years in a hospital and a patient service center. I draw 45–60 patients a shift with no labeling rejections in the last 12 months." },
      { level: "Senior", text: "Lead phlebotomist with 8 years in hospital and outpatient labs. I train new hires, build the daily draw schedule and handle the difficult pediatric and geriatric draws." },
    ],
    bullets: [
      { skill: "Volume", weak: "Drew blood from patients", strong: "Performed specimen collection for 45–60 patients a shift at a walk-in patient service center" },
      { skill: "Accuracy", weak: "Labeled tubes", strong: "Confirmed two patient identifiers and labeled every tube at the chair, with no labeling rejections in 12 months" },
      { skill: "Order of draw", weak: "Followed lab procedures", strong: "Followed the CLSI order of draw on multi-tube orders and processed specimens for courier pickup" },
      { skill: "Blood cultures", weak: "Did blood cultures", strong: "Collected blood cultures with aseptic technique and helped cut the team's contamination rate from 3% to under 2%" },
      { skill: "Inpatient rounds", weak: "Did morning draws", strong: "Drew 30–40 inpatients on 4 medical-surgical units before the lab's morning cutoff" },
      { skill: "Special collections", weak: "Did other tests", strong: "Ran glucose tolerance tests and timed draws and logged collection times in the LIS" },
    ],
    keywords: [
      "Phlebotomy", "Venipuncture", "Capillary collection", "Specimen collection", "Specimen processing", "Order of draw", "Blood cultures",
      "Patient identification", "Aseptic technique", "Pediatric draws", "Glucose tolerance tests", "Centrifuge", "LIS", "Infection control",
      "HIPAA", "CPT (NHA)", "PBT (ASCP)", "BLS", "Customer service",
    ],
    keywordSort: {
      tools: ["Centrifuge", "LIS"],
      credentials: ["CPT (NHA)", "PBT (ASCP)", "BLS"],
      soft: ["Customer service"],
    },
    tips: [
      { t: "Write the credential the way it's issued", d: "CPT (NHA) and PBT (ASCP) are different certifications from different organizations. Put yours in your headline exactly as it appears on your certificate." },
      { t: "Give the setting and the volume", d: "\"Patient service center, 45–60 patients a shift\" or \"inpatient rounds on 4 units\" tells a supervisor your pace in one line." },
      { t: "Prove accuracy, not just speed", d: "Patient identification, labeling at the chair and the order of draw are what keep specimens from being rejected. Show them in a bullet." },
      { t: "List special collections", d: "Blood cultures, glucose tolerance tests, timed draws and pediatric or heel-stick collections are common screening terms. Include the ones you've done." },
      { t: "Check your state's rules", d: "A few states, including California, Louisiana, Nevada and Washington, require phlebotomists to be certified. If you work in one, list the state certificate too." },
    ],
    faqs: [
      { q: "Should I list CPT (NHA) or PBT (ASCP)?", a: "List the one you hold, written exactly as issued. The National Healthcareer Association awards the Certified Phlebotomy Technician (CPT), and the ASCP Board of Certification awards the Phlebotomy Technician (PBT). Both are widely recognized; check whether the job post or your state names one." },
      { q: "What if I'm not certified yet?", a: "List your training program and completion date, and add the exam you plan to take with a date, such as \"CPT (NHA) exam scheduled for March.\" Your externship and the draws you completed there count as experience." },
      { q: "How long should a phlebotomist resume be?", a: "One page. Put your certification, setting and daily draw volume near the top, then one or two jobs with bullets on accuracy and special collections." },
      { q: "Can I include my externship?", a: "Yes. List it like a job with the facility type, hours and what you did, such as venipuncture, capillary collection and specimen processing under supervision." },
      { q: "Should I mention customer service?", a: "Yes. Many patients are nervous about needles. A line about calming anxious or pediatric patients, or keeping a walk-in line moving, shows the side of the job that isn't technical." },
    ],
    related: ["medical-assistant", "certified-nursing-assistant", "licensed-practical-nurse", "registered-nurse"],
  },
  {
    slug: "emt",
    role: "EMT",
    group: "Healthcare",
    level: "Mid-level · 4 years experience",
    intro:
      "An EMT resume that shows calm, safe patient care on 911 and transport calls — with the national certification, state credential and field-skill keywords EMS agencies and fire departments screen for.",
    resume: {
      name: "Tyler Brennan",
      headline: "Emergency Medical Technician (EMT), NREMT",
      contact: "Fort Worth, TX · tyler.brennan@email.com · (817) 555-0162",
      summary:
        "Nationally Registered EMT with 4 years on 911 and interfacility ambulances. I assess fast, communicate clearly with patients and crews, and hand off a complete report every time.",
      jobs: [
        {
          title: "EMT",
          company: "Prairie Line Ambulance Service",
          dates: "Mar 2024 – Present",
          bullets: [
            "Respond to 10–14 calls per 24-hour shift on a BLS ambulance in a county 911 system covering city and rural areas",
            "Perform patient assessment, airway management, bleeding control, splinting and CPR, and assist paramedics on ALS calls",
            "Complete ePCR documentation in ESO for every call and give ED staff a structured verbal handoff",
            "Check the truck at the start of every shift — oxygen, AED, suction and stretcher — and restock after each call",
            "Serve as a field training officer and precepted 4 new EMTs in 2025",
          ],
        },
        {
          title: "EMT",
          company: "Brazos Bend Medical Transport",
          dates: "Jun 2022 – Feb 2024",
          bullets: [
            "Completed 6–8 interfacility and discharge transports a shift, including patients on oxygen and with limited mobility",
            "Used stair chairs and safe lifting with my partner, with no lifting injuries on any transport",
            "Confirmed orders, DNR status and destination with nursing staff and families before every patient transport",
          ],
        },
      ],
      education: "EMT Course, North Prairie College EMS Program, 2022 · NREMT certified (EMT) · Texas EMT certification (DSHS) · BLS · EVOC",
      skills: [
        "Patient assessment", "Airway management", "CPR", "AED", "Bleeding control", "Splinting", "Vital signs", "Oxygen therapy",
        "Patient transport", "Interfacility transport", "911 response", "ePCR", "ESO", "Teamwork",
      ],
    },
    whyItWorks:
      "It leads with the national and state credentials, gives call volume and system type in numbers, and lists skills within EMT scope — assessment, airway, bleeding control — instead of claiming paramedic-level care.",
    summaries: [
      { level: "New EMT", text: "Newly certified EMT (NREMT) with ride-along and emergency department clinical hours from my EMT course. BLS and EVOC trained, with a clean driving record and a strong customer service background." },
      { level: "Mid level", text: "Nationally Registered EMT with 4 years on 911 and interfacility ambulances. I run 10–14 calls a shift and precept new EMTs as a field training officer." },
      { level: "Senior", text: "EMT and crew lead with 9 years in county 911 and event medical coverage. I train new hires, run truck and supply checks for a station and am completing paramedic school." },
    ],
    bullets: [
      { skill: "Call volume", weak: "Answered emergency calls", strong: "Responded to 10–14 calls per 24-hour shift on a BLS ambulance in a county 911 system" },
      { skill: "Field skills", weak: "Treated patients", strong: "Performed patient assessment, airway management, bleeding control, splinting and CPR, assisting paramedics on ALS calls" },
      { skill: "Documentation", weak: "Wrote reports", strong: "Completed ePCR documentation in ESO for every call and gave ED staff a structured verbal handoff" },
      { skill: "Readiness", weak: "Checked equipment", strong: "Checked oxygen, AED, suction and stretcher every shift and restocked the truck after each call" },
      { skill: "Training", weak: "Helped new hires", strong: "Precepted 4 new EMTs as a field training officer in 2025" },
      { skill: "Safety", weak: "Moved patients safely", strong: "Used stair chairs and safe lifting with my partner, with no lifting injuries on any transport" },
    ],
    keywords: [
      "Emergency medical technician", "NREMT", "Patient assessment", "Airway management", "CPR", "AED", "Bleeding control", "Splinting",
      "Vital signs", "Oxygen therapy", "Patient transport", "911 response", "Interfacility transport", "ePCR", "ESO", "BLS", "EVOC", "Teamwork",
    ],
    keywordSort: {
      tools: ["ePCR", "ESO", "AED"],
      credentials: ["NREMT", "BLS", "EVOC"],
      soft: ["Teamwork"],
    },
    tips: [
      { t: "Put both credentials up top", d: "Show your NREMT certification and your state EMT certification or license. Every state requires EMTs to hold a state credential, and agencies check it first." },
      { t: "Give call volume and system type", d: "\"10–14 calls per 24-hour shift in a county 911 system\" tells a hiring officer more than \"responded to emergencies.\"" },
      { t: "Stay inside your scope", d: "List the skills you're trained and allowed to perform at the EMT level. Write \"assisted paramedics on ALS calls\" rather than claiming advanced procedures." },
      { t: "Show documentation habits", d: "Name your ePCR software and mention complete reports and handoffs. Clean charting matters for quality review and billing." },
      { t: "Mention driving credentials", d: "EVOC or a similar driver course and a clean driving record are often required. Say so if you have them." },
    ],
    faqs: [
      { q: "What's the difference between NREMT certification and a state EMT license?", a: "NREMT certification is a national credential from the National Registry of Emergency Medical Technicians. Your state EMS office grants the credential that lets you work, and many states accept NREMT certification as the basis for it. List both, with your state's exact title." },
      { q: "How often do EMTs recertify?", a: "National Registry certification runs on a two-year cycle, and you recertify with continuing education or an exam. State renewal rules differ, so list your current expiration dates if a posting asks for them." },
      { q: "What should a new EMT put on a resume?", a: "Your EMT course, certification and state credential, clinical and ride-along hours, and any jobs that show reliability under pressure, such as lifeguarding, security or customer service." },
      { q: "Should I list my EMT experience for a firefighter or nursing application?", a: "Yes. Patient assessment, calm communication and documentation carry over. Describe your call volume and the kinds of calls you ran." },
      { q: "How long should an EMT resume be?", a: "One page. Put credentials and expiration dates near the top, then your EMS jobs with call volume, skills and training roles." },
    ],
    related: ["registered-nurse", "phlebotomist", "certified-nursing-assistant", "medical-assistant"],
  },
  {
    slug: "radiologic-technologist",
    role: "Radiologic Technologist",
    group: "Healthcare",
    photo: { src: "/images/photos/role-radiologic-technologist.webp", alt: "Chest and shoulder X-ray image" },
    level: "Experienced · 5 years",
    intro:
      "A radiologic technologist resume that shows clean images, safe radiation practice and steady patient care across the ED, OR and outpatient imaging — with the ARRT credential and modality keywords imaging managers search for.",
    resume: {
      name: "Lauren Pierce",
      headline: "Radiologic Technologist, R.T.(R)(ARRT)",
      contact: "Columbus, OH · lauren.pierce@email.com · (614) 555-0175",
      summary:
        "Registered radiographer with 5 years in hospital and outpatient orthopedic imaging. I get diagnostic images on the first try, keep dose as low as reasonably achievable and keep patients comfortable while I do it.",
      jobs: [
        {
          title: "Radiologic Technologist",
          company: "Scioto Bend Medical Center",
          dates: "Apr 2023 – Present",
          bullets: [
            "Perform 40–50 radiography exams a shift across the ED, inpatient floors and outpatient imaging on digital radiography (DR) equipment",
            "Run portable radiography in the ICU and C-arm fluoroscopy in the OR for orthopedic and general surgery cases",
            "Cut repeat images on my shift from 6% to 3% by standardizing patient positioning for portable chest and extremity exams",
            "Apply ALARA and radiation safety on every exam — collimation, shielding where protocol calls for it and pediatric technique charts",
            "Verify orders and patient ID, send images to PACS, document in the RIS and follow HIPAA and infection control on every exam",
          ],
        },
        {
          title: "Radiographer",
          company: "Northbridge Orthopedic Associates",
          dates: "Jun 2021 – Mar 2023",
          bullets: [
            "Imaged 35+ outpatient orthopedic patients a day, including weight-bearing, scoliosis and post-op exams",
            "Kept the clinic on schedule with an average 9-minute turnaround from check-in to images in PACS",
            "Ran daily quality control checks on DR equipment and reported issues to the service vendor the same day",
          ],
        },
      ],
      education:
        "A.A.S. Radiologic Technology, Fairfield Ridge Community College (JRCERT-accredited program), 2021 · R.T.(R)(ARRT) · Ohio radiographer license · BLS",
      skills: [
        "Radiography", "Digital radiography", "Patient positioning", "Portable radiography", "Fluoroscopy", "C-arm", "Trauma imaging",
        "Radiation safety", "ALARA", "PACS", "RIS", "Quality control", "Patient care",
      ],
    },
    whyItWorks:
      "The credential is written the way ARRT recommends, the license state is named, and the bullets cover volume, modalities and image quality — repeat rate, turnaround, QC — so a manager can see both skill and safety.",
    summaries: [
      { level: "New graduate", text: "New radiography graduate from a JRCERT-accredited program with clinical rotations in the ED, OR and outpatient imaging. R.T.(R)(ARRT) and eligible for state licensure, with hands-on portable and C-arm experience." },
      { level: "Experienced", text: "Registered radiographer with 5 years in hospital and orthopedic imaging. I run 40–50 exams a shift and cut repeat images on my shift from 6% to 3%." },
      { level: "Lead", text: "Lead radiologic technologist with 11 years in a Level I trauma center. I schedule a team of 14, train students from our clinical affiliate and run QC for the department." },
    ],
    bullets: [
      { skill: "Volume", weak: "Took X-rays", strong: "Performed 40–50 radiography exams a shift across the ED, inpatient floors and outpatient imaging" },
      { skill: "Image quality", weak: "Took good images", strong: "Cut repeat images on my shift from 6% to 3% by standardizing patient positioning for portable exams" },
      { skill: "Surgery", weak: "Worked in the OR", strong: "Ran C-arm fluoroscopy in the OR for orthopedic and general surgery cases" },
      { skill: "Radiation safety", weak: "Followed safety rules", strong: "Applied ALARA on every exam with collimation, protocol-based shielding and pediatric technique charts" },
      { skill: "Throughput", weak: "Kept on schedule", strong: "Kept an orthopedic clinic on schedule with an average 9-minute turnaround from check-in to images in PACS" },
      { skill: "Quality control", weak: "Checked equipment", strong: "Ran daily QC checks on DR equipment and reported issues to the vendor the same day" },
    ],
    keywords: [
      "R.T.(R)(ARRT)", "Radiography", "Digital radiography", "Patient positioning", "Portable radiography", "Fluoroscopy", "C-arm",
      "Trauma imaging", "Radiation safety", "ALARA", "PACS", "RIS", "Quality control", "Patient care", "Infection control", "HIPAA",
      "Radiographer license", "BLS",
    ],
    keywordSort: {
      tools: ["PACS", "RIS", "C-arm"],
      credentials: ["R.T.(R)(ARRT)", "Radiographer license", "BLS"],
    },
    tips: [
      { t: "Write the ARRT credential correctly", d: "ARRT's format is your name, a comma, then R.T. with the discipline in parentheses and (ARRT) at the end — for a radiographer, R.T.(R)(ARRT)." },
      { t: "Name your state license", d: "Most states require radiologic technologists to be licensed or certified. Put the state and license type next to your ARRT credential." },
      { t: "List settings and modalities", d: "ED, OR, portables, fluoroscopy, C-arm and outpatient orthopedics are different skills. Say which ones you work in." },
      { t: "Show image quality and safety", d: "A repeat rate, a QC routine or how you apply ALARA shows judgment, not just button-pushing." },
      { t: "Mention cross-training honestly", d: "If you're training in CT or MRI, say \"in training\" or give a target date. Only list ARRT credentials you hold." },
    ],
    faqs: [
      { q: "How do I list my ARRT credential on a resume?", a: "ARRT recommends your full name, a comma, then the credential string: R.T. followed by each discipline in parentheses and (ARRT) at the end — for example, R.T.(R)(ARRT) for radiography. Use periods only after R.T." },
      { q: "Do I need a state license as well as ARRT?", a: "In most states, yes. Requirements differ by state, and many accept ARRT certification as the basis for a license. Check your state's radiologic licensing agency and list the license by name." },
      { q: "What should a new graduate radiographer include?", a: "Your program, ARRT status, license status and clinical rotations, with the areas you rotated through and the exam types you did, such as portables, fluoroscopy and C-arm." },
      { q: "Should I mention CT or MRI cross-training?", a: "Yes, if it's real. Note any clinical hours or training you've completed. ARRT offers CT and MRI as additional credentials with their own requirements, so list them only once you've earned them." },
      { q: "How long should a radiologic technologist resume be?", a: "One page for most technologists. Put your credential and license at the top, then settings, exam volume and one or two quality results." },
    ],
    related: ["registered-nurse", "medical-assistant", "phlebotomist", "physical-therapist-assistant"],
  },
  {
    slug: "physical-therapist-assistant",
    role: "Physical Therapist Assistant",
    group: "Healthcare",
    photo: { src: "/images/photos/role-physical-therapist-assistant.webp", alt: "Physical therapy assistant in scrubs with a clipboard beside a patient at parallel bars" },
    level: "Mid-level · 4 years experience",
    intro:
      "A physical therapist assistant resume that shows safe, progressing treatment under the PT's plan of care — with the license, setting and treatment keywords outpatient clinics and rehab facilities screen for.",
    resume: {
      name: "Derek Lawson",
      headline: "Physical Therapist Assistant (PTA), Licensed in North Carolina",
      contact: "Charlotte, NC · derek.lawson@email.com · (704) 555-0128",
      summary:
        "Licensed PTA with 4 years in outpatient orthopedics and skilled nursing rehab. I carry out the physical therapist's plan of care, progress patients safely and keep notes the PT can trust.",
      jobs: [
        {
          title: "Physical Therapist Assistant",
          company: "Catawba Ridge Physical Therapy",
          dates: "May 2024 – Present",
          bullets: [
            "Treat 14–18 outpatients a day under the supervising physical therapist's plan of care, mostly post-op knee, shoulder and spine patients",
            "Lead therapeutic exercise, neuromuscular re-education, gait training and modalities such as electrical stimulation, ultrasound, heat and ice",
            "Write daily notes in WebPT the same day and flag changes in pain or function to the PT before the next visit",
            "Raised plan-of-care completion for my patients from 64% to 79% by building clear home exercise programs and calling patients after missed visits",
          ],
        },
        {
          title: "Physical Therapist Assistant",
          company: "Piedmont Crossing Rehabilitation Center",
          dates: "Aug 2022 – Apr 2024",
          bullets: [
            "Treated 10–12 residents a day in skilled nursing rehab, focused on transfer training, gait and fall prevention",
            "Led patient education for residents, families and CNAs on safe transfers and walker and wheelchair use",
            "Documented treatment and functional progress in PointClickCare to meet Medicare documentation requirements",
          ],
        },
      ],
      education:
        "A.A.S. Physical Therapist Assistant, Sugar Creek Community College (CAPTE-accredited program), 2022 · North Carolina PTA license (passed the NPTE for PTAs) · BLS",
      skills: [
        "Plan of care", "Therapeutic exercise", "Neuromuscular re-education", "Gait training", "Transfer training", "Modalities",
        "Fall prevention", "Home exercise programs", "Patient education", "Documentation", "WebPT", "PointClickCare",
      ],
    },
    whyItWorks:
      "License, program and setting are clear at the top, every bullet works inside the PT's plan of care, and the numbers — caseload and plan-of-care completion — show results a clinic director cares about.",
    summaries: [
      { level: "New graduate", text: "New PTA graduate from a CAPTE-accredited program with clinical rotations in outpatient orthopedics, acute care and skilled nursing. Passed the NPTE for PTAs; North Carolina license pending." },
      { level: "Mid level", text: "Licensed PTA with 4 years in outpatient orthopedics and skilled nursing rehab. I treat 14–18 patients a day and raised plan-of-care completion from 64% to 79%." },
      { level: "Senior", text: "PTA with 10 years in outpatient and home health who mentors PTA students, leads the clinic's fall prevention classes and handles a full caseload across two locations." },
    ],
    bullets: [
      { skill: "Caseload", weak: "Saw patients", strong: "Treated 14–18 outpatients a day under the supervising PT's plan of care" },
      { skill: "Treatment", weak: "Did exercises with patients", strong: "Led therapeutic exercise, neuromuscular re-education, gait training and modalities for post-op knee, shoulder and spine patients" },
      { skill: "Retention", weak: "Helped patients finish therapy", strong: "Raised plan-of-care completion from 64% to 79% with clear home exercise programs and missed-visit calls" },
      { skill: "Communication", weak: "Talked to the PT", strong: "Flagged changes in pain or function to the PT before the next visit and wrote same-day notes in WebPT" },
      { skill: "Fall prevention", weak: "Worked with older patients", strong: "Treated 10–12 skilled nursing residents a day with a focus on transfer training, gait and fall prevention" },
      { skill: "Patient education", weak: "Trained families", strong: "Taught residents, families and CNAs safe transfers and walker and wheelchair use" },
    ],
    keywords: [
      "Physical therapist assistant", "Plan of care", "Therapeutic exercise", "Neuromuscular re-education", "Gait training", "Transfer training",
      "Modalities", "Fall prevention", "Home exercise programs", "Patient education", "Documentation", "WebPT", "PointClickCare",
      "Outpatient orthopedics", "Skilled nursing", "PTA license", "NPTE", "BLS",
    ],
    keywordSort: {
      tools: ["WebPT", "PointClickCare"],
      credentials: ["PTA license", "NPTE", "BLS"],
    },
    tips: [
      { t: "Lead with license and program", d: "Put your state PTA license or certification in your headline and your CAPTE-accredited program in education." },
      { t: "Show you work within the plan of care", d: "PTAs carry out the physical therapist's plan. Wording like \"under the supervising PT's plan of care\" shows you understand the role." },
      { t: "Give setting and caseload", d: "Outpatient, skilled nursing, acute care and home health run very differently. Say where you've worked and how many patients a day you treat." },
      { t: "Name your documentation system", d: "WebPT, PointClickCare and similar systems show up in job posts. Mention same-day notes if you write them." },
      { t: "Use one outcome", d: "Plan-of-care completion, fewer missed visits or functional progress shows the effect of your treatment." },
    ],
    faqs: [
      { q: "What do I need to work as a physical therapist assistant?", a: "You need to graduate from a CAPTE-accredited PTA program and pass the National Physical Therapy Examination (NPTE) for PTAs, which the Federation of State Boards of Physical Therapy administers. Each state then licenses or certifies PTAs under its own rules." },
      { q: "Should I list the NPTE on my resume?", a: "Your state license or certification is what employers check, so list that first. New graduates waiting on a license can add a line such as \"Passed the NPTE for PTAs; license pending.\"" },
      { q: "Can a PTA write evaluations?", a: "No. The physical therapist evaluates the patient and sets the plan of care, and the PTA carries out treatment under the PT's supervision. State rules set the details, so describe your work in those terms." },
      { q: "How should a new graduate list clinical rotations?", a: "List each rotation with the setting, length and the patients you treated, such as post-op orthopedics, stroke rehab or skilled nursing." },
      { q: "How long should a PTA resume be?", a: "One page. Put your license, setting and caseload near the top, then two or three jobs or rotations with treatment and outcome bullets." },
    ],
    related: ["certified-nursing-assistant", "licensed-practical-nurse", "home-health-aide", "radiologic-technologist"],
  },
  {
    slug: "home-health-aide",
    role: "Home Health Aide",
    group: "Healthcare",
    photo: { src: "/images/photos/role-home-health-aide.webp", alt: "Home health aide in blue scrubs smiling with an older woman" },
    level: "Mid-level · 3 years experience",
    intro:
      "A home health aide resume that shows safe, reliable personal care in clients' homes — with the training, care plan and reporting keywords home health agencies screen for.",
    resume: {
      name: "Rosa Jimenez",
      headline: "Home Health Aide (HHA)",
      contact: "Philadelphia, PA · rosa.jimenez@email.com · (215) 555-0156",
      summary:
        "Home health aide with 3 years in home health and assisted living. I help clients stay safe and independent at home, follow the nurse's care plan closely and report changes the same day.",
      jobs: [
        {
          title: "Home Health Aide",
          company: "Schuylkill Home Health Services",
          dates: "Feb 2025 – Present",
          bullets: [
            "Visit 5–7 clients a day in their homes for personal care — bathing, dressing, grooming and toileting — following each client's aide care plan from the RN",
            "Take and record vital signs and report any change in condition to the RN case manager the same day",
            "Provide mobility assistance and safe transfers using gait belts and walkers; none of my clients had a fall during a visit in 2025",
            "Record every visit in HHAeXchange for EVV and keep documentation complete before the end of each day",
          ],
        },
        {
          title: "Personal Care Aide",
          company: "Fairmount Gardens Assisted Living",
          dates: "Jun 2023 – Jan 2025",
          bullets: [
            "Helped 12–14 residents a shift with ADLs, meals and medication reminders",
            "Supported residents with dementia using calm routines and redirection, as part of the community's dementia care team",
            "Kept intake and output logs and weekly weights, and followed infection control and HIPAA on every shift",
          ],
        },
      ],
      education:
        "Home Health Aide Training Program (75 hours, including 16 hours of supervised practical training), Keystone Bridge Career Institute, 2023 · Competency evaluation passed · CPR and First Aid",
      skills: [
        "Personal care", "ADLs", "Vital signs", "Care plan", "Mobility assistance", "Transfers", "Fall prevention", "Medication reminders",
        "Meal preparation", "Light housekeeping", "Dementia care", "Infection control", "EVV", "HIPAA",
      ],
    },
    whyItWorks:
      "It names the training and competency evaluation employers must check, gives the daily visit load, and shows the habits agencies rely on: following the care plan, reporting changes and documenting every visit.",
    summaries: [
      { level: "Entry level", text: "Newly trained home health aide who completed a 75-hour program with supervised practical training and passed the competency evaluation. CPR and First Aid certified, with 2 years of caring for a family member at home." },
      { level: "Mid level", text: "Home health aide with 3 years in home health and assisted living. I visit 5–7 clients a day, follow each aide care plan and report changes to the RN the same day." },
      { level: "Senior", text: "Senior home health aide with 9 years in home care who orients new aides on the agency's care plans, EVV and safety routines and covers hard-to-staff clients." },
    ],
    bullets: [
      { skill: "Personal care", weak: "Helped clients", strong: "Visited 5–7 clients a day for bathing, dressing, grooming and toileting, following each aide care plan" },
      { skill: "Reporting", weak: "Told the nurse about problems", strong: "Took vital signs and reported every change in condition to the RN case manager the same day" },
      { skill: "Safety", weak: "Helped clients walk", strong: "Used gait belts and walkers for safe transfers; none of my clients fell during a visit in 2025" },
      { skill: "Documentation", weak: "Filled out paperwork", strong: "Recorded every visit in HHAeXchange for EVV and finished documentation before the end of each day" },
      { skill: "Dementia care", weak: "Worked with dementia patients", strong: "Used calm routines and redirection with residents with dementia as part of a dementia care team" },
      { skill: "Daily living", weak: "Did chores", strong: "Helped 12–14 residents a shift with ADLs, meals and medication reminders" },
    ],
    keywords: [
      "Home health aide", "Personal care", "ADLs", "Care plan", "Vital signs", "Mobility assistance", "Transfers", "Fall prevention",
      "Medication reminders", "Meal preparation", "Light housekeeping", "Dementia care", "Infection control", "EVV", "Documentation",
      "HIPAA", "CPR and First Aid", "Compassion",
    ],
    keywordSort: {
      tools: ["EVV"],
      credentials: ["CPR and First Aid"],
      soft: ["Compassion"],
    },
    tips: [
      { t: "List your training and competency evaluation", d: "Medicare-certified home health agencies must use aides who completed qualifying training and a competency evaluation, or a state program that meets the federal rules. Put both in your education line." },
      { t: "Give your daily visit load", d: "\"5–7 clients a day\" or \"12–14 residents a shift\" tells an agency you can handle a full schedule." },
      { t: "Show that you follow the care plan", d: "Agencies want aides who do what the nurse's plan says and report anything that changes. Say so in a bullet." },
      { t: "Stay inside your role", d: "Write \"medication reminders\" rather than \"gave medications\" unless your state and agency let aides do more. Accuracy builds trust." },
      { t: "Mention reliability and transportation", d: "Home care depends on showing up on time. A valid driver's license, reliable car or the areas you can cover are worth a line." },
    ],
    faqs: [
      { q: "How much training does a home health aide need?", a: "For Medicare-certified home health agencies, federal rules (42 CFR 484.80) call for at least 75 hours of classroom and supervised practical training, with at least 16 hours of supervised practical training, plus a competency evaluation. Aides also need 12 hours of in-service training each year. Some states require more." },
      { q: "What's the difference between a home health aide and a caregiver?", a: "Home health aides usually work for a home health agency under a nurse's care plan and complete formal training. Caregivers and personal care aides often provide non-medical help with daily living and companionship, and training rules vary by state." },
      { q: "What if I have no paid experience?", a: "List your training program and clinical hours, plus any caregiving for family members, volunteer work or jobs that show reliability, such as food service or retail." },
      { q: "Should I list the agencies I worked for or each client?", a: "List the agency as your employer. Describe your clients by need and number — never by name — to protect their privacy." },
      { q: "How long should a home health aide resume be?", a: "One page. Put your training, CPR and First Aid and daily visit load near the top, then one or two jobs with care, safety and reporting bullets." },
    ],
    related: ["caregiver", "certified-nursing-assistant", "licensed-practical-nurse", "medical-assistant"],
  },
  {
    slug: "caregiver",
    role: "Caregiver",
    group: "Healthcare",
    photo: { src: "/images/photos/role-caregiver.webp", alt: "Caregiver holding hands with a smiling older woman in a care home lounge" },
    level: "Experienced · 5 years",
    intro:
      "A caregiver resume that shows kind, dependable in-home care — personal care, meals, safety and companionship — with the keywords home care agencies and families look for.",
    resume: {
      name: "Lorena Santos",
      headline: "Caregiver, In-Home Senior Care",
      contact: "Tucson, AZ · lorena.santos@email.com · (520) 555-0187",
      summary:
        "Caregiver with 5 years helping older adults live safely at home, including clients with Alzheimer's disease and stroke. I'm patient, dependable and I keep families up to date every day.",
      jobs: [
        {
          title: "Caregiver",
          company: "Rincon Valley Home Care",
          dates: "Jan 2023 – Present",
          bullets: [
            "Provide in-home personal care and companionship for 3 regular clients across 30–36 hours a week, including one client with Alzheimer's disease",
            "Help with bathing, dressing, toileting and transfers, and keep a daily care log that families and the care manager read",
            "Handle meal preparation for diabetic and low-sodium diets, plus grocery shopping and lists",
            "Give medication reminders from pre-filled pill organizers and tell the family the same day about any missed dose",
          ],
        },
        {
          title: "Companion Caregiver",
          company: "Desert Willow Care Agency",
          dates: "May 2021 – Dec 2022",
          bullets: [
            "Cared for one client recovering from a stroke, helping with her physical therapist's walking exercises and safe transfers",
            "Drove the client to 4–6 appointments a month and kept a shared calendar for her family",
            "Kept the home safe for fall prevention — cleared trip hazards and set up a shower chair — and did light housekeeping and laundry",
          ],
        },
      ],
      education: "High school diploma, Cholla Vista High School · CPR and First Aid · Dementia care training (agency course) · Valid driver's license",
      skills: [
        "Personal care", "Companionship", "Dementia care", "Alzheimer's care", "Meal preparation", "Medication reminders", "Transfers",
        "Mobility assistance", "Fall prevention", "Light housekeeping", "Transportation", "Care log", "Family communication",
      ],
    },
    whyItWorks:
      "It shows who she cares for and how many hours, uses plain words families and agencies search for, and proves reliability with routines — care logs, medication reminders, safe transfers — rather than vague claims about being caring.",
    summaries: [
      { level: "Entry level", text: "Caring and reliable first-time caregiver with 3 years of helping a grandparent at home with meals, medication reminders and appointments. CPR and First Aid certified with a valid driver's license." },
      { level: "Experienced", text: "Caregiver with 5 years helping older adults live safely at home, including clients with Alzheimer's disease. I keep a daily care log and update families every day." },
      { level: "Senior", text: "Live-in caregiver with 10 years in private and agency home care, specializing in dementia care and end-of-life support alongside hospice teams." },
    ],
    bullets: [
      { skill: "Personal care", weak: "Took care of clients", strong: "Provided personal care and companionship for 3 regular clients across 30–36 hours a week" },
      { skill: "Dementia care", weak: "Worked with a dementia patient", strong: "Cared for a client with Alzheimer's disease using steady routines and a daily care log the family reads" },
      { skill: "Meals", weak: "Cooked for clients", strong: "Planned and cooked meals for diabetic and low-sodium diets and handled grocery shopping" },
      { skill: "Medications", weak: "Helped with pills", strong: "Gave medication reminders from pre-filled pill organizers and reported missed doses to the family the same day" },
      { skill: "Transportation", weak: "Drove clients", strong: "Drove a client to 4–6 appointments a month and kept a shared calendar for her family" },
      { skill: "Safety", weak: "Kept the house clean", strong: "Cleared trip hazards, set up a shower chair and helped with safe transfers to prevent falls" },
    ],
    keywords: [
      "Caregiver", "Personal care", "Companionship", "Dementia care", "Alzheimer's care", "Meal preparation", "Medication reminders",
      "Transfers", "Mobility assistance", "Fall prevention", "Light housekeeping", "Transportation", "Care log", "Family communication",
      "CPR and First Aid", "Valid driver's license", "Patience", "Reliability",
    ],
    keywordSort: {
      credentials: ["CPR and First Aid", "Valid driver's license"],
      soft: ["Family communication", "Patience", "Reliability"],
    },
    tips: [
      { t: "Say who you care for", d: "\"Older adults with Alzheimer's disease\" or \"a client recovering from a stroke\" tells families and agencies what experience you bring." },
      { t: "Give hours and number of clients", d: "\"3 regular clients, 30–36 hours a week\" shows your schedule and that clients keep asking for you." },
      { t: "Use the words agencies search for", d: "Personal care, companionship, meal preparation, medication reminders and light housekeeping are common terms in caregiver posts." },
      { t: "Be careful with medical terms", d: "Write \"medication reminders\" rather than \"gave medications\" if you don't administer them. Only list tasks you're trained and allowed to do." },
      { t: "Protect client privacy", d: "Describe clients by their needs, never by name. Families and agencies notice when a caregiver keeps details private." },
    ],
    faqs: [
      { q: "How do I list private caregiving jobs?", a: "List the agency, or \"Private family\" if you were hired directly, with your dates and city. Describe the care you gave without naming the client." },
      { q: "Can I count caring for a family member?", a: "Yes. If you cared for a parent or grandparent, list it with dates and the help you gave, such as meals, medication reminders and appointments. It's real caregiving experience." },
      { q: "Do caregivers need a certification?", a: "It depends on the state and the employer. Many agencies ask for CPR and First Aid, a background check and their own training. Some states set training rules for caregivers in certain settings, so check the posting." },
      { q: "What's the difference between a caregiver and a home health aide?", a: "Caregivers usually provide non-medical help — personal care, meals, companionship and errands. Home health aides typically work for a home health agency under a nurse's care plan and complete formal training and a competency evaluation." },
      { q: "How long should a caregiver resume be?", a: "One page. A short summary, one or two caregiving jobs, your certifications and your availability are enough." },
    ],
    related: ["home-health-aide", "certified-nursing-assistant", "licensed-practical-nurse"],
  },

  // ----------------------------------------------------------------- Education
  {
    slug: "substitute-teacher",
    role: "Substitute Teacher",
    group: "Education",
    photo: { src: "/images/photos/role-substitute-teacher.webp", alt: "Teacher standing at the front of a classroom while students sit at desks" },
    level: "Mid-level · 3 years substitute teaching",
    intro:
      "A substitute teacher resume that shows you can walk into any classroom, follow the plan and leave it in good shape — with the authorization, grade-level and classroom management keywords districts screen for.",
    resume: {
      name: "Kyle Henderson",
      headline: "Substitute Teacher, K–12",
      contact: "Aurora, CO · kyle.henderson@email.com · (303) 555-0134",
      summary:
        "Substitute teacher with 3 years in K–12 classrooms and 2 years leading an after-school program. I follow the teacher's lesson plans, keep the room calm and on task, and leave clear notes so the next day starts smoothly.",
      jobs: [
        {
          title: "Substitute Teacher",
          company: "Sand Creek Public Schools",
          dates: "Aug 2023 – Present",
          bullets: [
            "Cover 140+ days a year across 9 elementary, middle and high schools, from kindergarten to high school chemistry",
            "Follow teachers' lesson plans and classroom procedures, take attendance in PowerSchool and leave end-of-day notes on what was covered and any behavior concerns",
            "Completed a 6-week long-term substitute assignment in 7th-grade math, grading work and posting assignments in Google Classroom",
            "Requested by name by 12 teachers; keep students engaged with clear expectations and positive classroom management",
          ],
        },
        {
          title: "After-School Program Lead",
          company: "Highline Park Recreation Center",
          dates: "Jun 2021 – Jul 2023",
          bullets: [
            "Ran homework help and activities for 25–30 students in grades K–5 every afternoon",
            "Set daily routines and behavior expectations that cut incident reports from 9 to 3 per semester",
            "Handled parent communication at pickup and passed concerns to the program director the same day",
          ],
        },
      ],
      education: "B.A. History, Front Range State University, 2021 · Colorado 3-Year Substitute Authorization · CPR and First Aid",
      skills: [
        "Classroom management", "Lesson plans", "Behavior management", "Student engagement", "Long-term substitute", "K–12", "Attendance",
        "Grading", "Google Classroom", "PowerSchool", "Parent communication", "Flexibility",
      ],
    },
    whyItWorks:
      "It shows range and reliability in numbers — days covered, schools served, teachers who ask for him — and proves he can handle a long-term assignment, which is what principals look for when they book subs.",
    summaries: [
      { level: "Entry level", text: "Recent graduate with a bachelor's degree and 2 years of coaching youth soccer. Holds a state substitute authorization and is available for K–12 assignments every weekday." },
      { level: "Mid level", text: "Substitute teacher with 3 years in K–12 classrooms. I cover 140+ days a year across 9 schools and completed a 6-week long-term assignment in 7th-grade math." },
      { level: "Career changer", text: "Former corporate trainer moving into teaching. Substitute teaching across grades 6–12 while completing an alternative teacher licensure program." },
    ],
    bullets: [
      { skill: "Reliability", weak: "Subbed in many schools", strong: "Covered 140+ days a year across 9 elementary, middle and high schools" },
      { skill: "Lesson plans", weak: "Followed plans", strong: "Followed teachers' lesson plans and left end-of-day notes on what was covered and any behavior concerns" },
      { skill: "Long-term", weak: "Did a long-term job", strong: "Completed a 6-week long-term assignment in 7th-grade math, grading work and posting assignments in Google Classroom" },
      { skill: "Reputation", weak: "Teachers liked me", strong: "Requested by name by 12 teachers across the district" },
      { skill: "Behavior", weak: "Managed behavior", strong: "Set routines and expectations that cut after-school incident reports from 9 to 3 per semester" },
      { skill: "Families", weak: "Talked to parents", strong: "Talked with parents at pickup and passed concerns to the director the same day" },
    ],
    keywords: [
      "Substitute teacher", "Classroom management", "Lesson plans", "Behavior management", "Student engagement", "Long-term substitute",
      "K–12", "Attendance", "Grading", "Classroom procedures", "Google Classroom", "PowerSchool", "Substitute authorization",
      "CPR and First Aid", "Parent communication", "Flexibility", "Communication",
    ],
    keywordSort: {
      tools: ["Google Classroom", "PowerSchool"],
      credentials: ["Substitute authorization", "CPR and First Aid"],
      soft: ["Parent communication", "Flexibility", "Communication"],
    },
    tips: [
      { t: "List subbing as one job", d: "Put the district or staffing agency as the employer with one date range, then use bullets for days, schools and grade levels." },
      { t: "Lead with reliability", d: "Days covered per year, schools served and teachers who request you by name are the numbers principals care about." },
      { t: "Highlight long-term assignments", d: "A multi-week assignment where you graded and planned shows you can do more than follow a sub plan." },
      { t: "Name your authorization", d: "Write your state's exact title for the substitute license, permit or authorization, and include CPR and First Aid if you have it." },
      { t: "Show classroom management", d: "Routines, expectations and calm redirection are what make a sub successful. Give one example in a bullet." },
    ],
    faqs: [
      { q: "What do I need to become a substitute teacher?", a: "It depends on the state. Colorado, for example, offers a one-year substitute authorization with a high school diploma, a three-year authorization with a bachelor's degree and a five-year authorization with a full teaching license, plus a fingerprint background check. Check your state education department's rules." },
      { q: "How do I list substitute teaching for several schools?", a: "List it as one job under the district or agency, with one date range. Say how many schools and grade levels you covered in the bullets." },
      { q: "Should I include a long-term substitute assignment separately?", a: "You can list it as a bullet, or as its own entry if it was long and you planned lessons and graded. Give the grade, subject and length." },
      { q: "Can substitute teaching help me get a full-time teaching job?", a: "Yes. It shows principals how you handle a room. On your resume, mention teachers who request you, long-term assignments and any licensure program you're in." },
      { q: "How long should a substitute teacher resume be?", a: "One page. Put your authorization, availability and range of grades near the top, then your subbing and other work with children." },
    ],
    related: ["teacher", "teacher-assistant", "preschool-teacher", "special-education-teacher"],
  },
  {
    slug: "preschool-teacher",
    role: "Preschool Teacher",
    group: "Education",
    level: "Experienced · 6 years",
    intro:
      "A preschool teacher resume that shows a well-run, play-based classroom and real progress for young children — with the credential, curriculum and assessment keywords early learning centers screen for.",
    resume: {
      name: "Molly Jensen",
      headline: "Lead Preschool Teacher, CDA",
      contact: "Minneapolis, MN · molly.jensen@email.com · (612) 555-0119",
      summary:
        "Preschool teacher with 6 years in toddler and pre-K classrooms. I plan play-based lessons, track each child's development and keep families closely involved in their child's day.",
      jobs: [
        {
          title: "Lead Preschool Teacher, Pre-K",
          company: "Bright Pines Early Learning Center",
          dates: "Aug 2022 – Present",
          bullets: [
            "Lead a classroom of 16 four- and five-year-olds with one assistant teacher, planning weekly lessons with The Creative Curriculum",
            "Assess children 3 times a year with Teaching Strategies GOLD and share results with families at conferences",
            "By spring, 14 of 16 children met widely held expectations in literacy, up from 9 in the fall — our main kindergarten readiness goal",
            "Use play-based learning and social-emotional learning routines, such as a calm-down corner and daily feelings check-ins",
            "Send daily updates and photos to families in Brightwheel and keep the room in line with state licensing standards and health and safety rules",
          ],
        },
        {
          title: "Assistant Teacher, Toddler Room",
          company: "Little Harbor Child Care Center",
          dates: "Jun 2020 – Jul 2022",
          bullets: [
            "Supported a toddler room of 10 with two co-teachers, running sensory, art and outdoor play",
            "Worked with families on toilet learning and kept daily logs of meals, naps and diapering",
            "Used observation and assessment notes to help the lead teacher plan activities around each child's child development goals",
          ],
        },
      ],
      education:
        "A.A.S. Early Childhood Education, North Lakes Community College, 2020 · CDA Credential (Preschool), Council for Professional Recognition · Pediatric CPR and First Aid",
      skills: [
        "Early childhood education", "Lesson planning", "Play-based learning", "Social-emotional learning", "Classroom management",
        "Observation and assessment", "The Creative Curriculum", "Teaching Strategies GOLD", "Brightwheel", "Family engagement",
        "Health and safety", "Licensing standards",
      ],
    },
    whyItWorks:
      "It names the credential, curriculum and assessment tool a director checks for, gives class size and age group, and shows child progress as a group result, never by individual child.",
    summaries: [
      { level: "Entry level", text: "Early childhood education student completing a CDA, with 2 years as a toddler room assistant and summers at a day camp. Pediatric CPR and First Aid certified." },
      { level: "Experienced", text: "Preschool teacher with 6 years in toddler and pre-K classrooms. I lead a class of 16 with The Creative Curriculum and Teaching Strategies GOLD." },
      { level: "Senior", text: "Lead teacher and curriculum coordinator with 12 years in early learning who mentors new teachers, plans for 5 classrooms and prepares the center for accreditation visits." },
    ],
    bullets: [
      { skill: "Lesson planning", weak: "Planned activities", strong: "Planned weekly play-based lessons with The Creative Curriculum for a pre-K class of 16" },
      { skill: "Assessment", weak: "Tracked progress", strong: "Assessed children 3 times a year with Teaching Strategies GOLD and shared results at family conferences" },
      { skill: "Readiness", weak: "Got kids ready for kindergarten", strong: "14 of 16 children met widely held expectations in literacy by spring, up from 9 in the fall" },
      { skill: "Social-emotional", weak: "Helped with feelings", strong: "Built a calm-down corner and daily feelings check-ins as part of social-emotional learning" },
      { skill: "Families", weak: "Talked to parents", strong: "Sent daily updates and photos in Brightwheel and held conferences with every family twice a year" },
      { skill: "Toddlers", weak: "Worked with toddlers", strong: "Supported a toddler room of 10 with sensory, art and outdoor play and helped families with toilet learning" },
    ],
    keywords: [
      "Early childhood education", "Lesson planning", "Play-based learning", "Social-emotional learning", "Child development",
      "Kindergarten readiness", "Classroom management", "Observation and assessment", "The Creative Curriculum", "Teaching Strategies GOLD",
      "Brightwheel", "Family engagement", "Health and safety", "Licensing standards", "CDA", "Pediatric CPR and First Aid", "Patience",
    ],
    keywordSort: {
      tools: ["The Creative Curriculum", "Teaching Strategies GOLD", "Brightwheel"],
      credentials: ["CDA", "Pediatric CPR and First Aid"],
      soft: ["Family engagement", "Patience"],
    },
    tips: [
      { t: "Put your credential and degree up top", d: "A CDA, an early childhood degree or a state credential is often required for lead teachers. Make it easy to find." },
      { t: "Give age group and class size", d: "\"Pre-K class of 16 four- and five-year-olds\" tells a director exactly where you fit." },
      { t: "Name your curriculum and assessment tools", d: "The Creative Curriculum, HighScope, Teaching Strategies GOLD and similar tools show up in job posts. List the ones you've used." },
      { t: "Show progress as a group", d: "Use class-wide results, such as how many children met expectations. Never name or describe an individual child." },
      { t: "Mention families and safety", d: "Daily family communication and following licensing and health rules matter as much as lesson plans in early learning." },
    ],
    faqs: [
      { q: "What is the CDA credential?", a: "The Child Development Associate (CDA) credential is awarded by the Council for Professional Recognition. Candidates complete 120 hours of professional education and 480 hours of experience with young children, then a portfolio, observation and exam. It's renewed every three years." },
      { q: "Do I need a degree to be a preschool teacher?", a: "It depends on the state, the program and the funding source. Some centers hire lead teachers with a CDA; public pre-K and some programs require an associate or bachelor's degree. Check the posting." },
      { q: "How do I show results without sharing children's information?", a: "Use group results, such as \"14 of 16 children met widely held expectations in literacy,\" and describe children by age group only." },
      { q: "What if I've only worked as an assistant teacher?", a: "List the room, age group and what you led yourself — circle time, centers or family updates — and mention any CDA or coursework in progress." },
      { q: "How long should a preschool teacher resume be?", a: "One page. Put your credential, age group and class size near the top, then two or three jobs with curriculum, assessment and family bullets." },
    ],
    related: ["teacher-assistant", "teacher", "substitute-teacher"],
  },
  {
    slug: "special-education-teacher",
    role: "Special Education Teacher",
    group: "Education",
    level: "Experienced · 7 years",
    intro:
      "A special education teacher resume that shows strong IEPs, measurable student progress and solid teamwork with families and staff — with the license, IDEA and instruction keywords school districts screen for.",
    resume: {
      name: "Simone Bradley",
      headline: "Special Education Teacher, LBS I",
      contact: "Joliet, IL · simone.bradley@email.com · (815) 555-0147",
      summary:
        "Special education teacher with 7 years in resource, co-teaching and self-contained classrooms. I write clear, measurable IEPs, use data to adjust instruction and keep families part of every decision.",
      jobs: [
        {
          title: "Special Education Teacher, Resource and Co-Teaching",
          company: "Prairie Path Middle School",
          dates: "Aug 2021 – Present",
          bullets: [
            "Manage a caseload of 14 students with an IEP in grades 6–8, writing present levels, measurable IEP goals and accommodations",
            "Co-teach 3 periods of 7th-grade ELA and math in inclusion classrooms and run small-group instruction in the resource room",
            "Collect progress monitoring data every week; last year 11 of 14 students on my caseload met at least 80% of their annual IEP goals",
            "Lead annual IEP meetings and coordinate reevaluations with the school psychologist, speech-language pathologist and families under IDEA",
            "Write behavior intervention plans with the school's behavior team and keep student records confidential under FERPA",
          ],
        },
        {
          title: "Special Education Teacher, Self-Contained K–2",
          company: "Willow Run Elementary School",
          dates: "Aug 2019 – Jun 2021",
          bullets: [
            "Taught a self-contained class of 8 students in grades K–2 with autism and other disabilities, with 2 paraprofessionals",
            "Built classroom routines with visual schedules and token systems that cut daily behavior incidents by about half by spring, based on our data collection",
            "Trained and scheduled 2 paraprofessionals and sent weekly parent communication notes home",
          ],
        },
      ],
      education:
        "M.Ed. Special Education, Lakeshore State University, 2019 · Illinois Professional Educator License (PEL) · Special education endorsement: LBS I · CPI Nonviolent Crisis Intervention",
      skills: [
        "IEP development", "Case management", "Progress monitoring", "Differentiated instruction", "Co-teaching", "Small-group instruction",
        "Behavior intervention plans", "Data collection", "Accommodations", "Autism", "Paraprofessional supervision", "Parent communication",
      ],
    },
    whyItWorks:
      "It shows caseload, grade band and setting right away, proves IEP work with a group goal-attainment result, and names the legal framework — IDEA and FERPA — that special education directors expect teachers to know.",
    summaries: [
      { level: "New teacher", text: "Newly licensed special education teacher with a student teaching placement in a K–5 resource room and a summer as a paraprofessional in extended school year. Trained in writing measurable IEP goals and progress monitoring." },
      { level: "Experienced", text: "Special education teacher with 7 years in resource, co-teaching and self-contained classrooms. I manage a caseload of 14, and 11 of 14 students met at least 80% of their IEP goals last year." },
      { level: "Senior", text: "Special education department lead with 13 years in K–8 who mentors new teachers, supports IEP compliance across a building and leads co-teaching training for general education staff." },
    ],
    bullets: [
      { skill: "Caseload", weak: "Worked with IEP students", strong: "Managed a caseload of 14 students with an IEP in grades 6–8, writing measurable goals and accommodations" },
      { skill: "Progress", weak: "Tracked IEP goals", strong: "Collected weekly progress monitoring data; 11 of 14 students met at least 80% of their annual IEP goals" },
      { skill: "Co-teaching", weak: "Co-taught classes", strong: "Co-taught 3 periods of 7th-grade ELA and math and ran small-group instruction in the resource room" },
      { skill: "IEP meetings", weak: "Went to IEP meetings", strong: "Led annual IEP meetings and coordinated reevaluations with the school psychologist, SLP and families" },
      { skill: "Behavior", weak: "Handled behavior", strong: "Used visual schedules and token systems that cut daily behavior incidents by about half by spring" },
      { skill: "Team leadership", weak: "Worked with aides", strong: "Trained and scheduled 2 paraprofessionals in a self-contained K–2 classroom" },
    ],
    keywords: [
      "Special education", "IEP", "IDEA", "IEP goals", "Case management", "Progress monitoring", "Accommodations", "Co-teaching", "Inclusion",
      "Differentiated instruction", "Small-group instruction", "Behavior intervention plans", "Data collection", "Autism",
      "Paraprofessional supervision", "FERPA", "Parent communication", "Special education endorsement",
    ],
    keywordSort: {
      credentials: ["Special education endorsement"],
      soft: ["Parent communication"],
    },
    tips: [
      { t: "Lead with license and endorsement", d: "Name your state teaching license and special education endorsement exactly as issued, such as an Illinois PEL with an LBS I endorsement." },
      { t: "Give caseload, grades and setting", d: "\"Caseload of 14, grades 6–8, resource and co-teaching\" tells a director where you fit in one line." },
      { t: "Show IEP results as a group", d: "Goal attainment across your caseload shows the effect of your teaching without identifying any student." },
      { t: "Name the framework", d: "IDEA, IEP, FERPA, progress monitoring and behavior intervention plans are terms districts screen for. Use them where they're accurate." },
      { t: "Show teamwork", d: "Special education depends on general education teachers, related service providers, paraprofessionals and families. One bullet on how you work with them helps." },
    ],
    faqs: [
      { q: "What license do I need to teach special education?", a: "A state teaching license with a special education endorsement or certification. Names differ by state — in Illinois, for example, it's a Professional Educator License (PEL) with the Learning Behavior Specialist I (LBS I) endorsement. List yours exactly as issued." },
      { q: "How often are IEPs reviewed?", a: "Under IDEA, the IEP team reviews each IEP at least once a year, and a reevaluation happens at least once every three years unless the parent and school agree it isn't needed. Mentioning that you lead annual reviews and coordinate reevaluations shows you know the process." },
      { q: "How do I describe student progress without breaking privacy?", a: "Use caseload-wide numbers, such as \"11 of 14 students met at least 80% of their IEP goals,\" and describe students by grade and setting only. FERPA protects student records, so leave out anything that could identify a child." },
      { q: "How do I move from general education to special education?", a: "Highlight co-teaching, differentiated instruction, accommodations you've used and any IEP meetings you've joined, and list the endorsement you've earned or are completing." },
      { q: "How long should a special education teacher resume be?", a: "One or two pages. One page is enough for most teachers; use two only if you have many years, multiple settings and leadership roles worth describing." },
    ],
    related: ["teacher", "teacher-assistant", "school-counselor", "substitute-teacher"],
  },

  // ---------------------------------------------------------- People & service
  {
    slug: "receptionist",
    role: "Receptionist",
    group: "People & service",
    photo: { src: "/images/photos/role-receptionist.webp", alt: "Front desk receptionist checking in a client at a salon counter with a tablet" },
    level: "Mid-level · 4 years experience",
    intro:
      "A receptionist resume that shows a calm, organized front desk — phones, visitors, scheduling and the small fixes that keep an office running — with the keywords office managers search for.",
    resume: {
      name: "Kayla Robinson",
      headline: "Receptionist, Professional and Medical Offices",
      contact: "Atlanta, GA · kayla.robinson@email.com · (404) 555-0193",
      summary:
        "Receptionist with 4 years at the front desk of a law firm and a dental office. I greet every visitor warmly, keep calls and messages moving and make sure the right person always knows who's waiting.",
      jobs: [
        {
          title: "Receptionist",
          company: "Midtown Arbor Law Group",
          dates: "Mar 2024 – Present",
          bullets: [
            "Greet 60–80 clients and visitors a day at the front desk of a 45-person law firm and manage visitor management, sign-in and badges",
            "Answer a multi-line phone system and handle call routing for 120+ calls a day to attorneys and staff",
            "Book 8 conference rooms in Microsoft Outlook and handle scheduling and calendar management for client meetings",
            "Cut missed phone messages by moving from paper slips to Microsoft Teams messages and a shared inbox",
            "Cover mail handling and couriers, do data entry for the client log and order office supplies within a monthly budget",
          ],
        },
        {
          title: "Front Desk Receptionist",
          company: "Chattahoochee Family Dental",
          dates: "Jun 2022 – Feb 2024",
          bullets: [
            "Checked in 50+ patients a day, handled insurance verification and collected copays in Dentrix",
            "Confirmed next-day appointments by phone and text, and the office's no-show rate fell from 12% to 7%",
            "Kept patient information private under HIPAA and answered billing questions with clear customer service",
          ],
        },
      ],
      education: "A.A. Business Administration, Peachtree Valley College, 2022 · Typing: 65 WPM",
      skills: [
        "Front desk", "Multi-line phone system", "Call routing", "Visitor management", "Scheduling", "Calendar management", "Data entry",
        "Microsoft Outlook", "Microsoft Teams", "Microsoft Office", "Dentrix", "Insurance verification", "Customer service",
      ],
    },
    whyItWorks:
      "It gives the front desk real numbers — visitors, calls, rooms — names the software, and adds one small process fix and one result, so a manager sees an organized receptionist rather than someone who just answers phones.",
    summaries: [
      { level: "Entry level", text: "Friendly, organized first-time receptionist with 2 years in retail customer service. Comfortable on phones and Microsoft Office, types 55 WPM and is available full time." },
      { level: "Mid level", text: "Receptionist with 4 years at a law firm and dental office. I greet 60–80 visitors and route 120+ calls a day while keeping conference rooms and schedules on track." },
      { level: "Senior", text: "Lead receptionist with 9 years in corporate offices who manages the front desk for a 300-person headquarters, trains backup receptionists and runs the visitor management system." },
    ],
    bullets: [
      { skill: "Visitors", weak: "Greeted visitors", strong: "Greeted 60–80 clients and visitors a day and ran sign-in and badges for a 45-person law firm" },
      { skill: "Phones", weak: "Answered phones", strong: "Routed 120+ calls a day on a multi-line phone system to attorneys and staff" },
      { skill: "Scheduling", weak: "Booked rooms", strong: "Booked 8 conference rooms in Outlook and scheduled client meetings without double bookings" },
      { skill: "Process", weak: "Took messages", strong: "Replaced paper message slips with Teams messages and a shared inbox, cutting missed messages" },
      { skill: "Patients", weak: "Checked in patients", strong: "Checked in 50+ patients a day, verified insurance and collected copays in Dentrix" },
      { skill: "Results", weak: "Called patients", strong: "Confirmed next-day appointments by phone and text as the no-show rate fell from 12% to 7%" },
    ],
    keywords: [
      "Receptionist", "Front desk", "Multi-line phone system", "Call routing", "Visitor management", "Scheduling", "Calendar management",
      "Data entry", "Microsoft Outlook", "Microsoft Teams", "Microsoft Office", "Dentrix", "Insurance verification", "Mail handling",
      "Office supplies", "Customer service", "HIPAA", "Professionalism", "Multitasking",
    ],
    keywordSort: {
      tools: ["Microsoft Outlook", "Microsoft Teams", "Microsoft Office", "Dentrix"],
      soft: ["Customer service", "Professionalism", "Multitasking"],
    },
    tips: [
      { t: "Give the front desk numbers", d: "Visitors a day, calls a day and the size of the office tell a manager how busy your desk was." },
      { t: "Name the software", d: "Outlook, Teams, phone systems and any scheduling or practice software, such as Dentrix, are common screening terms." },
      { t: "Show one improvement", d: "A better message system, a cleaner sign-in or fewer no-shows shows you make the office run better, not just answer the phone." },
      { t: "Match the setting", d: "Medical, legal and corporate front desks differ. Mention HIPAA for medical offices and confidentiality for law firms." },
      { t: "Include typing speed if it's strong", d: "Around 60 WPM or higher is worth listing for roles with data entry." },
    ],
    faqs: [
      { q: "What skills should a receptionist list?", a: "Phones and call routing, greeting visitors, scheduling, data entry and office software, plus customer service. Add setting-specific skills such as insurance verification for medical offices." },
      { q: "How do I show results as a receptionist?", a: "Use volume and small improvements: calls and visitors a day, rooms or calendars you manage, and any process you fixed, such as messages or confirmations." },
      { q: "What if I have no office experience?", a: "Use retail, restaurant or customer service work. Greeting customers, handling phones, managing a register and solving problems all carry over to a front desk." },
      { q: "Receptionist or front desk coordinator — which title should I use?", a: "Use your actual title, and mirror the job post's wording in your headline or summary if it's accurate." },
      { q: "How long should a receptionist resume be?", a: "One page. A short summary, two or three jobs with numbers and a skills line with your software is plenty." },
    ],
    related: ["administrative-assistant", "front-desk-agent", "customer-service-representative", "office-manager"],
  },
  {
    slug: "office-manager",
    role: "Office Manager",
    group: "People & service",
    level: "Senior · 9 years experience",
    intro:
      "An office manager resume that shows a well-run office in numbers — budgets, vendors, onboarding and moves — with the operations, finance and software keywords small and mid-size companies search for.",
    resume: {
      name: "Diane Russo",
      headline: "Office Manager",
      contact: "Providence, RI · diane.russo@email.com · (401) 555-0152",
      summary:
        "Office manager with 9 years running offices for an architecture firm and an insurance agency. I keep budgets on track, vendors accountable and new hires set up from day one, so everyone else can focus on their work.",
      jobs: [
        {
          title: "Office Manager",
          company: "Harbor Lane Architects",
          dates: "Jun 2020 – Present",
          bullets: [
            "Run office management and day-to-day operations for a 35-person architecture firm: facilities, vendors, supplies, IT tickets and the front desk",
            "Own a $180K annual office budget and cut vendor costs by 14% by rebidding cleaning, copier and coffee contracts as part of vendor management",
            "Send biweekly payroll inputs in Gusto, run onboarding for new hires and keep HR administration and personnel files current",
            "Enter and track accounts payable in QuickBooks and reconcile the office credit card each month",
            "Planned an office move for 35 staff over one weekend with no lost workdays",
          ],
        },
        {
          title: "Office Administrator",
          company: "Pawtuxet Valley Insurance Agency",
          dates: "Aug 2017 – May 2020",
          bullets: [
            "Managed scheduling, phones, filing and supplies for a 12-person insurance agency",
            "Moved paper files to a shared Google Workspace drive, cutting the time to find a client file from minutes to seconds",
            "Handled event planning for the agency's client appreciation events and quarterly team lunches",
          ],
        },
      ],
      education: "B.S. Business Administration, Narragansett Bay University, 2017",
      skills: [
        "Office management", "Budget management", "Vendor management", "Facilities", "Accounts payable", "Payroll", "Onboarding",
        "HR administration", "QuickBooks", "Gusto", "Microsoft 365", "Google Workspace", "Event planning",
      ],
    },
    whyItWorks:
      "It shows the size of the office she runs, the money she controls and what she saved, and it covers the full spread of the job — facilities, finance, HR and events — with the tools named.",
    summaries: [
      { level: "Entry level", text: "Administrative assistant ready to move into office management, with 3 years supporting a 20-person office. I handle supplies, vendors and onboarding and track invoices in QuickBooks." },
      { level: "Mid level", text: "Office manager with 5 years in small professional offices. I run facilities, vendors and new-hire setup and keep the office budget on track." },
      { level: "Senior", text: "Office manager with 9 years running offices for an architecture firm and an insurance agency. I own a $180K budget and cut vendor costs by 14%." },
    ],
    bullets: [
      { skill: "Budget", weak: "Managed the office budget", strong: "Owned a $180K annual office budget and cut vendor costs by 14% by rebidding 3 contracts" },
      { skill: "Operations", weak: "Ran the office", strong: "Ran facilities, vendors, supplies, IT tickets and the front desk for a 35-person firm" },
      { skill: "HR support", weak: "Helped with HR", strong: "Sent biweekly payroll inputs in Gusto and ran onboarding for every new hire" },
      { skill: "Finance", weak: "Paid bills", strong: "Entered and tracked accounts payable in QuickBooks and reconciled the office credit card monthly" },
      { skill: "Projects", weak: "Helped with the office move", strong: "Planned an office move for 35 staff over one weekend with no lost workdays" },
      { skill: "Organization", weak: "Organized files", strong: "Moved paper files to a shared Google Workspace drive so staff could find client files in seconds" },
    ],
    keywords: [
      "Office management", "Operations", "Budget management", "Vendor management", "Facilities", "Accounts payable", "QuickBooks", "Gusto",
      "Payroll", "Onboarding", "HR administration", "Microsoft 365", "Google Workspace", "Event planning", "Process improvement",
      "Leadership", "Problem solving",
    ],
    keywordSort: {
      tools: ["QuickBooks", "Gusto", "Microsoft 365", "Google Workspace"],
      soft: ["Leadership", "Problem solving"],
    },
    tips: [
      { t: "Give the size of the office", d: "\"35-person architecture firm\" tells a hiring manager the scale you're used to running." },
      { t: "Put money in numbers", d: "The budget you manage and what you saved are the strongest lines on an office manager resume." },
      { t: "Show the full spread of the job", d: "Facilities, vendors, finance, HR support and events — cover the areas the posting lists." },
      { t: "Name the systems", d: "QuickBooks, Gusto, ADP, Microsoft 365 and Google Workspace are common screening terms. List the ones you use." },
      { t: "Include one project", d: "An office move, a new vendor or a new filing system shows you can plan and finish something bigger than daily tasks." },
    ],
    faqs: [
      { q: "What's the difference between an office manager and an administrative assistant?", a: "Office managers usually own the office budget, vendors and facilities, and often HR and finance tasks. Administrative assistants more often support specific people with calendars, travel and documents." },
      { q: "Should I include HR and bookkeeping tasks?", a: "Yes, if you do them. Payroll inputs, onboarding and accounts payable are common parts of office management, especially in small companies." },
      { q: "How do I move from administrative assistant to office manager?", a: "Show any budget, vendor, facilities or onboarding work you've owned, with numbers, and mention projects you've run, such as a move or a new system." },
      { q: "Do office managers need a certification?", a: "Usually not. Experience and results matter most. If you hold one, such as the Certified Administrative Professional (CAP) from IAAP, list it in your education section." },
      { q: "How long should an office manager resume be?", a: "One page for most office managers. Two pages can work with 10+ years if every line shows scope or results." },
    ],
    related: ["administrative-assistant", "executive-assistant", "bookkeeper", "hr-generalist"],
  },
  {
    slug: "executive-assistant",
    role: "Executive Assistant",
    group: "People & service",
    level: "Senior · 8 years experience",
    intro:
      "An executive assistant resume that shows senior-level support — complex calendars, travel, board materials and confidential work — with the tools and skills keywords recruiters for C-suite roles search for.",
    resume: {
      name: "Caroline Hughes",
      headline: "Executive Assistant to the CEO",
      contact: "New York, NY · caroline.hughes@email.com · (212) 555-0171",
      summary:
        "Executive assistant with 8 years supporting CEOs and senior leaders in health technology and advertising. I protect my executive's time, run the details behind board meetings and offsites, and handle confidential work with discretion.",
      jobs: [
        {
          title: "Executive Assistant to the CEO",
          company: "Ashgrove Health Technologies",
          dates: "Mar 2022 – Present",
          bullets: [
            "Provide executive support to the CEO and 2 SVPs at a 600-person company, with calendar management across 4 time zones",
            "Handle travel planning for 30+ domestic and international trips a year and file expense reports in Concur",
            "Prepare materials for quarterly board meetings in PowerPoint, track action items and keep board documents confidential",
            "Handle email management for the CEO, screening 150+ emails a day, drafting replies and flagging what needs a decision",
            "Planned a 3-day leadership offsite for 45 people and came in under budget, from venue contracts to agendas",
          ],
        },
        {
          title: "Executive Assistant",
          company: "Hollis & Grant Advertising",
          dates: "Jul 2018 – Feb 2022",
          bullets: [
            "Supported 3 executives with meeting coordination, client calls on Zoom and Microsoft Outlook scheduling",
            "Ran project coordination for the agency's annual client summit, working with 6 department leads",
            "Built a shared Microsoft 365 tracker for executive requests that cut follow-up emails between teams",
          ],
        },
      ],
      education: "B.A. Communications, Hudson Ridge College, 2018 · Certified Administrative Professional, CAP (IAAP)",
      skills: [
        "Executive support", "Calendar management", "Travel planning", "Expense reports", "Board meetings", "Meeting coordination",
        "Event planning", "Email management", "Project coordination", "Concur", "Microsoft 365", "Outlook", "PowerPoint", "Zoom", "Confidentiality",
      ],
    },
    whyItWorks:
      "It says exactly who she supports and at what scale, puts the confidential, high-stakes work — board meetings, an offsite, the CEO's inbox — in plain numbers, and lists the tools recruiters filter for.",
    summaries: [
      { level: "Entry level", text: "Administrative assistant with 3 years supporting a sales director, ready to step up to executive support. I manage calendars and travel in Outlook and Concur and handle confidential files with care." },
      { level: "Mid level", text: "Executive assistant with 5 years supporting two VPs at a growing tech company. I run calendars across time zones, plan travel and prepare leadership meeting materials." },
      { level: "Senior", text: "Executive assistant with 8 years supporting CEOs and senior leaders. I support the CEO and 2 SVPs of a 600-person company and prepare quarterly board meeting materials." },
    ],
    bullets: [
      { skill: "Executive support", weak: "Supported executives", strong: "Supported the CEO and 2 SVPs of a 600-person company, managing calendars across 4 time zones" },
      { skill: "Travel", weak: "Booked travel", strong: "Planned 30+ domestic and international trips a year and filed expense reports in Concur" },
      { skill: "Board meetings", weak: "Helped with board meetings", strong: "Prepared quarterly board meeting materials in PowerPoint and tracked every action item" },
      { skill: "Inbox", weak: "Managed email", strong: "Screened 150+ emails a day for the CEO, drafting replies and flagging what needed a decision" },
      { skill: "Events", weak: "Planned events", strong: "Planned a 3-day leadership offsite for 45 people and came in under budget" },
      { skill: "Coordination", weak: "Worked with other teams", strong: "Ran project coordination for an annual client summit with 6 department leads" },
    ],
    keywords: [
      "Executive support", "Calendar management", "Travel planning", "Expense reports", "Board meetings", "Meeting coordination",
      "Event planning", "Email management", "Project coordination", "Concur", "Microsoft 365", "Outlook", "PowerPoint", "Zoom",
      "Confidentiality", "CAP (IAAP)", "Discretion", "Stakeholder communication",
    ],
    keywordSort: {
      tools: ["Concur", "Microsoft 365", "Outlook", "PowerPoint", "Zoom"],
      credentials: ["CAP (IAAP)"],
      soft: ["Confidentiality", "Discretion", "Stakeholder communication"],
    },
    tips: [
      { t: "Say exactly who you support", d: "\"CEO and 2 SVPs at a 600-person company\" shows your level right away." },
      { t: "Put complexity in numbers", d: "Time zones, trips a year, emails a day and board meetings show how much you manage." },
      { t: "Show discretion without details", d: "Mention board materials or confidential projects in general terms. Never share specifics about your executive or company." },
      { t: "Name your tools", d: "Outlook, Microsoft 365, Concur, Zoom and PowerPoint are common screening terms for executive assistant roles." },
      { t: "Include one project you ran", d: "An offsite, a summit or a new request tracker shows you can own work, not just schedule it." },
    ],
    faqs: [
      { q: "What's the difference between an executive assistant and an administrative assistant?", a: "Executive assistants usually support one or a few senior leaders and handle more confidential, high-stakes work, such as board materials and strategic calendars. Administrative assistants more often support a team or department." },
      { q: "Should I list the executive's name?", a: "No. Use the title — CEO, CFO or SVP of Sales — and the company size. That shows your level without sharing details about a person." },
      { q: "Is the CAP certification worth listing?", a: "Yes, if you hold it. The Certified Administrative Professional (CAP) from the International Association of Administrative Professionals (IAAP) is a recognized credential in the field. Put it with your education." },
      { q: "How do I show impact as an executive assistant?", a: "Use scope and results: who you support, the volume you manage, time you saved your executive, events you delivered on budget and processes you improved." },
      { q: "How long should an executive assistant resume be?", a: "One page for most. Two pages can work for senior executive assistants with 10+ years if each line shows scope or results." },
    ],
    related: ["administrative-assistant", "office-manager", "project-manager", "receptionist"],
  },
];
