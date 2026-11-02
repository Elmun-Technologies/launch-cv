import { SiteShell } from "@/components/site/site-shell";
import { JsonLd } from "@/components/json-ld";
import { WordCounter } from "@/components/site/tools/word-counter";
import { MoreTools, NumberedCards, ToolFaq, ToolHero, ToolNextSteps, ToolStage } from "@/components/site/tools/tool-page";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { toolPageLd } from "@/lib/seo/free-tools";
import { LINES_PER_PAGE, LONG_BULLET_WORDS, READING_WPM, WORDS_PER_PAGE } from "@/lib/seo/resume-text-stats";
import type { FaqItem } from "@/lib/faq-ld";

const PATH = "/tools/resume-word-counter";
const DESCRIPTION =
  "Paste your resume to count words, characters and bullets, estimate pages and flag filler phrases recruiters skim past. Free, instant, nothing uploaded.";

export const metadata = buildMarketingMetadata({
  title: "Resume Word Counter — Length, Bullets & Filler",
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  keywords: ["resume word counter", "resume length checker", "how many words should a resume be", "resume page count", "resume filler words"],
});

const faqs: FaqItem[] = [
  {
    q: "How many words should a resume be?",
    a: "A one-page resume usually holds about 400 to 600 words, and a two-page resume up to about 1,000. Length matters less than whether every line shows something you did.",
  },
  {
    q: "How is the page count estimated?",
    a: `We divide your word count by ${WORDS_PER_PAGE} words a page, or your line count by ${LINES_PER_PAGE} lines a page, whichever is larger. That's roughly a one-column US letter page at 10.5–11 pt. Your template, font and margins change the real number.`,
  },
  {
    q: "How long should a resume bullet be?",
    a: `One or two lines. Bullets over ${LONG_BULLET_WORDS} words usually wrap to a third line, and long bullets are the ones readers skim. Lines that start with •, - or * count as bullets.`,
  },
  {
    q: "What counts as a filler phrase?",
    a: "Weak openers such as “responsible for” and “duties included”, and self-descriptions such as “team player” or “detail-oriented” that a reader can't verify. Each flag comes with what to do instead.",
  },
  {
    q: "Is my resume uploaded?",
    a: "No. Everything is counted in your browser. Your text isn't sent to LaunchCV or saved anywhere.",
  },
];

const metrics = [
  { t: "Words and characters", d: "Every word and character, with and without spaces — for forms with a character limit." },
  { t: "Estimated pages", d: `Words ÷ ${WORDS_PER_PAGE} or lines ÷ ${LINES_PER_PAGE}, whichever is larger.` },
  { t: "Bullets", d: `How many, their average length, and how many run over ${LONG_BULLET_WORDS} words.` },
  { t: "Filler and repeats", d: `Clichés to cut, words you use 3+ times, and reading time at ${READING_WPM} words a minute.` },
];

export default function WordCounterPage() {
  return (
    <SiteShell>
      <JsonLd data={toolPageLd({ name: "Resume Word Counter", crumb: "Resume word counter", path: PATH, description: DESCRIPTION, faqs })} />
      <ToolHero
        crumb="Resume word counter"
        title="Resume word counter."
        muted="Length, bullets and filler words."
        lead="Paste your resume. See word count, page estimate, bullet length and the filler phrases recruiters skim past."
      />
      <ToolStage>
        <WordCounter />
      </ToolStage>
      <NumberedCards label="What it counts" title="Four numbers worth checking." muted="Before you hit Apply." items={metrics} />
      <MoreTools current="words" />
      <ToolFaq title="Word counter," muted="answered." faqs={faqs} />
      <ToolNextSteps
        location="word_counter_next"
        title="Right length? Now check what the software reads."
        lead="The free ATS check scores your resume and names each fix. The editor, templates and PDF export are free with an account."
      />
    </SiteShell>
  );
}
