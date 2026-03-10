import { NextResponse } from 'next/server';

import { getPompEvents } from '../_services/pompen';

export async function GET() {
  const data = await getPompEvents();
  return NextResponse.json(data);
}
