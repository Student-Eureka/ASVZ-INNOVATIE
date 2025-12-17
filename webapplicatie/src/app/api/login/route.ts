import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/../lib/db";
import crypto from "crypto";

/**
 * Login endpoint:
 * - valideert gebruikersnaam en wachtwoord
 * - maakt een sessie-token aan en slaat die op in de database
 * - zet een httpOnly cookie voor de sessie
 */
export async function POST(req: NextRequest) {
  // Haal login gegevens op uit request body
  const { gebruikersnaam, wachtwoord } = await req.json();

  // Controleer of de gebruiker bestaat in de database
  const [users]: any = await db.query(
    "SELECT woning_id, rol FROM woningen WHERE gebruikersnaam = ? AND wachtwoord = ?",
    [gebruikersnaam, wachtwoord]
  );

  // Ongelde login
  if (users.length === 0) {
    return NextResponse.json(
      { success: false, message: "Ongeldige login" },
      { status: 401 }
    );
  }

  // Maak een uniek sessie-token en bepaal vervaldatum
  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 8);
  // Data.now() werkt met milliseconden
  // 1000ms * 60 s * 60 m * 8 uur = 8 uur vanaf inlog moment
 
// Sla sessie op in de database
  await db.query(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
    [token, users[0].id, expires]
  );

  // Stuur succesresponse en zet httpOnly sessie-cookie
  const res = NextResponse.json({ success: true });
  res.cookies.set("session", token, {
    httpOnly: true,         // Alleen toegangelijk via HTTP(S), niet via JS
    path: "/",              // Cookie is beschikbaar op alle routes      
    maxAge: 60 * 60 * 8,   // Levensduur cookie in seconden: 60 s * 60 m * 8 uur = 8 uur
  });

  return res;
}
