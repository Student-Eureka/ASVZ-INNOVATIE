import type { MqttClient } from 'mqtt';
import mqtt from 'mqtt';

let client: MqttClient | null = null;
let isConnecting = false;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

export function getMqttClient() {
  if (client || isConnecting) return client;

  isConnecting = true;

  const broker = requireEnv('MQTT_BROKER_URL');
  const username = requireEnv('MQTT_USER');
  const password = requireEnv('MQTT_PASS');

  client = mqtt.connect(broker, {
    username,
    password,
    clientId: `server_${Math.random().toString(16).slice(3)}`,
    reconnectPeriod: 5000,
  });

  client.on('error', (err) => {
    console.error('MQTT error:', err);
  });

  return client;
}
