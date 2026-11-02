/**
 * Extra sample resumes for the highest-search roles, keyed by slug and merged
 * into RESUME_EXAMPLES as `variants`. Each one covers a different level or
 * specialty from the role's main sample. People, employers and figures are
 * fictional; licenses and certifications are real and fit the level shown.
 */

import type { ResumeVariant } from "@/lib/resume-examples";

export const RESUME_EXAMPLE_VARIANTS: Record<string, ResumeVariant[]> = {
  teacher: [
    {
      id: "elementary",
      label: "Elementary teacher",
      level: "Grade 3 · 5 years",
      resume: {
        name: "Rosa Delgado",
        headline: "Elementary School Teacher, Grade 3",
        contact: "Sacramento, CA · rosa.delgado@email.com · (916) 555-0148",
        summary:
          "Third grade teacher with 5 years in self-contained elementary classrooms. I teach early reading through explicit phonics and small groups, and I keep families involved in every step.",
        jobs: [
          {
            title: "3rd Grade Teacher",
            company: "Riverbend Elementary School",
            dates: "Aug 2023 – Present",
            bullets: [
              "Teach all core subjects to a class of 26, including 7 English learners and 3 students with 504 plans",
              "Moved 19 of 26 students to on-grade-level reading by spring, measured on i-Ready diagnostics",
              "Run daily guided reading and phonics groups, regrouping every 6 weeks from progress-monitoring data",
              "Held fall and spring conferences with every family, using a Spanish interpreter for 6 of them",
            ],
          },
          {
            title: "2nd Grade Teacher",
            company: "Oak Hollow Elementary School",
            dates: "Aug 2021 – Jun 2023",
            bullets: [
              "Built a PBIS classroom economy that cut office referrals from 14 to 3 in one year",
              "Planned designated ELD lessons with the grade-level team for 11 English learners",
              "Served on the Student Study Team, writing intervention plans for struggling readers",
            ],
          },
        ],
        education: "B.A. Liberal Studies, California State University, Sacramento, 2020 · California Clear Multiple Subject Teaching Credential",
        skills: ["Guided reading", "Phonics instruction", "Small-group instruction", "English learner support (ELD)", "PBIS", "i-Ready", "Seesaw", "Progress monitoring", "Family conferences", "Classroom routines"],
      },
      whyItWorks:
        "An elementary principal wants to know the grade, the class makeup and whether kids learn to read. This sample names all three, shows growth on a named assessment, and lists the credential that lets her teach every subject.",
    },
    {
      id: "high-school-english",
      label: "High school English teacher",
      level: "Grades 9–12 · 8 years",
      resume: {
        name: "Marcus Reed",
        headline: "High School English Teacher",
        contact: "Aurora, IL · marcus.reed@email.com · (630) 555-0187",
        summary:
          "English teacher with 8 years in grades 9–12, including AP English Language. I teach students to read closely and write arguments they can defend, and I advise the student newspaper.",
        jobs: [
          {
            title: "English Teacher",
            company: "Prairie View High School",
            dates: "Aug 2020 – Present",
            bullets: [
              "Teach English 10 and AP English Language and Composition to about 140 students a year",
              "Grew AP Language from 1 section to 3 while keeping more than 60% of students scoring 3 or higher",
              "Introduced a writing workshop with peer conferences; average rubric scores on argument essays rose a full point",
              "Advise the student newspaper, which publishes 8 print issues and a weekly online edition",
            ],
          },
          {
            title: "English Teacher",
            company: "Fox River Valley High School",
            dates: "Aug 2018 – Jun 2020",
            bullets: [
              "Taught English 9 and a reading support class for freshmen reading below grade level",
              "Co-wrote the 9th grade research paper unit, now used by all 6 freshman English teachers",
              "Moved my courses to Schoology during remote learning and kept weekly assignment completion above 85%",
            ],
          },
        ],
        education: "B.A. English, Illinois State University, 2018 · Illinois Professional Educator License (PEL), English Language Arts 9–12",
        skills: ["Literary analysis", "Argumentative writing", "AP English Language", "Writing workshop", "Rubric design", "Reading intervention", "Schoology", "Turnitin", "Student newspaper advising", "Curriculum writing"],
      },
      whyItWorks:
        "Secondary hiring is subject-first, so the course names and the 9–12 endorsement come early. The bullets show both advanced and support classes, AP results stated honestly as a share of students, and leadership outside the classroom.",
    },
    {
      id: "first-year",
      label: "First-year teacher",
      level: "New teacher · student teaching",
      resume: {
        name: "Owen Gallagher",
        headline: "Social Studies Teacher, Grades 5–12",
        contact: "Worcester, MA · owen.gallagher@email.com · (508) 555-0136",
        summary:
          "New history teacher who finished a full-year practicum in a 10th grade U.S. History classroom. I plan document-based lessons that get every student talking, not just the hand-raisers.",
        jobs: [
          {
            title: "Student Teacher, U.S. History",
            company: "Lakeview Regional High School",
            dates: "Sep 2025 – May 2026",
            bullets: [
              "Took over full teaching duties for 4 sections of 10th grade U.S. History, about 95 students, for 12 weeks",
              "Designed a primary-source unit on the Progressive Era with document-based questions and a structured debate",
              "Used sentence frames and vocabulary walls to support 14 English learners, in line with SEI strategies",
              "Called or emailed every family in my first month to introduce myself and share the unit calendar",
            ],
          },
          {
            title: "Summer Program Instructor",
            company: "Bridgeway Summer Academy",
            dates: "Jun 2025 – Aug 2025",
            bullets: [
              "Taught a 6-week civics and reading enrichment course to 18 rising 7th graders",
              "Planned a mock town meeting where students researched, proposed and voted on a local issue",
            ],
          },
        ],
        education: "B.A. History, University of Massachusetts Amherst, 2026 · Massachusetts Initial License, History (5–12) · SEI Endorsement",
        skills: ["Lesson planning", "Primary-source instruction", "Document-based questions", "Sheltered English Immersion (SEI)", "Classroom management", "Formative checks", "Google Classroom", "Family outreach", "Unit design", "Student discussion"],
      },
      whyItWorks:
        "With no full-time job yet, student teaching becomes the main experience entry, written with the same detail as a paid role: grade, course, sections, weeks of full takeover. The license and SEI endorsement show the teacher is ready to be hired.",
    },
    {
      id: "esl",
      label: "ESL teacher",
      level: "Elementary ESL · 6 years",
      resume: {
        name: "Lucía Moreno",
        headline: "ESL Teacher, Grades K–5",
        contact: "Houston, TX · lucia.moreno@email.com · (713) 555-0152",
        summary:
          "Bilingual ESL teacher with 6 years helping elementary English learners build academic English. I co-teach with grade-level teachers so newcomers keep up with content while they learn the language.",
        jobs: [
          {
            title: "ESL Teacher, K–5",
            company: "Cypress Bend Elementary School",
            dates: "Aug 2022 – Present",
            bullets: [
              "Serve 48 English learners through push-in co-teaching and small pull-out groups across 6 grades",
              "Helped 64% of my students advance at least one TELPAS proficiency level in 2025, up from 47% two years earlier",
              "Sit on the campus LPAC, reviewing placement, progress and reclassification for every English learner",
              "Run three family literacy nights a year in Spanish and English, with 60+ families attending each",
            ],
          },
          {
            title: "1st Grade Teacher (ESL classroom)",
            company: "Westchase Park Elementary School",
            dates: "Aug 2020 – Jun 2022",
            bullets: [
              "Taught a self-contained ESL first grade class of 21, planning lessons around the ELPS",
              "Used sheltered instruction strategies — visuals, realia and partner talk — in every content block",
            ],
          },
        ],
        education: "B.S. Interdisciplinary Studies, University of Houston, 2020 · Texas Educator Certificate, Core Subjects EC–6 · English as a Second Language Supplemental",
        skills: ["Sheltered instruction", "Co-teaching", "TELPAS", "LPAC", "ELPS", "Language acquisition", "Newcomer support", "Spanish (fluent)", "Family engagement", "Data tracking"],
      },
      whyItWorks:
        "ESL roles are screened for the supplemental certification and the state's language-proficiency terms. This sample uses Texas's own words — TELPAS, LPAC, ELPS — and shows language growth, co-teaching and work with families.",
    },
    {
      id: "career-changer",
      label: "Career changer into teaching",
      level: "Biology · former lab technician",
      resume: {
        name: "David Okafor",
        headline: "Biology Teacher",
        contact: "Tampa, FL · david.okafor@email.com · (813) 555-0164",
        summary:
          "Biology teacher in my second year after 7 years as a clinical lab technician. I bring real lab work into the classroom so students see why cells, genetics and data matter outside school.",
        jobs: [
          {
            title: "Biology Teacher",
            company: "Palmetto Grove High School",
            dates: "Aug 2025 – Present",
            bullets: [
              "Teach Biology 1 and Honors Biology to about 150 students in grades 9 and 10",
              "Rebuilt 12 labs around real diagnostic methods, including a gel electrophoresis lab using donated equipment",
              "Prepare students for the Biology 1 End-of-Course exam with weekly standards checks and targeted review",
              "Wrote the department's lab safety contract and walkthrough, now used in every science class",
            ],
          },
          {
            title: "Medical Laboratory Technician",
            company: "Suncoast Diagnostics Laboratory",
            dates: "Mar 2018 – Jul 2025",
            bullets: [
              "Ran hematology and chemistry tests on 200+ patient samples a shift with strict quality control",
              "Trained 12 new technicians and wrote 9 standard operating procedures still in use",
              "Volunteered at 3 local high school career days explaining lab careers to students",
            ],
          },
        ],
        education: "B.S. Biology, University of South Florida, 2017 · Florida Temporary Certificate, Biology (6–12)",
        skills: ["Biology instruction", "Lab instruction", "Lab safety", "Inquiry-based learning", "End-of-Course exam prep", "Lesson planning", "Classroom management", "Data analysis", "Adult training", "Microsoft Excel"],
      },
      whyItWorks:
        "A career changer has to show two things: real subject expertise and proof they can teach. Bullets from the lab job are chosen for training, documentation and school outreach, and the Florida certificate shows the teacher is cleared to be in front of a class.",
    },
  ],

  "registered-nurse": [
    {
      id: "new-grad",
      label: "New grad nurse",
      level: "New graduate · BSN 2026",
      resume: {
        name: "Kayla Brooks",
        headline: "Registered Nurse, New Graduate",
        contact: "Charlotte, NC · kayla.brooks@email.com · (704) 555-0119",
        summary:
          "New graduate RN with a BSN and two years as a patient care technician on a progressive care unit. I'm comfortable with high-acuity patients and ready for a nurse residency in step-down or telemetry.",
        jobs: [
          {
            title: "Student Nurse, Capstone Preceptorship (Progressive Care)",
            company: "Carolina Pines Medical Center",
            dates: "Jan 2026 – Apr 2026",
            bullets: [
              "Completed a 180-hour preceptorship on a 28-bed progressive care unit, building up to a 3-patient assignment",
              "Gave scheduled and PRN medications, managed IV drips under supervision and documented in Epic",
              "Gave SBAR handoffs at shift change and to the rapid response team during one patient deterioration",
            ],
          },
          {
            title: "Patient Care Technician",
            company: "Carolina Pines Medical Center",
            dates: "Jun 2024 – Present",
            bullets: [
              "Support RNs on a progressive care unit with vital signs, blood glucose checks and EKG strips for 10–12 patients a shift",
              "Help with mobility, bathing and turns every 2 hours for high-risk patients; the unit had no hospital-acquired pressure injuries in my last 6 months",
              "Recognized by the unit manager for spotting and reporting a sudden drop in a patient's blood pressure",
            ],
          },
        ],
        education: "B.S. Nursing (BSN), University of North Carolina at Charlotte, 2026 · RN license, North Carolina (NCLEX-RN, 2026) · BLS",
        skills: ["Head-to-toe assessment", "SBAR handoff", "Medication administration", "IV management", "Blood glucose monitoring", "Pressure injury prevention", "Infection control", "Epic", "Patient education", "Time management"],
      },
      whyItWorks:
        "New grad resumes win on clinical exposure. The capstone is written like a job with unit type, hours and patient load, the PCT role proves bedside experience, and the NCLEX-RN and license line answers the recruiter's first question.",
    },
    {
      id: "icu",
      label: "ICU nurse",
      level: "Critical care · 6 years",
      resume: {
        name: "Daniel Nguyen",
        headline: "Registered Nurse, Medical ICU, CCRN",
        contact: "Denver, CO · daniel.nguyen@email.com · (303) 555-0177",
        summary:
          "Critical care nurse with 5 years in a medical ICU and a year in progressive care. I manage ventilated, septic and multi-organ-failure patients and serve as a resource for CRRT.",
        jobs: [
          {
            title: "Staff Nurse, Medical ICU",
            company: "Front Range University Hospital",
            dates: "Aug 2021 – Present",
            bullets: [
              "Care for 1–2 critically ill adults per shift in a 24-bed medical ICU, including ventilated and proned patients",
              "Titrate vasoactive and sedation drips to protocol and manage arterial lines and central lines",
              "CRRT super user: trained 14 nurses and cut filter clotting events by about a third with a new anticoagulation checklist",
              "Helped bring the unit to 14 straight months without a CLABSI through daily line-necessity rounds",
            ],
          },
          {
            title: "Registered Nurse, Progressive Care",
            company: "Mile High Regional Medical Center",
            dates: "Jun 2020 – Jul 2021",
            bullets: [
              "Cared for 3–4 step-down patients on BiPAP, insulin drips and cardiac monitoring",
              "Floated to the COVID ICU for 4 months as a team-nursing partner, then joined the medical ICU",
            ],
          },
        ],
        education: "B.S. Nursing (BSN), University of Colorado, 2020 · RN license, Colorado (multistate) · CCRN (Adult) · BLS, ACLS",
        skills: ["Critical care", "Mechanical ventilation", "Vasoactive titration", "CRRT", "Sepsis management", "Arterial and central lines", "Sedation management", "CLABSI prevention", "Epic", "Family communication"],
      },
      whyItWorks:
        "ICU managers look for patient ratio, acuity and devices. This sample names them in the first bullets, adds a measured safety result, and lists CCRN, which the nurse qualifies for after years of direct critical care hours.",
    },
    {
      id: "er",
      label: "ER nurse",
      level: "Emergency · 4 years",
      resume: {
        name: "Alexis Romero",
        headline: "Emergency Department RN, CEN",
        contact: "San Antonio, TX · alexis.romero@email.com · (210) 555-0193",
        summary:
          "Emergency nurse with 4 years in a Level II trauma center and a rural ED. I triage fast, stay calm in trauma and stroke alerts, and keep patients moving through a crowded department.",
        jobs: [
          {
            title: "Registered Nurse, Emergency Department",
            company: "Mission Trail Medical Center (Level II trauma center)",
            dates: "Mar 2023 – Present",
            bullets: [
              "Work all zones of a 58-bed ED that sees about 85,000 visits a year, including triage and the trauma bays",
              "Triage up to 40 patients a shift using the Emergency Severity Index (ESI)",
              "Respond to trauma activations and stroke alerts; joined a stroke team effort that cut median door-to-CT time from 24 to 15 minutes",
              "Start sepsis bundles from triage with nurse-driven protocols for lactate and blood cultures",
            ],
          },
          {
            title: "Registered Nurse, Emergency Department",
            company: "Hill Country Community Hospital",
            dates: "Jun 2022 – Feb 2023",
            bullets: [
              "Staffed a 12-bed rural ED with one physician, stabilizing patients for air and ground transfer",
              "Cared for pediatric, obstetric and behavioral health emergencies with limited on-site specialists",
            ],
          },
        ],
        education: "B.S. Nursing (BSN), Texas State University, 2022 · RN license, Texas (multistate) · CEN · TNCC · BLS, ACLS, PALS",
        skills: ["ESI triage", "Trauma care", "Stroke alerts", "Sepsis protocols", "Rapid assessment", "IV access", "Pediatric emergencies", "Patient flow", "Epic ASAP", "De-escalation"],
      },
      whyItWorks:
        "ER resumes are read for volume, trauma level and the core certifications. CEN, TNCC and PALS sit with the license, the bullets show triage volume and time-critical results, and the rural ED adds breadth a big-center nurse may not have.",
    },
    {
      id: "charge-nurse",
      label: "Charge nurse",
      level: "Med-surg charge nurse · 10 years",
      resume: {
        name: "Theresa Walsh",
        headline: "Charge Nurse, Medical-Surgical, CMSRN",
        contact: "Pittsburgh, PA · theresa.walsh@email.com · (412) 555-0158",
        summary:
          "Med-surg nurse with 10 years at the bedside, the last 5 as primary day-shift charge nurse. I run staffing, throughput and safety on a 36-bed unit so the team can focus on patients.",
        jobs: [
          {
            title: "Charge Nurse, Medical-Surgical",
            company: "Ironbridge General Hospital",
            dates: "Jan 2021 – Present",
            bullets: [
              "Lead a day shift of 9 RNs and 4 nursing assistants, building assignments by acuity and continuity",
              "Raised discharges before noon from 18% to 34% with a next-day discharge huddle and early pharmacy reviews",
              "Run the daily safety huddle and escalate deteriorating patients to the rapid response team",
              "Orient travel and float nurses to the unit; the unit's HCAHPS nurse-communication score rose 6 points in 2 years",
            ],
          },
          {
            title: "Staff Nurse, Medical-Surgical",
            company: "Ironbridge General Hospital",
            dates: "Jun 2016 – Dec 2020",
            bullets: [
              "Cared for 5 post-surgical and medical patients a shift, specializing in orthopedic and GI surgery recovery",
              "Chaired the unit practice council for 2 years and rewrote the post-op pain reassessment guideline",
            ],
          },
        ],
        education: "B.S. Nursing (BSN), University of Pittsburgh, 2016 · RN license, Pennsylvania · CMSRN · BLS, ACLS",
        skills: ["Charge nurse leadership", "Acuity-based staffing", "Patient throughput", "Discharge planning", "Safety huddles", "Rapid response escalation", "Post-surgical care", "HCAHPS", "Conflict resolution", "Staff orientation"],
      },
      whyItWorks:
        "A charge nurse is judged on how the unit runs, not just on patient care. The bullets measure staffing, throughput and patient experience, and CMSRN backs up 10 years of med-surg practice.",
    },
    {
      id: "travel-nurse",
      label: "Travel nurse",
      level: "Travel · telemetry and PCU · 7 years",
      resume: {
        name: "Jordan Ellis",
        headline: "Travel Registered Nurse, Telemetry and Progressive Care",
        contact: "Austin, TX · jordan.ellis@email.com · (512) 555-0124",
        summary:
          "Travel nurse with 7 years in cardiac telemetry and progressive care, including 9 assignments in 5 compact states. I get oriented fast, take a full assignment early and leave units asking me to extend.",
        jobs: [
          {
            title: "Travel Registered Nurse, Telemetry and PCU",
            company: "Summit Line Travel Nursing",
            dates: "Mar 2023 – Present",
            bullets: [
              "Completed 9 13-week assignments at hospitals in Arizona, Colorado, North Carolina, Tennessee and Florida",
              "Took a full 4-patient telemetry assignment after 2 orientation shifts at each facility",
              "Extended at 5 of 9 hospitals; one unit offered a permanent position at the end of the contract",
              "Charted in Epic, Oracle Health (Cerner) and Meditech, and floated to step-down, med-surg and ED holds",
            ],
          },
          {
            title: "Staff Nurse, Cardiac Telemetry",
            company: "Pecan Valley Medical Center",
            dates: "Jun 2019 – Feb 2023",
            bullets: [
              "Cared for 4–5 cardiac patients after catheterization, ablation and pacemaker placement",
              "Monitored drips such as heparin, amiodarone and diltiazem per protocol",
              "Served as a stroke resource nurse, performing NIH Stroke Scale assessments on new neuro changes",
            ],
          },
        ],
        education: "B.S. Nursing (BSN), Texas Tech University Health Sciences Center, 2019 · Multistate RN license, Texas (Nurse Licensure Compact) · BLS, ACLS · NIH Stroke Scale",
        skills: ["Cardiac telemetry", "Progressive care", "Rapid orientation", "Cardiac drips", "NIH Stroke Scale", "Epic", "Oracle Health (Cerner)", "Meditech", "Floating", "Adaptability"],
      },
      whyItWorks:
        "Travel recruiters check three things: the license states, the specialty and how quickly you settle in. The multistate license is spelled out, the assignment count and extensions prove reliability, and the EHR list shows the nurse can chart anywhere.",
    },
  ],

  "data-analyst": [
    {
      id: "entry-level",
      label: "Entry-level data analyst",
      level: "Entry level · 1 year",
      resume: {
        name: "Sofia Martinez",
        headline: "Junior Data Analyst",
        contact: "Atlanta, GA · sofia.martinez@email.com · linkedin.com/in/sofiamartinez",
        summary:
          "Junior data analyst with a year of experience and an economics degree. I clean messy data, write SQL and build Power BI reports that people actually open.",
        jobs: [
          {
            title: "Junior Data Analyst",
            company: "Brightline Credit Union",
            dates: "Sep 2025 – Present",
            bullets: [
              "Rebuilt the monthly member growth report in Power BI, replacing a 3-hour manual Excel process",
              "Write SQL queries for the lending and marketing teams, answering about 15 requests a week",
              "Cleaned 80,000 member records, merging duplicate accounts and fixing address formats before a CRM migration",
            ],
          },
          {
            title: "Data Analytics Intern",
            company: "Peachtree Logistics Group",
            dates: "May 2025 – Aug 2025",
            bullets: [
              "Analyzed 12 months of delivery data in Excel and found 3 routes running late more than 20% of the time",
              "Presented the findings and a pivot-table dashboard to the operations manager, who reassigned 2 routes",
            ],
          },
        ],
        education: "B.S. Economics, Georgia State University, 2025 · Google Data Analytics Professional Certificate",
        skills: ["SQL", "Excel (Power Query, pivot tables)", "Power BI", "Data cleaning", "Python (basic)", "Google Sheets", "Data visualization", "Descriptive statistics", "Report automation", "Presenting findings"],
      },
      whyItWorks:
        "With little experience, each bullet has to prove one core skill — SQL, cleaning, dashboards, presenting — with a concrete before and after. The certificate fills in tool training without pretending to be more than it is.",
    },
    {
      id: "marketing-analytics",
      label: "Marketing analyst",
      level: "Marketing analytics · 5 years",
      resume: {
        name: "Nina Patel",
        headline: "Marketing Data Analyst",
        contact: "Brooklyn, NY · nina.patel@email.com · linkedin.com/in/ninapatel",
        summary:
          "Marketing analyst with 5 years in direct-to-consumer and agency teams. I measure which channels really drive revenue and help marketers move budget to the ones that pay back.",
        jobs: [
          {
            title: "Marketing Data Analyst",
            company: "Fernhill Home",
            dates: "Mar 2022 – Present",
            bullets: [
              "Built a GA4 and BigQuery pipeline that joins web sessions to orders, giving the team daily ROAS by channel",
              "Ran geo holdout tests showing that branded search was mostly capturing existing demand; moving 15% of that budget to paid social grew new customers 9%",
              "Built Looker Studio dashboards for CAC, payback period and repeat purchase rate used in every weekly marketing meeting",
              "Modeled 12-month customer lifetime value by acquisition cohort to set channel bid targets",
            ],
          },
          {
            title: "Digital Marketing Analyst",
            company: "Brightwave Agency",
            dates: "Jul 2021 – Feb 2022",
            bullets: [
              "Reported paid search and social results for 8 retail clients across Google Ads and Meta Ads Manager",
              "Automated weekly client reports with Google Sheets and Apps Script, saving about 6 hours a week",
            ],
          },
        ],
        education: "B.A. Economics, Rutgers University, 2021 · Google Analytics Certification",
        skills: ["GA4", "BigQuery", "SQL", "Looker Studio", "Attribution", "Incrementality testing", "Cohort analysis", "Customer lifetime value", "Google Ads", "Meta Ads Manager"],
      },
      whyItWorks:
        "Marketing teams hire analysts who can link spend to revenue. The bullets use the metrics marketers use — ROAS, CAC, payback, LTV — and show a test that changed where the budget went.",
    },
    {
      id: "healthcare-analytics",
      label: "Healthcare data analyst",
      level: "Healthcare analytics · 6 years",
      resume: {
        name: "Aisha Johnson",
        headline: "Healthcare Data Analyst",
        contact: "Nashville, TN · aisha.johnson@email.com · linkedin.com/in/aishajohnson",
        summary:
          "Healthcare data analyst with 6 years at a hospital system and a health plan. I turn EHR and claims data into quality and readmission reports that clinical leaders use to change care.",
        jobs: [
          {
            title: "Clinical Data Analyst",
            company: "Harpeth Valley Health System",
            dates: "Apr 2022 – Present",
            bullets: [
              "Write Epic Clarity SQL for quality, nursing and finance teams across 4 hospitals",
              "Built a 30-day readmissions dashboard in Tableau that care managers use to target follow-up calls; heart failure readmissions fell from 21% to 17% in a year",
              "Track sepsis bundle compliance by unit and shift, which the sepsis committee reviews every month",
              "Prepare de-identified datasets for research requests, following HIPAA and the minimum-necessary standard",
            ],
          },
          {
            title: "Quality Data Analyst",
            company: "Cumberland Health Plan",
            dates: "Jul 2020 – Mar 2022",
            bullets: [
              "Calculated HEDIS measures from claims and lab data for about 120,000 members",
              "Built monthly gap-in-care lists that outreach staff used to schedule screenings and well visits",
            ],
          },
        ],
        education: "B.S. Public Health, University of Tennessee, Knoxville, 2020 · Epic Clarity Data Model certification",
        skills: ["SQL Server", "Epic Clarity", "Tableau", "HEDIS", "Claims data", "Readmission analysis", "Quality measures", "HIPAA", "R", "Data validation"],
      },
      whyItWorks:
        "Health systems screen for the data sources they use, so Epic Clarity, claims and HEDIS appear in plain words. The bullets tie reports to patient outcomes and show careful handling of protected health data.",
    },
    {
      id: "product-analytics",
      label: "Product analyst",
      level: "Product analytics · 3 years",
      resume: {
        name: "Liam O'Connor",
        headline: "Product Data Analyst",
        contact: "San Francisco, CA · liam.oconnor@email.com · linkedin.com/in/liamoconnor",
        summary:
          "Product analyst with 3 years in B2B software. I design experiments, set up event tracking and tell product managers which features keep customers around.",
        jobs: [
          {
            title: "Product Analyst",
            company: "Tandemly",
            dates: "Jan 2024 – Present",
            bullets: [
              "Wrote the event tracking plan for the core app — 140 events — and audited it with engineering each release",
              "Designed and analyzed 22 product experiments, including sample-size planning and guardrail metrics",
              "Found that teams who invited a second user in week one retained at twice the rate; the onboarding change that followed raised 90-day retention 6 points",
              "Built Amplitude funnels and Mode reports that PMs use to review feature adoption every sprint",
            ],
          },
          {
            title: "Business Analyst",
            company: "Copperleaf Insurance",
            dates: "Jul 2023 – Dec 2023",
            bullets: [
              "Analyzed quote-to-bind drop-off in the online application and flagged 2 form steps for redesign",
              "Wrote Snowflake SQL and Python notebooks for weekly sales and conversion reporting",
            ],
          },
        ],
        education: "B.S. Cognitive Science, University of California, San Diego, 2023",
        skills: ["SQL", "Snowflake", "Amplitude", "Mode", "Python", "Experiment design", "Funnel analysis", "Retention analysis", "Event tracking", "Product metrics"],
      },
      whyItWorks:
        "Product analytics is about behavior and causation. This sample shows experiment design, a tracking plan and an insight that led to a measured product change — what a product team hiring an analyst wants.",
    },
    {
      id: "senior",
      label: "Senior data analyst",
      level: "Senior · 9 years",
      resume: {
        name: "Rachel Goldberg",
        headline: "Senior Data Analyst, Analytics Lead",
        contact: "Minneapolis, MN · rachel.goldberg@email.com · linkedin.com/in/rachelgoldberg",
        summary:
          "Senior analyst with 9 years in grocery and insurance, now leading a small analytics team. I set metric definitions, build self-serve reporting and coach analysts so the business gets consistent answers.",
        jobs: [
          {
            title: "Senior Data Analyst",
            company: "Northstar Grocers",
            dates: "Jun 2021 – Present",
            bullets: [
              "Lead 3 analysts supporting merchandising, supply chain and finance for 90 stores",
              "Built a dbt and Looker semantic layer with one agreed definition for sales, margin and shrink, ending conflicting numbers in leadership meetings",
              "Grew self-serve Looker users from 40 to 220 and cut ad-hoc requests to the team by about 40%",
              "Built the weekly sales forecast with finance, keeping average error under 4% at the store-week level",
            ],
          },
          {
            title: "Data Analyst",
            company: "Lakewood Insurance Group",
            dates: "Aug 2017 – May 2021",
            bullets: [
              "Analyzed claims frequency and severity by region to support pricing reviews for auto policies",
              "Moved 25 recurring reports from Access to SQL and Tableau, cutting monthly reporting time by 3 days",
            ],
          },
        ],
        education: "M.S. Business Analytics, University of Minnesota, 2017",
        skills: ["SQL", "dbt", "Looker", "Snowflake", "Python", "Forecasting", "Data modeling", "Metric definitions", "Team leadership", "Stakeholder management"],
      },
      whyItWorks:
        "At the senior level, impact comes from making the whole company's data trustworthy. These bullets show leadership, metric governance and self-serve adoption, with numbers that show how far the work reaches.",
    },
  ],

  "software-engineer": [
    {
      id: "new-grad",
      label: "New grad engineer",
      level: "Entry level · new grad",
      resume: {
        name: "Maya Thompson",
        headline: "Software Engineer, New Grad",
        contact: "Ann Arbor, MI · maya.thompson@email.com · github.com/mayathompson",
        summary:
          "Computer science graduate with an internship in fintech and two years as a data structures teaching assistant. I write clear, tested Java and Python and like explaining how code works.",
        jobs: [
          {
            title: "Software Engineering Intern",
            company: "Ledgerline",
            dates: "May 2025 – Aug 2025",
            bullets: [
              "Built a Spring Boot endpoint that lets support agents look up a customer's failed transfers, removing a manual database query step",
              "Wrote unit and integration tests with JUnit for the new endpoint, reaching 90% branch coverage",
              "Shipped to production behind a feature flag after 3 rounds of code review",
            ],
          },
          {
            title: "Teaching Assistant, Data Structures and Algorithms",
            company: "University of Michigan",
            dates: "Sep 2024 – Apr 2026",
            bullets: [
              "Led weekly lab sections for 35 students on trees, graphs, hashing and big-O analysis",
              "Wrote autograder tests for 4 programming projects used by 600+ students",
            ],
          },
          {
            title: "Capstone Project: Campus Study-Room Finder",
            company: "Team of 4",
            dates: "Jan 2026 – Apr 2026",
            bullets: [
              "Built a React and Node.js app showing live room availability; 1,100 students used it in the first month",
            ],
          },
        ],
        education: "B.S.E. Computer Science, University of Michigan, 2026",
        skills: ["Java", "Python", "JavaScript", "React", "Node.js", "Spring Boot", "SQL", "JUnit", "Git", "Linux"],
      },
      whyItWorks:
        "Without years of experience, an internship, TA work and a used project stand in for jobs. Each shows a real skill — shipping code, testing, explaining — with a number, and the skills line sticks to tools the graduate actually used.",
    },
    {
      id: "frontend",
      label: "Frontend engineer",
      level: "Mid-level · frontend · 5 years",
      resume: {
        name: "Lucas Rivera",
        headline: "Frontend Engineer",
        contact: "Portland, OR · lucas.rivera@email.com · github.com/lucasrivera",
        summary:
          "Frontend engineer with 5 years building React apps for travel and media. I care about fast pages, accessible components and design systems that make the next feature quicker to ship.",
        jobs: [
          {
            title: "Frontend Engineer",
            company: "Trellis Travel",
            dates: "Feb 2022 – Present",
            bullets: [
              "Improved Largest Contentful Paint on search pages from 4.1s to 2.0s with server rendering in Next.js and image optimization",
              "Built a shared component library of 60 components in TypeScript and Storybook, used by 5 product teams",
              "Led a WCAG 2.2 AA audit and fixed 120+ issues in booking flows, from focus order to color contrast",
              "Added Playwright end-to-end tests for checkout, catching 9 regressions before release in the first quarter",
            ],
          },
          {
            title: "UI Developer",
            company: "Bluepine Media",
            dates: "Jun 2021 – Jan 2022",
            bullets: [
              "Rebuilt article pages in React, cutting JavaScript bundle size by 35%",
              "Worked with designers in Figma to turn the style guide into reusable CSS tokens",
            ],
          },
        ],
        education: "B.S. Computer Science, Oregon State University, 2021",
        skills: ["TypeScript", "React", "Next.js", "CSS and Tailwind", "Accessibility (WCAG)", "Web performance", "Storybook", "Playwright", "Jest", "GraphQL"],
      },
      whyItWorks:
        "Frontend roles are judged on what users feel. The bullets measure speed with Core Web Vitals, accessibility with a named standard and quality with tests, and the skills match the React and TypeScript stack in most frontend posts.",
    },
    {
      id: "full-stack",
      label: "Full-stack engineer",
      level: "Mid-level · full stack · 4 years",
      resume: {
        name: "Aaliyah Washington",
        headline: "Full-Stack Software Engineer",
        contact: "Salt Lake City, UT · aaliyah.washington@email.com · github.com/awashington",
        summary:
          "Full-stack engineer with 4 years shipping customer features end to end in Ruby on Rails and React. I talk to customers, write the migration and the UI, and watch the metrics after launch.",
        jobs: [
          {
            title: "Software Engineer",
            company: "Harvestly",
            dates: "Mar 2023 – Present",
            bullets: [
              "Built online ordering for 1,400 farm stands — Rails API, React front end and card payments — which now handles 30% of customer revenue",
              "Moved slow report exports to Sidekiq background jobs, ending request timeouts for the largest customers",
              "Added feature flags and staged rollouts, letting the team ship to 5% of customers first",
              "Join a customer call every two weeks and turn the feedback into tickets for the next sprint",
            ],
          },
          {
            title: "Junior Developer",
            company: "Wasatch Web Studio",
            dates: "Jun 2022 – Feb 2023",
            bullets: [
              "Built and maintained websites and booking tools for 10 small-business clients",
              "Wrote PostgreSQL migrations and fixed N+1 queries that were slowing a client's admin pages",
            ],
          },
        ],
        education: "B.S. Computer Science, University of Utah, 2022",
        skills: ["Ruby on Rails", "React", "TypeScript", "PostgreSQL", "Redis", "Sidekiq", "REST APIs", "Docker", "Feature flags", "Customer feedback"],
      },
      whyItWorks:
        "Full-stack hiring managers want someone who can own a feature. Each bullet covers both sides — API and UI, rollout and customer — and ends with a business result like revenue share or fewer timeouts.",
    },
    {
      id: "ios",
      label: "iOS engineer",
      level: "Mobile · 6 years",
      resume: {
        name: "Kevin Park",
        headline: "Senior iOS Engineer",
        contact: "Los Angeles, CA · kevin.park@email.com · github.com/kevinpark",
        summary:
          "iOS engineer with 6 years building consumer apps in Swift. I make apps start fast, crash less and stay easy to change as the team grows.",
        jobs: [
          {
            title: "Senior iOS Engineer",
            company: "Pulsefit",
            dates: "May 2022 – Present",
            bullets: [
              "Raised crash-free sessions from 99.2% to 99.8% by fixing threading bugs found in crash reports",
              "Cut cold launch time from 2.6s to 1.1s by deferring work and trimming dynamic frameworks",
              "Rebuilt workout screens in SwiftUI and integrated HealthKit, lifting weekly active users of the feature 18%",
              "Split the app into 14 Swift packages, cutting incremental build times roughly in half",
            ],
          },
          {
            title: "iOS Developer",
            company: "Canyon Apps",
            dates: "Jul 2020 – Apr 2022",
            bullets: [
              "Built 5 client apps in UIKit, from design handoff to App Store release",
              "Set up Fastlane and CI so builds went to TestFlight automatically on every merge",
            ],
          },
        ],
        education: "B.S. Computer Engineering, University of California, Irvine, 2020",
        skills: ["Swift", "SwiftUI", "UIKit", "Combine", "Core Data", "HealthKit", "XCTest", "Xcode Instruments", "Fastlane", "App Store Connect"],
      },
      whyItWorks:
        "Mobile teams measure quality in crash rate, launch time and release speed. The bullets lead with those numbers, and the skills name Apple's frameworks exactly as iOS job posts do.",
    },
    {
      id: "staff",
      label: "Staff engineer",
      level: "Staff · 12 years",
      resume: {
        name: "Elena Petrova",
        headline: "Staff Software Engineer, Platform",
        contact: "Boston, MA · elena.petrova@email.com · linkedin.com/in/elenapetrova",
        summary:
          "Staff engineer with 12 years in data and platform engineering. I set technical direction across teams, write the design docs that settle hard decisions and grow the senior engineers around me.",
        jobs: [
          {
            title: "Staff Software Engineer, Platform",
            company: "Harborlight Analytics",
            dates: "Jan 2021 – Present",
            bullets: [
              "Set technical direction for 4 platform teams (30 engineers) and wrote the design-review process now used company-wide",
              "Led the move to multi-region active-active, cutting the worst regional outage impact from hours to minutes",
              "Introduced SLOs and blameless incident reviews; repeat incidents fell by more than half in a year",
              "Cut CI build times from 45 to 12 minutes with remote caching in Bazel",
            ],
          },
          {
            title: "Senior Software Engineer",
            company: "Quillmark",
            dates: "Mar 2017 – Dec 2020",
            bullets: [
              "Designed the event ingestion pipeline in Kotlin and Kafka, processing 2B events a day",
              "Sponsored 4 engineers' promotions to senior through design mentoring and project ownership",
            ],
          },
          {
            title: "Software Engineer",
            company: "Brookside Systems",
            dates: "Jul 2014 – Feb 2017",
            bullets: ["Built Java services for a scheduling product used by 900 clinics"],
          },
        ],
        education: "B.S. Computer Science, Northeastern University, 2014",
        skills: ["Distributed systems", "Technical strategy", "Java", "Kotlin", "Kafka", "AWS", "Multi-region architecture", "SLOs and observability", "Bazel", "Engineering mentorship"],
      },
      whyItWorks:
        "Staff-level resumes are read for scope: how many teams, how big the decisions, how others grew. Each bullet shows influence beyond one team, with reliability and productivity numbers to back it up.",
    },
  ],

  "graphic-designer": [
    {
      id: "entry-level",
      label: "Entry-level graphic designer",
      level: "Entry level · recent grad",
      resume: {
        name: "Jada Coleman",
        headline: "Junior Graphic Designer",
        contact: "Savannah, GA · jada.coleman@email.com · jadacoleman.design",
        summary:
          "Recent graphic design graduate with an agency internship and two years designing for a campus arts center. I make clean layouts and illustrations, and I take feedback well.",
        jobs: [
          {
            title: "Design Intern",
            company: "Tidewater Marketing Co.",
            dates: "Jun 2025 – Dec 2025",
            bullets: [
              "Designed social posts, flyers and email headers for 6 local clients under a senior designer",
              "Created a set of 24 spot illustrations for a museum's family guide, printed in 10,000 copies",
              "Prepared files for print with correct bleed and color settings, with no reprints during the internship",
            ],
          },
          {
            title: "Student Graphic Designer",
            company: "Campus Arts Center",
            dates: "Sep 2023 – May 2025",
            bullets: [
              "Designed posters and programs for 30+ concerts, exhibits and theater productions",
              "Built a poster template system that cut turnaround from 5 days to 2",
            ],
          },
        ],
        education: "B.F.A. Graphic Design, Savannah College of Art and Design, 2026 · Adobe Certified Professional, Graphic Design & Illustration (Illustrator)",
        skills: ["Adobe Illustrator", "Adobe InDesign", "Adobe Photoshop", "Figma", "Layout design", "Illustration", "Social media graphics", "Print preparation", "Typography", "Taking feedback"],
      },
      whyItWorks:
        "Entry-level design resumes have to point to the portfolio and prove you can work with others. This one gives the portfolio URL, real output counts and print details, and an Adobe certification that backs up tool skills.",
    },
    {
      id: "digital-social",
      label: "Digital and social designer",
      level: "Digital · 4 years",
      resume: {
        name: "Chris Alvarez",
        headline: "Digital Designer, Social and Web",
        contact: "Miami, FL · chris.alvarez@email.com · behance.net/chrisalvarez",
        summary:
          "Digital designer with 4 years making social, paid ad and email creative for consumer brands. I design fast, test variations and use the results to make the next round better.",
        jobs: [
          {
            title: "Digital Designer",
            company: "Coral & Co. Swimwear",
            dates: "Feb 2023 – Present",
            bullets: [
              "Design 30+ social and paid ad assets a week for Instagram, TikTok and Pinterest",
              "Run creative tests with the paid social team; a user-generated-style template lifted ad click-through rate 28%",
              "Designed email templates in Figma that the CRM team reuses for every campaign",
              "Edit short videos in Premiere Pro and After Effects for product launches",
            ],
          },
          {
            title: "Junior Digital Designer",
            company: "Brightpoint Agency",
            dates: "Jun 2022 – Jan 2023",
            bullets: [
              "Built web banners and landing page mockups for 12 clients, handing off specs to developers",
              "Resized and adapted campaign assets into 20+ ad formats per launch",
            ],
          },
        ],
        education: "B.A. Graphic Design, Florida International University, 2022",
        skills: ["Figma", "Adobe Photoshop", "After Effects", "Premiere Pro", "Social media design", "Paid ad creative", "Creative testing", "Email design", "Web banners", "HTML and CSS basics"],
      },
      whyItWorks:
        "Digital design is measured in volume and performance. The bullets show weekly output, a creative test with a result, and the platforms and video tools social teams ask for.",
    },
    {
      id: "production-artist",
      label: "Production artist",
      level: "Print production · 8 years",
      resume: {
        name: "Linda Kowalski",
        headline: "Senior Production Artist, Print",
        contact: "Milwaukee, WI · linda.kowalski@email.com · (414) 555-0182",
        summary:
          "Production artist with 8 years preparing files for commercial print and large format. I catch problems before they reach the press and keep high-volume jobs on schedule.",
        jobs: [
          {
            title: "Senior Production Artist",
            company: "Lakefront Print & Display",
            dates: "Mar 2020 – Present",
            bullets: [
              "Preflight and correct about 150 customer files a week for offset, digital and large-format presses",
              "Cut press-side file problems by 40% by building Acrobat Pro preflight profiles for each press",
              "Set up imposition and variable data printing for direct mail runs up to 250,000 pieces",
              "Manage color for brand-critical jobs, matching proofs to spot colors before sign-off",
            ],
          },
          {
            title: "Production Artist",
            company: "Badger State Publishing",
            dates: "Jun 2018 – Feb 2020",
            bullets: [
              "Built page layouts for 3 monthly magazines in InDesign using master pages and paragraph styles",
              "Retouched and color-corrected photos for print and kept the digital asset archive organized",
            ],
          },
        ],
        education: "A.A.S. Graphic Design, Milwaukee Area Technical College, 2018",
        skills: ["Adobe InDesign", "Adobe Illustrator", "Acrobat Pro preflight", "Prepress", "Imposition", "Color management", "Variable data printing", "Large-format print", "Trapping", "Asset management"],
      },
      whyItWorks:
        "Production roles are about accuracy and throughput, not big ideas. The sample counts files and pieces, shows errors prevented and uses the prepress terms print shops screen for.",
    },
    {
      id: "art-director",
      label: "Senior designer / art director",
      level: "Art director · 11 years",
      resume: {
        name: "Marcus Bell",
        headline: "Art Director",
        contact: "Philadelphia, PA · marcus.bell@email.com · marcusbell.studio",
        summary:
          "Art director with 11 years in agencies and in-house teams. I lead designers, build brand systems and present ideas that win the room — and then make sure the work ships well.",
        jobs: [
          {
            title: "Art Director",
            company: "Schuylkill & Pine",
            dates: "Apr 2021 – Present",
            bullets: [
              "Lead a team of 5 designers on brand and campaign work for healthcare, finance and education clients",
              "Directed the rebrand of a regional credit union across 40 branches, signage, web and app",
              "Developed concepts for 5 new-business pitches; the agency won 3 of them",
              "Art-directed 12 photo and video shoots, from shot lists to final selects",
            ],
          },
          {
            title: "Senior Graphic Designer",
            company: "Fairmount Creative",
            dates: "Aug 2016 – Mar 2021",
            bullets: [
              "Designed identity systems for 15 clients and wrote the brand guidelines for each",
              "Mentored 3 junior designers, 2 of whom were promoted",
            ],
          },
        ],
        education: "B.F.A. Graphic Design, Tyler School of Art and Architecture, Temple University, 2015",
        skills: ["Art direction", "Brand systems", "Campaign concepting", "Creative leadership", "Photo and video direction", "Client presentations", "Design critique", "Adobe Creative Cloud", "Figma", "Brand guidelines"],
      },
      whyItWorks:
        "A senior creative is hired for judgment and leadership. The bullets show team size, the scale of a rebrand, pitch wins and shoots directed, so the resume reads as someone who sets the direction, not someone who takes it.",
    },
    {
      id: "freelance",
      label: "Freelance graphic designer",
      level: "Self-employed · 7 years",
      resume: {
        name: "Noah Fischer",
        headline: "Freelance Graphic Designer",
        contact: "Asheville, NC · noah@fischerstudio.com · fischerstudio.com",
        summary:
          "Independent designer with 7 years of brand, label and editorial work, most of it for craft beverage brands and nonprofits. I handle the design and the business side: scoping, budgets and deadlines.",
        jobs: [
          {
            title: "Owner and Designer",
            company: "Fischer Studio (freelance)",
            dates: "May 2021 – Present",
            bullets: [
              "Designed brand identities and labels for 40+ clients, including 9 breweries and cideries",
              "About 70% of yearly revenue comes from repeat clients and referrals",
              "Lay out annual reports and donor materials for 6 nonprofits each year in InDesign",
              "Write proposals, contracts and invoices, and deliver projects on agreed budgets",
            ],
          },
          {
            title: "Graphic Designer",
            company: "Blue Ridge Outfitters",
            dates: "Jul 2019 – Apr 2021",
            bullets: [
              "Designed catalogs, in-store signage and hang tags for an outdoor gear retailer with 6 stores",
              "Drew a series of trail map illustrations that became the brand's best-selling T-shirt line",
            ],
          },
        ],
        education: "B.A. Studio Art, Appalachian State University, 2019",
        skills: ["Brand identity", "Label design", "Editorial layout", "Illustration", "Procreate", "Adobe Illustrator", "Adobe InDesign", "Project scoping", "Client management", "Budgeting"],
      },
      whyItWorks:
        "Freelance work reads as a real job when it is written like one: a business name, a client count, repeat business and the admin you handle. That reassures in-house employers that a freelancer can run projects on their own.",
    },
  ],

  accountant: [
    {
      id: "entry-level",
      label: "Entry-level staff accountant",
      level: "Entry level · 1 year",
      resume: {
        name: "Brandon Lee",
        headline: "Staff Accountant",
        contact: "Kansas City, MO · brandon.lee@email.com · linkedin.com/in/brandonlee",
        summary:
          "Staff accountant with a year in corporate accounting and an audit internship. I keep reconciliations current, prepare clean accruals and I'm working toward my CPA.",
        jobs: [
          {
            title: "Staff Accountant",
            company: "Prairieland Foods",
            dates: "Jun 2025 – Present",
            bullets: [
              "Reconcile 9 bank and credit card accounts monthly in Sage Intacct, clearing a 4-month backlog in my first quarter",
              "Prepare prepaid, accrual and fixed-asset schedules for the month-end close",
              "Built an Excel tracker for customer deductions that cut open items over 90 days by half",
            ],
          },
          {
            title: "Audit Intern",
            company: "Moreland & Price CPAs",
            dates: "Jan 2025 – Apr 2025",
            bullets: [
              "Tested cash, receivables and expense samples on 4 audits of manufacturers and nonprofits",
              "Documented workpapers and drafted confirmation letters under the audit senior",
            ],
          },
        ],
        education: "B.S. Accounting, University of Missouri–Kansas City, 2025 · CPA candidate (passed AUD and FAR)",
        skills: ["Bank reconciliations", "Accruals", "Fixed assets", "Accounts receivable", "Sage Intacct", "Excel (pivot tables)", "Audit workpapers", "GAAP basics", "Attention to detail", "Month-end support"],
      },
      whyItWorks:
        "Entry-level accounting hires are judged on accuracy and progress toward the CPA. The sample shows reconciliations and schedules a staff accountant really owns, an audit internship and the exact CPA sections passed.",
    },
    {
      id: "tax",
      label: "Tax accountant",
      level: "Public accounting tax · 6 years",
      resume: {
        name: "Michelle Tran",
        headline: "Senior Tax Accountant, CPA",
        contact: "Irvine, CA · michelle.tran@email.com · linkedin.com/in/michelletran",
        summary:
          "CPA with 6 years in public accounting tax for closely held businesses and their owners. I prepare and review complex partnership and S corporation returns and find planning ideas clients act on.",
        jobs: [
          {
            title: "Senior Tax Accountant",
            company: "Whitlock Avery LLP",
            dates: "Jan 2022 – Present",
            bullets: [
              "Prepare and review about 120 returns a season — Forms 1065, 1120-S and 1040 — for real estate and professional services clients",
              "Handle multistate apportionment and composite filings for partnerships operating in up to 14 states",
              "Recommended entity and timing changes that saved one client group about $180K in federal and state tax",
              "Review work from 3 staff accountants in CCH Axcess and train them on workpaper standards",
            ],
          },
          {
            title: "Staff Tax Accountant",
            company: "Harbor & Finch CPAs",
            dates: "Sep 2020 – Dec 2021",
            bullets: [
              "Prepared individual, trust and small business returns and quarterly estimates",
              "Drafted responses to 40+ IRS and state notices, most resolved without penalties",
            ],
          },
        ],
        education: "M.S. Taxation, California State University, Fullerton, 2020 · Certified Public Accountant (CPA), California",
        skills: ["Partnership returns (1065)", "S corporation returns (1120-S)", "Individual returns (1040)", "Multistate tax", "Tax planning", "Tax research", "IRS notices", "CCH Axcess", "Workpaper review", "Client service"],
      },
      whyItWorks:
        "Tax hiring managers read for return types, volume and complexity. The form numbers, return count and multistate work show level at a glance, and one planning result shows advice, not just compliance.",
    },
    {
      id: "audit",
      label: "Audit senior",
      level: "Public accounting audit · 4 years",
      resume: {
        name: "Jonah Feldman",
        headline: "Audit Senior, CPA",
        contact: "Hartford, CT · jonah.feldman@email.com · linkedin.com/in/jonahfeldman",
        summary:
          "Audit senior and CPA with 4 years in public accounting. I run fieldwork on manufacturing, nonprofit and benefit plan audits, and I keep staff and clients on schedule.",
        jobs: [
          {
            title: "Audit Senior",
            company: "Brightwater Kane LLP",
            dates: "Oct 2024 – Present",
            bullets: [
              "Lead fieldwork on 7 engagements a year, supervising teams of 2–4 associates",
              "Plan audits with risk assessments and materiality, and design tests of internal controls",
              "Run single audits under the Uniform Guidance for 3 nonprofit clients that receive federal grants",
              "Brought two engagements in 15% under budget by sending clients a request list and timeline before fieldwork",
            ],
          },
          {
            title: "Audit Associate",
            company: "Brightwater Kane LLP",
            dates: "Sep 2022 – Sep 2024",
            bullets: [
              "Performed substantive testing on revenue, inventory and payroll for 12 clients",
              "Tested participant data and contributions on 6 employee benefit plan audits",
            ],
          },
        ],
        education: "B.S. Accounting, University of Connecticut, 2022 · Certified Public Accountant (CPA), Connecticut",
        skills: ["Audit planning", "Risk assessment", "Internal controls testing", "Substantive testing", "Single audits (Uniform Guidance)", "Employee benefit plan audits", "CaseWare", "Team supervision", "Client communication", "Budget management"],
      },
      whyItWorks:
        "Audit resumes are read for engagement count, industries and who you supervise. This sample names each, shows the audit types that require specialized knowledge, and proves the senior can manage a budget.",
    },
    {
      id: "cost-accountant",
      label: "Cost accountant",
      level: "Manufacturing · 7 years",
      resume: {
        name: "Carlos Mendoza",
        headline: "Senior Cost Accountant, CMA",
        contact: "Grand Rapids, MI · carlos.mendoza@email.com · linkedin.com/in/carlosmendoza",
        summary:
          "Cost accountant with 7 years in manufacturing. I keep standard costs right, explain variances in plain words and show operations which products and plants make money.",
        jobs: [
          {
            title: "Senior Cost Accountant",
            company: "Lakeshore Furniture Works",
            dates: "Feb 2021 – Present",
            bullets: [
              "Own standard costs for 1,800 SKUs across 2 plants and lead the annual standard cost roll",
              "Explain purchase price, labor and overhead variances to plant managers in a monthly review",
              "Product-line margin analysis showed 60 SKUs losing money; discontinuing them added about 1.5 points of gross margin",
              "Partner with operations on cycle counts, cutting inventory adjustments at year end by 70%",
            ],
          },
          {
            title: "Cost Accountant",
            company: "Kent County Plastics",
            dates: "Jun 2019 – Jan 2021",
            bullets: [
              "Maintained bills of materials and routings in Epicor and fixed cost errors on 200+ items",
              "Built the inventory reserve analysis for slow-moving and obsolete stock",
            ],
          },
        ],
        education: "B.B.A. Accounting, Grand Valley State University, 2019 · Certified Management Accountant (CMA)",
        skills: ["Standard costing", "Variance analysis", "Inventory accounting", "Bills of materials", "Margin analysis", "Cycle counts", "Inventory reserves", "Epicor ERP", "Power BI", "Budgeting"],
      },
      whyItWorks:
        "Cost accounting is where finance meets the factory floor. The bullets use plant terms — SKUs, standard cost roll, variances, cycle counts — and show a margin decision the analysis drove. The CMA fits management accounting work better than a CPA alone.",
    },
    {
      id: "accounting-manager",
      label: "Accounting manager",
      level: "Manager · 11 years",
      resume: {
        name: "Denise Harper",
        headline: "Accounting Manager, CPA",
        contact: "Indianapolis, IN · denise.harper@email.com · linkedin.com/in/deniseharper",
        summary:
          "Accounting manager and CPA with 11 years in logistics and healthcare. I lead the accounting team, build controls and systems that scale, and give leadership numbers they can trust.",
        jobs: [
          {
            title: "Accounting Manager",
            company: "Crossroads Logistics",
            dates: "Mar 2020 – Present",
            bullets: [
              "Lead a team of 5 covering general ledger, payables, receivables and payroll accounting",
              "Led the move from QuickBooks to Microsoft Dynamics 365 Business Central across 4 entities, live in 7 months",
              "Wrote the company's first internal controls matrix ahead of a private equity investment",
              "Adopted ASC 842 for 60 warehouse and equipment leases and built the 13-week cash forecast",
            ],
          },
          {
            title: "Senior Accountant",
            company: "Monon Health Partners",
            dates: "Jul 2015 – Feb 2020",
            bullets: [
              "Prepared monthly financial statements and board reporting packages for a 12-clinic group",
              "Coordinated the annual audit and the payroll tax filings across 3 states",
            ],
          },
        ],
        education: "B.S. Accounting, Indiana University, 2015 · Certified Public Accountant (CPA), Indiana",
        skills: ["Team leadership", "ERP implementation", "Internal controls", "ASC 842", "Cash forecasting", "Financial reporting", "Audit management", "Dynamics 365 Business Central", "Process improvement", "Hiring and training"],
      },
      whyItWorks:
        "A manager's resume should show team, systems and controls rather than individual entries. The bullets give team size, a dated ERP go-live, a controls project and a new accounting standard — the work a controller hands to a manager.",
    },
  ],

  "security-officer": [
    {
      id: "entry-level",
      label: "Entry-level security officer",
      level: "Entry level · first year",
      resume: {
        name: "Kevin Morales",
        headline: "Security Officer, NYS Registered",
        contact: "Bronx, NY · kevin.morales@email.com · (718) 555-0139",
        summary:
          "Registered security officer in my first year, posted at a residential building lobby. I bring three years of customer service, a calm manner and careful logbooks.",
        jobs: [
          {
            title: "Security Officer",
            company: "Empire Gate Security (residential lobby post)",
            dates: "Feb 2026 – Present",
            bullets: [
              "Staff the lobby desk of a 200-unit apartment building, checking in guests and contractors",
              "Log every visitor, delivery and incident in the daily activity report",
              "Run the package room, signing in about 120 deliveries a day with no lost packages reported",
              "Walk floors and stairwells on scheduled rounds and report hazards to building management",
            ],
          },
          {
            title: "Customer Service Associate",
            company: "Bronx Fresh Market",
            dates: "Jun 2023 – Jan 2026",
            bullets: [
              "Helped 200+ customers a shift at registers and the service desk, handling returns and complaints",
              "Watched for shoplifting and alerted the manager, following store policy",
            ],
          },
        ],
        education: "High school diploma, Grand Concourse High School, 2023 · NYS Security Guard Registration (8-hour pre-assignment and 16-hour on-the-job training) · CPR/AED",
        skills: ["Lobby access control", "Visitor logs", "Daily activity reports", "Package management", "Building rounds", "Customer service", "Radio communication", "Observation", "Spanish (fluent)", "Reliability"],
      },
      whyItWorks:
        "A first-year officer is hired for reliability and the right registration. This sample states the New York registration and training, describes a real post in detail and turns retail experience into security-relevant skills.",
    },
    {
      id: "armed",
      label: "Armed security officer",
      level: "Armed · 6 years",
      resume: {
        name: "Andre Williams",
        headline: "Armed Security Officer, Florida Class D and G",
        contact: "Jacksonville, FL · andre.williams@email.com · (904) 555-0172",
        summary:
          "Armed security officer with 6 years of experience, the last 4 on armed posts at a bank operations center and a utility site. I follow post orders closely, stay alert on long shifts and keep my firearm qualification current.",
        jobs: [
          {
            title: "Armed Security Officer",
            company: "Atlantic Shield Protection",
            dates: "Jan 2022 – Present",
            bullets: [
              "Hold armed posts at a regional bank operations center and an electric utility substation",
              "Control vehicle and pedestrian entry, check credentials and escort vendors in secure areas",
              "Pass annual firearm requalification and keep the Class G license current with no lapses",
              "Wrote detailed reports on 2 attempted break-ins that the client shared with police",
            ],
          },
          {
            title: "Security Officer",
            company: "Riverside Commerce Park",
            dates: "Mar 2020 – Dec 2021",
            bullets: [
              "Patrolled a 12-building business park by vehicle and checked alarms after hours",
              "Responded to tenant calls and kept a clean logbook used for insurance claims",
            ],
          },
        ],
        education: "High school diploma, Duval Ridge High School, 2014 · Florida Class D Security Officer License · Florida Class G Statewide Firearm License · First Aid/CPR",
        skills: ["Armed security", "Firearm safety", "Access control", "Vehicle checkpoints", "Vendor escorts", "Threat awareness", "Post orders", "Incident reports", "Alarm response", "Patrol"],
      },
      whyItWorks:
        "Armed posts are filled on licenses first, so both Florida licenses are in the headline and education. The bullets stress discipline — requalification, post orders, reports — over force, which is what clients want from armed officers.",
    },
    {
      id: "hospital",
      label: "Hospital security officer",
      level: "Healthcare · 5 years",
      resume: {
        name: "Shawn Patterson",
        headline: "Hospital Security Officer",
        contact: "Cleveland, OH · shawn.patterson@email.com · (216) 555-0145",
        summary:
          "Hospital security officer with 3 years in security and 2 years as a patient transporter. I work with nurses to keep the emergency department and behavioral health units safe for patients and staff.",
        jobs: [
          {
            title: "Security Officer",
            company: "Lakeshore University Medical Center",
            dates: "Aug 2023 – Present",
            bullets: [
              "Post in the emergency department of a 450-bed hospital, screening visitors and managing patient belongings",
              "Respond to behavioral emergencies with the care team, using verbal de-escalation first",
              "Stand by with high-risk patients on suicide or elopement precautions as assigned by nursing",
              "Take part in infant-security and active-threat drills, and record each response for the Environment of Care committee",
            ],
          },
          {
            title: "Patient Transporter",
            company: "Lakeshore University Medical Center",
            dates: "Jun 2021 – Jul 2023",
            bullets: [
              "Moved 40+ patients a shift between units, imaging and procedures, following infection control rules",
              "Learned the hospital layout, codes and emergency procedures before moving to security",
            ],
          },
        ],
        education: "High school diploma, Cuyahoga Heights High School, 2020 · IAHSS Basic and Advanced certifications · CPI Nonviolent Crisis Intervention · BLS",
        skills: ["Healthcare security", "De-escalation", "Behavioral health standby", "Visitor screening", "Patient belongings", "Emergency codes", "Infection control", "Report writing", "Teamwork with nursing", "Calm under pressure"],
      },
      whyItWorks:
        "Hospitals want officers who work with care teams, not apart from them. The sample uses healthcare terms — standbys, emergency codes, Environment of Care — and lists IAHSS and CPI training that healthcare security leaders recognize.",
    },
    {
      id: "supervisor",
      label: "Security supervisor",
      level: "Supervisor · 9 years",
      resume: {
        name: "Victor Ramirez",
        headline: "Security Site Supervisor",
        contact: "Fort Worth, TX · victor.ramirez@email.com · (817) 555-0168",
        summary:
          "Security supervisor with 9 years in contract security, the last 5 running a 24/7 distribution center site. I schedule and train officers, write post orders and keep the client informed.",
        jobs: [
          {
            title: "Site Supervisor",
            company: "Lone Oak Security Services (distribution center)",
            dates: "Apr 2021 – Present",
            bullets: [
              "Supervise 14 officers across 3 shifts at a 1.2M sq ft distribution center",
              "Rewrote post orders for truck gates, the lobby and patrols, and trained every officer on them",
              "Cut overtime by 22% by building a 4-week rotating schedule with a standby list",
              "Send the client a weekly report on gate volume, incidents and open maintenance hazards",
            ],
          },
          {
            title: "Commissioned Security Officer",
            company: "Trinity River Protection",
            dates: "May 2017 – Mar 2021",
            bullets: [
              "Worked armed posts at an industrial site and a hospital parking garage",
              "Served as field training officer for 20+ new officers",
            ],
          },
        ],
        education: "High school diploma, Westcreek High School, 2011 · Texas DPS commissioned security officer license (Level II and III) · CPR/AED and First Aid",
        skills: ["Team supervision", "Scheduling", "Post orders", "Officer training", "Client reporting", "Truck gate operations", "Overtime control", "Incident review", "Safety inspections", "Conflict resolution"],
      },
      whyItWorks:
        "Supervisor resumes are read for team size, scheduling and how you handle the client. These bullets measure all three and show the officer-to-trainer-to-supervisor path that contract security companies promote from.",
    },
    {
      id: "residential-concierge",
      label: "Concierge security officer",
      level: "High-rise residential · 3 years",
      resume: {
        name: "Imani Carter",
        headline: "Concierge Security Officer",
        contact: "Chicago, IL · imani.carter@email.com · (312) 555-0126",
        summary:
          "Concierge security officer with 3 years at a luxury residential tower and 2 years in hotel guest service. I keep the building secure while making residents feel at home.",
        jobs: [
          {
            title: "Concierge Security Officer",
            company: "Prairie Shield Security (52-story residential tower)",
            dates: "May 2023 – Present",
            bullets: [
              "Run the front desk for a 480-unit tower, verifying residents, guests and contractors",
              "Program and deactivate resident key fobs and keep access records current",
              "Check contractor insurance certificates and schedule elevator reservations for 30+ move-ins a month",
              "Monitor the fire alarm panel and building systems overnight and follow the emergency plan on alarms",
            ],
          },
          {
            title: "Front Desk Agent",
            company: "Wabash Avenue Hotel",
            dates: "Jun 2021 – Apr 2023",
            bullets: [
              "Checked in 150+ guests a day and handled room changes, billing questions and complaints",
              "Earned top guest-satisfaction scores on the front desk team for 3 quarters",
            ],
          },
        ],
        education: "Associate in Arts, Harold Washington College, 2021 · Illinois PERC card · CPR/AED",
        skills: ["Concierge service", "Key fob management", "Resident verification", "Contractor check-in", "Elevator reservations", "Fire alarm panel monitoring", "Package room", "Resident relations", "Incident reports", "Hospitality"],
      },
      whyItWorks:
        "Residential towers hire for service as much as security. The sample pairs access control and fire-panel monitoring with hotel guest-service results, and lists the Illinois PERC card that contract security employees need.",
    },
  ],

  "administrative-assistant": [
    {
      id: "entry-level",
      label: "Entry-level administrative assistant",
      level: "Entry level · 1 year",
      resume: {
        name: "Emily Nguyen",
        headline: "Administrative Assistant",
        contact: "Omaha, NE · emily.nguyen@email.com · (402) 555-0153",
        summary:
          "Administrative assistant with a year at an insurance agency front desk and three years in retail. I'm organized, quick on the phone and careful with data entry.",
        jobs: [
          {
            title: "Receptionist and Administrative Assistant",
            company: "Platte River Insurance Agency",
            dates: "Aug 2025 – Present",
            bullets: [
              "Answer about 60 calls a day and route them to 4 agents or take detailed messages",
              "Schedule client appointments for 4 agents and send reminder emails the day before each one",
              "Enter new policies and client changes into the agency management system with a near-zero error rate on audits",
              "Assemble onboarding packets and scan, label and file client documents",
            ],
          },
          {
            title: "Cashier and Customer Service",
            company: "Hy-Ridge Grocery",
            dates: "Jun 2022 – Jul 2025",
            bullets: [
              "Handled cash and card payments for 150+ customers a shift and balanced my drawer every night",
              "Trained 5 new cashiers on the register and returns process",
            ],
          },
        ],
        education: "High school diploma, Millard Valley High School, 2022 · Microsoft Office Specialist (Word)",
        skills: ["Phone etiquette", "Appointment scheduling", "Data entry", "Microsoft Word", "Excel", "Google Workspace", "Filing and scanning", "Customer service", "Typing 60 WPM", "Cash handling"],
      },
      whyItWorks:
        "With one year in an office, the sample shows the basics hiring managers test for — phones, scheduling, data entry — with volumes, then presents retail work as proof of reliability and accuracy.",
    },
    {
      id: "medical-office",
      label: "Medical administrative assistant",
      level: "Medical office · 4 years",
      resume: {
        name: "Destiny Brown",
        headline: "Medical Administrative Assistant, CMAA",
        contact: "Memphis, TN · destiny.brown@email.com · (901) 555-0181",
        summary:
          "Certified medical administrative assistant with 4 years at the front desk of busy specialty practices. I keep check-in fast, insurance clean and patients informed.",
        jobs: [
          {
            title: "Medical Administrative Assistant",
            company: "Riverbluff Orthopedics",
            dates: "Mar 2023 – Present",
            bullets: [
              "Check in about 70 patients a day for 5 surgeons and collect copays and balances",
              "Verify insurance eligibility two days ahead, reducing claim denials for eligibility errors",
              "Schedule surgeries, imaging and post-op visits in eClinicalWorks, coordinating with the surgery center",
              "Started reminder calls for new patients that brought the no-show rate down from 11% to 7%",
            ],
          },
          {
            title: "Front Desk Coordinator",
            company: "Mid-South Children's Clinic",
            dates: "Aug 2021 – Feb 2023",
            bullets: [
              "Registered patients, scanned insurance cards and updated demographics at every visit",
              "Processed medical records requests following HIPAA rules",
            ],
          },
        ],
        education: "Medical Office Administration Certificate, Southwest Tennessee Community College, 2021 · CMAA (NHA)",
        skills: ["Patient check-in", "Insurance verification", "eClinicalWorks", "Surgery scheduling", "Copay collection", "ICD-10 and CPT basics", "Medical terminology", "HIPAA", "Records requests", "Multi-line phones"],
      },
      whyItWorks:
        "Medical practices screen for front-office skills that protect revenue: eligibility checks, copays, scheduling in their EHR. The CMAA and HIPAA show training, and the no-show result proves the assistant improves the practice.",
    },
    {
      id: "legal",
      label: "Legal administrative assistant",
      level: "Law firm · 7 years",
      resume: {
        name: "Patricia Gomez",
        headline: "Legal Administrative Assistant",
        contact: "Albany, NY · patricia.gomez@email.com · (518) 555-0115",
        summary:
          "Legal administrative assistant with 7 years supporting litigation attorneys. I keep court calendars accurate, file on deadline and handle confidential documents with care.",
        jobs: [
          {
            title: "Legal Administrative Assistant, Litigation",
            company: "Hudson & Vale LLP",
            dates: "Apr 2021 – Present",
            bullets: [
              "Support 3 litigation partners and 2 paralegals on about 60 active matters",
              "E-file pleadings and motions through NYSCEF and federal court systems, with no missed filing deadlines",
              "Docket court dates and discovery deadlines and send attorneys weekly deadline reports",
              "Enter and edit time for attorneys in Clio, cutting month-end billing corrections",
            ],
          },
          {
            title: "Legal Receptionist",
            company: "Capital District Family Law",
            dates: "Jun 2019 – Mar 2021",
            bullets: [
              "Greeted clients, ran conflict checks on new inquiries and scheduled consultations",
              "Prepared document binders and exhibit sets for hearings",
            ],
          },
        ],
        education: "A.A.S. Paralegal Studies, Hudson Valley Community College, 2019",
        skills: ["Legal calendaring", "Court e-filing (NYSCEF)", "Docketing", "Clio", "Time entry and billing", "Conflict checks", "Exhibit preparation", "Legal terminology", "Microsoft Word (advanced)", "Confidentiality"],
      },
      whyItWorks:
        "Law firms hire assistants who never miss a deadline. The sample leads with matter count, e-filing and docketing, names the court system and billing software, and shows years of confidential work.",
    },
    {
      id: "school-office",
      label: "School administrative assistant",
      level: "K–12 school office · 5 years",
      resume: {
        name: "María Hernández",
        headline: "School Administrative Assistant",
        contact: "Albuquerque, NM · maria.hernandez@email.com · (505) 555-0174",
        summary:
          "Bilingual school office assistant with 5 years at a middle school front desk. I keep attendance accurate, welcome families in English and Spanish and handle a busy office calmly.",
        jobs: [
          {
            title: "Front Office Assistant",
            company: "Mesa Vista Middle School",
            dates: "Aug 2021 – Present",
            bullets: [
              "Run the front office for a 780-student school with the principal, two assistant principals and the counseling team",
              "Record attendance in PowerSchool and make daily absence calls; chronic absence fell 4 points after we added a second follow-up call",
              "Enroll and withdraw students, request records from other schools and keep files FERPA compliant",
              "Arrange substitute coverage for about 10 absences a week and check visitors in and out",
            ],
          },
          {
            title: "Office Clerk",
            company: "Sandia Valley Credit Union",
            dates: "Jan 2020 – Jul 2021",
            bullets: [
              "Processed member forms, mailed statements and kept the branch's paper records organized",
              "Translated member letters and calls for Spanish-speaking members",
            ],
          },
        ],
        education: "Associate of Arts, Liberal Arts, Central New Mexico Community College, 2020",
        skills: ["PowerSchool", "Attendance tracking", "Student enrollment", "FERPA", "Family communication", "Spanish (fluent)", "Visitor management", "Substitute coordination", "Records management", "Google Workspace"],
      },
      whyItWorks:
        "Schools look for someone who can run a front office full of students, parents and staff. The sample names the student information system, the privacy law and attendance work, and shows bilingual service where it matters.",
    },
    {
      id: "office-coordinator",
      label: "Office coordinator",
      level: "Senior admin · 9 years",
      resume: {
        name: "Rebecca Stone",
        headline: "Office Coordinator",
        contact: "Boise, ID · rebecca.stone@email.com · (208) 555-0162",
        summary:
          "Office coordinator with 9 years running offices for an architecture firm and a nonprofit. I manage vendors, budgets and onboarding so 85 people have what they need to work.",
        jobs: [
          {
            title: "Office Coordinator",
            company: "Treasure Valley Architects",
            dates: "May 2020 – Present",
            bullets: [
              "Run daily operations for an 85-person office, from facilities and IT tickets to supplies and mail",
              "Managed the move to a new two-floor office, finishing on schedule with one day of downtime",
              "Track a $180K annual office budget and cut vendor costs 15% by rebidding cleaning and coffee service",
              "Onboard about 25 new hires a year — desks, equipment, accounts and first-day schedules",
            ],
          },
          {
            title: "Administrative Assistant",
            company: "Boise River Health Foundation",
            dates: "Aug 2017 – Apr 2020",
            bullets: [
              "Kept donor records in Raiser's Edge and processed 3,000+ gift acknowledgments a year",
              "Coordinated logistics for the annual gala of 400 guests",
            ],
          },
        ],
        education: "B.A. Communication, Boise State University, 2017",
        skills: ["Office management", "Vendor management", "Facilities coordination", "Budget tracking", "Employee onboarding", "Office moves", "SAP Concur", "Raiser's Edge", "Process documentation", "Event logistics"],
      },
      whyItWorks:
        "Senior admin roles are about running the place. This sample shows headcount supported, a budget and savings, a completed office move and onboarding volume — the scope that separates a coordinator from an assistant.",
    },
  ],

  "medical-assistant": [
    {
      id: "new-grad",
      label: "New graduate medical assistant",
      level: "Entry level · externship",
      resume: {
        name: "Kiara Robinson",
        headline: "Certified Clinical Medical Assistant, CCMA",
        contact: "Tulsa, OK · kiara.robinson@email.com · (918) 555-0131",
        summary:
          "Newly certified clinical medical assistant who finished a 160-hour externship in internal medicine. I'm confident with vitals, injections and blood draws and ready to learn your clinic's flow.",
        jobs: [
          {
            title: "Medical Assistant",
            company: "Tulsa Hills Family Clinic",
            dates: "May 2026 – Present",
            bullets: [
              "Room 18–22 patients a day, taking vitals, chief complaints and medication lists",
              "Give vaccines and injections under provider orders and document lot numbers",
              "Restock exam rooms and clean equipment between patients following infection control steps",
            ],
          },
          {
            title: "Medical Assistant Extern",
            company: "Green Country Internal Medicine",
            dates: "Feb 2026 – Apr 2026",
            bullets: [
              "Completed 160 hours rooming patients, performing 60+ venipunctures and 25 EKGs under supervision",
              "Practiced scheduling and check-in at the front desk 1 day a week",
            ],
          },
        ],
        education: "Clinical Medical Assistant Diploma, Green Country Technical College, 2026 · CCMA (NHA) · BLS",
        skills: ["Vital signs", "Rooming", "Venipuncture", "Injections and vaccines", "EKG", "Medication reconciliation", "Infection control", "Exam room prep", "Patient communication", "HIPAA"],
      },
      whyItWorks:
        "New medical assistants are hired on hands-on skills. The externship lists procedure counts, the first job shows real patient volume, and the CCMA and BLS answer the credential question right away.",
    },
    {
      id: "pediatrics",
      label: "Pediatric medical assistant",
      level: "Pediatrics · 3 years",
      resume: {
        name: "Gabriela Torres",
        headline: "Pediatric Medical Assistant, RMA",
        contact: "El Paso, TX · gabriela.torres@email.com · (915) 555-0127",
        summary:
          "Bilingual pediatric medical assistant with 3 years in a busy children's practice. I keep kids calm during shots and screenings and make sure every immunization is recorded right.",
        jobs: [
          {
            title: "Medical Assistant",
            company: "Franklin Mountain Pediatrics",
            dates: "Mar 2023 – Present",
            bullets: [
              "Room 30+ children a day for well-child and sick visits, measuring growth and plotting it on growth charts",
              "Give childhood vaccines and record each dose in the state immunization registry, ImmTrac2",
              "Manage Vaccines for Children inventory and temperature logs, with zero wasted doses on the last state visit",
              "Run vision and hearing screens and hand out developmental screening forms in English and Spanish",
            ],
          },
          {
            title: "Medical Assistant Extern",
            company: "Sun City Family Medicine",
            dates: "Oct 2022 – Feb 2023",
            bullets: [
              "Roomed patients, took vitals and performed point-of-care tests during a 160-hour externship",
              "Was hired by a pediatric practice that the externship site referred me to",
            ],
          },
        ],
        education: "Medical Assisting Diploma, Rio Bravo Career College, 2022 · RMA (AMT) · BLS",
        skills: ["Pediatric rooming", "Childhood immunizations", "ImmTrac2", "Vaccines for Children (VFC)", "Vaccine storage and handling", "Growth charts", "Vision and hearing screening", "Developmental screening", "Spanish (fluent)", "Calming anxious kids"],
      },
      whyItWorks:
        "Pediatric clinics care about vaccines done right. The sample names the registry, the VFC program and storage rules, shows screening work and highlights bilingual care for families.",
    },
    {
      id: "cardiology",
      label: "Cardiology medical assistant",
      level: "Cardiology · 5 years",
      resume: {
        name: "Monique Harris",
        headline: "Cardiology Medical Assistant, CCMA and CET",
        contact: "Richmond, VA · monique.harris@email.com · (804) 555-0185",
        summary:
          "Cardiology medical assistant and certified EKG technician with 5 years in outpatient cardiology. I run EKGs and monitors, prepare stress tests and keep busy cardiologists on schedule.",
        jobs: [
          {
            title: "Cardiology Medical Assistant",
            company: "James River Heart Associates",
            dates: "Jan 2022 – Present",
            bullets: [
              "Perform about 25 12-lead EKGs a day and flag abnormal tracings to the provider before the visit",
              "Apply Holter and event monitors, teach patients how to use them and track returns",
              "Prepare patients for treadmill and nuclear stress tests and monitor vitals during recovery",
              "Run point-of-care INR checks for the anticoagulation clinic and send results to the pharmacist",
            ],
          },
          {
            title: "Medical Assistant",
            company: "Chesterfield Family Practice",
            dates: "Jun 2021 – Dec 2021",
            bullets: [
              "Roomed 25 patients a day, drew blood and performed EKGs for a 3-physician practice",
              "Earned the CET certification and moved to cardiology",
            ],
          },
        ],
        education: "Medical Assistant Certificate, Capitol City Career Institute, 2021 · CCMA (NHA) · CET (NHA) · BLS",
        skills: ["12-lead EKG", "Holter monitors", "Event monitors", "Stress test prep", "Point-of-care INR", "Cardiac medications", "Vital signs", "Patient teaching", "Rooming", "Epic"],
      },
      whyItWorks:
        "Specialty practices want proof of their procedures. This sample counts EKGs, names each cardiac test the MA supports and lists the CET next to the CCMA, so a cardiology manager sees ready-made skills.",
    },
    {
      id: "dermatology",
      label: "Dermatology medical assistant",
      level: "Dermatology · 4 years",
      resume: {
        name: "Hailey Park",
        headline: "Dermatology Medical Assistant",
        contact: "Orlando, FL · hailey.park@email.com · (407) 555-0109",
        summary:
          "Dermatology medical assistant with 4 years in medical, surgical and cosmetic dermatology. I set up procedures, track every biopsy result and keep the day running for two providers.",
        jobs: [
          {
            title: "Dermatology Medical Assistant",
            company: "Citrus Grove Dermatology",
            dates: "Sep 2022 – Present",
            bullets: [
              "Work with a dermatologist and a PA seeing 50+ patients a day, rooming and scribing during skin exams",
              "Set up and assist with shave and punch biopsies, excisions and cryotherapy",
              "Own the pathology log: every biopsy result is tracked until the patient is notified, with none lost in 3 years",
              "Take standardized clinical photos for mole mapping and cosmetic consultations",
            ],
          },
          {
            title: "Medical Assistant",
            company: "Seminole Family Care",
            dates: "Aug 2020 – Aug 2022",
            bullets: [
              "Roomed patients, gave injections and cleaned and sterilized instruments in the autoclave",
              "Assisted with minor office procedures and kept sterile supplies stocked",
            ],
          },
        ],
        education: "Medical Assisting Certificate, Orange Blossom Technical College, 2020 · CCMA (NHA) · BLS",
        skills: ["Procedure setup", "Biopsy assistance", "Pathology tracking", "Sterile technique", "Instrument sterilization", "Clinical photography", "Cryotherapy setup", "Scribing", "Cosmetic consults", "Patient education"],
      },
      whyItWorks:
        "Dermatology runs on procedures and follow-up. The sample shows the biopsy and sterile work an office needs and a safety result — no lost pathology — that tells a manager this MA can be trusted.",
    },
    {
      id: "lead",
      label: "Lead medical assistant",
      level: "Lead MA · 8 years",
      resume: {
        name: "Tanya Brooks",
        headline: "Lead Medical Assistant, CMA (AAMA)",
        contact: "Colorado Springs, CO · tanya.brooks@email.com · (719) 555-0156",
        summary:
          "Lead medical assistant with 8 years in primary care, the last 4 leading a team of 9 MAs. I train staff, run clinic flow and help providers close care gaps through standing orders.",
        jobs: [
          {
            title: "Lead Medical Assistant",
            company: "Pikes Peak Multispecialty Clinic",
            dates: "Feb 2022 – Present",
            bullets: [
              "Lead 9 medical assistants across 3 care teams, building schedules and covering call-outs",
              "Wrote competency checklists and onboarding for new MAs; 90-day turnover dropped from 30% to 10%",
              "Used standing orders to close screening gaps, raising breast cancer screening completion from 64% to 75%",
              "Keep logs for waived lab testing and vaccine storage and prepare the clinic for inspections",
            ],
          },
          {
            title: "Certified Medical Assistant",
            company: "Garden of the Gods Family Medicine",
            dates: "Jun 2018 – Jan 2022",
            bullets: [
              "Roomed patients, managed refill requests and handled patient portal messages for 2 physicians",
              "Precepted 6 medical assisting students during their externships",
            ],
          },
        ],
        education: "Medical Assisting A.A.S., Rampart Range Community College, 2018 · CMA (AAMA) · BLS",
        skills: ["Team leadership", "MA training", "Scheduling", "Standing orders", "Care gap closure", "Quality measures", "Waived lab testing", "Vaccine management", "Patient portal", "Clinic flow"],
      },
      whyItWorks:
        "A lead MA is measured on the team and the clinic's quality numbers. The sample shows team size, retention, a screening rate the MAs moved, and compliance work — plus the CMA many clinics expect from their leads.",
    },
  ],

  server: [
    {
      id: "entry-level",
      label: "Entry-level server",
      level: "Entry level · first serving job",
      resume: {
        name: "Diego Ramírez",
        headline: "Server",
        contact: "Corpus Christi, TX · diego.ramirez@email.com · (361) 555-0143",
        summary:
          "Friendly server who moved up from host at a busy seafood restaurant. I learn menus fast, keep my tables updated and help the team on every rush.",
        jobs: [
          {
            title: "Server",
            company: "Bayfront Grill",
            dates: "Mar 2026 – Present",
            bullets: [
              "Serve a 4-table section on weeknights and 5 tables on weekends in a 120-seat casual restaurant",
              "Learned the full menu and drink list in 2 weeks and passed the server menu test on the first try",
              "Run food and pre-bus for other sections during rushes",
            ],
          },
          {
            title: "Host",
            company: "Bayfront Grill",
            dates: "Jun 2025 – Feb 2026",
            bullets: [
              "Greeted guests, managed the waitlist and rotated seating evenly between servers",
              "Answered phones and took to-go orders on weekend nights with 90-minute waits",
            ],
          },
          {
            title: "Cashier",
            company: "La Palma Taquería",
            dates: "Aug 2024 – May 2025",
            bullets: ["Took orders and payments at the counter and kept the dining room clean during lunch rushes"],
          },
        ],
        education: "High school diploma, Ocean Drive High School, 2025 · TABC Seller-Server Certification · Texas Food Handler certificate",
        skills: ["Guest service", "Menu knowledge", "Order taking", "Food running", "Table maintenance", "POS systems", "Teamwork", "Waitlist management", "Bilingual (English and Spanish)", "Fast learner"],
      },
      whyItWorks:
        "A first serving job is earned on attitude and quick learning. The sample shows a promotion from host, how fast the menu was learned and teamwork during rushes, and lists Texas alcohol and food handler training.",
    },
    {
      id: "banquet",
      label: "Banquet server",
      level: "Hotel banquets · 4 years",
      resume: {
        name: "Andrea Kowalczyk",
        headline: "Banquet Server",
        contact: "Chicago, IL · andrea.kowalczyk@email.com · (773) 555-0161",
        summary:
          "Banquet server with 4 years at a downtown hotel and a catering company. I work weddings, galas and conferences of up to 400 guests and know how to follow a BEO to the minute.",
        jobs: [
          {
            title: "Banquet Server",
            company: "Wacker Grand Hotel",
            dates: "Apr 2023 – Present",
            bullets: [
              "Serve plated, buffet and family-style events from 20-person board lunches to 400-guest weddings",
              "Follow banquet event orders for timing, menus and dietary notes, delivering plated courses in synchronized service",
              "Set and reset ballrooms between events, often turning a room in under 90 minutes",
              "Serve as captain for events up to 120 guests, briefing the team and working with the banquet manager",
            ],
          },
          {
            title: "Catering Server",
            company: "Windy City Catering Co.",
            dates: "May 2022 – Mar 2023",
            bullets: [
              "Worked off-site corporate events and weddings, setting up and breaking down at new venues",
              "Ran passed appetizers and bar service for events of 50–250 guests",
            ],
          },
        ],
        education: "High school diploma, Northwest Side High School, 2019 · BASSET certification (on-premise) · Illinois Food Handler Training",
        skills: ["Banquet service", "Plated service", "Buffet service", "BEO execution", "Room setup and flips", "Event captain", "Dietary and allergy notes", "Bar service", "Teamwork", "Flexible scheduling"],
      },
      whyItWorks:
        "Banquet managers hire for timing and teamwork. The sample uses banquet terms — BEOs, synchronized service, flips — gives event sizes, and lists the Illinois BASSET certification required for alcohol service.",
    },
    {
      id: "high-volume",
      label: "High-volume casual server",
      level: "Casual dining · 3 years",
      resume: {
        name: "Tyler Nguyen",
        headline: "Server, High-Volume Casual Dining",
        contact: "Seattle, WA · tyler.nguyen@email.com · (206) 555-0198",
        summary:
          "Server with 3 years in high-volume casual dining, including a 300-seat brewpub on game days. I stay fast and accurate when every table is full and the kitchen is backed up.",
        jobs: [
          {
            title: "Server",
            company: "Pine Street Brewhouse",
            dates: "Feb 2024 – Present",
            bullets: [
              "Run an 8-table section in a 300-seat brewpub, serving up to 50 guests an hour on game days",
              "Ring orders on a handheld POS at the table, cutting time from order to kitchen by several minutes",
              "Know all 20 taps and suggest pairings; beer sales per guest in my section are among the highest on staff",
              "Close out side work and the end-of-night checklist so the next shift starts ready",
            ],
          },
          {
            title: "Busser and Food Runner",
            company: "Ballard Fish House",
            dates: "Apr 2022 – Jan 2024",
            bullets: [
              "Cleared and reset tables for a 160-seat restaurant, helping it turn tables faster on weekends",
              "Ran food from the expo line and checked each plate against the ticket",
            ],
          },
        ],
        education: "High school diploma, Rainier Valley High School, 2021 · Washington MAST permit (Class 12) · Washington Food Worker Card",
        skills: ["High-volume service", "Handheld POS", "Beer knowledge", "Table turns", "Order accuracy", "Side work", "Expo and food running", "Teamwork", "Composure under pressure", "Upselling"],
      },
      whyItWorks:
        "Casual restaurants want speed without mistakes. The sample measures pace in guests per hour and section size, shows product knowledge that lifts sales, and lists the Washington permits a manager has to check.",
    },
    {
      id: "lead-trainer",
      label: "Lead server and trainer",
      level: "Lead server · 8 years",
      resume: {
        name: "Isabella Rossi",
        headline: "Lead Server and Trainer",
        contact: "Santa Barbara, CA · isabella.rossi@email.com · (805) 555-0134",
        summary:
          "Lead server with 8 years in upscale casual restaurants. I train new servers, run the floor when the manager is off and keep service standards steady on every shift.",
        jobs: [
          {
            title: "Lead Server",
            company: "Mesa Verde Coastal Kitchen",
            dates: "Jan 2021 – Present",
            bullets: [
              "Lead pre-shift lineups covering specials, allergies and reservations for a team of 12 servers",
              "Wrote the server training guide and trained 25 new hires; 80% stayed past 6 months",
              "Run the floor on manager days off, handling seating, comps and guest issues",
              "Cut comped meals by about a third by coaching servers to check orders back with guests",
            ],
          },
          {
            title: "Server",
            company: "Harbor Light Bistro",
            dates: "May 2018 – Dec 2020",
            bullets: [
              "Served a 5-table section in a 110-seat waterfront restaurant",
              "Built a regular guest base that often asked for my section by name",
            ],
          },
        ],
        education: "Associate of Arts, Communication, Santa Barbara City College, 2018 · California RBS certification (ABC) · California Food Handler Card · ServSafe Food Protection Manager",
        skills: ["Server training", "Pre-shift lineups", "Floor management", "Guest recovery", "Comp and void control", "Seating charts", "Allergy procedures", "Coaching", "Reservations", "Service standards"],
      },
      whyItWorks:
        "A lead server is judged on the team. The bullets show training, retention, floor coverage and fewer comps, and California's required RBS certification sits beside a food-safety manager credential.",
    },
    {
      id: "cocktail-server",
      label: "Casino cocktail server",
      level: "Casino floor · 5 years",
      resume: {
        name: "Natalie Cruz",
        headline: "Cocktail Server",
        contact: "Las Vegas, NV · natalie.cruz@email.com · (702) 555-0188",
        summary:
          "Cocktail server with 5 years on casino floors. I cover large sections quickly, serve alcohol responsibly and give players the kind of service that brings them back.",
        jobs: [
          {
            title: "Cocktail Server",
            company: "Silver Mesa Resort & Casino",
            dates: "Jun 2022 – Present",
            bullets: [
              "Cover a floor section of about 120 slot machines and 8 table games, completing a round every 10–15 minutes",
              "Serve players in the high-limit room, learning regulars' drinks and preferences",
              "Watch for signs of intoxication and work with bartenders and security to stop service when needed",
              "Settle my bank at the end of every shift with no shortages",
            ],
          },
          {
            title: "Cocktail Server",
            company: "Desert Star Hotel & Casino",
            dates: "Mar 2021 – May 2022",
            bullets: [
              "Served casino floor and lounge guests during busy weekend and convention shifts",
              "Trained 4 new cocktail servers on section rounds and the drink order system",
            ],
          },
        ],
        education: "High school diploma, Red Rock Valley High School, 2016 · Nevada alcohol awareness card · Southern Nevada Health District food handler card",
        skills: ["Casino floor service", "Responsible alcohol service", "Section rounds", "High-limit service", "Drink knowledge", "Cash handling", "Guest recognition", "Working with security", "Stamina", "Teamwork"],
      },
      whyItWorks:
        "Casino managers hire for coverage, pace and responsible service. The sample gives section size and round time, shows how the server handles intoxicated guests, and lists the Nevada cards needed to work the floor.",
    },
  ],
};
