import {
  getPompLogSnapshot,
  getPompenSnapshot,
  recordPompInfo,
  recordPompStatus,
  wirePompenMqtt,
} from '@/core/pompenStore';
import {
  createRegisteredPompRecord,
  getRegisteredPompByWoningAndId,
  getRegisteredPompIdsByWoningId,
  getRegisteredPompenByWoningId,
} from '@/infra/pompRepo';
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

const announcedDiscoveredPompen = new Set<string>();

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizePompId(value: string) {
  return value.trim().toLowerCase();
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

function buildStatusTopic(woningId: string, pompId: string) {
  return `asvz/${woningId}/${pompId}/status`;
}

function buildCommandTopic(woningId: string, pompId: string) {
  return `asvz/${woningId}/${pompId}/set`;
}

function toDbStatus(status: string): 'Inactief' | 'Rust' | 'Actief' {
  const normalized = status.trim().toLowerCase();

  if (normalized === 'actief' || normalized === 'alarm') {
    return 'Actief';
  }

  if (normalized === 'rust' || normalized === 'ok') {
    return 'Rust';
  }

  return 'Inactief';
}

function toApiStatus(status: string) {
  const normalized = status.trim().toLowerCase();

  if (normalized === 'actief') return 'actief';
  if (normalized === 'rust') return 'rust';
  if (normalized === 'inactief') return 'inactief';
  if (normalized === 'alarm') return 'actief';
  if (normalized === 'ok') return 'rust';
  if (normalized === 'offline') return 'inactief';

  return normalized || 'inactief';
}

async function syncDiscoveredPompen(woningId: string) {
  const livePompen = getPompenSnapshot().filter((record) => record.woning === woningId);
  const registeredPumpIds = new Set(
    (await getRegisteredPompIdsByWoningId(woningId)).map(normalizePompId)
  );

  for (const pomp of livePompen) {
    if (registeredPumpIds.has(normalizePompId(pomp.id))) {
      continue;
    }

    const discoveryKey = `${woningId}:${pomp.id}`;
    if (announcedDiscoveredPompen.has(discoveryKey)) {
      continue;
    }

    announcedDiscoveredPompen.add(discoveryKey);
    recordPompInfo({
      woning: woningId,
      pompId: pomp.id,
      message: 'Pomp gevonden via MQTT en nog niet in database',
      topic: pomp.statusTopic,
    });
  }
}

export async function getPompenForWoning(woningId: string) {
  ensureMqttSubscription();
  await syncDiscoveredPompen(woningId);

  const livePompen = getPompenSnapshot().filter((record) => record.woning === woningId);
  const livePompenById = new Map(
    livePompen.map((record) => [normalizePompId(record.id), record])
  );
  const registeredPompen = await getRegisteredPompenByWoningId(woningId);

  return registeredPompen.map((registered) => {
    const live = livePompenById.get(normalizePompId(registered.pompId));

    return {
      uniqueId: `${woningId}_${registered.pompId}`,
      id: registered.pompId,
      woning: woningId,
      status: live?.status ?? toApiStatus(registered.status),
      lastUpdate: live?.lastUpdate ?? registered.lastUpdate ?? registered.createdAt ?? '',
      statusTopic: live?.statusTopic ?? buildStatusTopic(woningId, registered.pompId),
      commandTopic: live?.commandTopic ?? buildCommandTopic(woningId, registered.pompId),
    };
  });
}

export async function getRegisteredPompEventsForWoning(woningId: string) {
  ensureMqttSubscription();
  await syncDiscoveredPompen(woningId);

  const registeredPumpIds = new Set(
    (await getRegisteredPompIdsByWoningId(woningId)).map(normalizePompId)
  );

  return getPompLogSnapshot().filter(
    (item) => item.woning === woningId && registeredPumpIds.has(normalizePompId(item.pompId))
  );
}

export async function getDiscoveredPompenForWoning(woningId: string) {
  ensureMqttSubscription();
  await syncDiscoveredPompen(woningId);

  const livePompen = getPompenSnapshot().filter((record) => record.woning === woningId);
  const registeredPumpIds = new Set(
    (await getRegisteredPompIdsByWoningId(woningId)).map(normalizePompId)
  );

  return livePompen.filter((record) => !registeredPumpIds.has(normalizePompId(record.id)));
}

export async function registerDiscoveredPomp(params: {
  ownerId: string;
  woningId: string;
  pompId: string;
}) {
  ensureMqttSubscription();

  const livePomp = getPompenSnapshot().find(
    (record) =>
      record.woning === params.woningId &&
      normalizePompId(record.id) === normalizePompId(params.pompId)
  );

  if (!livePomp) {
    throw new Error('Pomp is niet live gevonden via MQTT');
  }

  const existing = await getRegisteredPompByWoningAndId(params.woningId, params.pompId);
  if (existing) {
    return {
      alreadyExists: true,
      record: {
        uniqueId: `${params.woningId}_${params.pompId}`,
        id: params.pompId,
        woning: params.woningId,
        status: livePomp.status,
        lastUpdate: livePomp.lastUpdate,
        statusTopic: livePomp.statusTopic,
        commandTopic: livePomp.commandTopic,
      },
    };
  }

  await createRegisteredPompRecord({
    ownerId: params.ownerId,
    woningId: params.woningId,
    pompId: params.pompId,
    status: toDbStatus(String(livePomp.status)),
    lastUpdate: livePomp.lastUpdate,
  });

  return {
    alreadyExists: false,
    record: {
      uniqueId: `${params.woningId}_${params.pompId}`,
      id: params.pompId,
      woning: params.woningId,
      status: livePomp.status,
      lastUpdate: livePomp.lastUpdate,
      statusTopic: livePomp.statusTopic,
      commandTopic: livePomp.commandTopic,
    },
  };
}

export async function getAuditLogForWoning(woningId: string) {
  ensureMqttSubscription();
  await syncDiscoveredPompen(woningId);

  return getPompLogSnapshot().filter((item) => item.woning === woningId);
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
