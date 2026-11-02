/**
 * Content for the /resignation-letter hub guide. The template pages under
 * /resignation-letter/[slug] live in lib/seo/resignation-templates.ts.
 *
 * Every rule about notice and final pay points at an entry in
 * RESIGNATION_SOURCES via a `[source](#source-<id>)` footnote. This page is
 * general information, not legal advice, and says so; it makes no statistical
 * claims. If you add one, cite a primary source.
 */

import type { GuideSection } from "@/components/site/seo/guide-page";
import type { LetterContent } from "@/components/site/seo/letter-sheet";
import type { SourceItem } from "@/components/site/seo/source-list";

export const RESIGNATION_PUBLISHED = "2026-11-02";
export const RESIGNATION_UPDATED = "2026-11-02";

export const RESIGNATION_HUB_PATH = "/resignation-letter";
export const RESIGNATION_GENERATOR_PATH = "/tools/resignation-letter-generator";

/** Shared one-line disclaimer, shown on the hub and every template page. */
export const NOT_LEGAL_ADVICE =
  "This page is general information for US employees, not legal advice. Notice rules can come from your contract, a union agreement, company policy or state law — if you're unsure, check those or ask an employment attorney.";

/** Checked Nov 2, 2026. Government and legislature pages only. */
export const RESIGNATION_SOURCES: SourceItem[] = [
  {
    id: "ncsl",
    label: "National Conference of State Legislatures — At-Will Employment: Overview",
    url: "https://www.ncsl.org/labor-and-employment/at-will-employment-overview",
    note: "Employment is presumed to be at-will in every state except Montana; an employee can leave at any time, for any reason or none.",
  },
  {
    id: "dol-termination",
    label: "U.S. Department of Labor — Termination",
    url: "https://www.dol.gov/general/topic/termination",
    note: "Outside discrimination, retaliation and other protected situations, ending a job is governed by any contract between employer and employee or a labor agreement.",
  },
  {
    id: "dol-last-paycheck",
    label: "U.S. Department of Labor — Last Paycheck",
    url: "https://www.dol.gov/general/topic/wages/lastpaycheck",
    note: "Federal law doesn't require employers to give former employees their final paycheck immediately; some states do.",
  },
  {
    id: "ca-dir",
    label: "California Department of Industrial Relations — Paydays, pay periods, and the final wages",
    url: "https://www.dir.ca.gov/dlse/faq_paydays.htm",
    note: "An example of a state rule: in California, an employee who quits with at least 72 hours' notice is paid on the last day; without it, within 72 hours.",
  },
  {
    id: "twc",
    label: "Texas Workforce Commission — Work Separations",
    url: "https://efte.twc.texas.gov/work_separations_general.html",
    note: "Texas law requires no advance notice of resignation, and an employer doesn't have to pay for a notice period that isn't worked unless its policy promises to.",
  },
];

export const RESIGNATION_TEMPLATE: LetterContent = {
  name: "[Your Name]",
  contact: "[Email] · [Phone]",
  date: "[Month Day, Year]",
  recipient: ["[Manager's Name]", "[Manager's Title], [Company Name]"],
  greeting: "Dear [Manager's Name],",
  paragraphs: [
    "Please accept this letter as formal notice of my resignation from my position as [Job Title] at [Company Name]. My last day will be [Month Day, Year].",
    "Thank you for the support and the opportunities I've had here. I've valued working with you and the team.",
    "Before I leave, I'll [finish or hand off your main project], document my open work and help with the handover however I can. Please let me know what would be most useful.",
    "I wish you and [Company Name] all the best, and I hope we stay in touch.",
  ],
  signoff: "Sincerely,",
};

/** What each template paragraph does (numbered like the letter). */
export const RESIGNATION_PARTS: { t: string; d: string }[] = [
  { t: "The resignation", d: "One sentence that you're resigning, from which role, and your exact last day." },
  { t: "Thanks", d: "A short, sincere line. No need for a list of everything you learned." },
  { t: "Handover", d: "What you'll finish or hand off, and an offer to help." },
  { t: "Close", d: "A good wish and a sign-off. Nothing you'd regret in your file." },
];

/** A filled-in example. Names and company are fictional. */
export const RESIGNATION_SAMPLE: LetterContent = {
  name: "Jordan Ellis",
  contact: "jordan.ellis@example.com · (555) 010-0143",
  date: "November 2, 2026",
  recipient: ["Priya Raman", "Customer Support Manager, Northfield Supply Co."],
  greeting: "Dear Priya,",
  paragraphs: [
    "Please accept this letter as formal notice of my resignation from my position as Customer Support Specialist at Northfield Supply Co. My last day will be Friday, November 13, 2026.",
    "Thank you for your support over the past few years, and especially for trusting me to train new hires on the returns process. I've learned a lot from you and the team.",
    "Before I go, I'll close out or reassign my open tickets, update the returns guide with the recent policy changes and spend time with whoever takes over my accounts. Please let me know if there's anything else you'd like me to prioritize.",
    "I wish you and everyone at Northfield all the best.",
  ],
  signoff: "Sincerely,",
};

export const RESIGNATION_QUICK = [
  "Tell your manager in person or on a call first, then send the letter",
  "State your exact last day as a date, not \"two weeks from today\"",
  "Keep it to three or four short paragraphs",
  "Thank them briefly and offer to help with the handover",
  "Leave out complaints, comparisons and anything you'd regret",
  "Keep a copy of what you sent and when",
];

export const RESIGNATION_SECTIONS: GuideSection[] = [
  {
    id: "template",
    title: "Free resignation letter template",
    body: [
      "Copy the template below into an email or a document, replace every bracketed placeholder and delete anything that doesn't apply. It works for most jobs in the US: a clear statement that you're resigning, your last day, a brief thank-you and an offer to help with the handover.",
    ],
    figure: "template",
    after: [
      "A resignation letter is a record, not a conversation. Its job is to put the facts in writing — that you're leaving and when — so HR can process it. The conversation, and any explanation you want to give, happens with your manager before you send it.",
    ],
  },
  {
    id: "what-to-include",
    title: "What to include in a resignation letter",
    body: [
      "- **The date** you send it, at the top (in an email, the timestamp does this).\n- **A clear statement that you're resigning** and from which position. \"Please accept this letter as formal notice of my resignation\" is plain and unmistakable.\n- **Your last day**, written as a date: \"My last day will be Friday, November 13, 2026.\" A date leaves no room for different ways of counting.\n- **A short thank-you.** One or two sentences is enough, and it should be true.\n- **An offer to help with the transition** — finishing a project, writing handover notes, training a colleague. Be specific if you can, and only offer what you'll actually do.\n- **Your signature.** On a printed letter, sign above your typed name; in an email, your typed name is enough.",
      "That's all it needs. A reason is optional (see [what not to say](#what-not-to-say)), and questions about your final paycheck, unused vacation or benefits are better sent to HR separately so they get a written answer.",
    ],
  },
  {
    id: "how-to-write",
    title: "How to write a resignation letter, step by step",
    body: [
      "1. **Check your paperwork first.** Read your offer letter, employment contract, union agreement or employee handbook for a required notice period, and for rules that tie things like vacation payout or rehire eligibility to giving notice.\n2. **Pick your last day.** Count from the day you'll hand in the letter. If you have a new job, confirm its start date in writing before you resign.\n3. **Tell your manager first,** in person or on a video call, and keep it short: you're leaving, your last day, and that you'll help with the handover. They shouldn't learn about it from a letter or from HR.\n4. **Send the letter the same day** to your manager, and to HR if that's your company's process. Use the template above or one of the [templates by situation](#templates).\n5. **Keep a copy** of the letter and note when and how you sent it.\n6. **Write the handover:** your open work, key contacts, where files live and which shared accounts need a new owner. Then work your notice period the way you'd want to be remembered.",
    ],
  },
  {
    id: "notice",
    title: "How much notice to give in the US",
    body: [
      "**Two weeks is the custom, not a federal rule.** Most US jobs are \"at-will\": every state except Montana presumes employment is at-will, which means an employee can leave at any time, for any reason or none [source](#source-ncsl). No federal law sets a notice period for quitting. Outside protected situations like discrimination or retaliation, how a job ends is governed by whatever contract or labor agreement you have [source](#source-dol-termination). State labor agencies say the same — Texas, for example, requires no advance notice of resignation [source](#source-twc).",
      "**So where does \"two weeks\" come from?** It's a long-standing professional courtesy that gives your employer time to plan the handover. Giving it protects your reference and your reputation, and many company policies ask for it.",
      "**When you may need to give more — or follow different rules:**\n- **A contract or union agreement** that names a notice period. If you signed one, follow it or ask what happens if you can't.\n- **Company policy.** Some employers pay out unused vacation, or keep you eligible for rehire, only if you give the notice their handbook asks for.\n- **Senior roles and some professions** usually give longer notice. [Teachers](/resignation-letter/teacher) often have contract and end-of-school-year rules, and [nurses](/resignation-letter/nurse) need to plan around patient care and the unit schedule.",
      "**Your employer may also end things sooner.** At-will works both ways: an employer can accept your resignation effective immediately. Whether you're paid for the notice period you didn't get to work depends on state law and company policy — in Texas, for example, it isn't required unless policy promises it [source](#source-twc). Ask HR in writing if this matters to you.",
      "**Final pay depends on your state.** Federal law doesn't require an immediate final paycheck, but some states set deadlines [source](#source-dol-last-paycheck). In California, for instance, giving at least 72 hours' notice means you're owed your final wages on your last day [source](#source-ca-dir). Your state labor department's website has the rule where you work.",
    ],
  },
  {
    id: "what-not-to-say",
    title: "What not to say in a resignation letter",
    body: [
      "Your letter usually ends up in your personnel file, and it may be read by people you've never met. Leave out:",
      "- **Complaints** about your manager, coworkers, pay or workload. If there's a real problem, raise it with HR or in an exit interview, where it can be addressed.\n- **Comparisons with your new job,** its title or its pay. You don't have to name your new employer at all.\n- **A long explanation.** \"I've decided to move on\" or \"for personal reasons\" is complete.\n- **Vague dates.** \"In about two weeks\" invites a disagreement; a date doesn't.\n- **Promises you won't keep,** like being available after you leave, unless you mean it and have agreed the terms.\n- **Anything emotional you wrote in the moment.** Write it, wait a day if you can, then reread it.",
      "If you're leaving because of harassment, unsafe conditions or unpaid wages, keep the letter neutral and deal with those issues through the proper channels — HR, your state labor department or an employment attorney. The [immediate resignation](/resignation-letter/immediate) page has more on leaving quickly.",
    ],
  },
  {
    id: "sample",
    title: "Resignation letter sample",
    body: [
      "Here is the template filled in by a fictional customer support specialist. Notice how little it needs: the role, a specific last day, one real detail in the thank-you and a concrete handover plan.",
    ],
    figure: "sample",
  },
  {
    id: "sending",
    title: "Letter or email: how to send it",
    body: [
      "**Email is normal now,** especially for remote and hybrid jobs. Use a clear subject line like \"Resignation — [Your Name]\", put the letter in the body, and send it to your manager, adding HR if that's the process. The [resignation email](/resignation-letter/email) page has versions written for email.",
      "**A printed or PDF letter** suits more formal workplaces, or when your company asks for a signed copy. Use the same structure, sign above your typed name, and hand it over after the conversation with your manager.",
      "Either way, keep it to one page or less, in a plain font, with no attachments other than a handover document if you've already written one.",
    ],
  },
  {
    id: "templates",
    title: "Resignation letter templates by situation",
    body: [
      "Each page below has one to three versions you can copy or download as Word, when to use it, and tips for that situation.",
    ],
    figure: "grid",
  },
  {
    id: "generator",
    title: "Write yours with the free generator",
    body: [
      "If you'd rather start from your own details, the free [resignation letter generator](/tools/resignation-letter-generator) writes two versions from your name, your manager's name, the company, your position, your last day and the tone you choose. It uses only what you type — any version that adds a date or number you didn't give is dropped — and you can copy it or download it as a Word file. No account needed.",
    ],
  },
];

export const RESIGNATION_FAQS: { q: string; a: string }[] = [
  {
    q: "What should a resignation letter say?",
    a: "That you're resigning, from which position, and your exact last day, followed by a short thank-you and an offer to help with the handover. Three or four short paragraphs is enough.",
  },
  {
    q: "Is two weeks' notice required by law?",
    a: "Not by federal law. Most US jobs are at-will, so you can leave at any time, and two weeks is a professional custom. A contract, union agreement or company policy can require a specific notice period, so check yours. This is general information, not legal advice.",
  },
  {
    q: "Do I have to give a reason for resigning?",
    a: "No. \"I've decided to move on\" or \"for personal reasons\" is enough. If you want to explain, do it in the conversation with your manager rather than in the letter.",
  },
  {
    q: "Should I resign in person or by email?",
    a: "Tell your manager in person or on a video call first, then send the letter or email the same day so there's a written record with your last day.",
  },
  {
    q: "Who do I address a resignation letter to?",
    a: "Your direct manager. If your company has HR, copy them or send it the way your handbook says. Address your manager the way you normally do, by first name if that's your workplace's habit.",
  },
  {
    q: "Can I take back a resignation?",
    a: "Only if your employer agrees. Once you've given notice, they can accept it and plan around it, so be sure before you send the letter.",
  },
  {
    q: "What if my employer asks me to leave before my last day?",
    a: "In at-will employment they can end the job sooner. Whether you're paid for the rest of your notice period depends on your state and your company's policy, so ask HR in writing.",
  },
  {
    q: "Should I sign a resignation letter?",
    a: "On a printed letter, yes: sign above your typed name. In an email, your typed name at the end is enough.",
  },
];

export const RESIGNATION_READING: string[] = ["how-to-prepare-for-a-job-interview-with-ai", "how-to-tailor-your-resume-for-every-job"];
