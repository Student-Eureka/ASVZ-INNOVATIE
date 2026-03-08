import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Deze functie beschermt routes en stuurt gebruikers door naar login als ze geen sessie hebben.
export function proxy(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const path = request.nextUrl.pathname;

  // Beschermt routes (alleen toegankelijk als je bent ingelogd)
  const protectedPaths = ["/docs"];
  const isProtected = protectedPaths.some(
    (p) => path === p || path.startsWith(p + "/")
  );

  // Loginpagina is altijd toegankelijk; als je al ingelogd bent ga je door naar home ( / redirect -> /dashboard ) 
  if (path === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Geen sessie + beschermde route = doorsturen naar login page
  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Alles oke -> doorgaan naar page
  return NextResponse.next();
}
