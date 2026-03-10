import type { MqttClient } from 'mqtt';

export type PompStatus = 'actief' | 'rust' | 'inactief' | string;

export interface PompRecord {
  uniqueId: string;
  id: string;
  woning: string;
  status: PompStatus;
  lastUpdate: string;
  statusTopic: string;
  commandTopic: string;
}

export interface PompLogEntry {
  id: string;
  uniqueId: string;
  pompId: string;
  woning: string;
  kind: 'status' | 'command';
  status?: string;
  message: string;
  createdAt: string;
  topic: string;
}

const pompen = new Map<string, PompRecord>();
const pompLog = new Map<string, PompLogEntry>();

const MAX_LOG_ITEMS = 200;

let subscribed = false;
let logCounter = 0;

function buildUniqueId(woning: string, pompId: string) {
  return `${woning}_${pompId}`;
}

function buildStatusTopic(woning: string, pompId: string) {
  return `asvz/${woning}/${pompId}/status`;
}

function buildCommandTopic(woning: string, pompId: string) {
  return `asvz/${woning}/${pompId}/set`;
}

function normalizeStatus(status: string): PompStatus {
  const normalized = status.trim().toLowerCase();

  if (normalized === 'alarm') return 'actief';
  if (normalized === 'ok') return 'rust';
  if (normalized === 'offline') return 'inactief';
  if (normalized === 'actief' || normalized === 'rust' || normalized === 'inactief') {
    return normalized;
  }

  return normalized || 'inactief';
}

function pushLogEntry(entry: Omit<PompLogEntry, 'id'>) {
  logCounter += 1;

  const id = `${Date.now()}-${logCounter}`;
  pompLog.set(id, { id, ...entry });

  if (pompLog.size <= MAX_LOG_ITEMS) {
    return;
  }

  const oldestKey = pompLog.keys().next().value;
  if (oldestKey) {
    pompLog.delete(oldestKey);
  }
}

function setPompRecord(params: {
  woning: string;
  pompId: string;
  status: string;
  receivedAt?: string;
  topic?: string;
}) {
  const receivedAt = params.receivedAt ?? new Date().toISOString();
  const uniqueId = buildUniqueId(params.woning, params.pompId);
  const normalizedStatus = normalizeStatus(params.status);
  const statusTopic = params.topic ?? buildStatusTopic(params.woning, params.pompId);

  pompen.set(uniqueId, {
    uniqueId,
    id: params.pompId,
    woning: params.woning,
    status: normalizedStatus,
    lastUpdate: receivedAt,
    statusTopic,
    commandTopic: buildCommandTopic(params.woning, params.pompId),
  });

  pushLogEntry({
    uniqueId,
    pompId: params.pompId,
    woning: params.woning,
    kind: 'status',
    status: normalizedStatus,
    message: `Status bijgewerkt naar ${normalizedStatus}`,
    createdAt: receivedAt,
    topic: statusTopic,
  });
}

export function getPompenSnapshot(): PompRecord[] {
  return Array.from(pompen.values()).sort((a, b) => a.uniqueId.localeCompare(b.uniqueId));
}

export function getPompLogSnapshot(): PompLogEntry[] {
  return Array.from(pompLog.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function recordPompStatus(params: {
  woning: string;
  pompId: string;
  status: string;
  receivedAt?: string;
  topic?: string;
}) {
  setPompRecord(params);
}

export function recordServoCommand(params: {
  woning: string;
  pompId: string;
  message?: string;
  createdAt?: string;
}) {
  const createdAt = params.createdAt ?? new Date().toISOString();

  pushLogEntry({
    uniqueId: buildUniqueId(params.woning, params.pompId),
    pompId: params.pompId,
    woning: params.woning,
    kind: 'command',
    message: params.message ?? 'Servo-commando verstuurd',
    createdAt,
    topic: buildCommandTopic(params.woning, params.pompId),
  });
}

export function wirePompenMqtt(client: MqttClient) {
  if (subscribed) return;
  subscribed = true;

  const subscribeToStatusTopics = () => {
    client.subscribe('asvz/+/+/status');
  };

  client.on('connect', () => {
    console.log('MQTT connected');
    subscribeToStatusTopics();
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

    setPompRecord({
      woning: woningId,
      pompId,
      status: message.toString(),
      receivedAt: new Date().toISOString(),
      topic,
    });
  });

  if (client.connected) {
    subscribeToStatusTopics();
  }
}
