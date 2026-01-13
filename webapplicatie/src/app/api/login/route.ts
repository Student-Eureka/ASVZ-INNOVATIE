import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/../lib/db";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { gebruikersnaam, wachtwoord } = await req.json();

    if (!gebruikersnaam || !wachtwoord) {
      return NextResponse.json({ message: "Ongeldige input" }, { status: 400 });
    }

    const [rows]: any = await db.query(
      "SELECT woning_id, wachtwoord, rol FROM woningen WHERE gebruikersnaam = ?",
      [gebruikersnaam]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Ongeldige login" }, { status: 401 });
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(wachtwoord, user.wachtwoord);

    if (!isValid) {
      return NextResponse.json({ message: "Ongeldige login" }, { status: 401 });
    }

    // Genereer sessie ID en expiratie
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 *60 * 8); // 8 uur

    await db.query(
      "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)",
      [token, user.woning_id, expires]
    );

    const res = NextResponse.json({ success: true });
    res.cookies.set("session", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 8
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
