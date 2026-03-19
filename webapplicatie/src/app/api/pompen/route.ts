import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { requireUserByToken } from '@/core/auth/session';

import { getPompenForWoning, updatePompStatus } from './_services/pompen';

function errorMessage(err: unknown) {
  return err instanceof Error && err.message ? err.message : 'Server error';
}

function errorStatus(err: unknown) {
  if (
    err instanceof Error &&
    ['NO_SESSION_OR_EXPIRED', 'USER_NOT_FOUND', 'NOT_ADMIN'].includes(err.message)
  ) {
    return 401;
  }

  return 500;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value ?? null;
    const user = await requireUserByToken(token);
    const data = await getPompenForWoning(user.rol === 'admin' ? null : user.woning_id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: errorMessage(err) },
      { status: errorStatus(err) }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await updatePompStatus(body);

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);

    const message = err instanceof Error ? err.message : 'Onbekende fout';
    return NextResponse.json({ status: 'error', message }, { status: 400 });
  }
}
