import {
  getPompLogSnapshot,
  getPompenSnapshot,
  recordPompInfo,
  recordPompStatus,
  wirePompenMqtt,
} from '@/core/pompenStore';
import {
  createRegisteredPompRecord,
  getRegisteredPompByWoningAndCode,
  getRegisteredPompIdsByWoningCode,
  getRegisteredPompenByWoningCode,
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

function buildStatusTopic(woningCode: string, pompId: string) {
  return `asvz/${woningCode}/${pompId}/status`;
}

function buildCommandTopic(woningCode: string, pompId: string) {
  return `asvz/${woningCode}/${pompId}/set`;
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

async function syncDiscoveredPompen(woningCode: string) {
  const livePompen = getPompenSnapshot().filter((record) => record.woning === woningCode);
  const registeredPumpIds = new Set(await getRegisteredPompIdsByWoningCode(woningCode));

  for (const pomp of livePompen) {
    if (registeredPumpIds.has(pomp.id)) {
      continue;
    }

    const discoveryKey = `${woningCode}:${pomp.id}`;
    if (announcedDiscoveredPompen.has(discoveryKey)) {
      continue;
    }

    announcedDiscoveredPompen.add(discoveryKey);
    recordPompInfo({
      woning: woningCode,
      pompId: pomp.id,
      message: 'Pomp gevonden via MQTT en nog niet in database',
      topic: pomp.statusTopic,
    });
  }
}

export async function getPompenForWoning(woningCode: string) {
  ensureMqttSubscription();
  await syncDiscoveredPompen(woningCode);

  const livePompen = getPompenSnapshot().filter((record) => record.woning === woningCode);
  const livePompenById = new Map(livePompen.map((record) => [record.id, record]));
  const registeredPompen = await getRegisteredPompenByWoningCode(woningCode);

  return registeredPompen.map((registered) => {
    const live = livePompenById.get(registered.pompId);

    return {
      uniqueId: `${woningCode}_${registered.pompId}`,
      id: registered.pompId,
      woning: woningCode,
      status: live?.status ?? toApiStatus(registered.status),
      lastUpdate: live?.lastUpdate ?? registered.lastUpdate ?? registered.createdAt ?? '',
      statusTopic: live?.statusTopic ?? buildStatusTopic(woningCode, registered.pompId),
      commandTopic: live?.commandTopic ?? buildCommandTopic(woningCode, registered.pompId),
    };
  });
}

export async function getRegisteredPompEventsForWoning(woningCode: string) {
  ensureMqttSubscription();
  await syncDiscoveredPompen(woningCode);

  const registeredPumpIds = new Set(await getRegisteredPompIdsByWoningCode(woningCode));

  return getPompLogSnapshot().filter(
    (item) => item.woning === woningCode && registeredPumpIds.has(item.pompId)
  );
}

export async function getDiscoveredPompenForWoning(woningCode: string) {
  ensureMqttSubscription();
  await syncDiscoveredPompen(woningCode);

  const livePompen = getPompenSnapshot().filter((record) => record.woning === woningCode);
  const registeredPumpIds = new Set(await getRegisteredPompIdsByWoningCode(woningCode));

  return livePompen.filter((record) => !registeredPumpIds.has(record.id));
}

export async function registerDiscoveredPomp(params: {
  ownerId: string;
  woningCode: string;
  pompId: string;
}) {
  ensureMqttSubscription();

  const livePomp = getPompenSnapshot().find(
    (record) => record.woning === params.woningCode && record.id === params.pompId
  );

  if (!livePomp) {
    throw new Error('Pomp is niet live gevonden via MQTT');
  }

  const existing = await getRegisteredPompByWoningAndCode(params.woningCode, params.pompId);
  if (existing) {
    return {
      alreadyExists: true,
      record: {
        uniqueId: `${params.woningCode}_${params.pompId}`,
        id: params.pompId,
        woning: params.woningCode,
        status: livePomp.status,
        lastUpdate: livePomp.lastUpdate,
        statusTopic: livePomp.statusTopic,
        commandTopic: livePomp.commandTopic,
      },
    };
  }

  await createRegisteredPompRecord({
    ownerId: params.ownerId,
    woningCode: params.woningCode,
    pompId: params.pompId,
    status: toDbStatus(String(livePomp.status)),
    lastUpdate: livePomp.lastUpdate,
  });

  return {
    alreadyExists: false,
    record: {
      uniqueId: `${params.woningCode}_${params.pompId}`,
      id: params.pompId,
      woning: params.woningCode,
      status: livePomp.status,
      lastUpdate: livePomp.lastUpdate,
      statusTopic: livePomp.statusTopic,
      commandTopic: livePomp.commandTopic,
    },
  };
}

export async function getAuditLogForWoning(woningCode: string) {
  ensureMqttSubscription();
  await syncDiscoveredPompen(woningCode);

  return getPompLogSnapshot().filter((item) => item.woning === woningCode);
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
