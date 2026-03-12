import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Alleen de loginpagina is publiek; alle andere routes vereisen een sessie.
const PUBLIC_PATHS = new Set(['/login']);

export function middleware(request: NextRequest) {
  // Centrale route-guard: beschermt alles behalve /login.
  const { pathname } = request.nextUrl;

  // Next.js assets en API-routes niet blokkeren in middleware.
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // Ingelogde users hoeven de loginpagina niet te zien.
  if (PUBLIC_PATHS.has(pathname)) {
    if (request.cookies.get('session')?.value) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  const session = request.cookies.get('session')?.value;
  // Geen sessie = terug naar login.
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Laat middleware draaien op alle routes behalve Next assets.
  matcher: ['/((?!_next|favicon.ico).*)'],
};
