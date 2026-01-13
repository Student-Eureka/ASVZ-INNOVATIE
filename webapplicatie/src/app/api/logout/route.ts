import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/../lib/db";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("session")?.value;

  if (token) {
    await db.query("DELETE FROM sessions WHERE id = ?", [token]);
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("session", "", { path: "/", maxAge: 0 });

  return res;
}
