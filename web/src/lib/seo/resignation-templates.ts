/**
 * The /resignation-letter/[slug] template pages: one to three copyable
 * versions each, when to use it, tips and an FAQ. Plain text with [bracketed]
 * placeholders; no statistics. Role notes (teacher, nurse) point readers to
 * their contract, district, state board and employer policy instead of
 * stating the law, which varies by state and employer.
 */

import type { LetterContent } from "@/components/site/seo/letter-sheet";
import type { FaqItem } from "@/lib/faq-ld";

export type ResignationVersion = {
  /** Section anchor, unique on the page. */
  id: string;
  title: string;
  /** One line under the heading: who this version is for. */
  note: string;
  letter: LetterContent;
};

export type ResignationTemplate = {
  slug: string;
  /** Hub grid card and "related" links. */
  card: { t: string; d: string };
  crumb: string;
  /** Candidate <title>s, longest first; fitTitle picks the first that fits. */
  titles: string[];
  h1: string;
  muted: string;
  description: string;
  lead: string;
  keywords: string[];
  whenToUse: string[];
  /** Optional one-paragraph caution under "When to use". */
  caution?: string;
  versions: ResignationVersion[];
  tips: string[];
  /** Role-specific section (teacher, nurse). */
  roleNotes?: { title: string; body: string[] };
  faqs: FaqItem[];
  related: string[];
};

const ME = "[Your Name]";
const CONTACT = "[Email] · [Phone]";
const DATE = "[Month Day, Year]";
const TO = ["[Manager's Name]", "[Manager's Title], [Company Name]"];
const DEAR = "Dear [Manager's Name],";

/** A printed/PDF-style letter with the standard header. */
function letter(paragraphs: string[], opts: { recipient?: string[]; greeting?: string; signoff?: string } = {}): LetterContent {
  return {
    name: ME,
    contact: CONTACT,
    date: DATE,
    recipient: opts.recipient ?? TO,
    greeting: opts.greeting ?? DEAR,
    paragraphs,
    signoff: opts.signoff ?? "Sincerely,",
  };
}

/** An email: subject line, greeting, body and typed name. */
function email(subject: string, paragraphs: string[], opts: { greeting?: string; signoff?: string } = {}): LetterContent {
  return { name: ME, contact: "", recipient: [], subject, greeting: opts.greeting ?? DEAR, paragraphs, signoff: opts.signoff ?? "Best regards," };
}

export const RESIGNATION_TEMPLATES: ResignationTemplate[] = [
  {
    slug: "two-weeks-notice",
    card: { t: "Two weeks notice letter", d: "The standard US notice letter, in three versions." },
    crumb: "Two weeks notice letter",
    titles: ["Two Weeks Notice Letter: 3 Free Templates (2026)", "Two Weeks Notice Letter Templates"],
    h1: "Two weeks notice letter:",
    muted: "three templates to copy.",
    description:
      "Free two weeks notice letter templates: a standard letter, a short version and an email. Copy one or download it as Word, with tips on dates and handover.",
    lead: "Three ways to give two weeks' notice — a standard letter, a short one and an email — with your last day stated clearly and an offer to help with the handover.",
    keywords: ["two weeks notice letter", "2 weeks notice letter", "two weeks notice template", "two week notice letter sample", "notice letter"],
    whenToUse: [
      "You're leaving a job where two weeks is the normal expectation.",
      "You've already told your manager in person or on a call.",
      "Your contract, union agreement or handbook doesn't ask for a longer notice period.",
    ],
    versions: [
      {
        id: "standard",
        title: "Standard two weeks notice letter",
        note: "For most jobs. Formal, warm and specific about the handover.",
        letter: letter([
          "Please accept this letter as my two weeks' notice of resignation from my position as [Job Title] at [Company Name]. My last day will be [Month Day, Year].",
          "Thank you for the opportunities I've had here. I've learned a great deal from you and the team, and I'm grateful for your support.",
          "During the next two weeks, I'll [finish or hand off your main project], write up notes on my open work and help train whoever takes over my responsibilities.",
          "Please let me know how I can be most helpful before I go. I wish you and the team continued success.",
        ]),
      },
      {
        id: "short",
        title: "Short two weeks notice letter",
        note: "When you want it brief but still courteous.",
        letter: letter([
          "I'm writing to give my two weeks' notice. My last day as [Job Title] at [Company Name] will be [Month Day, Year].",
          "Thank you for everything during my time here. I'm happy to help hand off my work before I leave.",
        ]),
      },
      {
        id: "email",
        title: "Two weeks notice email",
        note: "Paste it into the body of an email after you've told your manager.",
        letter: email("Two weeks' notice — [Your Name]", [
          "As we discussed, I'm resigning from my position as [Job Title]. This email is my two weeks' notice, and my last day will be [Month Day, Year].",
          "Thank you for your support while I've been here. Over the next two weeks I'll wrap up [current work] and make sure the handover is in good shape.",
        ]),
      },
    ],
    tips: [
      "**Write the date, not the count.** \"My last day will be Friday, November 13\" can't be read two ways; \"two weeks from today\" can.",
      "**Count from the day you hand it in.** Two weeks usually means your last day falls on the same weekday two weeks later.",
      "**Check your handbook** for anything tied to notice, such as vacation payout or rehire eligibility.",
      "**Be ready to leave sooner.** In at-will jobs an employer can accept your resignation effective immediately, so have your personal files sorted before you resign.",
      "**Keep a copy** of the letter and a note of when you sent it.",
    ],
    faqs: [
      {
        q: "Is two weeks' notice required by law?",
        a: "Not by federal law, and most US jobs are at-will, so two weeks is a professional custom. A contract, union agreement or company policy can require a specific notice period, so check yours.",
      },
      {
        q: "Do weekends count in two weeks' notice?",
        a: "Two weeks normally means two calendar weeks, so your last day falls on the same weekday two weeks after you give notice. Naming the exact date in your letter avoids any confusion.",
      },
      {
        q: "What if my employer tells me to leave right away?",
        a: "In at-will employment they can. Whether you're paid for the rest of the notice period depends on your state and company policy, so ask HR in writing.",
      },
      {
        q: "Can I give more than two weeks' notice?",
        a: "Yes. Longer notice is common for senior roles and hard-to-fill positions. Say the exact last day in your letter either way.",
      },
    ],
    related: ["short", "email", "new-job"],
  },
  {
    slug: "short",
    card: { t: "Short resignation letter", d: "Two or three lines that still cover the basics." },
    crumb: "Short resignation letter",
    titles: ["Short Resignation Letter: Free Templates to Copy", "Short Resignation Letter Templates"],
    h1: "Short resignation letter:",
    muted: "brief, polite and complete.",
    description:
      "Short resignation letter templates you can copy in one click: formal, warm and a two-line email. Each one states your last day and keeps it professional.",
    lead: "A short resignation letter still needs three things: that you're resigning, your last day and a courteous close. These versions do it in a few lines.",
    keywords: ["short resignation letter", "simple resignation letter", "brief resignation letter", "short resignation letter sample", "basic resignation letter"],
    whenToUse: [
      "You've already had the conversation with your manager and just need it in writing.",
      "Your workplace is informal, or you've only been in the job a short time.",
      "You'd rather not give a reason or go into detail.",
    ],
    versions: [
      {
        id: "formal",
        title: "Short and formal",
        note: "Works anywhere, including more traditional workplaces.",
        letter: letter([
          "Please accept this letter as notice of my resignation from my position as [Job Title] at [Company Name], effective [Month Day, Year].",
          "Thank you for the opportunity to work here. I'll do what I can to make the transition smooth.",
        ]),
      },
      {
        id: "warm",
        title: "Short and warm",
        note: "For a manager you get on well with.",
        letter: letter(
          [
            "I wanted to put in writing what we talked about: I'm resigning from my role as [Job Title], and my last day will be [Month Day, Year].",
            "Thank you for being such a supportive manager. I've really enjoyed working with you and the team, and I'll make sure my work is handed off properly.",
          ],
          { greeting: "Dear [Manager's First Name],", signoff: "With thanks," },
        ),
      },
      {
        id: "email",
        title: "Two-line resignation email",
        note: "The minimum that still counts as written notice.",
        letter: email("Resignation — [Your Name]", [
          "I'm resigning from my position as [Job Title] at [Company Name]. My last day will be [Month Day, Year].",
          "Thank you for the opportunity, and please let me know how I can help with the handover.",
        ]),
      },
    ],
    tips: [
      "**Short isn't the same as cold.** One sentence of thanks makes a brief letter read as professional rather than curt.",
      "**Don't drop the date.** Even the shortest letter should name your last day.",
      "**Skip the reason** if you don't want to share it. A short letter doesn't need one.",
      "**Talk first, then send.** A two-line letter lands better after a conversation than instead of one.",
    ],
    faqs: [
      {
        q: "Is a short resignation letter unprofessional?",
        a: "No. A resignation letter is a record. As long as it states that you're resigning, your last day and a courteous thank-you, short is fine.",
      },
      {
        q: "What is the shortest acceptable resignation letter?",
        a: "Two sentences: one saying you're resigning from your position with your last day, and one thanking your employer and offering to help with the handover.",
      },
      {
        q: "Should a short resignation letter include a reason?",
        a: "Not unless you want it to. You can explain to your manager in person and keep the letter to the facts.",
      },
    ],
    related: ["two-weeks-notice", "email", "personal-reasons"],
  },
  {
    slug: "email",
    card: { t: "Resignation email", d: "Subject lines and email-ready versions." },
    crumb: "Resignation email",
    titles: ["Resignation Email: Free Templates & Subject Lines", "Resignation Email Templates"],
    h1: "Resignation email:",
    muted: "templates and subject lines.",
    description:
      "Free resignation email templates with clear subject lines: a standard email, a brief one and a follow-up after you've told your manager. Copy and send.",
    lead: "Most resignations are sent by email now. These versions have a clear subject line, your last day up front and nothing you'd want to take back.",
    keywords: ["resignation email", "resignation email template", "resignation email sample", "how to resign by email", "resignation email subject line"],
    whenToUse: [
      "You work remotely or on a hybrid team, or your manager is in another office.",
      "Your company handles HR paperwork by email.",
      "Your manager asked you to \"put it in writing\" after you told them.",
    ],
    versions: [
      {
        id: "standard",
        title: "Standard resignation email",
        note: "A complete resignation in the body of an email.",
        letter: email("Resignation — [Your Name], [Job Title]", [
          "Please accept this email as formal notice of my resignation from my position as [Job Title] at [Company Name]. My last day will be [Month Day, Year].",
          "Thank you for your support and for the opportunities I've had here. I've valued working with you and the team.",
          "Before I leave, I'll [finish or hand off your main project] and write up notes on my open work. Please let me know if there's anything you'd like me to prioritize.",
        ]),
      },
      {
        id: "follow-up",
        title: "Email after you've told your manager",
        note: "Puts a conversation on the record.",
        letter: email(
          "Following up: my resignation",
          [
            "Thanks for taking the time to talk today. As we discussed, I'm resigning from my role as [Job Title], and my last day will be [Month Day, Year].",
            "I'll put together a handover plan for [project or responsibilities] and share it with you by [day]. I'm grateful for everything I've learned here.",
          ],
          { greeting: "Hi [Manager's First Name]," },
        ),
      },
      {
        id: "brief",
        title: "Brief resignation email",
        note: "When less is more.",
        letter: email("Resignation — [Your Name]", [
          "I'm writing to let you know that I'm resigning from my position as [Job Title]. My last day will be [Month Day, Year].",
          "Thank you for the opportunity. I'll make sure my work is handed off before I go.",
        ]),
      },
    ],
    tips: [
      "**Use a subject line that says what it is:** \"Resignation — [Your Name]\". Don't make your manager open it to find out.",
      "**Send it to your manager,** and copy HR if that's your company's process.",
      "**Talk first when you can.** A resignation email shouldn't be the first your manager hears of it.",
      "**Send it during working hours** so it's read and acknowledged promptly.",
      "**Save a copy** of the email you sent and any reply that confirms your last day.",
    ],
    faqs: [
      {
        q: "Is it OK to resign by email?",
        a: "Yes, it's common, especially for remote jobs. Tell your manager in person or on a call first when you can, then send the email so there's a written record.",
      },
      {
        q: "What subject line should I use for a resignation email?",
        a: "Something plain like \"Resignation — [Your Name]\" or \"Two weeks' notice — [Your Name]\", so your manager and HR know what it is before they open it.",
      },
      {
        q: "Should I copy HR on my resignation email?",
        a: "If your company has an HR team, copy them or forward it the way your handbook says, so your last day is processed correctly.",
      },
      {
        q: "Do I need to attach a letter to my resignation email?",
        a: "Usually not; the email itself is the written notice. Attach a signed letter only if your company asks for one.",
      },
    ],
    related: ["two-weeks-notice", "short", "immediate"],
  },
  {
    slug: "immediate",
    card: { t: "Immediate resignation letter", d: "When you can't work a notice period." },
    crumb: "Immediate resignation letter",
    titles: ["Immediate Resignation Letter: Templates & Tips", "Immediate Resignation Letter"],
    h1: "Immediate resignation letter:",
    muted: "when you can't give notice.",
    description:
      "Immediate resignation letter templates for leaving without notice, with or without a reason. What to say, what to check first and how to leave on good terms.",
    lead: "Sometimes you can't work a notice period — a health problem, a family emergency or a workplace that isn't safe. These letters say so clearly and courteously.",
    keywords: ["immediate resignation letter", "resignation letter effective immediately", "resignation letter without notice", "quit without notice letter", "immediate resignation email"],
    whenToUse: [
      "A health issue or family emergency means you can't keep working.",
      "Staying would put your safety or well-being at risk.",
      "You and your employer have agreed that you'll leave right away.",
    ],
    caution:
      "Before you resign without notice, check your contract and handbook. Leaving without the notice your employer asks for can affect things like vacation payout or whether you're eligible to be rehired. If you're leaving because of harassment, unsafe conditions or unpaid wages, you may want to talk to an employment attorney or your state labor department first.",
    versions: [
      {
        id: "apology",
        title: "Effective immediately, with an apology",
        note: "Acknowledges the short notice and offers what help you can.",
        letter: letter([
          "Please accept this letter as notice of my resignation from my position as [Job Title] at [Company Name], effective immediately.",
          "I'm sorry for the short notice. Circumstances make it impossible for me to continue, and I didn't make this decision lightly.",
          "I'd like to make the transition as easy as I can. I'll send notes on my open work by [day], and I'm happy to answer questions by email for the next [few days].",
          "Thank you for the opportunities I've had here.",
        ]),
      },
      {
        id: "personal",
        title: "Effective immediately, for health or family reasons",
        note: "Gives a reason without sharing private details.",
        letter: letter([
          "Due to [a health matter / a family emergency], I need to resign from my position as [Job Title], effective [today, Month Day, Year].",
          "I regret that I can't give the usual notice, and I appreciate your understanding. Please let me know what you need from me to complete the handover and any paperwork.",
          "Thank you for your support during my time at [Company Name].",
        ]),
      },
      {
        id: "brief",
        title: "Brief immediate resignation email",
        note: "When a short, neutral record is all you can manage.",
        letter: email("Resignation effective immediately — [Your Name]", [
          "I'm resigning from my position as [Job Title], effective immediately. I'm sorry I'm unable to give more notice.",
          "Please let me know how to return [company equipment] and where to send any final paperwork.",
        ]),
      },
    ],
    tips: [
      "**Say \"effective immediately\" or give the date.** There should be no doubt about when you've stopped working.",
      "**Keep the reason short and private.** \"A family emergency\" is enough; you don't owe details.",
      "**Arrange to return equipment** — laptop, badge, keys — and ask where to send it.",
      "**Ask HR in writing** about your final paycheck, unused vacation and benefits. Final pay deadlines vary by state.",
      "**Stay neutral.** Even if you're leaving a bad situation, a calm letter protects you.",
    ],
    faqs: [
      {
        q: "Can I resign without giving notice?",
        a: "In most US jobs, yes: at-will employment means you can leave at any time. A contract, union agreement or company policy may set terms for notice, so check them before you go. This is general information, not legal advice.",
      },
      {
        q: "Will resigning immediately hurt my final paycheck?",
        a: "You're still owed wages for the time you worked. When the final check is due depends on your state, and whether unused vacation is paid out can depend on state law and company policy.",
      },
      {
        q: "Do I have to explain why I'm resigning immediately?",
        a: "No. A brief reason like \"due to a family emergency\" helps your employer understand, but you don't have to give one or share details.",
      },
      {
        q: "Can an immediate resignation affect a reference?",
        a: "It can. A courteous letter, an apology for the short notice and an offer to help with the handover go a long way toward leaving on good terms.",
      },
    ],
    related: ["personal-reasons", "email", "short"],
  },
  {
    slug: "personal-reasons",
    card: { t: "Resignation for personal reasons", d: "Leave without oversharing." },
    crumb: "Resignation letter for personal reasons",
    titles: ["Resignation Letter for Personal Reasons: Templates", "Personal Reasons Resignation Letter"],
    h1: "Resignation letter for personal reasons:",
    muted: "say enough, not everything.",
    description:
      "Resignation letter templates for personal reasons: no details, family reasons and health reasons. Courteous wording that keeps private matters private.",
    lead: "You don't have to explain why you're leaving. These letters mention personal reasons in a single line, then get on with the dates and the handover.",
    keywords: ["resignation letter for personal reasons", "personal reasons resignation letter", "resignation letter family reasons", "resignation letter due to health reasons", "resign for personal reasons"],
    whenToUse: [
      "You're leaving for family, health or other private reasons.",
      "You want to give some explanation without going into detail.",
      "You'd like to leave the door open to coming back later.",
    ],
    versions: [
      {
        id: "no-details",
        title: "Personal reasons, no details",
        note: "The most private version.",
        letter: letter([
          "Please accept this letter as notice of my resignation from my position as [Job Title] at [Company Name]. For personal reasons, I've decided to step away, and my last day will be [Month Day, Year].",
          "Thank you for the support and understanding you've shown me. I've valued my time here.",
          "Before I leave, I'll make sure my work is documented and handed off. Please let me know how I can help.",
        ]),
      },
      {
        id: "family",
        title: "Family reasons",
        note: "For caregiving, a new baby or other family needs.",
        letter: letter([
          "I'm writing to let you know that I'm resigning from my position as [Job Title], with my last day on [Month Day, Year]. My family needs more of my time right now, and I've decided this is the right step.",
          "I'm grateful for everything I've learned here and for how supportive you and the team have been.",
          "I'll do my best to leave things in good order, including [handover task]. I hope we can stay in touch.",
        ]),
      },
      {
        id: "health",
        title: "Health reasons",
        note: "Mentions health without sharing medical details.",
        letter: letter([
          "Please accept this letter as notice of my resignation from my position as [Job Title] at [Company Name]. I need to focus on my health, and my last day will be [Month Day, Year].",
          "Thank you for your understanding and for the opportunities I've had here.",
          "I'll document my current work so the team can pick it up easily. Please let me know what else would help.",
        ]),
      },
    ],
    tips: [
      "**One line on the reason is plenty.** \"For personal reasons\" is a complete explanation.",
      "**Don't share medical details.** \"To focus on my health\" says enough.",
      "**Ask about options before you resign** if you'd rather not leave: unpaid leave, a reduced schedule or remote work may be possible. HR can tell you what's available.",
      "**Leave the door open** if you might want to return. A warm close helps.",
    ],
    faqs: [
      {
        q: "Do I have to say what my personal reasons are?",
        a: "No. \"For personal reasons\" is enough. Your employer may ask, but you can keep details private.",
      },
      {
        q: "Should I mention a health issue in my resignation letter?",
        a: "Only in general terms, if at all. \"I need to focus on my health\" is enough, and you don't need to share a diagnosis.",
      },
      {
        q: "Is it better to resign or ask for leave?",
        a: "If you'd like to return, ask HR about leave or a flexible schedule before resigning. What's available depends on your employer's policies and your situation.",
      },
    ],
    related: ["immediate", "relocation", "short"],
  },
  {
    slug: "retirement",
    card: { t: "Retirement letter", d: "Announce your retirement and plan the handover." },
    crumb: "Retirement letter",
    titles: ["Retirement Letter: Free Templates & Examples (2026)", "Retirement Letter Templates"],
    h1: "Retirement letter:",
    muted: "templates for your last chapter at work.",
    description:
      "Free retirement letter templates to your employer: formal, warm and with a longer transition. Copy one or download it as Word, plus tips on timing and HR paperwork.",
    lead: "A retirement letter makes it official. These versions give your last day, thank the people you've worked with and set up a handover with plenty of time.",
    keywords: ["retirement letter", "retirement letter to employer", "retirement resignation letter", "retirement letter sample", "letter of retirement"],
    whenToUse: [
      "You've decided on a retirement date and told your manager.",
      "Your employer or benefits plan needs written notice to start the paperwork.",
      "You'd like to offer a longer or phased transition.",
    ],
    versions: [
      {
        id: "formal",
        title: "Formal retirement letter",
        note: "Clear and traditional, for any workplace.",
        letter: letter([
          "Please accept this letter as formal notice of my retirement from my position as [Job Title] at [Company Name]. My last day of work will be [Month Day, Year].",
          "It has been a privilege to work here, and I'm grateful for the colleagues and the opportunities I've had along the way.",
          "I'm committed to a smooth transition and will work with you and HR on handing over my responsibilities and completing my retirement paperwork.",
          "Thank you for your support over the years.",
        ]),
      },
      {
        id: "warm",
        title: "Warm retirement letter",
        note: "For a manager and team you've been close to.",
        letter: letter(
          [
            "After a lot of thought, I've decided it's time to retire. My last day as [Job Title] will be [Month Day, Year].",
            "Working at [Company Name] has been one of the best parts of my career. I'll miss the people most of all, and I'm proud of what we've built together, especially [project or achievement].",
            "I'd love to help make this an easy handover — whether that's training my successor, documenting how things work or anything else that would help the team.",
          ],
          { greeting: "Dear [Manager's First Name],", signoff: "With gratitude," },
        ),
      },
      {
        id: "transition",
        title: "Retirement letter with a longer transition",
        note: "When you're giving extra notice or offering to help afterward.",
        letter: letter([
          "I'm writing to let you know that I plan to retire from my position as [Job Title], with my last day on [Month Day, Year]. I'm giving this notice early so we have time to plan.",
          "Between now and then, I'd like to help hire and train my replacement and document [key processes or accounts]. If it would be useful, I'm open to discussing [part-time or consulting help] after my last day.",
          "Thank you for many rewarding years at [Company Name].",
        ]),
      },
    ],
    tips: [
      "**Give as much notice as you comfortably can.** Retirements are usually planned, and extra time helps your employer hire and train a successor.",
      "**Talk to HR early** about the paperwork for any pension, retirement plan or health coverage. Ask what dates or forms they need from you.",
      "**Only offer post-retirement help you want to give,** and agree the terms separately.",
      "**Mention one thing you're proud of.** It makes the letter personal without making it long.",
    ],
    faqs: [
      {
        q: "How much notice should I give before retiring?",
        a: "More than for an ordinary resignation if you can, because retirements are planned. Check your handbook and benefits plan for any notice they ask for.",
      },
      {
        q: "Who should I send my retirement letter to?",
        a: "Your manager, and HR or the benefits team, who will handle your retirement paperwork.",
      },
      {
        q: "Is a retirement letter the same as a resignation letter?",
        a: "It does the same job — it gives written notice and your last day — but it says you're retiring, which can matter for benefits paperwork.",
      },
    ],
    related: ["two-weeks-notice", "personal-reasons", "part-time-job"],
  },
  {
    slug: "teacher",
    card: { t: "Teacher resignation letter", d: "Contract and school-year timing." },
    crumb: "Teacher resignation letter",
    titles: ["Teacher Resignation Letter: Templates & Tips (2026)", "Teacher Resignation Letter Templates"],
    h1: "Teacher resignation letter:",
    muted: "templates, with your contract in mind.",
    description:
      "Teacher resignation letter templates for the end of the school year, mid-year and a short letter to your principal, plus what to check in your contract first.",
    lead: "Teachers resign on a different calendar. These letters fit the end of the school year or a mid-year move, and the notes below cover what to check in your contract first.",
    keywords: ["teacher resignation letter", "teacher resignation letter end of school year", "teacher resignation letter mid year", "resignation letter for teachers", "teacher resignation letter to principal"],
    whenToUse: [
      "You're leaving at the end of the school year and want to tell your district in good time.",
      "You need to leave mid-year and want to support a smooth transition for your students.",
      "Your district asks for written notice to your principal, HR or the superintendent.",
    ],
    versions: [
      {
        id: "end-of-year",
        title: "End of the school year",
        note: "The most common teacher resignation.",
        letter: letter(
          [
            "Please accept this letter as notice of my resignation from my position as [Grade/Subject] Teacher at [School Name], effective at the end of the [School Year] school year on [Month Day, Year].",
            "Thank you for your support and for the chance to teach such wonderful students. I've valued working with the staff and families at [School Name].",
            "I'll finish the year fully committed to my classes, and I'm happy to share curriculum materials, student notes and anything else that would help my successor.",
          ],
          { recipient: ["[Principal's Name]", "Principal, [School Name]"], greeting: "Dear [Principal's Name]," },
        ),
      },
      {
        id: "mid-year",
        title: "Mid-year resignation",
        note: "Acknowledges the timing and offers a transition plan.",
        letter: letter(
          [
            "I'm writing to inform you of my resignation from my position as [Grade/Subject] Teacher at [School Name]. In line with [my contract / district policy], my last day will be [Month Day, Year].",
            "I know a mid-year change is hard on students, and I didn't make this decision lightly. I want to make the transition as smooth as possible for my classes.",
            "Before I leave, I'll prepare lesson plans through [date or unit], up-to-date grades and notes on each class, and I'm glad to meet with my replacement.",
            "Thank you for your understanding and for your support during my time here.",
          ],
          { recipient: ["[Principal's Name]", "Principal, [School Name]"], greeting: "Dear [Principal's Name]," },
        ),
      },
      {
        id: "short",
        title: "Short letter to your principal",
        note: "When the details are already agreed.",
        letter: letter(
          [
            "Please accept this letter as my resignation from my position as [Grade/Subject] Teacher at [School Name], effective [Month Day, Year].",
            "Thank you for the opportunity to teach here. I'll make sure my classroom and materials are ready for whoever follows me.",
          ],
          { recipient: ["[Principal's Name]", "Principal, [School Name]"], greeting: "Dear [Principal's Name]," },
        ),
      },
    ],
    tips: [
      "**Read your contract before you write anything.** It may name a notice period, a date or a process for being released early.",
      "**Tell your principal first,** then send the letter to whoever your district names — often the principal and HR or the superintendent's office.",
      "**Think about your students' calendar.** If you can choose, the end of a grading period or the school year is easiest on them.",
      "**Leave a clean handover:** lesson plans, gradebook, IEP or 504 notes through the proper channels, and where materials are kept.",
      "**Ask about pay and benefits timing.** Teachers paid over the summer should ask HR how resigning affects those checks and health coverage.",
    ],
    roleNotes: {
      title: "Before you resign: contracts and the school year",
      body: [
        "Teaching jobs are often on annual contracts, and the rules for leaving vary by state and district. Some districts set a date by which teachers must say whether they're returning; some contracts require written notice a set number of days ahead or the district's agreement to release you mid-year. In some states, leaving a contract without being released can have consequences for your teaching certificate.",
        "**Check your contract, your district's policy and your union agreement if you have one** — and if anything is unclear, ask HR or your union representative before you send your letter. This page can't tell you what your contract says, and it isn't legal advice.",
      ],
    },
    faqs: [
      {
        q: "When should a teacher submit a resignation letter?",
        a: "It depends on your contract and district. Many districts ask teachers to give notice well before the next school year starts, and some set a specific deadline. Check your contract and district policy.",
      },
      {
        q: "Can a teacher resign in the middle of the school year?",
        a: "Often, yes, but your contract may require notice or the district's agreement to release you. Ask HR or your union representative before you resign, because the rules vary by state and district.",
      },
      {
        q: "Who should a teacher address a resignation letter to?",
        a: "Usually your principal, with a copy to HR or the superintendent's office. Your district's policy will say who needs it.",
      },
      {
        q: "Should I tell my students I'm leaving?",
        a: "Agree on the timing and wording with your principal first, so students and families hear it in a planned way.",
      },
    ],
    related: ["two-weeks-notice", "career-change", "relocation"],
  },
  {
    slug: "nurse",
    card: { t: "Nurse resignation letter", d: "Handoff, scheduling and patient care." },
    crumb: "Nurse resignation letter",
    titles: ["Nurse Resignation Letter: Templates & Tips (2026)", "Nurse Resignation Letter Templates"],
    h1: "Nurse resignation letter:",
    muted: "leave without leaving your patients short.",
    description:
      "Nurse resignation letter templates for staff nurses, longer notice and a short version, plus how to handle scheduling and patient handoff when you leave.",
    lead: "Nurses resign around a schedule and a patient assignment, not just a calendar. These letters give a clear last day and a handoff plan your nurse manager can work with.",
    keywords: ["nurse resignation letter", "RN resignation letter", "nursing resignation letter", "resignation letter for nurses", "nurse two weeks notice"],
    whenToUse: [
      "You're leaving a staff, charge or specialty nursing role.",
      "You want to give your nurse manager time to cover your shifts.",
      "You're moving to a new unit, facility or specialty.",
    ],
    versions: [
      {
        id: "standard",
        title: "Staff nurse resignation letter",
        note: "For most bedside roles.",
        letter: letter(
          [
            "Please accept this letter as notice of my resignation from my position as [Registered Nurse / Job Title] on [Unit Name] at [Facility Name]. My last scheduled shift will be [Month Day, Year].",
            "Thank you for your support and for the chance to work with such a dedicated team. I've learned a great deal here.",
            "I'll work all of my scheduled shifts through my last day and make sure my patients are handed off properly. If it would help with the schedule, I'm happy to talk about which shifts I can cover before I go.",
          ],
          { recipient: ["[Nurse Manager's Name]", "Nurse Manager, [Unit Name], [Facility Name]"], greeting: "Dear [Nurse Manager's Name]," },
        ),
      },
      {
        id: "longer-notice",
        title: "Longer notice with a handoff plan",
        note: "For charge, specialty or leadership roles.",
        letter: letter(
          [
            "I'm writing to give notice that I'm resigning from my position as [Job Title] on [Unit Name]. I'm giving notice before the next schedule is built, and my last shift will be [Month Day, Year].",
            "Before I leave, I'd like to help orient whoever takes over my [charge / preceptor / committee] responsibilities and update [unit resources or protocols I maintain].",
            "Thank you for your leadership and for everything I've learned at [Facility Name]. It has been a privilege to care for patients alongside this team.",
          ],
          { recipient: ["[Nurse Manager's Name]", "Nurse Manager, [Unit Name], [Facility Name]"], greeting: "Dear [Nurse Manager's Name]," },
        ),
      },
      {
        id: "short",
        title: "Short nurse resignation email",
        note: "When you've already spoken with your manager.",
        letter: email(
          "Resignation — [Your Name], RN, [Unit Name]",
          [
            "As we discussed, I'm resigning from my position as [Job Title] on [Unit Name]. My last scheduled shift will be [Month Day, Year].",
            "I'll complete my scheduled shifts and give a full handoff on each of them. Thank you for your support.",
          ],
          { greeting: "Dear [Nurse Manager's Name]," },
        ),
      },
    ],
    tips: [
      "**Check your handbook for the notice your employer asks for.** Many hospitals ask nurses for more than two weeks, especially in charge or leadership roles.",
      "**Give notice before the next schedule is built** if you can. It's the easiest way to keep your shifts covered.",
      "**Name your last shift,** not just a date, so scheduling knows exactly what's covered.",
      "**Don't leave in the middle of a shift.** Finish your scheduled shifts and give a full handoff each time.",
      "**Ask HR about your license verification, references and benefits end date** before your last day.",
    ],
    roleNotes: {
      title: "Patient care, scheduling and patient abandonment",
      body: [
        "Resigning is not the same as abandoning patients, but how you leave matters. Once you've accepted a patient assignment, walking out without a proper handoff to another qualified nurse can be treated very differently from giving notice and working your scheduled shifts.",
        "**State boards of nursing define patient abandonment differently**, and employers have their own policies on notice and scheduled shifts. Before you resign — and especially if you're thinking of leaving with little or no notice — **check your state board of nursing's guidance and your employer's policy**, and talk to your nurse manager about covering your remaining shifts. This page isn't legal advice.",
      ],
    },
    faqs: [
      {
        q: "How much notice should a nurse give?",
        a: "At least what your employer's policy asks for, which is often more than two weeks for nurses and longer for charge or leadership roles. Giving notice before the next schedule is built helps your unit most.",
      },
      {
        q: "Is resigning without notice patient abandonment?",
        a: "Not by itself — giving notice and leaving a job is different from leaving an accepted patient assignment without a handoff. But state boards of nursing define abandonment differently, so check your state board's guidance and your employer's policy.",
      },
      {
        q: "Who should a nurse send a resignation letter to?",
        a: "Your nurse manager, with a copy to HR or the staffing office if that's your facility's process.",
      },
      {
        q: "Should a travel or agency nurse send a resignation letter?",
        a: "Tell your agency first and follow your contract, which usually sets the terms for ending an assignment. The facility may also want written notice.",
      },
    ],
    related: ["two-weeks-notice", "new-job", "part-time-job"],
  },
  {
    slug: "new-job",
    card: { t: "Resignation for a new job", d: "Leaving for another role, gracefully." },
    crumb: "Resignation letter for a new job",
    titles: ["Resignation Letter for a New Job: Free Templates", "Resignation Letter for a New Job"],
    h1: "Resignation letter for a new job:",
    muted: "leave well, start fresh.",
    description:
      "Resignation letter templates for when you've accepted a new job: a standard letter, a warm one for a mentor manager and an email. You don't have to name the new employer.",
    lead: "You've accepted an offer. These letters give notice, thank your current employer and say nothing about the new job that you don't want to share.",
    keywords: ["resignation letter for new job", "resignation letter new opportunity", "resignation letter accepting another job", "resignation letter for better opportunity", "leaving for a new job letter"],
    whenToUse: [
      "You've accepted a written offer and confirmed your start date.",
      "You want to leave on good terms and keep your current manager as a reference.",
      "You'd rather not say where you're going.",
    ],
    caution:
      "Wait until you have the new offer in writing, with your start date — and any background check or other conditions cleared — before you resign.",
    versions: [
      {
        id: "standard",
        title: "Leaving for a new role",
        note: "Mentions a new opportunity without naming it.",
        letter: letter([
          "Please accept this letter as notice of my resignation from my position as [Job Title] at [Company Name]. I've accepted a new role, and my last day here will be [Month Day, Year].",
          "This wasn't an easy decision. I'm grateful for the opportunities I've had here and for everything I've learned from you and the team.",
          "Before I go, I'll [finish or hand off your main project] and document my open work so the transition is smooth.",
        ]),
      },
      {
        id: "mentor",
        title: "Warm letter for a manager who helped you grow",
        note: "When your manager played a part in getting you here.",
        letter: letter(
          [
            "I wanted to let you know in writing that I've accepted a new position and will be resigning from my role as [Job Title]. My last day will be [Month Day, Year].",
            "You've had a real part in my growth here — especially [something specific they did]. I'm grateful, and I hope we stay in touch.",
            "I'll do everything I can to set up whoever takes over my work, including [handover task].",
          ],
          { greeting: "Dear [Manager's First Name],", signoff: "With thanks," },
        ),
      },
      {
        id: "email",
        title: "Resignation email for a new job",
        note: "Short and email-ready.",
        letter: email("Resignation — [Your Name]", [
          "As we discussed, I've accepted a new role and am resigning from my position as [Job Title]. My last day will be [Month Day, Year].",
          "Thank you for the opportunities I've had here. I'll make sure my projects are handed off before I go.",
        ]),
      },
    ],
    tips: [
      "**Don't name the new employer** unless you want to. \"I've accepted a new role\" is enough.",
      "**Skip comparisons** of title, pay or culture. Leave that out of the letter and the exit interview.",
      "**Think about a counteroffer before you resign.** If you've already decided to leave, a polite \"thank you, but I've made my decision\" is fine.",
      "**Update your resume and LinkedIn after your last day,** and keep in touch with the people you'd want as references.",
    ],
    faqs: [
      {
        q: "Should I say where I'm going in my resignation letter?",
        a: "You don't have to. \"I've accepted a new role\" or \"a new opportunity\" is enough. Share more in conversation if you want to.",
      },
      {
        q: "When should I resign after accepting a new job?",
        a: "Once you have the offer in writing with a start date, and any conditions such as a background check are cleared. Then work back from the start date to give your current employer the notice they expect.",
      },
      {
        q: "What if my employer makes a counteroffer?",
        a: "Decide in advance whether anything would change your mind. If not, thank them and say you've made your decision.",
      },
    ],
    related: ["two-weeks-notice", "career-change", "email"],
  },
  {
    slug: "career-change",
    card: { t: "Resignation for a career change", d: "Moving to a new field or back to school." },
    crumb: "Resignation letter for a career change",
    titles: ["Resignation Letter for a Career Change: Templates", "Career Change Resignation Letter"],
    h1: "Resignation letter for a career change:",
    muted: "close one chapter cleanly.",
    description:
      "Resignation letter templates for a career change or going back to school. Explain the move in one honest line, give your last day and offer a clean handover.",
    lead: "Leaving your field is a bigger step than leaving a job. These letters explain it in one honest sentence and keep the rest about your last day and the handover.",
    keywords: ["resignation letter career change", "resignation letter for career change", "resignation letter to pursue another career", "resignation letter going back to school", "career change resignation"],
    whenToUse: [
      "You're moving to a different field or type of work.",
      "You're leaving to go back to school or retrain.",
      "You want your employer to understand it isn't about them.",
    ],
    versions: [
      {
        id: "career-change",
        title: "Career change",
        note: "Says why in one line, without overexplaining.",
        letter: letter([
          "Please accept this letter as notice of my resignation from my position as [Job Title] at [Company Name]. I've decided to pursue a career in [new field], and my last day will be [Month Day, Year].",
          "This decision is about the direction I want my career to take, not about my time here. I'm grateful for the experience and the skills I've built at [Company Name], and for your support.",
          "I'll make sure my work is documented and handed off before I go. Please let me know what would help most.",
        ]),
      },
      {
        id: "school",
        title: "Going back to school",
        note: "For a degree, certificate or training program.",
        letter: letter([
          "I'm writing to let you know that I'm resigning from my position as [Job Title] to return to school for [program or field]. My last day will be [Month Day, Year].",
          "Thank you for the opportunities and encouragement I've had here. The experience will stay with me in whatever comes next.",
          "Between now and my last day, I'll [handover task] and help train whoever takes over my responsibilities.",
        ]),
      },
      {
        id: "short",
        title: "Short career change email",
        note: "When you've already explained in person.",
        letter: email("Resignation — [Your Name]", [
          "As we discussed, I'm resigning from my role as [Job Title] to pursue a new direction in my career. My last day will be [Month Day, Year].",
          "Thank you for everything. I'll make sure my work is in good shape before I leave.",
        ]),
      },
    ],
    tips: [
      "**One sentence on the change is enough.** Your manager doesn't need your whole plan.",
      "**Make it clear it isn't personal** if that's true. It helps keep the relationship.",
      "**Ask for a reference or LinkedIn recommendation** while your work is fresh in your manager's mind.",
      "**Ask about part-time or project work** if you'd like income while you retrain — some employers are open to it.",
    ],
    faqs: [
      {
        q: "Should I explain my career change in my resignation letter?",
        a: "Briefly, if you want to. A single sentence like \"I've decided to pursue a career in [field]\" is enough.",
      },
      {
        q: "Can I ask my employer for a reference when changing careers?",
        a: "Yes. Ask your manager directly before you leave, and mention the skills that will carry over to your new field.",
      },
      {
        q: "Should I say I'm going back to school?",
        a: "If you're comfortable sharing it, yes. It's a clear, positive reason that most employers understand.",
      },
    ],
    related: ["new-job", "personal-reasons", "two-weeks-notice"],
  },
  {
    slug: "relocation",
    card: { t: "Resignation due to relocation", d: "Moving away, with or without a remote option." },
    crumb: "Resignation letter due to relocation",
    titles: ["Resignation Letter Due to Relocation: Templates", "Relocation Resignation Letter"],
    h1: "Resignation letter due to relocation:",
    muted: "moving on, literally.",
    description:
      "Resignation letter templates for when you're moving away: a standard relocation letter, one that asks about remote work and a short email. Copy or download as Word.",
    lead: "You're moving, and the job isn't coming with you — or might, if you ask. These letters cover both, with a clear last day either way.",
    keywords: ["resignation letter due to relocation", "relocation resignation letter", "resignation letter moving", "resignation letter moving out of state", "resignation letter relocating"],
    whenToUse: [
      "You're moving for a partner's job, family or a fresh start.",
      "Your job can't be done from where you're moving.",
      "You'd like to ask whether a remote arrangement is possible before you leave.",
    ],
    versions: [
      {
        id: "relocation",
        title: "Relocation resignation letter",
        note: "The straightforward version.",
        letter: letter([
          "Please accept this letter as notice of my resignation from my position as [Job Title] at [Company Name]. I'm relocating to [City, State], and my last day will be [Month Day, Year].",
          "I've truly enjoyed working here, and I'm grateful for your support and for the team I've worked with.",
          "Before I move, I'll hand off [projects or responsibilities] and make sure everything is documented.",
        ]),
      },
      {
        id: "remote",
        title: "Relocation, open to remote work",
        note: "Gives notice but leaves the door open.",
        letter: letter([
          "I'm writing to let you know that I'm relocating to [City, State], and I'm giving notice of my resignation from my position as [Job Title]. My last day in the office will be [Month Day, Year].",
          "I've valued my time here, and if a remote arrangement would work for the team, I'd be glad to discuss it. If not, I completely understand.",
          "Either way, I'll make sure my work is handed off smoothly before I go.",
        ]),
      },
      {
        id: "short",
        title: "Short relocation email",
        note: "When you've already talked it through.",
        letter: email("Resignation — [Your Name]", [
          "As we discussed, I'm moving to [City, State] and resigning from my position as [Job Title]. My last day will be [Month Day, Year].",
          "Thank you for everything. I'll have my handover notes ready before I leave.",
        ]),
      },
    ],
    tips: [
      "**Ask about remote work before you resign,** if you'd like to stay. Once you've resigned, your employer may already be planning around it.",
      "**Ask about a transfer** if your company has an office or location where you're moving.",
      "**Give your new address to HR** for your final paycheck and tax forms.",
      "**Check final pay rules in the state you're leaving;** they can differ from the state you're moving to.",
    ],
    faqs: [
      {
        q: "Should I ask about remote work before resigning?",
        a: "Yes, if you'd like to keep the job. Raise it with your manager first; if it isn't possible, then send your resignation.",
      },
      {
        q: "Do I need to say where I'm moving?",
        a: "No, though naming the city is common and friendly. Saying you're relocating is enough.",
      },
      {
        q: "What should I give HR when I relocate?",
        a: "Your new mailing address for your final paycheck and year-end tax forms, and any contact details they need.",
      },
    ],
    related: ["personal-reasons", "two-weeks-notice", "email"],
  },
  {
    slug: "part-time-job",
    card: { t: "Part-time job resignation", d: "Retail, restaurant and student jobs." },
    crumb: "Part-time job resignation letter",
    titles: ["Part-Time Job Resignation Letter: Free Templates", "Part-Time Resignation Letter"],
    h1: "Part-time job resignation letter:",
    muted: "short, polite and on schedule.",
    description:
      "Part-time job resignation letter templates for retail, restaurant and student jobs: a standard letter, one for going back to school and a short message.",
    lead: "Part-time jobs run on the schedule. These letters give your last shift, thank your manager and make it easy to cover your hours.",
    keywords: ["part time job resignation letter", "resignation letter part time job", "part time resignation letter", "resignation letter for student part time job", "retail resignation letter"],
    whenToUse: [
      "You're leaving a part-time job in retail, food service, a campus job or similar.",
      "You're going back to school or your schedule is changing.",
      "You want to stay on good terms for a reference or a seasonal return.",
    ],
    versions: [
      {
        id: "standard",
        title: "Part-time job resignation letter",
        note: "Works for most hourly jobs.",
        letter: letter(
          [
            "Please accept this letter as notice of my resignation from my part-time position as [Job Title] at [Company or Store Name]. My last shift will be [Month Day, Year].",
            "Thank you for the flexible schedule and for everything I've learned here. I've enjoyed working with the team.",
            "I'll work all of my scheduled shifts until then, and I'm happy to help train someone new if that would help.",
          ],
          { recipient: ["[Manager's Name]", "[Store or Location], [Company Name]"] },
        ),
      },
      {
        id: "school",
        title: "Student going back to school",
        note: "For a summer or seasonal job.",
        letter: letter(
          [
            "I'm writing to let you know that I'll be leaving my position as [Job Title] when I go back to school. My last shift will be [Month Day, Year].",
            "Thank you for working around my schedule and for a great [summer / season]. If you hire for [breaks or next summer], I'd love to be considered.",
          ],
          { recipient: ["[Manager's Name]", "[Store or Location], [Company Name]"], greeting: "Dear [Manager's First Name]," },
        ),
      },
      {
        id: "message",
        title: "Short resignation message",
        note: "For a quick email or, if your manager prefers it, a message in your scheduling app.",
        letter: email(
          "Resignation — [Your Name]",
          [
            "I'm giving notice that I'm leaving my part-time job as [Job Title]. My last shift will be [Month Day, Year]. Thanks for everything — I'll work my remaining shifts as scheduled.",
          ],
          { greeting: "Hi [Manager's First Name],", signoff: "Thanks," },
        ),
      },
    ],
    tips: [
      "**Give notice before the next schedule is posted** if you can. It's the kindest thing you can do for your manager.",
      "**Name your last shift.** In a shift-based job, the last shift is clearer than a date.",
      "**Ask how your manager wants it.** Some prefer email, some a printed letter, some a message in the scheduling app.",
      "**Return your uniform, keys or badge** on or before your last shift.",
      "**Ask for a reference before you go** if you'll need one for your next job or an internship.",
    ],
    faqs: [
      {
        q: "Do I need to give two weeks' notice at a part-time job?",
        a: "It's the usual courtesy, though not a federal legal requirement for most jobs. Check your employee handbook, and try to give notice before the next schedule is made.",
      },
      {
        q: "Can I quit a part-time job by text?",
        a: "Some managers accept it, especially in shift-based jobs, but tell them in person or by phone first if you can, and ask how they'd like it in writing.",
      },
      {
        q: "Should I say I'm going back to school?",
        a: "Yes, if that's the reason. It's easy for an employer to understand, and it leaves the door open for a seasonal return.",
      },
    ],
    related: ["short", "two-weeks-notice", "career-change"],
  },
];

export function getResignationTemplate(slug: string): ResignationTemplate | undefined {
  return RESIGNATION_TEMPLATES.find((t) => t.slug === slug);
}
