import type { ResumeExample } from "@/lib/resume-examples";

/** More role examples (see lib/resume-examples.ts for the shape and rules). */
export const MORE_EXAMPLES_B: ResumeExample[] = [
  // ─── Trades & logistics ──────────────────────────────────────────────
  {
    slug: "electrician",
    role: "Electrician",
    group: "Trades & logistics",
    level: "Mid-level · 7 years experience",
    intro:
      "An electrician resume that leads with your license and shows the systems you install, the code you work to and the inspections you pass — with the keywords contractors screen for.",
    resume: {
      name: "Marcus Reyes",
      headline: "Journeyman Electrician",
      contact: "Denver, CO · marcus.reyes@email.com · (303) 555-0164",
      summary:
        "Licensed journeyman electrician with 7 years in residential and commercial wiring. I run small crews, troubleshoot fast and build work that passes inspection the first time.",
      jobs: [
        {
          title: "Journeyman Electrician",
          company: "Ridgeview Electrical Services",
          dates: "Jun 2022 – Present",
          bullets: [
            "Install power, panels and lighting systems for retail and office build-outs up to 60,000 sq ft, working to the NEC and local amendments",
            "Lead a 3-person crew on tenant improvements; 14 of 15 projects finished on or ahead of schedule in 2025",
            "Troubleshoot motor controls and 480V three-phase power distribution with a multimeter and megohmmeter, passing 40+ inspections with no failed items",
            "Bend and run EMT and rigid conduit from blueprints and keep as-built drawings up to date for the project manager",
          ],
        },
        {
          title: "Apprentice Electrician",
          company: "Bluestem Electric",
          dates: "Aug 2018 – May 2022",
          bullets: [
            "Completed a 4-year registered apprenticeship in residential wiring and light commercial work",
            "Wired 120+ new single-family homes from rough-in through trim-out and service connection",
            "Installed EV chargers, generator transfer switches and low voltage data cabling for remodel customers",
            "Followed lockout/tagout and NFPA 70E procedures with no recordable safety incidents in 4 years",
          ],
        },
      ],
      education: "Registered Electrical Apprenticeship, 2018–2022 · Journeyman license, State of Colorado · OSHA 30-Hour Construction (OSHA 30) · NFPA 70E training",
      skills: ["Commercial wiring", "Residential wiring", "Electrical troubleshooting", "Panel installation", "Conduit bending", "Blueprint reading", "Motor controls", "Three-phase power", "Low voltage", "Crew leadership"],
    },
    whyItWorks:
      "The license and issuing state sit right under the name, each job names the kind of work and the systems involved, and results are shown the way contractors judge them: inspections passed, schedules met and a clean safety record.",
    summaries: [
      { level: "Apprentice", text: "Second-year electrical apprentice with 4,000+ supervised hours in residential wiring. Comfortable with rough-in, trim-out and panel work, and holding an OSHA 10 card." },
      { level: "Journeyman", text: "Licensed journeyman electrician with 7 years in residential and commercial wiring. I lead small crews and pass inspections the first time." },
      { level: "Master / foreman", text: "Master electrician and foreman who has run crews of 12 on commercial projects up to $3M, handling layout, material takeoffs and inspector walk-throughs." },
    ],
    bullets: [
      { skill: "Code compliance", weak: "Did work to code", strong: "Passed 40+ commercial inspections with no failed items, working to the NEC and local amendments" },
      { skill: "Troubleshooting", weak: "Fixed electrical problems", strong: "Traced an intermittent motor control fault to a failing contactor and restored a packaging line in under 2 hours" },
      { skill: "Leadership", weak: "Supervised workers", strong: "Led a 3-person crew on tenant improvements; 14 of 15 projects finished on or ahead of schedule" },
      { skill: "Volume", weak: "Wired houses", strong: "Wired 120+ new single-family homes from rough-in through trim-out and service connection" },
      { skill: "Safety", weak: "Followed safety rules", strong: "Followed lockout/tagout and NFPA 70E procedures with no recordable incidents in 4 years" },
      { skill: "Planning", weak: "Read plans", strong: "Laid out conduit runs from blueprints and kept as-built drawings current for the project manager" },
    ],
    keywords: [
      "Journeyman license", "NEC", "Electrical troubleshooting", "Commercial wiring", "Residential wiring", "Blueprint reading",
      "Conduit bending", "Panel installation", "Motor controls", "Three-phase power", "Lighting systems", "Low voltage",
      "Lockout/tagout", "Multimeter", "OSHA 30", "NFPA 70E", "Crew leadership",
    ],
    keywordSort: {
      tools: ["Multimeter"],
      credentials: ["Journeyman license", "OSHA 30", "NFPA 70E"],
      soft: ["Crew leadership"],
    },
    tips: [
      { t: "Put your license first", d: "Write the license type and the state that issued it — \"Journeyman Electrician, Colorado\" — near the top. Licensing is handled state by state, so employers check both." },
      { t: "Name the type of work", d: "Residential, commercial or industrial, new construction or service — and the systems you handle, like panels, motor controls or three-phase power." },
      { t: "Show code and inspection results", d: "Inspections passed and rework avoided prove you know the NEC better than a line that says \"knowledge of code\"." },
      { t: "Size the jobs", d: "Square footage, number of homes, crew size and schedule tell a contractor what scale of project you can take on." },
      { t: "List safety training in plain text", d: "OSHA 10 or OSHA 30 cards and NFPA 70E training are common screening terms. Write them out rather than using logos." },
    ],
    faqs: [
      { q: "Should I put my license number on my resume?", a: "List the license type and issuing state. Many applications ask for the number separately, and employers can look it up with the state licensing board." },
      { q: "How do I list an electrical apprenticeship?", a: "Treat it like a job with dates, then describe the work you did and the hours you completed. If you finished a registered apprenticeship program, add it under education too." },
      { q: "Do I need to mention which NEC edition I know?", a: "It can help. States and cities adopt NEC editions on their own schedules, so if you've worked under a specific edition, say so in a bullet or your summary." },
      { q: "I'm still an apprentice. What should my resume focus on?", a: "Your supervised hours, the kinds of work you've done, the tools you use confidently and your safety record. Don't use the journeyman title until you hold the license." },
      { q: "Should I list OSHA cards as certifications?", a: "List them, but by their name — \"OSHA 30-Hour Construction\". OSHA describes the 10- and 30-hour cards as course completion cards rather than a license or certification." },
    ],
    related: ["hvac-technician", "maintenance-technician", "project-manager"],
  },
  {
    slug: "hvac-technician",
    role: "HVAC Technician",
    group: "Trades & logistics",
    level: "Experienced · 5 years",
    intro:
      "An HVAC technician resume that shows the systems you diagnose and install, your EPA and NATE credentials, and how customers respond to your work — with the keywords service managers search for.",
    resume: {
      name: "Andre Washington",
      headline: "HVAC Service Technician",
      contact: "Charlotte, NC · andre.washington@email.com · (704) 555-0142",
      summary:
        "EPA 608 Universal and NATE-certified HVAC technician with 5 years in residential and light commercial service. I find the real fault on the first visit and explain the fix in plain words.",
      jobs: [
        {
          title: "HVAC Service Technician",
          company: "Lakewood Comfort Heating & Air",
          dates: "Mar 2022 – Present",
          bullets: [
            "Run 5–6 service calls a day on heat pumps, gas furnaces and split systems, keeping a 91% first-visit fix rate",
            "Handle refrigerant recovery, leak checks and charging on R-410A systems and newer A2L refrigerants such as R-454B",
            "Perform preventive maintenance on 30+ commercial rooftop units under quarterly service agreements",
            "Sold 110 maintenance plans in 2025 by walking homeowners through the diagnostics and repair options",
          ],
        },
        {
          title: "HVAC Installer",
          company: "Tri-County Mechanical Services",
          dates: "May 2020 – Feb 2022",
          bullets: [
            "Installed 70+ residential systems, including ductwork changes, line sets and thermostat installation",
            "Brazed copper line sets and pressure-tested with nitrogen before evacuation",
            "Ran Manual J load calculations with the lead tech to size replacement equipment",
          ],
        },
      ],
      education: "HVAC Technology Certificate, Central Piedmont Community College, 2020 · EPA 608 Universal · NATE: Air Conditioning and Heat Pumps (service) · OSHA 10",
      skills: ["HVAC diagnostics", "Heat pumps", "Gas furnaces", "Rooftop units", "Refrigerant recovery", "Brazing", "Electrical troubleshooting", "Ductwork", "ServiceTitan", "Customer service"],
    },
    whyItWorks:
      "The EPA and NATE credentials appear in the summary and education where a recruiter looks first, bullets name the equipment and refrigerants the tech handles, and results are shown in fix rate, volume and maintenance plans sold.",
    summaries: [
      { level: "Entry level", text: "HVAC technology graduate with EPA 608 Universal certification and 6 months as an installer's helper on residential replacements. Comfortable with brazing, line sets and thermostat wiring." },
      { level: "Experienced", text: "NATE-certified HVAC technician with 5 years in residential and light commercial service. I keep a 91% first-visit fix rate across 5–6 calls a day." },
      { level: "Lead technician", text: "Lead HVAC technician who trains a team of 6, handles escalated commercial calls and built the company's rooftop unit maintenance program." },
    ],
    bullets: [
      { skill: "Diagnostics", weak: "Repaired AC units", strong: "Kept a 91% first-visit fix rate on heat pumps, gas furnaces and split systems" },
      { skill: "Refrigerants", weak: "Handled refrigerant", strong: "Recovered and charged R-410A and A2L (R-454B) systems under EPA 608 Universal certification" },
      { skill: "Maintenance", weak: "Did maintenance", strong: "Ran preventive maintenance on 30+ commercial rooftop units under quarterly service agreements" },
      { skill: "Sales", weak: "Sold service plans", strong: "Sold 110 maintenance plans in a year by walking homeowners through the diagnosis and repair options" },
      { skill: "Installation", weak: "Installed systems", strong: "Installed 70+ residential systems, including ductwork changes, line sets and thermostats" },
      { skill: "Sizing", weak: "Helped size equipment", strong: "Ran Manual J load calculations to size replacement equipment for older homes" },
    ],
    keywords: [
      "HVAC", "EPA 608 Universal", "NATE", "Diagnostics", "Preventive maintenance", "Refrigerant recovery", "Heat pumps",
      "Gas furnaces", "Rooftop units", "Ductwork", "Thermostat installation", "Brazing", "Electrical troubleshooting",
      "Load calculations", "A2L refrigerants", "Service agreements", "ServiceTitan", "OSHA 10", "Customer service",
    ],
    keywordSort: {
      tools: ["ServiceTitan"],
      credentials: ["EPA 608 Universal", "NATE", "OSHA 10"],
      soft: ["Customer service"],
    },
    tips: [
      { t: "Name your EPA 608 type", d: "Type I, II, III or Universal cover different equipment. Write the exact type you hold, since it decides what you're allowed to service." },
      { t: "List NATE specialties", d: "NATE certifies by specialty, such as air conditioning, heat pumps or gas furnaces. Name yours instead of just \"NATE certified\"." },
      { t: "Say what equipment you work on", d: "Residential splits, heat pumps, furnaces, rooftop units or chillers — and the refrigerants — tell a service manager where you fit." },
      { t: "Show customer results", d: "Fix rate, callbacks, reviews and maintenance plans sold show you can be sent to a customer's home alone." },
      { t: "Mention your software", d: "Field service apps like ServiceTitan or Housecall Pro are common in postings. List the one you use daily." },
    ],
    faqs: [
      { q: "Which EPA 608 certification should I list?", a: "The type you hold. Type I covers small appliances, Type II high-pressure equipment, Type III low-pressure equipment, and Universal covers all three. Section 608 certification is also required to buy most refrigerants." },
      { q: "Is NATE certification required?", a: "It's voluntary, but many employers list it as preferred. Name the specialty and whether it's installation or service so it matches what the job needs." },
      { q: "Do I need a state license on my resume?", a: "If you hold one, yes. Licensing for HVAC technicians and contractors varies by state and city, so write the license type and issuing state." },
      { q: "Should I list the brands I've worked on?", a: "Yes, if the posting mentions them or you're factory-trained. A short line in skills or a bullet is enough." },
      { q: "How do I show customer skills on a technical resume?", a: "Use results: first-visit fix rate, low callback rate, customer reviews or service plans sold after explaining options." },
    ],
    related: ["electrician", "maintenance-technician", "customer-service-representative"],
  },
  {
    slug: "maintenance-technician",
    role: "Maintenance Technician",
    group: "Trades & logistics",
    level: "Mid-level · 6 years experience",
    intro:
      "A maintenance technician resume that proves you keep equipment running — with downtime, preventive maintenance and the PLC, hydraulics and safety keywords plant managers search for.",
    resume: {
      name: "Brian Kowalski",
      headline: "Industrial Maintenance Technician",
      contact: "Toledo, OH · brian.kowalski@email.com · (419) 555-0138",
      summary:
        "Industrial maintenance technician with 6 years in packaging and food manufacturing. I troubleshoot electrical and mechanical faults fast and build preventive maintenance plans that keep lines running.",
      jobs: [
        {
          title: "Maintenance Technician II",
          company: "Harborline Packaging",
          dates: "Apr 2021 – Present",
          bullets: [
            "Troubleshoot and repair conveyor systems, case packers and palletizers across 3 high-speed lines",
            "Cut unplanned downtime by 27% in a year by moving 40 assets onto a preventive maintenance schedule in the CMMS",
            "Diagnose Allen-Bradley PLC faults, motors and drives, and swap VFDs to restore production",
            "Led root cause analysis on repeat gearbox failures, ending a problem that had stopped Line 2 six times a quarter",
          ],
        },
        {
          title: "Maintenance Mechanic",
          company: "Kestrel Foods",
          dates: "Jun 2018 – Mar 2021",
          bullets: [
            "Repaired hydraulics and pneumatics on fillers and cappers, rebuilding cylinders and valves in-house",
            "Fabricated guards and brackets with MIG welding from blueprints",
            "Applied lockout/tagout on every job and trained 6 new operators on the energy control procedure",
          ],
        },
      ],
      education: "Associate of Applied Science, Industrial Maintenance Technology, Owens Community College, 2018 · OSHA 30-Hour General Industry (OSHA 30)",
      skills: ["Preventive maintenance", "PLC troubleshooting", "Electrical systems", "Mechanical repair", "Hydraulics", "Pneumatics", "Motors and drives", "Welding", "Blueprint reading", "CMMS"],
    },
    whyItWorks:
      "It measures maintenance the way a plant does — downtime and repeat failures — names the equipment, controls and systems the tech can repair, and shows a safety habit with lockout/tagout instead of only claiming it.",
    summaries: [
      { level: "Entry level", text: "Industrial maintenance graduate with hands-on training in PLCs, hydraulics and motor controls. Completed a 6-month internship supporting preventive maintenance on a bottling line." },
      { level: "Mid level", text: "Maintenance technician with 6 years in packaging and food manufacturing. I cut unplanned downtime by 27% by moving 40 assets onto preventive maintenance." },
      { level: "Lead / supervisor", text: "Maintenance lead who runs a crew of 8 technicians across 2 shifts, owns the CMMS and the spare-parts budget, and plans annual shutdowns." },
    ],
    bullets: [
      { skill: "Downtime", weak: "Reduced downtime", strong: "Cut unplanned downtime by 27% by moving 40 assets onto a preventive maintenance schedule" },
      { skill: "Controls", weak: "Worked on PLCs", strong: "Diagnosed Allen-Bradley PLC and VFD faults to restore production, usually within one shift" },
      { skill: "Root cause", weak: "Fixed recurring problems", strong: "Led root cause analysis on repeat gearbox failures that had stopped a line six times a quarter" },
      { skill: "Fluid power", weak: "Repaired machines", strong: "Rebuilt hydraulic cylinders and pneumatic valves in-house instead of sending them out" },
      { skill: "Safety", weak: "Followed safety rules", strong: "Applied lockout/tagout on every job and trained 6 new operators on the energy control procedure" },
      { skill: "Fabrication", weak: "Did welding", strong: "Fabricated machine guards and brackets from blueprints with MIG welding" },
    ],
    keywords: [
      "Preventive maintenance", "Troubleshooting", "PLC", "Electrical systems", "Mechanical repair", "Hydraulics", "Pneumatics",
      "Motors and drives", "Conveyor systems", "CMMS", "Allen-Bradley", "Lockout/tagout", "Root cause analysis", "Welding",
      "Blueprint reading", "Downtime", "OSHA 30", "Problem solving",
    ],
    keywordSort: {
      tools: ["PLC", "CMMS", "Allen-Bradley"],
      credentials: ["OSHA 30"],
      soft: ["Problem solving"],
    },
    tips: [
      { t: "Measure in downtime", d: "Unplanned downtime, mean time to repair and repeat failures are the numbers maintenance managers track." },
      { t: "Name the equipment and controls", d: "Conveyors, packaging machines, compressors — and the PLC platform you've worked on, such as Allen-Bradley or Siemens." },
      { t: "Split electrical and mechanical skills", d: "Many postings ask for both. Show at least one bullet for each so the reader doesn't have to guess." },
      { t: "Show safety as a habit", d: "Lockout/tagout, confined space or arc flash training belong in plain text — and a bullet that shows you use them." },
      { t: "Mention the CMMS", d: "Work orders, PM schedules and parts in a CMMS show you can run maintenance, not just respond to breakdowns." },
    ],
    faqs: [
      { q: "What should a maintenance technician resume include?", a: "The types of equipment you maintain, your electrical, mechanical and controls skills, safety training and at least one result such as reduced downtime." },
      { q: "How do I describe PLC experience honestly?", a: "Say what you actually do: reading ladder logic to troubleshoot, swapping I/O cards, or editing programs. Each is a different level, and interviewers will ask." },
      { q: "Should I list lockout/tagout?", a: "Yes. OSHA's lockout/tagout standard, 29 CFR 1910.147, covers servicing and maintenance in general industry, so employers expect technicians to know and follow it." },
      { q: "Is an associate degree required?", a: "Not always. Many technicians come from apprenticeships, the military or on-the-job training. List whatever formal training you have, then let your bullets show the skills." },
      { q: "How do I move from a facilities role to manufacturing maintenance?", a: "Lead with the overlap — electrical troubleshooting, motors, HVAC or plumbing repairs and preventive maintenance — and add any controls or PLC training you've done." },
    ],
    related: ["electrician", "hvac-technician", "warehouse-associate"],
  },
  {
    slug: "warehouse-associate",
    role: "Warehouse Associate",
    group: "Trades & logistics",
    level: "Experienced · 3 years",
    intro:
      "A warehouse associate resume that shows your pick rate, accuracy and safety record — plus the forklift, scanner and shipping keywords distribution centers screen for.",
    resume: {
      name: "Keisha Thompson",
      headline: "Warehouse Associate",
      contact: "Columbus, OH · keisha.thompson@email.com · (614) 555-0175",
      summary:
        "Forklift certified warehouse associate with 3 years in e-commerce and retail distribution. I keep pick rates high and order accuracy above 99.8%, and I'm comfortable lifting 50 lbs through 10-hour shifts.",
      jobs: [
        {
          title: "Warehouse Associate II",
          company: "Northgate Distribution",
          dates: "Feb 2023 – Present",
          bullets: [
            "Pick and pack 140+ units an hour with an RF scanner, holding 99.8% order accuracy over 18 months",
            "Run shipping and receiving for 25+ inbound trailers a week, checking counts against purchase orders in the WMS",
            "Operate a sit-down forklift, reach truck and electric pallet jack with no incidents",
            "Complete daily cycle counts that helped the site pass its quarterly inventory audit with no major findings",
          ],
        },
        {
          title: "Order Picker",
          company: "Parcelpoint Fulfillment",
          dates: "Aug 2021 – Jan 2023",
          bullets: [
            "Handled order picking and packing for an online store shipping about 3,000 orders a day at peak",
            "Handled loading and unloading of trailers and staged pallets for outbound carriers by cutoff time",
            "Joined the site safety team and helped run monthly walk-throughs of safety procedures",
          ],
        },
      ],
      education: "High school diploma, 2021 · Forklift certified (sit-down counterbalance and reach truck), training and evaluation under OSHA 29 CFR 1910.178",
      skills: ["Order picking", "Packing", "Shipping and receiving", "Inventory management", "Cycle counts", "RF scanner", "WMS", "Forklift operation", "Pallet jack", "Reach truck"],
    },
    whyItWorks:
      "It uses the numbers warehouse supervisors watch — units per hour, accuracy and safety — names each piece of equipment the associate is certified on, and keeps the layout simple enough for any applicant tracking system.",
    summaries: [
      { level: "Entry level", text: "Reliable, physically fit job seeker with retail stocking experience, comfortable lifting 50 lbs and working night shifts. Quick to learn RF scanners and pick paths." },
      { level: "Experienced", text: "Forklift certified warehouse associate with 3 years in distribution. I pick 140+ units an hour at 99.8% accuracy." },
      { level: "Lead", text: "Warehouse lead who runs a 12-person shift, assigns pick zones, trains new hires on equipment and keeps the dock on schedule for carrier cutoffs." },
    ],
    bullets: [
      { skill: "Productivity", weak: "Picked orders", strong: "Picked and packed 140+ units an hour with an RF scanner, above the site target" },
      { skill: "Accuracy", weak: "Made few mistakes", strong: "Held 99.8% order accuracy over 18 months on high-volume e-commerce orders" },
      { skill: "Receiving", weak: "Unloaded trucks", strong: "Received 25+ inbound trailers a week, checking counts against purchase orders in the WMS" },
      { skill: "Equipment", weak: "Drove a forklift", strong: "Operated a sit-down forklift, reach truck and electric pallet jack with no incidents" },
      { skill: "Inventory", weak: "Counted stock", strong: "Completed daily cycle counts that helped the site pass its quarterly inventory audit" },
      { skill: "Safety", weak: "Was safe at work", strong: "Joined the site safety team and helped run monthly walk-throughs of safety procedures" },
    ],
    keywords: [
      "Order picking", "Packing", "Shipping and receiving", "Inventory management", "Cycle counts", "RF scanner", "WMS",
      "Forklift operation", "Forklift certified", "Pallet jack", "Reach truck", "Loading and unloading", "Order accuracy",
      "Safety procedures", "Lifting 50 lbs", "Teamwork", "Reliability",
    ],
    keywordSort: {
      tools: ["RF scanner", "WMS", "Pallet jack", "Reach truck"],
      credentials: ["Forklift certified"],
      soft: ["Teamwork", "Reliability"],
    },
    tips: [
      { t: "Give your rate and accuracy", d: "Units or lines per hour and order accuracy are the first things a warehouse supervisor compares." },
      { t: "List every truck type you're certified on", d: "Sit-down forklift, reach truck, order picker or pallet jack — write each one, because sites hire for specific equipment." },
      { t: "Name the systems", d: "RF scanners, a WMS or voice picking show you can start without long training." },
      { t: "Show reliability", d: "Attendance awards, peak-season overtime or being picked to train others signal the trust supervisors look for." },
      { t: "Match the physical requirements", d: "If the posting asks for lifting 50 lbs or standing for a full shift, say you can, in plain words." },
    ],
    faqs: [
      { q: "Does OSHA issue forklift certification?", a: "No. Under 29 CFR 1910.178, your employer trains you, evaluates you on the trucks you'll drive and certifies that you completed it. Your performance has to be evaluated at least once every three years." },
      { q: "What should I write if I have no warehouse experience?", a: "Use retail stocking, food service or delivery work and describe pace, accuracy and reliability. Mention that you can lift the weight the posting lists and work the shifts offered." },
      { q: "Should I list my shift availability?", a: "Yes, briefly — nights, weekends or overtime availability can matter as much as experience for warehouse roles." },
      { q: "What numbers belong on a warehouse resume?", a: "Units or lines per hour, order accuracy, trailers loaded or received, inventory audit results and days without a safety incident." },
      { q: "How do I move up to a lead role?", a: "Show times you trained new hires, covered for a lead, solved a recurring problem on the floor or improved a process." },
    ],
    related: ["truck-driver", "logistics-coordinator", "maintenance-technician"],
  },
  {
    slug: "truck-driver",
    role: "Truck Driver",
    group: "Trades & logistics",
    level: "Experienced · 8 years",
    intro:
      "A truck driver resume that leads with your CDL class and endorsements, then proves safety and on-time delivery — with the keywords carriers and recruiters filter on.",
    resume: {
      name: "Luis Ramirez",
      headline: "Class A CDL Truck Driver",
      contact: "Fort Worth, TX · luis.ramirez@email.com · (817) 555-0193",
      summary:
        "CDL Class A driver with 8 years of OTR and regional routes, holding Hazmat and Tanker endorsements. I've driven 850,000+ accident-free miles and deliver on time without cutting corners on safety.",
      jobs: [
        {
          title: "Regional Truck Driver",
          company: "Lone Prairie Freight",
          dates: "May 2021 – Present",
          bullets: [
            "Run regional routes across Texas, Oklahoma and Louisiana in dry van and tanker equipment, about 2,500 miles a week",
            "Kept a 98% on-time delivery rate across 600+ loads while staying within hours of service limits",
            "Complete a full pre-trip inspection and DVIR every shift; passed 11 roadside inspections with no violations",
            "Log duty status on an ELD and plan fuel stops and rest breaks with dispatch to protect delivery windows",
          ],
        },
        {
          title: "OTR Truck Driver",
          company: "Redline Transport Co.",
          dates: "Mar 2018 – Apr 2021",
          bullets: [
            "Hauled dry van and flatbed freight in the lower 48, averaging 110,000 miles a year",
            "Secured steel, lumber and machinery to load securement rules using chains, straps and tarps",
            "Earned the carrier's safety award 3 years in a row for a clean MVR and a safety record with no preventable accidents",
          ],
        },
      ],
      education: "CDL Class A (Texas) · Endorsements: Hazmat (H), Tanker (N) · DOT medical card current · Commercial truck driving program, 2018",
      skills: ["CDL Class A", "Hazmat endorsement", "Tanker endorsement", "Pre-trip inspection", "Hours of service", "ELD", "Load securement", "Route planning", "Dry van", "Flatbed"],
    },
    whyItWorks:
      "The CDL class, endorsements and medical card are impossible to miss, the routes and equipment types match how carriers post jobs, and safety is shown with miles, inspections and awards instead of a vague claim.",
    summaries: [
      { level: "New CDL holder", text: "Recent commercial driving program graduate with a CDL Class A and clean MVR. Completed 160+ hours of training, including backing, coupling and pre-trip inspection." },
      { level: "Experienced", text: "CDL Class A driver with 8 years of OTR and regional experience and Hazmat and Tanker endorsements. 850,000+ accident-free miles and a 98% on-time rate." },
      { level: "Driver trainer", text: "Driver trainer who has coached 20+ new drivers through their first months on the road, covering safe backing, trip planning and hours of service." },
    ],
    bullets: [
      { skill: "Safety", weak: "Safe driver", strong: "Drove 850,000+ accident-free miles and earned the carrier's safety award 3 years in a row" },
      { skill: "On-time", weak: "Delivered loads on time", strong: "Kept a 98% on-time delivery rate across 600+ regional loads" },
      { skill: "Compliance", weak: "Followed DOT rules", strong: "Passed 11 roadside inspections with no violations, logging every shift on an ELD" },
      { skill: "Inspection", weak: "Checked the truck", strong: "Completed a full pre-trip inspection and DVIR every shift, catching 2 brake issues before they caused a breakdown" },
      { skill: "Cargo", weak: "Strapped loads", strong: "Secured steel, lumber and machinery on flatbeds using chains, straps and tarps to load securement rules" },
      { skill: "Planning", weak: "Planned routes", strong: "Planned fuel stops and rest breaks with dispatch to meet delivery windows within hours of service limits" },
    ],
    keywords: [
      "CDL Class A", "Hazmat endorsement", "Tanker endorsement", "DOT medical card", "Hours of service", "ELD",
      "Pre-trip inspection", "DVIR", "OTR", "Regional routes", "Dry van", "Flatbed", "Load securement", "Route planning",
      "On-time delivery", "Clean MVR", "Safety record", "Customer communication",
    ],
    keywordSort: {
      tools: ["ELD"],
      credentials: ["CDL Class A", "Hazmat endorsement", "Tanker endorsement", "DOT medical card"],
      soft: ["Customer communication"],
    },
    tips: [
      { t: "Lead with license and endorsements", d: "Put your CDL class, the issuing state and each endorsement in the summary or right under your name. Recruiters filter on them first." },
      { t: "Name the equipment and route type", d: "Dry van, reefer, flatbed or tanker, and OTR, regional or local — match the wording in the posting." },
      { t: "Prove safety with facts", d: "Accident-free miles, clean inspections and safety awards are stronger than \"safe driver\". Only list what your record supports." },
      { t: "Show on-time performance", d: "On-time rate, loads delivered and miles a year tell a carrier how dependable you are." },
      { t: "Say you're current", d: "Note that your DOT medical card is current and your MVR is clean, so the recruiter doesn't have to ask." },
    ],
    faqs: [
      { q: "Which CDL endorsements should I list?", a: "All the ones you hold, by name and letter: H for hazardous materials, N for tank vehicles, T for doubles and triples, or X for the combined tank and hazmat endorsement. A Hazmat endorsement also requires a TSA security threat assessment." },
      { q: "Should I mention my DOT medical card?", a: "Yes. A medical examiner's certificate is valid for up to 24 months and must come from an examiner listed on FMCSA's National Registry. Saying yours is current saves the recruiter a question." },
      { q: "How do I show a good safety record?", a: "Use facts: accident-free miles, years without a preventable accident, clean roadside inspections and any safety awards. Don't round up — carriers check your record." },
      { q: "Should I list ELD experience?", a: "Yes. Most drivers who keep records of duty status log them on an electronic logging device, so naming the ELD you've used and your hours-of-service record shows you'll fit in fast." },
      { q: "I just got my CDL. What should my resume focus on?", a: "Your training program, the hours and skills it covered, your endorsements, a clean MVR and any previous jobs that show reliability, like delivery or warehouse work." },
    ],
    related: ["warehouse-associate", "logistics-coordinator", "maintenance-technician"],
  },
  {
    slug: "logistics-coordinator",
    role: "Logistics Coordinator",
    group: "Trades & logistics",
    level: "Mid-level · 5 years experience",
    intro:
      "A logistics coordinator resume that shows shipments moved on time and freight costs controlled — with the TMS, carrier and documentation keywords supply chain teams screen for.",
    resume: {
      name: "Priya Nair",
      headline: "Logistics Coordinator",
      contact: "Atlanta, GA · priya.nair@email.com · linkedin.com/in/priyanair",
      summary:
        "Logistics coordinator with 5 years in freight brokerage and consumer goods distribution. I keep LTL and FTL shipments on schedule, carriers accountable and freight spend under control.",
      jobs: [
        {
          title: "Logistics Coordinator",
          company: "Oakhurst Home Goods",
          dates: "Jan 2022 – Present",
          bullets: [
            "Handle shipment scheduling for 150+ outbound LTL and FTL loads a week from 2 distribution centers using our TMS",
            "Cut freight cost per order by 9% by rebidding 6 lanes and shifting low-volume freight to consolidated LTL",
            "Run a weekly freight audit that caught $38K in duplicate and incorrect carrier invoices in 2025",
            "Build KPI reporting in Excel on on-time pickup, transit time and damage claims for the supply chain director",
          ],
        },
        {
          title: "Carrier Sales & Operations Coordinator",
          company: "Meridian Freight Solutions",
          dates: "Jun 2020 – Dec 2021",
          bullets: [
            "Booked and tracked 40+ truckloads a day, handling carrier management and check calls from pickup to delivery",
            "Prepared bill of lading paperwork and import/export documentation for cross-border shipments to Mexico",
            "Kept vendor communication moving during weather delays, rerouting freight to protect customer delivery dates",
          ],
        },
      ],
      education: "B.B.A. Supply Chain Management, Georgia State University, 2020 · ASCM Certified in Logistics, Transportation and Distribution (CLTD)",
      skills: ["Logistics coordination", "Shipment scheduling", "Carrier management", "Freight audit", "TMS", "WMS", "SAP", "Excel", "Incoterms", "Inventory control"],
    },
    whyItWorks:
      "It sizes the job in loads and lanes, shows money saved with real freight terms, and names the systems and documents — TMS, bill of lading, Incoterms — that logistics hiring managers search for.",
    summaries: [
      { level: "Entry level", text: "Supply chain graduate with a logistics internship at a regional distributor. Scheduled 20+ shipments a day and kept carrier tracking current in the TMS." },
      { level: "Mid level", text: "Logistics coordinator with 5 years in brokerage and distribution. I schedule 150+ loads a week and cut freight cost per order by 9% by rebidding lanes." },
      { level: "Senior / supervisor", text: "Logistics supervisor leading a team of 4 coordinators, owning carrier contracts and a $6M annual freight budget across 3 distribution centers." },
    ],
    bullets: [
      { skill: "Volume", weak: "Scheduled shipments", strong: "Scheduled 150+ outbound LTL and FTL loads a week from 2 distribution centers" },
      { skill: "Cost", weak: "Lowered freight costs", strong: "Cut freight cost per order by 9% by rebidding 6 lanes and consolidating low-volume freight" },
      { skill: "Audit", weak: "Checked invoices", strong: "Ran a weekly freight audit that caught $38K in duplicate and incorrect carrier invoices in a year" },
      { skill: "Reporting", weak: "Made reports", strong: "Built weekly KPI reporting on on-time pickup, transit time and damage claims in Excel" },
      { skill: "Documentation", weak: "Did paperwork", strong: "Prepared bills of lading and import/export documentation for cross-border shipments to Mexico" },
      { skill: "Problem solving", weak: "Handled delays", strong: "Rerouted freight during weather delays and kept 95% of affected orders on their original delivery date" },
    ],
    keywords: [
      "Logistics coordination", "Shipment scheduling", "Carrier management", "Freight audit", "LTL", "FTL", "TMS", "WMS",
      "SAP", "Excel", "Bill of lading", "Import/export documentation", "Incoterms", "Inventory control", "KPI reporting",
      "CLTD", "Vendor communication", "Problem solving",
    ],
    keywordSort: {
      tools: ["TMS", "WMS", "SAP", "Excel"],
      credentials: ["CLTD"],
      soft: ["Vendor communication", "Problem solving"],
    },
    tips: [
      { t: "Size your workload", d: "Loads a week, lanes, carriers or distribution centers tell a hiring manager the volume you can handle." },
      { t: "Use freight terms correctly", d: "LTL, FTL, intermodal, drayage, accessorials — use the ones that match your work, and keep them as plain text." },
      { t: "Show cost and service results", d: "Freight cost per order, on-time pickup, transit time and claims are the numbers logistics teams report." },
      { t: "Name the systems", d: "Your TMS, WMS and ERP (such as SAP or Oracle) are common filters. If you're strong in Excel, say what you build in it." },
      { t: "Mention documentation", d: "Bills of lading, customs paperwork and Incoterms matter for roles with international or cross-border freight." },
    ],
    faqs: [
      { q: "What skills should a logistics coordinator list?", a: "Shipment scheduling, carrier management, freight terms, the systems you use (TMS, WMS, ERP), Excel and communication with carriers, vendors and customers." },
      { q: "Do I need a certification like CLTD?", a: "No, but it can help, especially if you're moving up from an operations role. ASCM's CLTD covers logistics, transportation and distribution." },
      { q: "How do I move into logistics from a warehouse job?", a: "Lead with the overlap: shipping and receiving, carrier pickups, inventory accuracy and any scheduling or system work, and describe it in logistics terms." },
      { q: "Should I include freight dollar amounts?", a: "Yes, if you're allowed to share them in general terms. Savings, audit recoveries or the size of the freight budget you manage all show scale." },
      { q: "How long should a logistics coordinator resume be?", a: "One page for most coordinators. Keep 3–4 bullets per job that show volume, cost and service results." },
    ],
    related: ["warehouse-associate", "truck-driver", "project-manager", "administrative-assistant"],
  },

  // ─── Retail & hospitality ────────────────────────────────────────────
  {
    slug: "retail-sales-associate",
    role: "Retail Sales Associate",
    group: "Retail & hospitality",
    level: "Experienced · 3 years",
    intro:
      "A retail sales associate resume that shows you help customers, hit sales goals and keep the floor running — with the POS, merchandising and customer service keywords store managers screen for.",
    resume: {
      name: "Emily Nguyen",
      headline: "Retail Sales Associate",
      contact: "Portland, OR · emily.nguyen@email.com · (503) 555-0151",
      summary:
        "Retail sales associate with 3 years in outdoor gear and home goods. I learn the product inside out, help customers find the right fit and hit sales goals without being pushy.",
      jobs: [
        {
          title: "Sales Associate",
          company: "Trailhead Outdoor Supply",
          dates: "Apr 2023 – Present",
          bullets: [
            "Beat monthly sales goals in 10 of 12 months in 2025, averaging 112% of target",
            "Signed up 300+ customers for the loyalty program, the most in the store two quarters running",
            "Built product knowledge on footwear and camping gear to fit customers and suggest add-ons, raising my average sale by 15%",
            "Set up visual merchandising for seasonal displays and handled store opening and closing duties 3 days a week",
          ],
        },
        {
          title: "Sales Associate (Part-time)",
          company: "Cedar & Pine Home",
          dates: "Sep 2021 – Mar 2023",
          bullets: [
            "Ran POS systems for sales, returns and exchanges with accurate cash handling on every shift",
            "Restocked the floor and supported inventory counts, helping the store keep shrink below target",
            "Followed loss prevention procedures and flagged suspicious activity to the manager on duty",
          ],
        },
      ],
      education: "Associate of Arts, Portland Community College, 2022",
      skills: ["Customer service", "Sales", "POS systems", "Cash handling", "Upselling", "Visual merchandising", "Product knowledge", "Inventory", "Stocking", "Loss prevention"],
    },
    whyItWorks:
      "Each bullet ties customer help to a number a store manager tracks — sales against goal, loyalty sign-ups and average sale — and the everyday skills like cash handling and stocking are stated plainly.",
    summaries: [
      { level: "Entry level", text: "Friendly, dependable student looking for a first retail role. Volunteered at a community thrift store, helping 40+ shoppers a shift and running the register." },
      { level: "Experienced", text: "Retail sales associate with 3 years in outdoor gear and home goods. I averaged 112% of my monthly sales goal and lead the store in loyalty sign-ups." },
      { level: "Key holder / lead", text: "Retail key holder who opens and closes the store, runs shifts of 6 associates, handles deposits and coaches new hires on the POS and product knowledge." },
    ],
    bullets: [
      { skill: "Sales", weak: "Sold products", strong: "Beat monthly sales goals in 10 of 12 months, averaging 112% of target" },
      { skill: "Loyalty", weak: "Signed people up", strong: "Signed up 300+ customers for the loyalty program, the most in the store two quarters running" },
      { skill: "Upselling", weak: "Suggested add-ons", strong: "Raised my average sale by 15% by fitting customers properly and suggesting the right accessories" },
      { skill: "Merchandising", weak: "Set up displays", strong: "Built seasonal visual merchandising displays that the district manager used as the regional example" },
      { skill: "Accuracy", weak: "Worked the register", strong: "Handled sales, returns and exchanges on the POS with no cash drawer discrepancies in 18 months" },
      { skill: "Trust", weak: "Was reliable", strong: "Trusted with store opening and closing duties 3 days a week within 6 months of hire" },
    ],
    keywords: [
      "Customer service", "Sales", "Sales goals", "POS systems", "Cash handling", "Upselling", "Visual merchandising",
      "Product knowledge", "Inventory", "Stocking", "Loss prevention", "Returns and exchanges", "Loyalty program",
      "Store opening and closing", "Communication", "Teamwork",
    ],
    keywordSort: {
      tools: ["POS systems"],
      soft: ["Communication", "Teamwork"],
    },
    tips: [
      { t: "Show sales against goal", d: "Percent of target, average sale, items per transaction or loyalty sign-ups give a store manager something to compare." },
      { t: "Name what you sell", d: "Apparel, electronics, beauty or outdoor gear — product knowledge in the store's category is a real advantage." },
      { t: "List everyday skills too", d: "Cash handling, POS, returns and stocking are basic, but postings ask for them, so keep them in your skills list." },
      { t: "Show you're trusted", d: "Key holder duties, opening and closing or training new hires show a manager you're ready for more." },
      { t: "Mention availability", d: "Weekends, evenings and holiday availability matter in retail. A short line in your summary is enough." },
    ],
    faqs: [
      { q: "What should a retail sales associate resume include?", a: "Customer service, sales results, the POS and cash-handling experience you have, the products you know and the duties you're trusted with, like opening or closing." },
      { q: "I have no retail experience. What should I write?", a: "Use school, volunteer or food service work where you helped people, handled money or worked fast. Focus on reliability and how many customers you served." },
      { q: "How do I show sales results if my store didn't track them?", a: "Use what you know for sure — customers helped per shift, loyalty sign-ups, compliments from managers or being asked to train others." },
      { q: "Should I include a summary?", a: "A short one helps when it names the products you know and one result. Skip lines like \"hard-working team player\" that any applicant could write." },
      { q: "How do I move up to a key holder or lead role?", a: "Show times you opened or closed the store, handled deposits, solved a customer problem without a manager or trained a new associate." },
    ],
    related: ["cashier", "store-manager", "customer-service-representative", "sales-representative"],
  },
  {
    slug: "store-manager",
    role: "Store Manager",
    group: "Retail & hospitality",
    level: "Experienced · 9 years",
    intro:
      "A store manager resume built around results — sales growth, labor and shrink — plus the people-leadership and retail operations keywords district managers search for.",
    resume: {
      name: "Nicole Harris",
      headline: "Store Manager",
      contact: "Nashville, TN · nicole.harris@email.com · linkedin.com/in/nicoleharris",
      summary:
        "Store manager with 9 years in specialty retail, the last 4 running a $4.2M store. I grow sales, build strong teams and keep labor and shrink on budget.",
      jobs: [
        {
          title: "Store Manager",
          company: "Brightwell Home & Kitchen",
          dates: "Mar 2022 – Present",
          bullets: [
            "Own P&L management for a $4.2M store, delivering 14% sales growth over 2 years against a district average of 5%",
            "Lead a team of 22 through hiring and training, staff scheduling and weekly coaching; cut turnover from 68% to 41%",
            "Brought shrink from 2.1% to 1.2% of sales with tighter receiving, loss prevention audits and cash controls",
            "Hit the labor budget 10 of 12 months by matching staff scheduling to traffic data in Excel",
          ],
        },
        {
          title: "Assistant Store Manager",
          company: "Fernway Apparel",
          dates: "May 2017 – Feb 2022",
          bullets: [
            "Ran daily retail operations for a $2.8M store, including inventory control and vendor relations for local suppliers",
            "Rolled out a visual merchandising reset across 3 stores in the district ahead of the holiday season",
            "Raised customer experience survey scores from 78 to 89 by retraining the team on greeting and checkout",
          ],
        },
      ],
      education: "B.S. Business Administration, Middle Tennessee State University, 2016",
      skills: ["Store management", "P&L management", "Team leadership", "Hiring and training", "Staff scheduling", "Labor budget", "Inventory control", "Shrink reduction", "Visual merchandising", "KPIs"],
    },
    whyItWorks:
      "It reads like a district manager's scorecard — sales growth, shrink, labor and turnover — states the size of the store and team up front, and shows leadership through results rather than adjectives.",
    summaries: [
      { level: "Assistant manager", text: "Assistant store manager with 4 years in apparel retail. Ran daily operations for a $2.8M store and trained 15+ new associates on sales and POS." },
      { level: "Store manager", text: "Store manager with 9 years in specialty retail, running a $4.2M store. I grew sales 14% in 2 years and cut shrink nearly in half." },
      { level: "Multi-unit", text: "District manager over 8 stores and $30M in annual sales, coaching store managers on KPIs, labor planning and customer experience." },
    ],
    bullets: [
      { skill: "Sales growth", weak: "Increased sales", strong: "Grew store sales 14% over 2 years against a district average of 5%" },
      { skill: "Shrink", weak: "Reduced theft", strong: "Brought shrink from 2.1% to 1.2% of sales with tighter receiving, audits and cash controls" },
      { skill: "Labor", weak: "Managed schedules", strong: "Hit the labor budget 10 of 12 months by matching schedules to traffic data" },
      { skill: "People", weak: "Managed a team", strong: "Led a team of 22 and cut annual turnover from 68% to 41% through weekly coaching" },
      { skill: "Customer experience", weak: "Improved service", strong: "Raised customer survey scores from 78 to 89 by retraining the team on greeting and checkout" },
      { skill: "Merchandising", weak: "Did store resets", strong: "Led a holiday visual merchandising reset across 3 stores in the district" },
    ],
    keywords: [
      "Store management", "Retail operations", "P&L management", "Sales growth", "Team leadership", "Hiring and training",
      "Staff scheduling", "Labor budget", "Inventory control", "Shrink reduction", "Loss prevention", "Visual merchandising",
      "Customer experience", "KPIs", "Vendor relations", "Coaching", "Excel",
    ],
    keywordSort: {
      tools: ["Excel"],
      soft: ["Team leadership", "Coaching"],
    },
    tips: [
      { t: "State your store's size", d: "Annual sales, square footage and team size tell a district manager what you've already handled." },
      { t: "Report against budget", d: "Sales vs. plan, labor vs. budget and shrink vs. target are how store managers are judged. Show yours." },
      { t: "Show how you build teams", d: "Turnover, promotions from your store and training programs you ran prove leadership better than \"strong leader\"." },
      { t: "Compare to a baseline", d: "Growth against the district, last year or the company average gives your numbers context." },
      { t: "Keep it to the last 10–15 years", d: "Earlier hourly jobs can be summed up in one line so the page stays focused on management." },
    ],
    faqs: [
      { q: "How long should a store manager resume be?", a: "One page is enough for most store managers; two pages is fine for multi-unit or district roles with many results to show." },
      { q: "Can I share my store's sales numbers?", a: "Round, general figures like \"a $4M store\" or \"grew sales 14%\" are common. Leave out anything your employer treats as confidential." },
      { q: "How do I move from assistant manager to store manager?", a: "Show times you ran the store on your own — covering for the manager, owning a KPI, leading a reset or hiring and training staff." },
      { q: "Should I include hourly jobs from early in my career?", a: "Briefly. One line that shows you started on the floor can help, but the detail should go to your management roles." },
      { q: "Can I move into a store manager role from another industry?", a: "Yes, if you can show the same things: running a budget, leading a team, scheduling and serving customers. Restaurant and hospitality managers often make this move." },
    ],
    related: ["retail-sales-associate", "cashier", "sales-representative", "hr-generalist"],
  },
  {
    slug: "cashier",
    role: "Cashier",
    group: "Retail & hospitality",
    level: "Entry level · 2 years experience",
    intro:
      "A cashier resume that proves you're fast, accurate and friendly — with the cash handling, POS and customer service keywords employers look for.",
    resume: {
      name: "Jordan Mitchell",
      headline: "Cashier",
      contact: "Tampa, FL · jordan.mitchell@email.com · (813) 555-0126",
      summary:
        "Cashier with 2 years in grocery and pharmacy retail. I keep lines moving, my drawer balanced and customers leaving happy.",
      jobs: [
        {
          title: "Cashier",
          company: "Sunbay Grocery",
          dates: "Jun 2024 – Present",
          bullets: [
            "Check out 250+ customers a shift on POS systems, scanning and bagging quickly during peak hours",
            "Balanced my cash register drawer to the penny on 98% of shifts; drawer reconciliation never off by more than $1",
            "Handle returns and exchanges, coupons and loyalty program sign-ups, adding 80+ new members a month",
            "Complete age verification for alcohol and tobacco sales on every applicable transaction",
          ],
        },
        {
          title: "Cashier / Front Store Associate",
          company: "Gulfview Pharmacy",
          dates: "Aug 2023 – May 2024",
          bullets: [
            "Rang up front-store purchases and answered product questions, with light upselling of weekly deals at checkout",
            "Kept the checkout area and aisles clean and stocked, supporting store cleanliness scores",
          ],
        },
      ],
      education: "High school diploma, 2023",
      skills: ["Cash handling", "POS systems", "Cash register", "Customer service", "Drawer reconciliation", "Scanning", "Bagging", "Coupons", "Returns and exchanges", "Bilingual English/Spanish"],
    },
    whyItWorks:
      "It turns an hourly job into proof — customers per shift, a balanced drawer and loyalty sign-ups — and keeps the basic skills employers screen for in a plain, readable list.",
    summaries: [
      { level: "First job", text: "Friendly, punctual high school graduate looking for a first cashier role. Handled cash and sales at school events and volunteer fundraisers with no errors." },
      { level: "Experienced", text: "Cashier with 2 years in grocery and pharmacy retail. I check out 250+ customers a shift and balance my drawer on 98% of shifts." },
      { level: "Head cashier", text: "Head cashier who supervises 8 cashiers per shift, handles deposits and drawer counts, and trains new hires on the POS and age verification." },
    ],
    bullets: [
      { skill: "Speed", weak: "Checked out customers", strong: "Checked out 250+ customers a shift, keeping lines short during peak hours" },
      { skill: "Accuracy", weak: "Handled money", strong: "Balanced my drawer to the penny on 98% of shifts; never off by more than $1" },
      { skill: "Loyalty", weak: "Told customers about rewards", strong: "Signed up 80+ new loyalty program members a month at checkout" },
      { skill: "Compliance", weak: "Checked IDs", strong: "Completed age verification on every alcohol and tobacco sale, with no failed compliance checks" },
      { skill: "Service", weak: "Helped customers", strong: "Handled returns, exchanges and price questions without calling a manager in most cases" },
      { skill: "Upselling", weak: "Mentioned deals", strong: "Mentioned weekly deals at checkout, helping the front store reach its promotion goals" },
    ],
    keywords: [
      "Cash handling", "POS systems", "Cash register", "Customer service", "Drawer reconciliation", "Scanning", "Bagging",
      "Returns and exchanges", "Coupons", "Loyalty program", "Age verification", "Upselling", "Store cleanliness",
      "Attention to detail", "Teamwork",
    ],
    keywordSort: {
      tools: ["POS systems", "Cash register"],
      soft: ["Attention to detail", "Teamwork"],
    },
    tips: [
      { t: "Show accuracy with a number", d: "Balanced drawers, low overages and shortages, or no errors in a set time are what managers care about most." },
      { t: "Give your volume", d: "Customers or transactions per shift show you can keep up when the store is busy." },
      { t: "Name the POS if you know it", d: "If you've used Square, Clover or another POS, list it — it shows you can start quickly." },
      { t: "Mention languages", d: "Speaking a second language is a real plus at checkout. Write it plainly, like \"Bilingual English/Spanish\"." },
      { t: "Add your availability", d: "Weekends, evenings and holidays are hard to fill. Say you can work them if it's true." },
    ],
    faqs: [
      { q: "What should a cashier put on a resume with no experience?", a: "Any work where you handled money, helped people or worked fast — school events, volunteering, babysitting or family businesses. Add reliability and availability." },
      { q: "What skills do cashiers need on a resume?", a: "Cash handling, POS and scanning, customer service, accuracy, returns and exchanges, and any extras like a second language or age verification experience." },
      { q: "Should I include my drawer accuracy?", a: "Yes, if you know it. \"Balanced my drawer on 98% of shifts\" is the kind of fact that sets a cashier resume apart." },
      { q: "How long should a cashier resume be?", a: "One page. Two jobs with 2–4 bullets each, a short skills list and your education is plenty." },
      { q: "How do I move up from cashier?", a: "Show times you trained new cashiers, covered the service desk or handled deposits. Those point toward head cashier or front-end supervisor roles." },
    ],
    related: ["retail-sales-associate", "store-manager", "server", "customer-service-representative"],
  },
  {
    slug: "server",
    role: "Server",
    group: "Retail & hospitality",
    level: "Experienced · 5 years",
    intro:
      "A server resume that shows you keep guests happy, tables turning and checks growing — with the POS, menu and food safety keywords restaurant managers look for.",
    resume: {
      name: "Olivia Bennett",
      headline: "Server",
      contact: "Charleston, SC · olivia.bennett@email.com · (843) 555-0117",
      summary:
        "Server with 5 years in casual and fine dining. I know the menu cold, keep a full section running smoothly and turn good service into repeat guests and higher checks.",
      jobs: [
        {
          title: "Server",
          company: "Lantern & Oak Kitchen",
          dates: "Apr 2022 – Present",
          bullets: [
            "Run a 6-table section in a 140-seat fine dining restaurant, serving 60–80 guests on a typical weekend night",
            "Raised my average check 12% through menu knowledge, wine pairing suggestions and upselling desserts",
            "Handle food allergies by confirming each request with the kitchen and flagging tickets in Toast POS",
            "Train new servers on steps of service and table turnover, with 7 new hires trained in 2025",
          ],
        },
        {
          title: "Server",
          company: "Marigold Trattoria",
          dates: "Jun 2020 – Mar 2022",
          bullets: [
            "Served a busy casual dining section with high order accuracy, entering every order on the POS systems",
            "Handled cash handling and card payments and closed out my bank each night without discrepancies",
            "Named in guest reviews by name 30+ times, helping the restaurant's guest experience scores",
          ],
        },
      ],
      education: "ServSafe Food Handler · TIPS certified (responsible alcohol service)",
      skills: ["Table service", "Fine dining", "Guest experience", "Menu knowledge", "Wine pairing", "Upselling", "Toast POS", "Food allergies", "Cash handling", "Multitasking"],
    },
    whyItWorks:
      "It shows the size of the section and the pace of the restaurant, measures service in check size and guest reviews, and lists the food safety and alcohol service training managers need to see.",
    summaries: [
      { level: "Entry level", text: "Friendly, quick-learning host moving into serving. Seated 200+ guests a night in a busy restaurant and know the menu and allergen procedures well." },
      { level: "Experienced", text: "Server with 5 years in casual and fine dining. I run a 6-table section on busy weekends and raised my average check 12% with wine pairing and menu knowledge." },
      { level: "Lead server", text: "Lead server who trains new staff on steps of service, runs pre-shift meetings and covers floor manager duties on weekends." },
    ],
    bullets: [
      { skill: "Check size", weak: "Upsold items", strong: "Raised my average check 12% with wine pairing suggestions and dessert upselling" },
      { skill: "Volume", weak: "Served many tables", strong: "Ran a 6-table section serving 60–80 guests on a typical weekend night" },
      { skill: "Safety", weak: "Handled allergies", strong: "Confirmed every food allergy with the kitchen and flagged it on the ticket, with no allergen incidents" },
      { skill: "Guest experience", weak: "Got good reviews", strong: "Named in 30+ guest reviews for attentive, knowledgeable service" },
      { skill: "Training", weak: "Helped new staff", strong: "Trained 7 new servers on steps of service and table turnover in one year" },
      { skill: "Accuracy", weak: "Took orders", strong: "Entered every order on the POS and closed out my bank each night without discrepancies" },
    ],
    keywords: [
      "Table service", "Food service", "Guest experience", "Fine dining", "Menu knowledge", "Wine pairing", "Upselling",
      "POS systems", "Toast POS", "Food allergies", "Order accuracy", "Table turnover", "Cash handling",
      "ServSafe Food Handler", "TIPS certified", "Teamwork", "Multitasking",
    ],
    keywordSort: {
      tools: ["POS systems", "Toast POS"],
      credentials: ["ServSafe Food Handler", "TIPS certified"],
      soft: ["Teamwork", "Multitasking"],
    },
    tips: [
      { t: "Describe the restaurant", d: "Casual, fine dining, high-volume or banquet — plus the number of seats or tables — tells a manager what pace you're used to." },
      { t: "Show check size and reviews", d: "Average check, wine or dessert sales and guest reviews that mention you are the best proof of good service." },
      { t: "List food and alcohol training", d: "ServSafe Food Handler and an alcohol service program like TIPS or ServSafe Alcohol are often required. Include the ones you hold." },
      { t: "Name the POS", d: "Toast, Aloha or Square — whichever you've used — shows you can start without much training." },
      { t: "Mention trust", d: "Training new servers, closing duties or covering as lead show a manager you're ready for more." },
    ],
    faqs: [
      { q: "What should a server resume include?", a: "The type of restaurant and size of your section, results like check average or reviews, the POS you know and your food safety and alcohol service training." },
      { q: "Do I need alcohol server training?", a: "Often, yes. Some states and many employers require responsible alcohol service training for anyone who serves alcohol, and the approved programs vary by state. List the one you hold." },
      { q: "Is ServSafe Food Handler the same as ServSafe Manager?", a: "No. Food Handler is for front-line staff; ServSafe Manager is a food protection manager certification for people who supervise food safety. Servers usually need the Food Handler certificate." },
      { q: "How do I show soft skills on a server resume?", a: "Use examples: a full section on a busy night, guest reviews, allergy requests handled carefully or new staff you trained." },
      { q: "Should I list tips I earned?", a: "No. Show your check average, sales and reviews instead — they say the same thing in terms a manager is comfortable with." },
    ],
    related: ["line-cook", "front-desk-agent", "cashier", "customer-service-representative"],
  },
  {
    slug: "line-cook",
    role: "Line Cook",
    group: "Retail & hospitality",
    level: "Experienced · 4 years",
    intro:
      "A line cook resume that shows the stations you work, your speed on the line and your food safety habits — with the kitchen keywords chefs and kitchen managers look for.",
    resume: {
      name: "Carlos Mendoza",
      headline: "Line Cook",
      contact: "San Antonio, TX · carlos.mendoza@email.com · (210) 555-0189",
      summary:
        "Line cook with 4 years in high-volume and scratch kitchens. I work grill, sauté and fryer stations, keep ticket times down and keep a clean, organized station all shift.",
      jobs: [
        {
          title: "Line Cook",
          company: "Salt & Ember",
          dates: "May 2023 – Present",
          bullets: [
            "Run the grill and sauté stations in a 180-cover scratch kitchen, holding ticket times under 12 minutes on busy nights",
            "Set mise en place from daily prep lists and cut end-of-night food waste by about 20% through better portion control",
            "Follow FIFO, labeling and temperature logs; our kitchen passed every health inspection during my time here",
            "Trained 4 new cooks on recipe execution and plating standards for the grill station",
          ],
        },
        {
          title: "Prep / Line Cook",
          company: "Riverbend Grill",
          dates: "Feb 2021 – Apr 2023",
          bullets: [
            "Handled food preparation for a 250-cover casual restaurant, with knife skills for vegetables, proteins and sauces",
            "Worked the fryer and flat-top on weekend lunch rushes of 300+ covers",
            "Helped with weekly inventory counts and kept the walk-in organized and up to sanitation standards",
          ],
        },
      ],
      education: "ServSafe Food Handler, 2024 · Culinary Arts Certificate, Palo Alto College, 2021",
      skills: ["Line cooking", "Grill", "Sauté", "Fryer", "Food preparation", "Knife skills", "Mise en place", "Portion control", "Food safety", "Sanitation"],
    },
    whyItWorks:
      "It names the stations and the size of the kitchen, measures speed in ticket times and covers, and shows food safety through practices like FIFO and temperature logs instead of just listing a certificate.",
    summaries: [
      { level: "Entry level", text: "Culinary student with 6 months as a prep cook. Strong knife skills, ServSafe Food Handler certified and comfortable working fast in a busy kitchen." },
      { level: "Experienced", text: "Line cook with 4 years on grill, sauté and fryer in high-volume kitchens. I keep ticket times under 12 minutes on 180-cover nights." },
      { level: "Sous chef track", text: "Lead line cook who runs the line on busy nights, writes prep lists, handles ordering and trains new cooks, with ServSafe Manager certification." },
    ],
    bullets: [
      { skill: "Speed", weak: "Cooked fast", strong: "Held ticket times under 12 minutes on the grill station during 180-cover nights" },
      { skill: "Waste", weak: "Reduced waste", strong: "Cut end-of-night food waste by about 20% with tighter portion control and prep lists" },
      { skill: "Food safety", weak: "Followed food safety", strong: "Followed FIFO, labeling and temperature logs; the kitchen passed every health inspection" },
      { skill: "Volume", weak: "Worked busy shifts", strong: "Worked the fryer and flat-top through weekend lunch rushes of 300+ covers" },
      { skill: "Training", weak: "Helped new cooks", strong: "Trained 4 new cooks on recipe execution and plating standards for the grill station" },
      { skill: "Organization", weak: "Kept station clean", strong: "Set full mise en place from daily prep lists before every service" },
    ],
    keywords: [
      "Line cooking", "Food preparation", "Knife skills", "Grill", "Sauté", "Fryer", "Mise en place", "Prep lists",
      "Portion control", "Recipe execution", "Ticket times", "FIFO", "Food safety", "Sanitation", "Inventory",
      "ServSafe Food Handler", "Teamwork", "Working under pressure",
    ],
    keywordSort: {
      tools: ["Grill", "Fryer"],
      credentials: ["ServSafe Food Handler"],
      soft: ["Teamwork", "Working under pressure"],
    },
    tips: [
      { t: "Name your stations", d: "Grill, sauté, fryer, flat-top, garde manger or prep — chefs hire for specific stations, so list the ones you can run." },
      { t: "Describe the kitchen", d: "Covers per night, scratch or high-volume, and the cuisine tell a chef whether you'll keep up." },
      { t: "Show speed and consistency", d: "Ticket times, covers per rush and plating standards say more than \"fast-paced environment\"." },
      { t: "Prove food safety habits", d: "FIFO, labeling, temperature logs and inspection results back up your food handler certificate." },
      { t: "Keep it short", d: "One page with two or three kitchens is plenty. A chef will learn the rest in a stage or working interview." },
    ],
    faqs: [
      { q: "Do line cooks need a food handler card?", a: "Many employers and some states, counties or cities require one. ServSafe Food Handler is a common choice; the National Restaurant Association recognizes it for three years, but local rules can differ." },
      { q: "What skills should a line cook list?", a: "The stations you can run, knife skills, the cooking methods you know, food safety and sanitation, and how you handle a rush." },
      { q: "Should I include a culinary degree?", a: "If you have one, yes, but kitchen experience matters most. List certificates and degrees briefly under education." },
      { q: "How do I move up to sous chef?", a: "Show leadership in the kitchen: running the line, writing prep lists, ordering, training cooks and keeping food cost down. A food protection manager certification like ServSafe Manager helps too." },
      { q: "I only have fast-food experience. Is that useful?", a: "Yes. Speed, consistency, food safety and working a fryer or grill under pressure all carry over. Describe the volume you handled." },
    ],
    related: ["server", "front-desk-agent", "store-manager"],
  },
  {
    slug: "front-desk-agent",
    role: "Front Desk Agent",
    group: "Retail & hospitality",
    level: "Experienced · 3 years",
    intro:
      "A front desk agent resume that shows you handle check-ins, problems and upsells smoothly — with the property management system and guest services keywords hotels search for.",
    resume: {
      name: "Hannah Park",
      headline: "Front Desk Agent",
      contact: "Orlando, FL · hannah.park@email.com · (407) 555-0148",
      summary:
        "Front desk agent with 3 years in resort and business hotels. I keep check-in and check-out quick, solve guest problems on the spot and turn upgrades into extra revenue.",
      jobs: [
        {
          title: "Front Desk Agent",
          company: "Palmetto Bay Resort",
          dates: "Jul 2023 – Present",
          bullets: [
            "Handle check-in and check-out for a 420-room resort, often 150+ arrivals a shift during peak season",
            "Upsell room upgrades and late check-outs, adding about $4,500 a month in room revenue",
            "Manage reservations, room assignments and billing in Opera PMS, plus cash handling and shift-end balancing",
            "Handle guest relations and complaint resolution at the desk; named in 50+ guest reviews and survey comments in 2025",
          ],
        },
        {
          title: "Guest Services Associate",
          company: "Lakeside Suites",
          dates: "Mar 2022 – Jun 2023",
          bullets: [
            "Covered night audit 2 nights a week, closing the day in the property management system and running reports",
            "Answered a multi-line phone for reservations, guest requests and concierge questions about local attractions",
            "Enrolled 40+ guests a month in the loyalty program at check-in",
          ],
        },
      ],
      education: "Associate of Science, Hospitality and Tourism Management, Valencia College, 2022",
      skills: ["Front desk operations", "Guest services", "Check-in and check-out", "Reservations", "Opera PMS", "Night audit", "Upselling", "Complaint resolution", "Cash handling", "Bilingual English/Korean"],
    },
    whyItWorks:
      "It sizes the hotel and the arrivals per shift, shows revenue from upsells, names the property management system and night audit experience, and proves guest service with reviews.",
    summaries: [
      { level: "Entry level", text: "Hospitality student with retail cashier experience, comfortable handling payments and busy lines. Friendly on the phone and quick to learn new systems." },
      { level: "Experienced", text: "Front desk agent with 3 years in resort and business hotels. I handle 150+ arrivals a shift in Opera PMS and add about $4,500 a month in upgrade revenue." },
      { level: "Supervisor", text: "Front office supervisor who schedules a team of 10 agents, handles escalated guest issues and trains new hires on Opera PMS and night audit." },
    ],
    bullets: [
      { skill: "Volume", weak: "Checked in guests", strong: "Handled 150+ arrivals a shift at a 420-room resort during peak season" },
      { skill: "Revenue", weak: "Sold upgrades", strong: "Upsold room upgrades and late check-outs, adding about $4,500 a month in room revenue" },
      { skill: "Problem solving", weak: "Dealt with complaints", strong: "Resolved guest complaints at the desk and was named in 50+ guest reviews in a year" },
      { skill: "Systems", weak: "Used hotel software", strong: "Managed reservations, room assignments and billing in Opera PMS with accurate shift-end balancing" },
      { skill: "Night audit", weak: "Worked nights", strong: "Covered night audit 2 nights a week, closing the day and running reports in the property management system" },
      { skill: "Loyalty", weak: "Told guests about rewards", strong: "Enrolled 40+ guests a month in the loyalty program at check-in" },
    ],
    keywords: [
      "Front desk operations", "Guest services", "Check-in and check-out", "Reservations", "Opera PMS",
      "Property management system", "Guest relations", "Complaint resolution", "Upselling", "Cash handling", "Night audit",
      "Loyalty program", "Multi-line phone", "Concierge", "Bilingual", "Hospitality", "Attention to detail",
    ],
    keywordSort: {
      tools: ["Opera PMS", "Property management system", "Multi-line phone"],
      soft: ["Attention to detail"],
    },
    tips: [
      { t: "Name the hotel type and size", d: "Resort, business, boutique or extended stay, with the room count, tells a manager the pace you're used to." },
      { t: "Name your PMS", d: "Opera, or whichever property management system you use, is a common screening term. Say what you do in it." },
      { t: "Show upsell results", d: "Upgrade revenue and loyalty sign-ups are numbers front office managers track." },
      { t: "Prove guest service", d: "Guest reviews and survey comments that mention you are stronger than \"excellent people skills\"." },
      { t: "List languages and shifts", d: "A second language and availability for nights, weekends or night audit are real advantages at the desk." },
    ],
    faqs: [
      { q: "What should a front desk agent resume include?", a: "The type and size of the hotel, check-in volume, the property management system you use, upsell or loyalty results, and examples of guest problems you solved." },
      { q: "Is night audit experience worth listing?", a: "Yes. Night audit shows you can close the day, balance accounts and work alone, which many hotels need on their overnight shift." },
      { q: "I don't know Opera. Should I still apply?", a: "Yes. List the PMS or booking software you have used. Many hotels train new agents, and experience with any similar system helps." },
      { q: "How do I move into hotels from retail or restaurants?", a: "Lead with the overlap: handling payments, busy lines, phone calls and unhappy customers. Describe your volume and how you resolved problems." },
      { q: "How do I move up to front office supervisor?", a: "Show times you trained new agents, handled escalations, built schedules or covered for a manager on duty." },
    ],
    related: ["server", "customer-service-representative", "administrative-assistant", "cashier"],
  },
];
