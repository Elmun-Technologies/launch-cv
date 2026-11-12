/**
 * The /cover-letter/[slug] pages: cover letters for situations rather than
 * roles (no experience, career change, internal position…). Each has one or
 * two copyable versions with [bracketed] placeholders, when to use it, tips and
 * an FAQ. Plain advice, no statistics. Role-based letters live at
 * /cover-letter-examples/[slug].
 */

import type { LetterContent } from "@/components/site/seo/letter-sheet";
import type { FaqItem } from "@/lib/faq-ld";

export const COVER_SITUATION_BASE = "/cover-letter";
export const COVER_SITUATION_PUBLISHED = "2026-11-08";
export const COVER_SITUATION_UPDATED = "2026-11-08";

export type CoverVersion = { id: string; title: string; note: string; letter: LetterContent };

export type CoverSituation = {
  slug: string;
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
  /** What each paragraph of the first version is doing. */
  structure: string[];
  versions: CoverVersion[];
  tips: string[];
  faqs: FaqItem[];
  related: string[];
};

const ME = "[Your Name]";
const CONTACT = "[City, State] · [Email] · [Phone] · [LinkedIn URL]";
const DATE = "[Month Day, Year]";
const TO = ["[Hiring Manager's Name]", "[Company Name]", "[City, State]"];
const DEAR = "Dear [Hiring Manager's Name],";

function letter(paragraphs: string[], opts: { recipient?: string[]; greeting?: string; signoff?: string } = {}): LetterContent {
  return { name: ME, contact: CONTACT, date: DATE, recipient: opts.recipient ?? TO, greeting: opts.greeting ?? DEAR, paragraphs, signoff: opts.signoff ?? "Sincerely," };
}

function email(subject: string, paragraphs: string[], opts: { greeting?: string; signoff?: string } = {}): LetterContent {
  return { name: ME, contact: "", recipient: [], subject, greeting: opts.greeting ?? DEAR, paragraphs, signoff: opts.signoff ?? "Best regards," };
}

export const COVER_SITUATIONS: CoverSituation[] = [
  {
    slug: "no-experience",
    card: { t: "No experience", d: "A first job, using school, projects and volunteering as proof." },
    crumb: "Cover letter with no experience",
    titles: ["Cover Letter With No Experience: Free Template & Example (2026)", "Cover Letter With No Experience (2026)"],
    h1: "Cover letter with no experience:",
    muted: "a template that still shows proof.",
    description:
      "Cover letter template for your first job with no work experience: what to write instead, a fill-in letter, an email version and tips.",
    lead: "No job history doesn't mean no evidence. This template uses classes, projects, clubs and volunteering as proof, and keeps the letter short and specific.",
    keywords: ["cover letter with no experience", "cover letter no experience", "first job cover letter", "cover letter for teenager first job", "entry level cover letter no experience"],
    whenToUse: [
      "Your first job, or your first job in an office, store or professional setting",
      "Part-time and summer jobs while you're in school",
      "Roles that say \"no experience required\" or \"we'll train you\"",
    ],
    structure: [
      "Names the job and gives one reason you fit, right away.",
      "Uses a school, club or volunteer example as work-style proof, with one detail or number.",
      "Connects what you learned to two things the posting asks for.",
      "Asks for a conversation and states your availability.",
    ],
    versions: [
      {
        id: "letter",
        title: "Cover letter template with no experience",
        note: "For an application form or a PDF upload.",
        letter: letter([
          "I'm applying for the [Job Title] position at [Company Name]. I'm a [year / student status] at [School] and, while this would be my first [type of] job, I've spent the last [time] doing the kind of work your posting describes: [one-line summary, e.g. organizing events and handling money for a 60-member club].",
          "As [role, e.g. treasurer of the Business Club], I [specific thing you did, e.g. set up a shared budget sheet and kept spending under plan for two semesters]. I also [second example, e.g. volunteer every Saturday at the Eastside Food Bank, where I check in about 80 families a shift]. Both taught me to be on time, keep track of details and stay calm when it gets busy.",
          "Your posting asks for [requirement 1, e.g. reliability] and [requirement 2, e.g. friendly customer service]. I [proof for requirement 1, e.g. haven't missed a volunteer shift in a year], and I [proof for requirement 2, e.g. am the person new volunteers are paired with on their first day]. I learn quickly and I'm comfortable with [tools, e.g. Google Sheets and Square].",
          "I'm available [days/hours, e.g. weekday afternoons and weekends] and could start [date]. I'd be glad to talk about how I can help at [Company Name]. Thank you for your time.",
        ]),
      },
      {
        id: "email",
        title: "Short email version",
        note: "When you send your resume by email or apply through a quick form.",
        letter: email("Application for [Job Title] – [Your Name]", [
          "I'd like to apply for the [Job Title] position. I'm a [student status] at [School], and although this would be my first job, I've [one strong example, e.g. run the budget for a 60-member club for two semesters without going over].",
          "I'm reliable, quick to learn and available [days/hours]. My resume is attached. I'd welcome the chance to talk.",
        ]),
      },
    ],
    tips: [
      "Swap \"experience\" for evidence: a class project, a club role, volunteering, babysitting, a sport, a side project. Pick the one closest to the job.",
      "Give one concrete detail or number per example (\"80 families a shift\", \"two semesters\").",
      "Don't apologize for having no experience. Mention it once, then move on to what you can do.",
      "Match your availability to the job. For shift work, it's often the deciding factor.",
      "Keep it under 250 words. A short, specific letter beats a long, general one.",
    ],
    faqs: [
      { q: "What do I write in a cover letter if I have no experience?", a: "Use school, clubs, volunteering, sports or personal projects as proof of the skills the job asks for. Name the job, give one or two specific examples with a detail or number, connect them to the posting and say when you're available." },
      { q: "Should I mention that I have no experience?", a: "Once at most, and briefly. Spend the rest of the letter on what you have done. Employers hiring for entry-level roles expect it." },
      { q: "How long should a cover letter be for a first job?", a: "Three or four short paragraphs, around 150 to 250 words. The email version can be even shorter." },
    ],
    related: ["entry-level", "internship", "career-change"],
  },
  {
    slug: "career-change",
    card: { t: "Career change", d: "Moving into a new field: name the move and show what transfers." },
    crumb: "Career change cover letter",
    titles: ["Career Change Cover Letter: Template & Example (2026)", "Career Change Cover Letter (2026)"],
    h1: "Career change cover letter:",
    muted: "show the move makes sense.",
    description:
      "Career change cover letter template: explain the switch in one line, prove the new skills and show what transfers. Letter and email versions.",
    lead: "A career-change letter has one job: make the switch look like a smart next step instead of a gamble. Name the move, prove the new skill, then show what you bring from before.",
    keywords: ["career change cover letter", "cover letter for career change", "career changer cover letter", "career transition cover letter", "changing careers cover letter"],
    whenToUse: [
      "Moving into a different field (teaching to data, retail to HR, military to project management)",
      "Your most recent title doesn't match the job, so your resume alone may not explain the fit",
      "You've retrained with a course, certificate or degree and want to point to it",
    ],
    structure: [
      "Names the role and the move in one sentence, so the reader isn't confused.",
      "Proves the new skill with a course, certificate and something you built or did with it.",
      "Shows what transfers from your old career, in the employer's terms.",
      "Addresses commitment and asks for a conversation.",
    ],
    versions: [
      {
        id: "letter",
        title: "Career change cover letter template",
        note: "For a PDF or an application form.",
        letter: letter([
          "I'm applying for the [Job Title] role at [Company Name]. After [number] years as a [old role], I'm moving into [new field], and I'm writing because your team [specific reason, e.g. builds reporting for schools, which I've used every day as a teacher].",
          "Over the past [time] I completed [course or certificate, e.g. the Google Data Analytics Certificate] and put it to work: I [project, e.g. built a SQL and Tableau dashboard that tracks attendance for 900 students and is now used by our assistant principal]. That project used the same [tools/skills from the posting, e.g. SQL, data cleaning and dashboards] your posting lists.",
          "My [old career] taught me things that are harder to learn in a course. I [transferable strength 1, e.g. explained numbers to parents and staff who didn't love them], [transferable strength 2, e.g. planned a full year of work against fixed deadlines] and [transferable strength 3, e.g. handled confidential records under FERPA]. In a [new role] I'd bring that same [quality] to [what the team does].",
          "This change is deliberate: I've [proof of commitment, e.g. spent a year learning nights and weekends and joined the local analytics meetup]. I'd welcome the chance to talk about how my background could help [Company Name]. Thank you for considering my application.",
        ]),
      },
      {
        id: "email",
        title: "Short email version",
        note: "For a recruiter or a referral contact.",
        letter: email("[Job Title] application – career changer from [old field]", [
          "I'm applying for the [Job Title] role. After [number] years as a [old role], I've retrained in [new field] with [course/certificate] and built [project with one result].",
          "I'd bring [two transferable strengths] from my previous career. My resume is attached, and I'd be glad to talk.",
        ]),
      },
    ],
    tips: [
      "Explain the move in the first paragraph. If the reader has to guess why a nurse is applying to a software job, they'll stop.",
      "Lead with proof of the new skill (a project, certificate or freelance work), not with enthusiasm.",
      "Translate your old job into the new field's language: \"lesson plans\" become \"project plans\", \"patients\" become \"customers\" where it's honest.",
      "Pick two or three transferable strengths that the posting actually asks for.",
      "Don't apologize for the change or over-explain why you left. Keep it forward-looking.",
    ],
    faqs: [
      { q: "How do you explain a career change in a cover letter?", a: "In one sentence near the top: what you did, what you're moving into and why this role. Then spend the letter on proof of the new skill and what transfers from your old career." },
      { q: "Should a career changer use a cover letter?", a: "Yes. It's the one place you can connect a past that doesn't match the job title to the role you want. A resume alone often can't do that." },
      { q: "What if I have no paid experience in the new field?", a: "Use a project, a certificate's capstone, freelance or volunteer work in the new field. One real example you can talk about is worth more than a list of courses." },
    ],
    related: ["no-experience", "return-to-work", "letter-of-interest"],
  },
  {
    slug: "internal-position",
    card: { t: "Internal position", d: "Applying for a promotion or transfer at your current company." },
    crumb: "Internal position cover letter",
    titles: ["Cover Letter for an Internal Position or Promotion: Template (2026)", "Internal Position Cover Letter (2026)"],
    h1: "Cover letter for an internal position:",
    muted: "for a promotion or transfer.",
    description:
      "Cover letter template for an internal job or promotion: what to include, how to mention your manager, plus a short email version.",
    lead: "The hiring manager may already know you, so skip the introduction and show you're already doing part of the next job.",
    keywords: ["internal position cover letter", "cover letter for promotion", "internal job cover letter", "cover letter for internal transfer", "cover letter for internal promotion"],
    whenToUse: [
      "Applying for a promotion within your team",
      "Moving to another team or department at the same company",
      "An internal posting asks for a cover letter, even though the manager knows you",
    ],
    structure: [
      "Names the role, your current position and how long you've been there.",
      "Shows results in your current job that matter to the new one.",
      "Shows you're already doing part of the new job, and what you'd do first.",
      "Mentions your manager's support (if true) and asks for a conversation.",
    ],
    versions: [
      {
        id: "letter",
        title: "Internal position cover letter template",
        note: "For an internal application or a promotion.",
        letter: letter(
          [
            "I'm applying for the [New Job Title] position on the [Team] team. I've been a [Current Title] at [Company Name] for [time], working on [area], and I'd like to bring what I've learned here to this role.",
            "In my current role I [result 1, e.g. run the month-end close for our three US entities, which we now finish two days earlier], and I [result 2, e.g. built the reconciliation checklist the whole team uses]. I know our [systems, customers, processes] well, which means I could be useful from my first week.",
            "Over the past [time] I've already taken on parts of this job: I [example, e.g. trained the two newest staff accountants and reviewed their work]. In the first 90 days I'd focus on [one or two concrete priorities, e.g. documenting the close and cutting late adjustments].",
            "I've spoken with [Manager's Name] about this move, and [he/she/they] [support you applying / is happy to talk with you]. Thank you for considering me. I'd welcome the chance to discuss the role.",
          ],
          { recipient: ["[Hiring Manager's Name]", "[Team / Department]", "[Company Name]"] },
        ),
      },
      {
        id: "email",
        title: "Short email version",
        note: "For an internal job board or a message to the hiring manager.",
        letter: email("Internal application: [New Job Title] – [Your Name]", [
          "I'd like to apply for the [New Job Title] role. I've been a [Current Title] on the [Team] team for [time], where I [one strong result].",
          "I've already [part of the new job you've done], and I've let [Manager's Name] know I'm applying. I'd be glad to talk whenever suits you.",
        ]),
      },
    ],
    tips: [
      "Tell your current manager before you apply. Finding out from someone else damages trust, and their support can help.",
      "Don't assume they know your work. Spell out your results; the hiring manager may not have seen them.",
      "Use internal names and tools correctly, but avoid jargon the new team might not share.",
      "Show the next step, not just loyalty: what you'd do in the new role.",
      "Keep it professional even if you know the hiring manager well.",
    ],
    faqs: [
      { q: "Do I need a cover letter for an internal position?", a: "If the posting asks for one, yes. Even if it doesn't, a short letter or email helps the hiring manager see your results and why you want the move." },
      { q: "Should I mention my current manager in the letter?", a: "Mention them if they know and support your application. Talk to your manager before you apply, so they hear it from you first." },
      { q: "How is an internal cover letter different?", a: "It skips the introduction to the company and focuses on your results there, what you already do in the new role, and what you'd do first." },
    ],
    related: ["referral", "letter-of-interest", "career-change"],
  },
  {
    slug: "entry-level",
    card: { t: "Entry level", d: "Up to two years of experience: show the volume and results you've handled." },
    crumb: "Entry-level cover letter",
    titles: ["Entry-Level Cover Letter: Free Template & Example (2026)", "Entry-Level Cover Letter (2026)"],
    h1: "Entry-level cover letter:",
    muted: "make your first years count.",
    description:
      "Entry-level cover letter template for your first full-time job or up to two years of experience, with an email version and tips.",
    lead: "With a year or two behind you, your letter can point to real work: the volume you handled, a result and how fast you learned.",
    keywords: ["entry level cover letter", "entry-level cover letter", "cover letter for entry level job", "junior cover letter", "cover letter for first full time job"],
    whenToUse: [
      "Your first full-time job after school, part-time work or an internship",
      "You have up to about two years of experience in the field",
      "Junior, associate, assistant and coordinator roles",
    ],
    structure: [
      "Names the role and gives your current situation in one line.",
      "Shows what you've handled (volume, tools, people) and one result.",
      "Connects that to the posting's main requirements and shows you learn fast.",
      "Ends with a clear ask and thanks.",
    ],
    versions: [
      {
        id: "letter",
        title: "Entry-level cover letter template",
        note: "For a PDF or an application form.",
        letter: letter([
          "I'm applying for the [Job Title] position at [Company Name]. I'm a [current role or recent graduate status] with [time] of experience in [area], and I'm drawn to this role because [specific reason about the company or team].",
          "In my current role at [Company], I [what you handle, e.g. support 60 patients a day in a busy family practice] using [tools, e.g. Epic and Excel]. I [one result, e.g. cut check-in time by four minutes by preparing charts the night before], and I was [recognition or responsibility, e.g. asked to train two new hires within my first year].",
          "Your posting asks for [requirement 1] and [requirement 2]. I [proof 1], and I [proof 2]. I'm early in my career, so I've had to learn new systems quickly, and I'm used to asking good questions and then getting on with the work.",
          "I'd welcome the chance to talk about how I can contribute to [team or goal]. Thank you for your time and consideration.",
        ]),
      },
      {
        id: "email",
        title: "Short email version",
        note: "When you apply by email or message a recruiter.",
        letter: email("[Job Title] – [Your Name]", [
          "I'm applying for the [Job Title] role. I have [time] of experience in [area], where I [one strong result].",
          "I'm comfortable with [tools from the posting] and quick to learn. My resume is attached, and I'd be glad to talk.",
        ]),
      },
    ],
    tips: [
      "Lead with what you've handled: volume, customers, tools. It shows you can keep up.",
      "One result with a number beats three adjectives.",
      "Mention school only if it's recent and relevant; your work comes first now.",
      "Use the posting's words for the two requirements you match best.",
      "Keep it to one page, three or four paragraphs.",
    ],
    faqs: [
      { q: "What should an entry-level cover letter include?", a: "The role, your current situation, what you've handled so far with one result, how that matches two requirements from the posting, and a request to talk." },
      { q: "Is an internship enough experience to mention?", a: "Yes. Treat it like a job: what you did, the tools you used and one outcome." },
      { q: "Should I include my GPA?", a: "Only if it's strong and you graduated recently, and usually on the resume rather than in the letter." },
    ],
    related: ["no-experience", "internship", "referral"],
  },
  {
    slug: "internship",
    card: { t: "Internship", d: "For students: coursework, projects and what you want to learn." },
    crumb: "Internship cover letter",
    titles: ["Internship Cover Letter: Free Template & Example (2026)", "Internship Cover Letter (2026)"],
    h1: "Internship cover letter:",
    muted: "a template for students.",
    description:
      "Internship cover letter template for college students: use coursework and projects as proof. Fill-in letter, email version and tips.",
    lead: "Internship letters are read for potential. Show one project that proves you can do the work, why this company, and what you'll learn and contribute.",
    keywords: ["internship cover letter", "cover letter for internship", "internship cover letter example", "college student cover letter", "summer internship cover letter"],
    whenToUse: [
      "Summer and semester internships",
      "Co-op programs and apprenticeships",
      "Fellowships and student programs that ask for a cover letter",
    ],
    structure: [
      "Names the internship, your school, major and year.",
      "Uses a class or personal project as proof, with what you built and the result.",
      "Explains why this company and what you'd contribute while learning.",
      "Gives your dates and asks for a conversation.",
    ],
    versions: [
      {
        id: "letter",
        title: "Internship cover letter template",
        note: "For an application portal or PDF.",
        letter: letter([
          "I'm applying for the [Internship Title] at [Company Name] for [Summer/Fall 20XX]. I'm a [year] studying [major] at [School], and I'm interested in [Company Name] because [specific reason, e.g. your team's work on accessible banking apps].",
          "In [class or project], I [what you built or did, e.g. built a budgeting app in React with two classmates] and [result, e.g. 150 students used it during finals week]. I handled [your part, e.g. the front end and user testing], which taught me [skill from the posting, e.g. how to turn feedback into changes quickly].",
          "Your posting mentions [requirement 1] and [requirement 2]. I've used [tool/skill] in [context] and I'm [quality, e.g. comfortable asking for feedback early]. I'd like to learn [what you hope to learn] while helping the team with [specific contribution].",
          "I'm available from [start date] to [end date] for [hours/week]. I'd welcome the chance to talk about the internship. Thank you for your consideration.",
        ]),
      },
      {
        id: "email",
        title: "Short email version",
        note: "For a career fair follow-up or an email application.",
        letter: email("[Internship Title] application – [Your Name], [School]", [
          "I'm a [year] [major] student at [School] applying for the [Internship Title]. In [project], I [what you did and one result].",
          "I'm available [dates] and would love to contribute to [team]. My resume is attached. Thank you!",
        ]),
      },
    ],
    tips: [
      "One project told well beats a list of courses: what it was, your part, the result.",
      "Name your availability dates. Recruiters plan internship cohorts around them.",
      "Say why this company specifically. A sentence about their product or team is enough.",
      "It's fine to say what you want to learn, but pair it with what you'll contribute.",
      "If you met someone from the company at a career fair, mention them by name.",
    ],
    faqs: [
      { q: "What do you write in an internship cover letter?", a: "Your school, major and year, one project that proves the skills the internship needs, why this company, what you'd contribute and learn, and your availability dates." },
      { q: "How long should an internship cover letter be?", a: "About 200 to 300 words: three or four short paragraphs on one page." },
      { q: "Should I include coursework?", a: "Mention one or two relevant classes only if they connect to the role, and focus on a project you did in them." },
    ],
    related: ["no-experience", "entry-level", "letter-of-interest"],
  },
  {
    slug: "return-to-work",
    card: { t: "Returning to work", d: "After a gap for caregiving, health, study or a layoff." },
    crumb: "Return to work cover letter",
    titles: ["Cover Letter for Returning to Work After a Gap: Template (2026)", "Return to Work Cover Letter (2026)"],
    h1: "Return to work cover letter:",
    muted: "address the gap, then move on.",
    description:
      "Cover letter template for returning to work after a career gap: how much to say about the gap, a fill-in letter and an email version.",
    lead: "A gap needs a sentence, not a paragraph. Say what it was in a few words, show your skills are current, and spend the rest of the letter on what you can do now.",
    keywords: ["return to work cover letter", "cover letter after career break", "cover letter employment gap", "cover letter after being a stay at home parent", "cover letter after time off"],
    whenToUse: [
      "Returning after caregiving, parenting, health, study, travel or a layoff",
      "Gaps of several months or more that show on your resume",
      "Returnship programs that ask for a cover letter",
    ],
    structure: [
      "Names the role and your past experience in the field.",
      "Mentions the gap in one sentence, without apologizing.",
      "Shows your skills are current: a refresher, certificate, volunteer or freelance work.",
      "Ties your past results to the job and asks to talk.",
    ],
    versions: [
      {
        id: "letter",
        title: "Return to work cover letter template",
        note: "For a PDF or an application form.",
        letter: letter([
          "I'm applying for the [Job Title] role at [Company Name]. I have [number] years of experience as a [role] in [industry], most recently at [Company], and I'm returning to work after [time] [caring for my family / recovering from surgery / completing a degree].",
          "Before my break, I [result 1, e.g. processed 400+ invoices a month with a 0.5% error rate] and [result 2, e.g. led the move to a new AP system for a team of five]. That's the kind of [skill area] your posting describes.",
          "I've kept my skills current: I [refresher, e.g. completed QuickBooks Online certification this spring] and [other proof, e.g. have kept the books for a local nonprofit as a volunteer]. I'm ready to return full time and available to start [date].",
          "I'd welcome the chance to talk about how my experience could help [Company Name]. Thank you for your time.",
        ]),
      },
      {
        id: "email",
        title: "Short email version",
        note: "For a recruiter, returnship or email application.",
        letter: email("[Job Title] application – [Your Name]", [
          "I'm applying for the [Job Title] role. I have [number] years as a [role], and I'm returning after [time] of [reason in a few words].",
          "I recently [refresher or certificate] and I'm available to start [date]. My resume is attached; I'd be glad to talk.",
        ]),
      },
    ],
    tips: [
      "Name the reason in a few words (\"family caregiving\", \"a health issue, now resolved\") or simply \"a planned career break\". You don't owe details.",
      "Don't apologize. A calm, matter-of-fact sentence reads as confidence.",
      "Show something recent: a course, certificate, volunteer role, freelance project or part-time work.",
      "Put your strongest pre-break results in the letter; they're still yours.",
      "State your start date. It answers the reader's first practical question.",
    ],
    faqs: [
      { q: "Should I explain an employment gap in my cover letter?", a: "Briefly, yes, in one sentence. It answers the question before the reader asks it. Then focus on your skills and what you can do now." },
      { q: "How much detail should I give about the gap?", a: "Very little. \"Caring for a family member\", \"a health issue that's now resolved\" or \"a planned career break\" is enough." },
      { q: "What if my skills are out of date?", a: "Refresh one or two that the job needs (a short course, a certificate or a volunteer project) and mention it in the letter." },
    ],
    related: ["career-change", "entry-level", "referral"],
  },
  {
    slug: "referral",
    card: { t: "Referral", d: "Someone referred you: name them in the first line." },
    crumb: "Referral cover letter",
    titles: ["Referral Cover Letter: How to Mention a Referral (Template, 2026)", "Referral Cover Letter (2026)"],
    h1: "Referral cover letter:",
    muted: "name your contact up front.",
    description:
      "A referral cover letter template: how to mention who referred you in the first sentence, what to say about them, a fill-in letter, an email version and tips.",
    lead: "A referral is your strongest opening line. Put the name first, say how you know them, then prove the referral was worth making.",
    keywords: ["referral cover letter", "cover letter with referral", "how to mention a referral in a cover letter", "employee referral cover letter", "cover letter referred by"],
    whenToUse: [
      "An employee referred you or suggested you apply",
      "Someone at the company introduced you to the hiring manager",
      "A recruiter or mutual contact passed your name on",
    ],
    structure: [
      "Names who referred you and how you know them, in the first sentence.",
      "States the role and why your contact thought you'd fit.",
      "Proves it with your strongest result for this job.",
      "Asks to talk, and keeps your contact in the loop.",
    ],
    versions: [
      {
        id: "letter",
        title: "Referral cover letter template",
        note: "For a PDF or an application form.",
        letter: letter([
          "[Referrer's Name], [their title] on your [team], suggested I apply for the [Job Title] role. We [how you know them, e.g. worked together at Contoso for two years], and [he/she/they] thought my experience in [area] would be a good match for what your team is building.",
          "At [Current/Last Company], I [strongest result for this job, e.g. grew organic sign-ups threefold in 18 months with a 40-article SEO program]. I [second result or skill from the posting], which [Referrer's First Name] saw first-hand when we [shared project].",
          "What draws me to [Company Name] is [specific reason]. I'd bring [two strengths that match the posting] to the role.",
          "I'd welcome the chance to talk about how I could help. Thank you for your time, and thank you to [Referrer's First Name] for the introduction.",
        ]),
      },
      {
        id: "email",
        title: "Short email version",
        note: "When your contact forwards your resume or introduces you by email.",
        letter: email("Referred by [Referrer's Name]: [Job Title] – [Your Name]", [
          "[Referrer's Name] suggested I reach out about the [Job Title] role. We [how you know each other].",
          "I [one strong result relevant to the job]. My resume is attached, and I'd be glad to talk at a time that suits you.",
        ]),
      },
    ],
    tips: [
      "Ask your contact first. Confirm they're happy to be named and how they'd like to be described.",
      "Put the referral in the first sentence and the email subject line.",
      "Say how you know them. \"Former teammate\" carries more weight than \"met at an event\".",
      "Still prove the fit. The referral opens the door; your results get you the interview.",
      "Tell your contact when you've applied and thank them, whatever happens.",
    ],
    faqs: [
      { q: "How do you mention a referral in a cover letter?", a: "In the first sentence: their name, their role and how you know them, then the job you're applying for. Put their name in the email subject line too." },
      { q: "Do I need permission to mention a referral?", a: "Yes. Always ask the person first, and check how they'd like to be described." },
      { q: "Should I still submit a cover letter if I was referred?", a: "Yes, if the application allows one. It's where the referral gets its first and most useful mention." },
    ],
    related: ["internal-position", "letter-of-interest", "entry-level"],
  },
  {
    slug: "letter-of-interest",
    card: { t: "Letter of interest", d: "No open job posted: introduce yourself and ask about roles." },
    crumb: "Letter of interest",
    titles: ["Letter of Interest: Template & Example for a Job (2026)", "Letter of Interest Template (2026)"],
    h1: "Letter of interest:",
    muted: "when no job is posted yet.",
    description:
      "Letter of interest template for a company with no open role: how it differs from a cover letter, who to send it to, letter and email.",
    lead: "A letter of interest asks about roles that aren't posted. It's shorter than a cover letter, focused on the company's needs, and ends by asking for a conversation, not a job.",
    keywords: ["letter of interest", "letter of interest for a job", "letter of intent for job", "prospecting letter", "letter of interest template"],
    whenToUse: [
      "You'd like to work at a company that has no matching role posted",
      "You're relocating and contacting employers in a new city",
      "A contact suggested you introduce yourself to a team lead",
    ],
    structure: [
      "Says why you're writing to this company, specifically.",
      "Introduces you with your role, years and one result.",
      "Names the kind of role or problem you could help with.",
      "Asks for a short conversation, not a job.",
    ],
    versions: [
      {
        id: "letter",
        title: "Letter of interest template",
        note: "For a PDF attached to an email or a message to a team lead.",
        letter: letter([
          "I'm writing to ask about [type of role, e.g. operations or supply chain] opportunities at [Company Name]. I've followed [specific thing about the company, e.g. your expansion into same-day delivery in the Southeast], and I'd like to help with what comes next.",
          "I'm a [your role] with [number] years in [industry]. At [Company], I [strongest result, e.g. raised order accuracy to 99.6% across three shifts while volume doubled], and I [second result or skill].",
          "Teams growing like yours usually need [problem you solve, e.g. people who can keep accuracy up while adding sites]. I'd bring [two strengths]. If a role like [example title] opens, or if there's a need you haven't posted yet, I'd like to be considered.",
          "Would you be open to a 15-minute call in the next few weeks? I've attached my resume, and I'm happy to work around your schedule. Thank you for your time.",
        ]),
      },
      {
        id: "email",
        title: "Short email version",
        note: "For LinkedIn or a cold email to a team lead.",
        letter: email("[Your Role] interested in [Company Name] – [Your Name]", [
          "I'm a [role] with [number] years in [industry], and I've followed [specific company news]. At [Company], I [one strong result].",
          "If you're growing the [team], I'd love a 15-minute conversation about where I could help. My resume is attached.",
        ]),
      },
    ],
    tips: [
      "Send it to a person: the team lead or department head, not a general inbox.",
      "Make it about their needs. Mention something specific the company is doing.",
      "Keep it short, under 200 words for the email version.",
      "Ask for a conversation, not a job. It's an easier yes.",
      "Follow up once after a week or two, politely. Then let it go.",
    ],
    faqs: [
      { q: "What's the difference between a letter of interest and a cover letter?", a: "A cover letter applies for a specific posted job. A letter of interest asks about roles that aren't posted, so it's shorter, more about the company's needs, and ends by asking for a conversation." },
      { q: "Is a letter of interest the same as a letter of intent?", a: "For job searching, people often use the terms interchangeably. Some fields, like academia and real estate, use \"letter of intent\" for something different, so follow any instructions you're given." },
      { q: "Who should I send a letter of interest to?", a: "The person who leads the team you'd join, found through the company site or LinkedIn. A warm introduction from a contact works even better." },
    ],
    related: ["referral", "career-change", "internal-position"],
  },
];

export function getCoverSituation(slug: string): CoverSituation | undefined {
  return COVER_SITUATIONS.find((s) => s.slug === slug);
}
