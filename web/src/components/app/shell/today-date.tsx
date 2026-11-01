"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};
const today = () => new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

/** Today's date in the viewer's own time zone ("Saturday, November 1"). Renders nothing on the server. */
export function TodayDate({ className = "" }: { className?: string }) {
  const label = useSyncExternalStore(noop, today, () => "");
  if (!label) return <p className={className} aria-hidden="true">&nbsp;</p>;
  return <p className={className}>{label}</p>;
}
