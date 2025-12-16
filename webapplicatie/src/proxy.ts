import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import mysql from "mysql2/promise";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  const path = request.nextUrl.pathname;

  const protectedPaths = ["/", "/docs", "/pompen", "/statusboek"];
  const isProtected = protectedPaths.some(
    (p) => path === p || path.startsWith(p + "/")
  );

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "woningen_db",
    });

    const [rows]: any = await db.execute(
      "SELECT * FROM sessions WHERE token = ? AND expires_at > NOW()",
      [token]
    );

    await db.end();

    if (rows.length === 0) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.set("session", "", { maxAge: 0, path: "/" });
      return res;
    }

    if (path === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/docs/:path*", "/pompen/:path*", "/statusboek/:path*", "/login"],
};
