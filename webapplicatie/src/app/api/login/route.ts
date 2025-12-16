import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { gebruikersnaam, wachtwoord } = await req.json();

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "woningen_db",
  });

  // Controleer login
  const [rows] = await db.execute(
    "SELECT * FROM woningen WHERE gebruikersnaam = ? AND wachtwoord = ?",
    [gebruikersnaam, wachtwoord]
  );

  if ((rows as any).length === 0) {
    await db.end();
    return NextResponse.json(
      { success: false, message: "Ongeldige login" },
      { status: 401 }
    );
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

  await db.execute(
    "INSERT INTO sessions (token, gebruikersnaam, expires_at) VALUES (?, ?, ?)",
    [token, gebruikersnaam, expiresAt]
  );

  await db.end();

  const res = NextResponse.json({ success: true });
  res.cookies.set("session", token, {
    httpOnly: true,
    path: "/",
    maxAge: 24 * 60 * 60,
  });

  return res;
}
