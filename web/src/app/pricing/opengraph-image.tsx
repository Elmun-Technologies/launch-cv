import { ImageResponse } from "next/og";
import { OgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/components/og-image";
import { PUBLIC_PLANS, planPriceLabel, planNameList } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER } from "@/lib/plan-config";

export const runtime = "edge";
export const alt = `Launch CV pricing — ${planNameList("and")}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const pills = CHECKOUT_PLAN_ORDER.map((key) => `${PUBLIC_PLANS[key].title} ${planPriceLabel(key)}`);

export default function Image() {
  return new ImageResponse(
    <OgImage
      title="Pay monthly, yearly, or once."
      subtitle={`Every AI tool on every plan — ${pills.join(", ")}.`}
      pills={pills}
    />,
    { ...size },
  );
}
