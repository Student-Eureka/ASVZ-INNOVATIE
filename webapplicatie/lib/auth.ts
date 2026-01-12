import { db } from "@/../lib/db";
import type { NextRequest } from "next/server";

/**
 * Verifieert dat de gebruiker admin is.
 * Gooi een error als sessie ongeldig, verlopen of geen admin.
 */
export async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  if (!token) throw new Error("NO_SESSION");

  const [sessions]: any = await db.query(
    "SELECT user_id, expires_at FROM sessions WHERE token = ?",
    [token]
  );

  if (!sessions.length) throw new Error("INVALID_SESSION");
  if (new Date(sessions[0].expires_at) < new Date()) throw new Error("SESSION_EXPIRED");

  const [users]: any = await db.query(
    "SELECT woning_id, rol, gebruikersnaam FROM woningen WHERE woning_id = ?",
    [sessions[0].user_id]
  );

  if (!users.length || users[0].rol !== "admin") throw new Error("NOT_ADMIN");

  return users[0]; // admin user info
}
