import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/../lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { gebruikersnaam, wachtwoord } = await req.json();

  const [users]: any = await db.query(
    "SELECT woning_id, rol FROM woningen WHERE gebruikersnaam = ? AND wachtwoord = ?",
    [gebruikersnaam, wachtwoord]
  );

  if (users.length === 0) {
    return NextResponse.json(
      { success: false, message: "Ongeldige login" },
      { status: 401 }
    );
  }

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

  await db.query(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
    [token, users[0].id, expires]
  );

  const res = NextResponse.json({ success: true });

  res.cookies.set("session", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return res;
}
