/**
 * "a" or "an" for a phrase, by sound: "an accountant", "an EMT", "an HR generalist",
 * "an RN", "a UX designer", "a QA engineer". Acronyms are read letter by letter.
 */
const VOWEL_SOUND_LETTERS = new Set("AEFHILMNORSX".split(""));
const YOU_SOUND = /^(u[bcfgklrst][aeiouy]|uni|use|usu|ute|eu)/i; // "a user", "a unit", "a European"
const SILENT_H = /^(hour|honest|honor|heir)/i;

export function article(phrase: string): "a" | "an" {
  const word = phrase.trim().split(/\s+/)[0] ?? "";
  if (!word) return "a";
  if (/^[A-Z]{2,}/.test(word)) return VOWEL_SOUND_LETTERS.has(word[0]) ? "an" : "a";
  if (SILENT_H.test(word)) return "an";
  if (YOU_SOUND.test(word)) return "a";
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

/** The phrase with its article: withArticle("EMT") → "an EMT"; capital → "An EMT". */
export function withArticle(phrase: string, capital = false): string {
  const a = article(phrase);
  return `${capital ? a[0].toUpperCase() + a.slice(1) : a} ${phrase}`;
}
