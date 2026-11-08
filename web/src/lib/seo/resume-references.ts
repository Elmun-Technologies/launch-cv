/**
 * Content for the /resume-references pillar guide: a separate references
 * page (not part of the resume itself), when you need one, who to pick, how
 * to format it, how to ask, and a fill-in template. All names and contact
 * details in the template are [bracketed] placeholders. No statistics.
 */

import type { GuideSection } from "@/components/site/seo/guide-page";
import type { FaqItem } from "@/lib/faq-ld";
import type { ReferenceDoc } from "@/components/site/seo/reference-sheet";

export const RESUME_REFERENCES_PUBLISHED = "2026-11-08";
export const RESUME_REFERENCES_UPDATED = "2026-11-08";

export const REFERENCES_QUICK = [
  "Keep references off your resume; use a separate page only when asked",
  "Three references is standard; have a fourth ready as a backup",
  "A former manager carries more weight than a coworker or a friend",
  "Always ask permission before you list someone",
  "Give each reference your resume and the job post before they're called",
  "Match the header style of your resume so the two pages look related",
];

export const REFERENCE_PICKS: { who: string; why: string }[] = [
  { who: "A former manager or supervisor", why: "Speaks directly to your work and how you're managed. The strongest reference for most jobs." },
  { who: "A senior coworker or project lead", why: "Good when you worked closely together but didn't report to them, or your manager isn't reachable." },
  { who: "A client or vendor contact", why: "Useful for sales, consulting and account roles, where outside relationships are part of the job." },
  { who: "A professor or advisor", why: "Fine for a first job or internship, especially paired with a manager from part-time work." },
  { who: "A volunteer or club leader", why: "Works for students and career changers who can show reliability through unpaid work." },
];

export const REFERENCES_DONT: string[] = [
  "Family members, even if they also happen to be a boss or client",
  "Friends with no professional connection to your work",
  "Anyone you haven't asked, or who said yes a long time ago and may not remember you well",
  "A manager you know will give a lukewarm reference — pick someone who'll actually help you",
];

export const REFERENCES_WHEN: string[] = [
  "A job posting or application form asks for references",
  "You're asked after an interview, usually in the final round",
  "You're applying to government, healthcare, education or other roles that check references by policy",
];

export const REFERENCE_ASK_SCRIPT = {
  heading: "A short message to ask someone",
  text: `Hi [Name], I'm applying for [job title] roles and wondered if you'd be willing to be a reference. I'd expect at most a couple of calls or emails, and I'll give you the job details and my resume ahead of time so you're not caught off guard. Totally understand if now isn't a good time — just let me know either way. Thanks!`,
};

export const RESUME_REFERENCES_TEMPLATE: ReferenceDoc = {
  name: "[Your Name]",
  contact: "[City, State] · [Email] · [Phone]",
  heading: "References",
  entries: [
    {
      name: "[Reference 1 Name]",
      title: "[Their Job Title]",
      org: "[Company Name]",
      relationship: "[How you know them, e.g. \"Former manager at Acme Corp, 2022–2025\"]",
      contact: ["[Email]", "[Phone]"],
    },
    {
      name: "[Reference 2 Name]",
      title: "[Their Job Title]",
      org: "[Company Name]",
      relationship: "[How you know them]",
      contact: ["[Email]", "[Phone]"],
    },
    {
      name: "[Reference 3 Name]",
      title: "[Their Job Title]",
      org: "[Company Name]",
      relationship: "[How you know them]",
      contact: ["[Email]", "[Phone]"],
    },
  ],
};

export const RESUME_REFERENCES_SECTIONS: GuideSection[] = [
  {
    id: "what-is",
    title: "What is a references page?",
    body: [
      "A references page is a separate, one-page document listing people who can speak to your work — usually 3, with their title, company, how you know them and their contact details. It isn't part of your resume; you send or bring it only when it's asked for.",
      "That's a change from older advice. \"References available upon request\" used to be a standard resume line; today it's assumed and wastes space better spent on your experience. Leave it off and have the page ready instead.",
    ],
  },
  {
    id: "when",
    title: "When you need one",
    body: ["Most applications never ask. Prepare the page anyway, so you're never scrambling for one at the final step:"],
    figure: "when",
  },
  {
    id: "who",
    title: "Who to ask",
    body: ["Pick people who know your work well and will speak to it specifically — not just say nice things in general."],
    figure: "who",
    after: [
      `**Avoid these, even if they technically fit:**\n${REFERENCES_DONT.map((x) => `- ${x}`).join("\n")}`,
    ],
  },
  {
    id: "how-to-ask",
    title: "How to ask someone to be a reference",
    body: [
      "Ask directly, give them an easy way to say no, and tell them what to expect. A short message works well:",
    ],
    figure: "ask",
    after: [
      "Once they agree, send your resume and the job posting (or type of role) you're applying for, so their answers stay consistent with your application.",
    ],
  },
  {
    id: "template",
    title: "References page template",
    body: ["Match your resume's header style — same name treatment and font. Here's the format:"],
    figure: "template",
  },
  {
    id: "format",
    title: "Formatting rules",
    body: [
      "- **One page, plain text.** No columns, tables or graphics — the same reasons that make a resume ATS-friendly apply here.\n- **Three references is standard.** Fewer looks thin; more than four rarely gets read.\n- **List your strongest reference first.** Employers often start at the top.\n- **Keep it current.** Update phone numbers and titles before every job search; people change jobs too.\n- **Send it as its own file or page**, named clearly (e.g. \"[Your Name] — References.pdf\"), never pasted into the resume.",
    ],
  },
  {
    id: "linkedin",
    title: "LinkedIn recommendations aren't a substitute",
    body: [
      "A written LinkedIn recommendation is public, one-sided and can't be asked follow-up questions, so most employers still call or email the references you list separately. It's a good addition to your profile, but it doesn't replace a references page when one's requested.",
    ],
  },
];

export const RESUME_REFERENCES_FAQS: FaqItem[] = [
  { q: "Should references be on my resume?", a: "No. List them on a separate page and send it only when it's asked for, usually after an interview. A resume line like \"References available upon request\" is unnecessary and wastes space." },
  { q: "How many references should I list?", a: "Three is standard for most jobs. Keep a fourth ready in case one is unreachable or an employer asks for more." },
  { q: "Do I need permission to list someone as a reference?", a: "Yes, always ask first. A reference who's caught off guard, or who doesn't remember you well, can hurt more than help." },
  { q: "Can I use a friend or family member as a reference?", a: "Avoid it. Employers want a professional perspective on your work. A former manager, senior coworker, client or professor carries far more weight." },
  { q: "What if I don't have work experience?", a: "Use a professor, academic advisor, internship supervisor or a volunteer or club leader who's seen you show up, follow through and work with others." },
  { q: "Is a LinkedIn recommendation enough instead of references?", a: "No. It's a good addition, but it's public and one-sided. Most employers still want to contact the people you list directly." },
];

export const RESUME_REFERENCES_READING: string[] = ["how-to-tailor-your-resume-for-every-job", "thank-you-email-after-interview"];
