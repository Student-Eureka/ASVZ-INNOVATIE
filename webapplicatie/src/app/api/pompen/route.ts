import { NextResponse } from 'next/server';

import { getMqttClient } from '@/infra/mqttClient';
import { getPompenSnapshot, wirePompenMqtt } from '@/core/pompenStore';

export async function GET() {
  const client = getMqttClient();
  if (client) {
    wirePompenMqtt(client);
  }

  const data = getPompenSnapshot();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Nieuwe status ontvangen:', body);
    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
