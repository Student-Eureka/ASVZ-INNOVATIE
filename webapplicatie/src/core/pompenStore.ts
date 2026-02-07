import type { MqttClient } from 'mqtt';

export type PompStatus = 'actief' | 'rust' | 'inactief' | string;

export interface PompRecord {
  uniqueId: string;
  id: string;
  woning: string;
  status: PompStatus;
}

const pompen = new Map<string, PompRecord>();
let subscribed = false;

export function getPompenSnapshot(): PompRecord[] {
  return Array.from(pompen.values());
}

export function wirePompenMqtt(client: MqttClient) {
  if (subscribed) return;
  subscribed = true;

  client.on('connect', () => {
    console.log('MQTT connected');
    client.subscribe('asvz/+/+/+');
  });

  client.on('reconnect', () => {
    console.log('MQTT reconnecting');
  });

  client.on('close', () => {
    console.log('MQTT closed');
  });

  client.on('offline', () => {
    console.log('MQTT offline');
  });

  client.on('message', (topic: string, message: Buffer) => {
    const parts = topic.split('/');
    if (parts.length < 4) return;
    const [, woningId, pompId, type] = parts;
    if (type !== 'status') return;

    const statusMsg = message.toString();
    const uniqueId = `${woningId}_${pompId}`;

    pompen.set(uniqueId, {
      uniqueId,
      id: pompId,
      woning: woningId,
      status: statusMsg,
    });
  });
}
