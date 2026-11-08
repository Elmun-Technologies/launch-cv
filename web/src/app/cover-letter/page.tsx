import { permanentRedirect } from "next/navigation";

/** /cover-letter has no page of its own: situations are listed on the examples index. */
export default function CoverLetterIndex() {
  permanentRedirect("/cover-letter-examples#situations");
}
