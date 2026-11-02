/**
 * Content for the /cover-letter-template pillar guide.
 *
 * The template is plain text with [placeholders]; the filled-in example is
 * read from lib/cover-letter-examples.ts (with the sender from the matching
 * resume example), never retyped here. This page makes no statistical claims;
 * if you add one, cite a primary source the way lib/seo/resume-format.ts does.
 */

import type { GuideSection } from "@/components/site/seo/guide-page";
import type { LetterContent } from "@/components/site/seo/letter-sheet";

export const COVER_TEMPLATE_PUBLISHED = "2026-11-02";
export const COVER_TEMPLATE_UPDATED = "2026-11-02";

/** Cover letter example (slug in lib/cover-letter-examples.ts) shown filled in. */
export const COVER_TEMPLATE_EXAMPLE = "product-manager";

export const COVER_LETTER_TEMPLATE: LetterContent = {
  name: "[Your Name]",
  contact: "[City, State] · [Phone] · [Email] · [LinkedIn or portfolio URL]",
  date: "[Month Day, Year]",
  recipient: ["[Hiring Manager's Name]", "[Their Title], [Company Name]"],
  greeting: "Dear [Hiring Manager's Name],",
  paragraphs: [
    "I'm applying for the [Job Title] role at [Company Name]. As [your current or most recent title] at [Employer], I [your most relevant result], and your posting's focus on [a need named in the job post] is exactly the kind of work I want to keep doing.",
    "The work that best shows how I'd help is [one project or responsibility]. [The problem or goal, in one sentence.] [What you did — the decisions and actions that were yours.] [The result, with a number you can explain if you have one.]",
    "Your posting also mentions [a second requirement or goal from the job post]. [A different example that shows you can do it.] [Optional: one accurate, specific sentence about the company's product, customers or recent work, and why it matters to you.]",
    "I'd welcome the chance to talk about [a goal or challenge the team faces] and how I could help. [Your availability or next step.] Thank you for your time and consideration.",
  ],
  signoff: "Sincerely,",
};

/** What each template paragraph does (numbered like the letter). */
export const TEMPLATE_PARAGRAPH_ROLES: { t: string; d: string }[] = [
  { t: "Opening", d: "The role, and your single most relevant result tied to their need." },
  { t: "Evidence", d: "One example told properly: problem, what you did, what changed." },
  { t: "Fit", d: "A second, different example aimed at another stated requirement." },
  { t: "Close", d: "A specific next step, your availability and a thank-you." },
];

export const COVER_TEMPLATE_QUICK = [
  "Three or four short paragraphs, well under one page",
  "Address a named person when you can find one",
  "Open with the role and your most relevant result",
  "Tell one example properly instead of listing many",
  "Match the employer's stated needs, in their words",
  "Same header and font as your resume; PDF unless asked otherwise",
];

export const COVER_TEMPLATE_SECTIONS: GuideSection[] = [
  {
    id: "template",
    title: "Free cover letter template",
    body: [
      "Copy the template below into your document or email, replace every bracketed placeholder, and delete anything that doesn't apply. It follows the standard US business-letter structure: your details, the date, the recipient, a greeting, four short paragraphs and a sign-off.",
    ],
    figure: "template",
    after: [
      "Write it last, after your resume is tailored to the job — the letter's examples should come from that resume, told in more detail. The sections below explain what each part is for.",
    ],
  },
  {
    id: "header-greeting",
    title: "Header and greeting",
    body: [
      "**Your details** go at the top: name, city and state, phone, email and a LinkedIn or portfolio link — the same header as your resume, so the two look like a set. Then the **date**, written out (\"November 2, 2026\"), and the **recipient**: the hiring manager's name, their title and the company. A street address is optional, and in an email you can leave the whole recipient block out.",
      "**Address a person when you can.** The job post, the company's site or LinkedIn often names the hiring manager or team lead. Use their full name (\"Dear [First Name] [Last Name],\"), or \"Dear Ms. [Last Name],\" only if you're sure of the title. If you can't find a name, \"Dear Hiring Manager,\" or \"Dear [Team] Hiring Team,\" is fine. \"To Whom It May Concern\" reads as dated.",
    ],
  },
  {
    id: "opening",
    title: "Paragraph 1: The opening",
    body: [
      "Name the exact job title, then give your **single most relevant result** and connect it to something the posting asks for. That's the whole paragraph — two or three sentences.",
      "Skip the throat-clearing: \"I am writing to express my interest in…\" and \"My name is…\" use up the lines a reader is most likely to read. If someone referred you, say who in the first sentence.",
    ],
  },
  {
    id: "evidence",
    title: "Paragraph 2: Your strongest evidence",
    body: [
      "Pick **one** project, problem or responsibility from your resume and tell it properly: what the situation was, what you did, and what changed as a result. This is where a cover letter adds something a bullet point can't — the how and the why.",
      "Keep numbers to the ones you could explain in an interview. If the result isn't measurable, say who used your work or what it replaced.",
    ],
  },
  {
    id: "fit",
    title: "Paragraph 3: Why you, and why this company",
    body: [
      "Answer a **second requirement** from the posting with a different kind of example — if paragraph 2 was about results, this one might be about leading people, working with clients or handling a regulated process.",
      "This is also the place for one specific sentence about the company: a product you've used, a customer group you understand, a recent launch. Make it accurate and brief. General praise (\"your innovative culture\") adds nothing.",
    ],
  },
  {
    id: "closing",
    title: "Paragraph 4: The close and sign-off",
    body: [
      "End with a short, specific next step — a conversation about a goal the team has — plus your availability and a thank-you. Don't repeat your resume, and don't apologize for anything.",
      "Sign off with **\"Sincerely,\"** or **\"Best regards,\"** followed by your full name. In a PDF you can add a scanned signature above your typed name, but it isn't expected.",
    ],
  },
  {
    id: "example",
    title: "The template, filled in",
    body: [
      "Here is a complete letter that follows the same four-paragraph structure, from our [cover letter examples](/cover-letter-examples). It's written by the same fictional person as the matching resume example, so you can see how the letter retells results from the resume in more detail.",
    ],
    figure: "example",
  },
  {
    id: "format",
    title: "Length, formatting and sending it",
    body: [
      "- **Length:** three or four short paragraphs, comfortably under one page.\n- **Font and margins:** the same font as your resume at 10–12 pt, with margins of about 0.5 to 1 inch, left-aligned, with a blank line between paragraphs.\n- **File:** a text-based PDF unless the posting asks for Word. Name it plainly, like `Firstname-Lastname-Cover-Letter.pdf`.\n- **By email:** paste the letter into the body (no recipient block), and use a subject line with the job title and your name. Attach your resume.\n- **In an application form:** paste the plain text into the box; formatting is usually stripped, so check the paragraph breaks.",
      "Once you've accepted the offer, the same business-letter layout works for giving notice: see the free [resignation letter templates](/resignation-letter), including a [two weeks notice letter](/resignation-letter/two-weeks-notice).",
    ],
  },
  {
    id: "mistakes",
    title: "Mistakes to avoid",
    body: [
      "- **Repeating your resume** line by line. Pick one or two stories and add the detail the resume can't.\n- **Making it about you** (\"this role would be a great step for my career\") instead of what you'd do for them.\n- **A generic letter** that could be sent to any company. If you can swap in another employer's name without changing anything, rewrite it.\n- **The wrong company or job title** left over from a previous letter. Check both before you send.\n- **Claims you can't back up.** Every result should be one you can talk through in an interview.\n- **Going over a page.** If it's long, cut the weakest example rather than shrinking the font.",
    ],
  },
  {
    id: "from-your-resume",
    title: "Write it faster from your resume",
    body: [
      "If you've built your resume in LaunchCV, the [AI cover letter generator](/features/cover-letter) drafts a letter from your resume and the job description, in a formal or neutral tone, and is told not to add experience or results you don't have. You edit it, then copy it out. It's included in every paid plan.",
      "Whichever way you write it, make sure the resume it goes with is ready: the [how to write a resume](/how-to-write-a-resume) guide walks through each section, and the [free ATS check](/free-ats-check) shows how an applicant tracking system reads your file.",
    ],
  },
];

export const COVER_TEMPLATE_FAQS: { q: string; a: string }[] = [
  {
    q: "What is the best format for a cover letter?",
    a: "A US business-letter layout: your contact details, the date, the recipient's name and company, a greeting, three or four short paragraphs, and a sign-off with your name. Keep it under one page and use the same font as your resume.",
  },
  {
    q: "How long should a cover letter be?",
    a: "Three or four short paragraphs, well under one page. Hiring managers skim, so the first two sentences should carry your strongest point.",
  },
  {
    q: "Who do I address a cover letter to if there's no name?",
    a: "Look for the hiring manager or team lead in the job post, on the company site or on LinkedIn. If you can't find a name, \"Dear Hiring Manager,\" or \"Dear [Team] Hiring Team,\" works.",
  },
  {
    q: "Is it OK to use a cover letter template?",
    a: "Yes, for the structure. Replace every placeholder with details specific to the job and company, and rewrite any sentence that would make sense in a letter to a different employer.",
  },
  {
    q: "Should a cover letter repeat my resume?",
    a: "No. Pick one or two results from your resume and tell the story behind them — the problem, what you did and what changed — and connect them to what the employer says it needs.",
  },
  {
    q: "Should I send my cover letter as a PDF?",
    a: "Yes, unless the posting asks for Word or a text box. A text-based PDF keeps your formatting. When applying by email, you can paste the letter into the message body instead.",
  },
  {
    q: "How do I end a cover letter?",
    a: "With a specific next step, your availability and a thank-you, followed by \"Sincerely,\" or \"Best regards,\" and your full name.",
  },
];

export const COVER_TEMPLATE_READING: string[] = ["cover-letter-tips-that-actually-work", "how-to-tailor-your-resume-for-every-job"];
