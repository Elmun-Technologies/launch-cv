import { NextResponse } from "next/server";
import { adminApi } from "@/lib/admin-api";
import { live } from "@/lib/traffic/queries";

/** Admin → Analytics → Live: visitors in the last 5 minutes and their pages (polled every 15 s). */
export async function GET() {
  const { error } = await adminApi("view");
  if (error) return error;
  return NextResponse.json(await live(new Date()), { headers: { "Cache-Control": "no-store" } });
}
