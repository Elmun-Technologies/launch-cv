import { getSettings } from "@/lib/app-settings";
import { integrationStatuses } from "@/lib/integrations";
import { productIdForCheckoutPlan } from "@/lib/polar";
import { secretBoxReady } from "@/lib/secret-box";
import { CHECKOUT_PLAN_ORDER } from "@/lib/plan-config";
import { PUBLIC_PLANS } from "@/lib/monetization";

/**
 * Settings checkout and AI need to work; a missing one silently loses sales.
 * Shown on Admin → Overview and in the weekly owner report.
 */
export async function configProblems(): Promise<string[]> {
  const out: string[] = [];
  const st = await integrationStatuses();
  const field = (p: string, f: string) => st.find((x) => x.id === p)?.fields.find((x) => x.key === f)?.source !== "none";
  if (!field("polar", "accessToken")) out.push("Polar access token is missing — nobody can open checkout.");
  if (!field("polar", "webhookSecret")) out.push("Polar webhook secret is missing — paid users won't get access.");
  for (const p of CHECKOUT_PLAN_ORDER) {
    if (!(await productIdForCheckoutPlan(p))) out.push(`No Polar product id for ${PUBLIC_PLANS[p].title} — its checkout fails.`);
  }
  // Only the providers the chosen models actually use need a key.
  const models = Object.values((await getSettings()).models).filter(Boolean);
  if (models.some((m) => !m.startsWith("claude-")) && !field("openai", "apiKey")) out.push("OpenAI key is missing — AI tools set to an OpenAI model fail.");
  if (models.some((m) => m.startsWith("claude-")) && !field("anthropic", "apiKey")) out.push("Claude API key is missing — AI tools set to a Claude model fail.");
  if (!secretBoxReady()) out.push("KEY_ENCRYPTION_KEY is not set in hosting — keys can't be saved from Integrations.");
  if (!process.env.NEXT_PUBLIC_APP_URL) out.push("NEXT_PUBLIC_APP_URL is not set — checkout return links and sitemap use a fallback host.");
  return out;
}
