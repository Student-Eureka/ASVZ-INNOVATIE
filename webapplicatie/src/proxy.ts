import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const path = request.nextUrl.pathname;

  // Protected routes
  const protectedPaths = ["/docs", "/pompen", "/statusboek"];
  const isProtected = protectedPaths.some(
    (p) => path === p || path.startsWith(p + "/")
  );

  // ALTIJD loginpagina toestaan
  if (path === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Redirect naar login als niet ingelogd is
  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Alles verder gewoon doorgaan
  return NextResponse.next();
}
