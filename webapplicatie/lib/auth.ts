import { db } from "@/../lib/db";
import type { NextRequest } from "next/server";

/**
 * Haalt sessie op en verwijdert verlopen sessies.
 */
export async function getSession(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  if (!token) return null;

  const [sessions]: any = await db.query(
    "SELECT * FROM sessions WHERE id = ?",
    [token]
  );

  if (!sessions.length) return null;

  const session = sessions[0];

  // Check of sessie verlopen is
  if (new Date(session.expires_at) < new Date()) {
    // Verwijder direct uit DB
    await db.query("DELETE FROM sessions WHERE id = ?", [token]);
    return null;
  }

  return session;
}

/**
 * Verifieer admin user op basis van sessie cookie.
 */
export async function requireAdmin(req: NextRequest) {
  const session = await getSession(req);
  if (!session) throw new Error("NO_SESSION_OR_EXPIRED");

  const [users]: any = await db.query(
    "SELECT woning_id, rol, gebruikersnaam FROM woningen WHERE woning_id = ?",
    [session.user_id]
  );

  if (!users.length || users[0].rol !== "admin") throw new Error("NOT_ADMIN");

  return users[0]; // admin user info
}
