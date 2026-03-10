import { recordServoCommand } from '@/core/pompenStore';
import { publishOnce } from '@/infra/mqttPublish';

interface ServoCommandConfig {
  host: string;
  port: number;
  protocol: 'mqtts' | 'mqtt';
  username?: string;
  password?: string;
  rejectUnauthorized?: boolean;
}

interface ServoTarget {
  woning: string;
  pompId: string;
  payload?: string;
}

export async function sendServoSweep(config: ServoCommandConfig, target: ServoTarget) {
  const topic = `asvz/${target.woning}/${target.pompId}/set`;
  const payload = target.payload ?? 'SWEEP';

  await publishOnce(topic, payload, {
    host: config.host,
    port: config.port,
    protocol: config.protocol,
    username: config.username,
    password: config.password,
    rejectUnauthorized: config.rejectUnauthorized,
    connectTimeoutMs: 5000,
  });

  recordServoCommand({
    woning: target.woning,
    pompId: target.pompId,
    message: `Servo-commando verstuurd (${payload})`,
  });
}
