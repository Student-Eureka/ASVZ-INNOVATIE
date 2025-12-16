import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const token = req.headers
    .get("cookie")
    ?.split("session=")[1]
    ?.split(";")[0];

  if (token) {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "woningen_db",
    });

    await db.execute("DELETE FROM sessions WHERE token = ?", [token]);
    await db.end();
  }
  
  const res = NextResponse.json({ success: true });
  res.cookies.set("session", "", { maxAge: 0, path: "/" });
  return res;
}
