import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { requireAdminByToken } from '@/core/auth/session';
import {
  getDiscoveredPompenForWoning,
  registerDiscoveredPomp,
} from '@/app/api/pompen/_services/pompen';

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

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
    const user = await requireAdminByToken(token);
    const data = await getDiscoveredPompenForWoning(user.woning_id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { success: false, message: errorMessage(err) },
      { status: errorStatus(err) }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value ?? null;
    const user = await requireAdminByToken(token);
    const body = await req.json();
    const pompId = readString(body?.pompId);

    if (!pompId) {
      return NextResponse.json(
        { success: false, message: 'Geen pompId opgegeven' },
        { status: 400 }
      );
    }

    const result = await registerDiscoveredPomp({
      ownerId: user.woning_id,
      woningId: user.woning_id,
      pompId,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: errorMessage(err) },
      { status: errorStatus(err) }
    );
  }
}
