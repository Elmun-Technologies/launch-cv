/**
 * Content for the /follow-up-email-after-applying pillar guide: checking in
 * after you've applied or interviewed and heard nothing back. Different from
 * the thank-you note sent right after an interview (see the blog post
 * thank-you-email-after-interview) — this is for the silence that follows.
 * Plain advice, no statistics. All example details are [bracketed] placeholders.
 */

import type { GuideSection } from "@/components/site/seo/guide-page";
import type { FaqItem } from "@/lib/faq-ld";
import type { LetterContent } from "@/components/site/seo/letter-sheet";

export const FOLLOWUP_PUBLISHED = "2026-11-08";
export const FOLLOWUP_UPDATED = "2026-11-08";

export const FOLLOWUP_QUICK = [
  "Wait at least a week after applying before your first follow-up",
  "Keep it to 3–5 sentences: who you are, the role, one line of interest, a question",
  "Send it to the person you already have an email for, not a generic inbox, when you can",
  "One follow-up per stage (after applying, after an interview) is enough",
  "Never ask why you haven't heard back, or sound impatient",
  "No reply after a second follow-up usually means it's time to move on",
];

export const FOLLOWUP_TIMING: string[][] = [
  ["After applying", "1–2 weeks", "Only if the posting gives no timeline. Skip it if they said \"we'll contact candidates by [date]\" and that date hasn't passed."],
  ["After an interview", "1 week after their stated timeline, or 1 week if none was given", "This is a check-in, not the thank-you note — send that within 24 hours of the interview instead."],
  ["Final check-in", "2–3 weeks after your last message", "Keep it short and close the loop either way. One more after this isn't worth sending."],
];

export const FOLLOWUP_DOS: string[] = [
  "Reference the exact job title and the date you applied or interviewed",
  "Add one short, genuine reason you're still interested",
  "Reattach your resume if you're emailing a new contact who may not have it",
  "Proofread the subject line as closely as the body",
  "Keep the tone warm and brief, never apologetic",
];

export const FOLLOWUP_DONTS: string[] = [
  "Don't ask why you haven't heard anything, or imply they're being slow",
  "Don't follow up more than once per stage, or sooner than the timing above",
  "Don't call unless the posting explicitly invites it",
  "Don't copy a hiring manager's personal contact found outside official channels",
];

const ME = "[Your Name]";

function email(subject: string, paragraphs: string[]): LetterContent {
  return { name: ME, contact: "", recipient: [], subject, greeting: "Dear [Hiring Manager's Name],", paragraphs, signoff: "Best regards," };
}

export const FOLLOWUP_TEMPLATES: { id: string; title: string; note: string; letter: LetterContent }[] = [
  {
    id: "after-applying",
    title: "After applying, no response yet",
    note: "Send about 1–2 weeks after you applied, if the posting gave no timeline.",
    letter: email("Following up: [Job Title] application – [Your Name]", [
      "I applied for the [Job Title] role on [Date] and wanted to confirm you received my application. I'm still very interested in the position and in what your team is building at [Company Name].",
      "If it's helpful, I'm happy to share more about my background — for example, [one relevant result, e.g. I grew organic sign-ups threefold in my current role]. My resume is attached again for convenience.",
      "Thank you for your time, and please let me know if you need anything else from me.",
    ]),
  },
  {
    id: "after-interview",
    title: "After an interview, checking in",
    note: "Send about a week after their stated timeline passes, or a week after the interview if none was given.",
    letter: email("Checking in: [Job Title] interview – [Your Name]", [
      "It was great speaking with you on [Date] about the [Job Title] role. I'm writing to check in, since I understand you may still be finishing up interviews.",
      "I remain very interested in the position, particularly [specific detail from the interview, e.g. the project you mentioned around improving onboarding]. Please let me know if there's anything else I can provide to help with your decision.",
      "Thank you again for your time — I look forward to hearing from you.",
    ]),
  },
  {
    id: "final-check-in",
    title: "Final check-in",
    note: "Send once, about 2–3 weeks after your last message, to close the loop.",
    letter: email("Final check-in: [Job Title] – [Your Name]", [
      "I wanted to follow up one last time on the [Job Title] role. I know hiring timelines shift, and I don't want to be a bother, so this will be my last check-in.",
      "I'm still interested if the position is open, and I completely understand if you've moved in a different direction. Either way, thank you for considering my application — I'd welcome the chance to stay in touch for future opportunities at [Company Name].",
      "Wishing you and the team the best.",
    ]),
  },
];

export const FOLLOWUP_SECTIONS: GuideSection[] = [
  {
    id: "when",
    title: "When to send a follow-up email",
    body: [
      "A follow-up checks in after silence; it's different from the thank-you note you send within 24 hours of an interview. Timing matters more than wording — too soon reads as pushy, and employers are often juggling dozens of candidates.",
    ],
    figure: "timing",
  },
  {
    id: "etiquette",
    title: "Do's and don'ts",
    body: [],
    figure: "etiquette",
  },
  {
    id: "after-applying",
    title: "After applying, no response yet",
    body: [FOLLOWUP_TEMPLATES[0].note],
    figure: "after-applying",
  },
  {
    id: "after-interview",
    title: "After an interview, checking in",
    body: [FOLLOWUP_TEMPLATES[1].note],
    figure: "after-interview",
    after: [
      "This isn't the same as a thank-you note. If you haven't sent one yet, see our [thank-you email after an interview](/blog/thank-you-email-after-interview) guide — send that within a day, and save this check-in for a week or more of silence after.",
    ],
  },
  {
    id: "final-check-in",
    title: "Final check-in",
    body: [FOLLOWUP_TEMPLATES[2].note],
    figure: "final-check-in",
  },
  {
    id: "subject-lines",
    title: "Subject line tips",
    body: [
      "- **Keep the job title in it.** A recruiter may be tracking dozens of roles; make it easy to find.\n- **Say what it is.** \"Following up\" or \"Checking in\" tells them what to expect before they open it.\n- **Skip the exclamation points and all caps.** A calm subject line reads as professional, not anxious.\n- **Reply to the original thread when you can**, instead of starting a new email — it keeps the history visible.",
    ],
  },
  {
    id: "no-response",
    title: "What if you still don't hear back?",
    body: [
      "After a final check-in with no reply, it's reasonable to assume the role moved on without you — or moved slower than expected, which happens often and isn't about you. Keep applying elsewhere rather than sending a third or fourth message; repeated follow-ups rarely change the outcome and can leave a worse impression than silence.",
      "If a recruiter explicitly said they'd keep your resume on file, a brief note a few months later, when you have a new result to share, is a reasonable way to re-open the conversation.",
    ],
  },
];

export const FOLLOWUP_FAQS: FaqItem[] = [
  { q: "How long should I wait before following up after applying?", a: "About 1 to 2 weeks, unless the posting gives a specific timeline — in that case, wait until it passes." },
  { q: "Is a follow-up email the same as a thank-you email?", a: "No. A thank-you note goes out within 24 hours of an interview. A follow-up email checks in after a period of silence, whether that's after applying or after an interview." },
  { q: "How many times should I follow up?", a: "Once per stage is enough: once after applying if there's silence, once after an interview, and at most one final check-in after that. More than that rarely helps." },
  { q: "Should I call instead of emailing?", a: "Only if the job posting or a recruiter explicitly invites a call. Email is the safer default and gives the other person time to respond." },
  { q: "What if I don't have a direct contact to email?", a: "Reply to the original application confirmation or interview-scheduling email if you have one. Otherwise, a short note through the application portal or to a general recruiting inbox is fine." },
  { q: "Is it okay to follow up on LinkedIn?", a: "A short, polite message is fine if you're already connected or the recruiter reached out to you there first. It shouldn't replace an email follow-up, just supplement it." },
];

export const FOLLOWUP_READING: string[] = ["thank-you-email-after-interview", "how-to-prepare-for-a-job-interview-with-ai"];
