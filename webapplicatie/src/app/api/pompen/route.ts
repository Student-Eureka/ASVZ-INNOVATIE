// src/app/api/pompen/route.ts
import { NextResponse } from 'next/server';

import { getPompen, updatePompStatus } from './_services/pompen';

export async function GET() {
  const data = await getPompen();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await updatePompStatus(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
