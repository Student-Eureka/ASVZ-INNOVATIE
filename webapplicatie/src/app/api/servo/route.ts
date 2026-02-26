import { NextResponse } from 'next/server';

import { sendServoSweep } from '@/core/servo/commands';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

export async function POST() {
  try {
    const host = requireEnv('SERVO_MQTT_HOST');
    const port = Number(requireEnv('SERVO_MQTT_PORT'));
    const protocol = requireEnv('SERVO_MQTT_PROTOCOL') as 'mqtt' | 'mqtts';
    const username = process.env.SERVO_MQTT_USER;
    const password = process.env.SERVO_MQTT_PASS;
    const rejectUnauthorized = process.env.SERVO_MQTT_REJECT_UNAUTHORIZED !== 'false';

    await sendServoSweep({
      host,
      port,
      protocol,
      username,
      password,
      rejectUnauthorized,
    });

    return NextResponse.json({ success: true, message: 'Commando verstuurd!' });
  } catch (err: any) {
    console.error('Servo command error:', err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Kon niet publishen' },
      { status: 500 }
    );
  }
}
