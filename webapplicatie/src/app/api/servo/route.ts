import { NextResponse } from 'next/server';

import { sendServoSweep } from '@/core/servo/commands';

interface ServoRequestBody {
  woning?: unknown;
  pompId?: unknown;
  payload?: unknown;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as ServoRequestBody;
    const woning = readString(body.woning) || 'woning_a';
    const pompId = readString(body.pompId) || 'pomp_1';
    const payload = readString(body.payload) || 'SWEEP';

    const host = requireEnv('SERVO_MQTT_HOST');
    const port = Number(requireEnv('SERVO_MQTT_PORT'));
    const protocol = requireEnv('SERVO_MQTT_PROTOCOL') as 'mqtt' | 'mqtts';
    const username = process.env.SERVO_MQTT_USER;
    const password = process.env.SERVO_MQTT_PASS;
    const rejectUnauthorized = process.env.SERVO_MQTT_REJECT_UNAUTHORIZED !== 'false';

    await sendServoSweep(
      {
        host,
        port,
        protocol,
        username,
        password,
        rejectUnauthorized,
      },
      { woning, pompId, payload }
    );

    return NextResponse.json({
      success: true,
      message: `Commando verstuurd naar ${woning}/${pompId}`,
    });
  } catch (err) {
    console.error('Servo command error:', err);

    const message = err instanceof Error ? err.message : 'Kon niet publishen';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
