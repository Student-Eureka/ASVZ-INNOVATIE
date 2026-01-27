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
      "SELECT woning_id AS id, gebruikersnaam AS name, email, rol AS role, last_login AS lastLogin FROM woningen"
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

    const { name, email, password, role } = await req.json();
    const cleanName = String(name ?? "").trim();
    const cleanEmail = String(email ?? "").trim();
    const cleanRole = String(role ?? "").trim();
    const cleanPassword = String(password ?? "");

    if (!cleanName || !cleanEmail || !cleanPassword || !["user", "admin"].includes(cleanRole)) {
      return NextResponse.json({ success: false, message: "Ongeldige input" }, { status: 400 });
    }

    const [existing]: any = await db.query(
      "SELECT woning_id FROM woningen WHERE gebruikersnaam = ? OR email = ?",
      [cleanName, cleanEmail]
    );

    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "Gebruiker bestaat al" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, SALT_ROUNDS);

    const [result]: any = await db.query(
      "INSERT INTO woningen (gebruikersnaam, email, wachtwoord, rol) VALUES (?, ?, ?, ?)",
      [cleanName, cleanEmail, hashedPassword, cleanRole]
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

// PATCH: gebruiker updaten (naam, role, password)
export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { id, name, role, password } = await req.json();
    if (!id) return NextResponse.json({ success: false, message: "Geen id opgegeven" }, { status: 400 });

    const updates: string[] = [];
    const values: any[] = [];

    if (role && ["user", "admin"].includes(role)) {
      updates.push("rol = ?");
      values.push(role);
    }
    if (name) {
      updates.push("gebruikersnaam = ?");
      values.push(name);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      updates.push("wachtwoord = ?");
      values.push(hashedPassword);
    }

    if (updates.length === 0) return NextResponse.json({ success: false, message: "Niets om te updaten" }, { status: 400 });

    values.push(id); // voor WHERE
    await db.query(`UPDATE woningen SET ${updates.join(", ")} WHERE woning_id = ?`, values);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
