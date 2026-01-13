import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/../lib/auth";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // ALTIJD loginpagina toestaan
  if (path === "/login") {
    const session = await getSession(request);
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  const protectedPaths = ["/docs", "/pompen", "/statusboek", "/admin"];
  const isProtected = protectedPaths.some(
    (p) => path === p || path.startsWith(p + "/")
  );

  const session = await getSession(request);

  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
