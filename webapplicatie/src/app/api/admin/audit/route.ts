import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { requireAdminByToken } from '@/core/auth/session';
import { getAuditLogForWoning } from '@/app/api/pompen/_services/pompen';

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
    const data = await getAuditLogForWoning(user.woning_id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { success: false, message: errorMessage(err) },
      { status: errorStatus(err) }
    );
  }
}
