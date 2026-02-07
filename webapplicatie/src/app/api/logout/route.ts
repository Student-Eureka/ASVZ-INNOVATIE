import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { logoutSession } from './_services/logout';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('session')?.value ?? null;

  await logoutSession(token);

  const res = NextResponse.json({ success: true });
  res.cookies.set('session', '', { path: '/', maxAge: 0 });

  return res;
}
