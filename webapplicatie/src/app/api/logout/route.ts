
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/../lib/db";

/**
 * Log out endpoint: verwijdert de sessie uit de database en delete de cookie.
 */
export async function POST(req: NextRequest) {
  // Haal de sessiecookie op
  const token = req.cookies.get("session")?.value;

  // Verwijder sessie uit de database als er een token bestaat
  if (token) {
    await db.query("DELETE FROM sessions WHERE token = ?", [token]);
  }

  // Maak response en delete cookie in de browser
  const res = NextResponse.json({ success: true });
  res.cookies.set("session", "", { path: "/", maxAge: 0 });

  return res;
}
