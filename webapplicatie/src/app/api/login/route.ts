import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { loginWithPassword } from './_services/login';

export async function POST(req: NextRequest) {
  try {
    const { gebruikersnaam, wachtwoord } = await req.json();

    const result = await loginWithPassword(gebruikersnaam, wachtwoord);

    if (!result.success) {
      return NextResponse.json(
        { message: result.message ?? 'Ongeldige login' },
        { status: result.status }
      );
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set('session', result.token ?? '', {
      httpOnly: true,
      path: '/',
      maxAge: result.maxAgeSeconds,
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
