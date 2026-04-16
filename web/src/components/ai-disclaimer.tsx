import { AlertTriangle } from "lucide-react";

export function AiDisclaimer() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
      <p className="text-xs leading-relaxed text-amber-800">
        AI suggestions may not always be accurate. The system is designed to avoid fabricating metrics or unverified facts, but always review the results carefully.
      </p>
    </div>
  );
}
