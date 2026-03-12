import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { requireUserByToken } from '@/core/auth/session';

function errorMessage(err: unknown) {
  return err instanceof Error && err.message ? err.message : 'Server error';
}

function errorStatus(err: unknown) {
  if (err instanceof Error && ['NO_SESSION_OR_EXPIRED', 'USER_NOT_FOUND'].includes(err.message)) {
    return 401;
  }

  return 500;
}

export async function GET(req: NextRequest) {
  // Geeft basisgegevens van de ingelogde gebruiker terug.
  try {
    const token = req.cookies.get('session')?.value ?? null;
    const user = await requireUserByToken(token);
    // De benodigde velden zodat de frontend kan bepalen of de Admin-tab zichtbaar is.
    return NextResponse.json({
      id: user.woning_id,
      role: user.rol,
      username: user.gebruikersnaam,
    });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: errorMessage(err) },
      { status: errorStatus(err) }
    );
  }
}
