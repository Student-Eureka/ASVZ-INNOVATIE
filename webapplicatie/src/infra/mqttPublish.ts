import mqtt from 'mqtt';

interface MqttPublishOptions {
  host: string;
  port: number;
  protocol: 'mqtts' | 'mqtt';
  username?: string;
  password?: string;
  rejectUnauthorized?: boolean;
  connectTimeoutMs?: number;
}

export async function publishOnce(
  topic: string,
  payload: string,
  options: MqttPublishOptions
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const client = mqtt.connect({
      host: options.host,
      port: options.port,
      protocol: options.protocol,
      username: options.username,
      password: options.password,
      rejectUnauthorized: options.rejectUnauthorized ?? true,
      connectTimeout: options.connectTimeoutMs ?? 5000,
    });

    client.on('connect', () => {
      client.publish(topic, payload, (err) => {
        client.end();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    client.on('error', (err) => {
      client.end();
      reject(err);
    });
  });
}
