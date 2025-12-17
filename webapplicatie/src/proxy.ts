
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware functie die inkomende requests controleert op sessies.
 * Beveiligde routes vereisen een actieve sessie.
 * ingelogde gebruikers kunnen niet naar /login, worden doorverwezen naar /.
 */
export function proxy(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const path = request.nextUrl.pathname;

  // Controleer of het pad beschermd is
  const protectedPaths = ["/", "/docs", "/pompen", "/statusboek"];
  const isProtected = protectedPaths.some(
    (p) => path === p || path.startsWith(p + "/")
  );

  // Redirect naar login als niet ingelogd is en route beschermd is.
  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect naar home als ingelogd en op login pagina
  if (session && path === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Laat de request anders gewoon door
  return NextResponse.next();
}

/**
 * Middleware configuratie: Bepaalt welke routes deze middleware activeert
 */
export const config = {
  matcher: [
    "/",
    "/docs/:path*",
    "/pompen/:path*",
    "/statusboek/:path*",
    "/login",
  ],
};
