import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTH_DISABLED = true;

export function proxy(request: NextRequest) {
  if (AUTH_DISABLED && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (AUTH_DISABLED) {
    return NextResponse.next();
  }

  const session = request.cookies.get('session')?.value;
  const path = request.nextUrl.pathname;

  const protectedPaths = ['/dashboard', '/pompen', '/docs', '/admin'];
  const isProtected = protectedPaths.some((p) => path === p || path.startsWith(`${p}/`));

  if (path === '/login') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (!session && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
