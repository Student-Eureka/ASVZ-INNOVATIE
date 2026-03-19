import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { requireAdminByToken } from '@/core/auth/session';
import { createUser, deleteUser, getUsers, updateUser } from '@/core/users/users';

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
    await requireAdminByToken(token);
    const rows = await getUsers();
    return NextResponse.json(rows);
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
    await requireAdminByToken(token);
    const payload = await req.json();
    const result = await createUser(payload);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status }
      );
    }
    return NextResponse.json({ success: true, id: result.id });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: errorMessage(err) },
      { status: errorStatus(err) }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value ?? null;
    const admin = await requireAdminByToken(token);
    const payload = await req.json();
    const result = await deleteUser(payload, {
      id: admin.woning_id,
    });
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: errorMessage(err) },
      { status: errorStatus(err) }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value ?? null;
    await requireAdminByToken(token);
    const payload = await req.json();
    const result = await updateUser(payload);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: errorMessage(err) },
      { status: errorStatus(err) }
    );
  }
}
