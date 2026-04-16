import type { Prisma } from "@prisma/client";
import { emptyResumeContent, type ResumeContent } from "@/types/resume";

export function parseResumeContent(raw: Prisma.JsonValue): ResumeContent {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return emptyResumeContent();
  }
  return raw as unknown as ResumeContent;
}
