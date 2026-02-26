import { publishOnce } from '@/infra/mqttPublish';

interface ServoCommandConfig {
  host: string;
  port: number;
  protocol: 'mqtts' | 'mqtt';
  username?: string;
  password?: string;
  rejectUnauthorized?: boolean;
}

export async function sendServoSweep(config: ServoCommandConfig) {
  const topic = 'asvz/woning_a/pomp_1/set';
  await publishOnce(topic, 'SWEEP', {
    host: config.host,
    port: config.port,
    protocol: config.protocol,
    username: config.username,
    password: config.password,
    rejectUnauthorized: config.rejectUnauthorized,
    connectTimeoutMs: 5000,
  });
}
