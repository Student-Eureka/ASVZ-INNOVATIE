import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/../lib/db";
import bcrypt from "bcrypt";
import { requireAdmin } from "@/../lib/auth";

const SALT_ROUNDS = 12;

// GET: alle gebruikers ophalen
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req); // security check

    const [rows]: any = await db.query(
      "SELECT woning_id AS id, gebruikersnaam AS name, rol AS role FROM woningen"
    );
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 401 });
  }
}

// POST: nieuwe gebruiker toevoegen
export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { name, password, role } = await req.json();
    const cleanName = String(name ?? "").trim();
    const cleanRole = String(role ?? "").trim();
    const cleanPassword = String(password ?? "");

    if (!cleanName || !cleanPassword || !["user", "admin"].includes(cleanRole)) {
      return NextResponse.json({ success: false, message: "Ongeldige input" }, { status: 400 });
    }

    const [existing]: any = await db.query(
      "SELECT woning_id FROM woningen WHERE gebruikersnaam = ?",
      [cleanName]
    );

    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "Gebruiker bestaat al" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, SALT_ROUNDS);

    const [result]: any = await db.query(
      "INSERT INTO woningen (gebruikersnaam, wachtwoord, rol) VALUES (?, ?, ?)",
      [cleanName, hashedPassword, cleanRole]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}

// DELETE: gebruiker verwijderen
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, message: "Geen id opgegeven" }, { status: 400 });

    await db.query("DELETE FROM woningen WHERE woning_id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}

// PATCH: role bijwerken
export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { id, role } = await req.json();
    if (!id || !["user","admin"].includes(role)) return NextResponse.json({ success: false, message: "Ongeldige input" }, { status: 400 });

    await db.query("UPDATE woningen SET rol = ? WHERE woning_id = ?", [role, id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
