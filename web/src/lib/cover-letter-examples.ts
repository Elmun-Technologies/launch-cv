/**
 * Cover letter examples (/cover-letter-examples/[slug]), one per resume example and
 * written by the same fictional person, so each pair reads as one application.
 * Names, companies and numbers are illustrative.
 */

export type CoverLetterExample = {
  /** Same slug as the matching resume example. */
  slug: string;
  /** Job the letter applies for (fictional employer). */
  target: { title: string; company: string; hiringManager: string };
  /** Letter body, one string per paragraph, without greeting or sign-off. */
  paragraphs: string[];
  /** What each paragraph is doing, shown next to the letter. */
  annotations: string[];
  tips: { t: string; d: string }[];
  faqs: { q: string; a: string }[];
};

export const COVER_LETTER_EXAMPLES: CoverLetterExample[] = [];

export function getCoverLetterExample(slug: string): CoverLetterExample | undefined {
  return COVER_LETTER_EXAMPLES.find((c) => c.slug === slug);
}
