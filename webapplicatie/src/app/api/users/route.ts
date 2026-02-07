import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { requireAdmin } from '@/../lib/auth';
import { createUser } from './_services/createUser';
import { deleteUser } from './_services/deleteUser';
import { getUsers } from './_services/getUsers';
import { updateUser } from './_services/updateUser';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const rows = await getUsers();
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const payload = await req.json();
    const result = await createUser(payload);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: result.status });
    }
    return NextResponse.json({ success: true, id: result.id });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req);
    const payload = await req.json();
    const result = await deleteUser(payload);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: result.status });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin(req);
    const payload = await req.json();
    const result = await updateUser(payload);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: result.status });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}
