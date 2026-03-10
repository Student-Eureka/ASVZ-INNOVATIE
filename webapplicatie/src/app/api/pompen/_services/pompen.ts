import { getPompLogSnapshot, getPompenSnapshot, recordPompStatus, wirePompenMqtt } from '@/core/pompenStore';
import { getMqttClient } from '@/infra/mqttClient';

interface StatusUpdatePayload {
  woning?: unknown;
  woningId?: unknown;
  pompId?: unknown;
  pomp?: unknown;
  id?: unknown;
  status?: unknown;
  topic?: unknown;
}

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function extractStatusPayload(body: unknown) {
  if (!body || typeof body !== 'object') {
    throw new Error('Ongeldige payload');
  }

  const payload = body as StatusUpdatePayload;
  const woning = readString(payload.woning) || readString(payload.woningId);
  const pompId = readString(payload.pompId) || readString(payload.pomp) || readString(payload.id);
  const status = readString(payload.status);
  const topic = readString(payload.topic);

  if (!woning || !pompId || !status) {
    throw new Error('Verplichte velden ontbreken');
  }

  return { woning, pompId, status, topic };
}

function ensureMqttSubscription() {
  try {
    const client = getMqttClient();
    if (client) {
      wirePompenMqtt(client);
    }
  } catch (error) {
    console.error('MQTT initialisatie mislukt:', error);
  }
}

export async function getPompen() {
  ensureMqttSubscription();
  return getPompenSnapshot();
}

export async function getPompEvents() {
  ensureMqttSubscription();
  return getPompLogSnapshot();
}

export async function updatePompStatus(body: unknown) {
  const payload = extractStatusPayload(body);

  recordPompStatus({
    woning: payload.woning,
    pompId: payload.pompId,
    status: payload.status,
    topic: payload.topic || undefined,
  });

  return { status: 'ok' };
}
