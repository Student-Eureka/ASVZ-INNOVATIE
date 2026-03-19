import {
  getPompLogSnapshot,
  getPompenSnapshot,
  recordPompInfo,
  recordPompStatus,
  wirePompenMqtt,
} from '@/core/pompenStore';
import {
  createRegisteredPompRecord,
  getRegisteredPompIds,
  getRegisteredPompByWoningAndId,
  getRegisteredPompen,
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

function resolveMqttWoning(record: { woningId: string; mqttWoning?: string | null }) {
  return readString(record.mqttWoning) || String(record.woningId);
}

function matchesWoningScope(candidate: string, woningId?: string | null) {
  if (!woningId) {
    return true;
  }

  return candidate === woningId;
}

async function getRegisteredPumpKeys(woningId?: string | null) {
  if (woningId) {
    return (await getRegisteredPompIdsByWoningId(woningId)).map((record) => ({
      woningId: String(record.woningId),
      pompId: record.pompId,
      mqttWoning: resolveMqttWoning({
        woningId: String(record.woningId),
        mqttWoning: record.mqttWoning,
      }),
    }));
  }

  return getRegisteredPompIds();
}

async function getRegisteredPompenInScope(woningId?: string | null) {
  if (woningId) {
    return getRegisteredPompenByWoningId(woningId);
  }

  return getRegisteredPompen();
}

function toDbStatus(status: string): 'Inactief' | 'Actief' | 'Alarm' {
  const normalized = status.trim().toLowerCase();

  if (normalized === 'alarm') {
    return 'Alarm';
  }

  if (normalized === 'actief' || normalized === 'rust' || normalized === 'sluimerend' || normalized === 'ok') {
    return 'Actief';
  }

  return 'Inactief';
}

function toApiStatus(status: string) {
  const normalized = status.trim().toLowerCase();

  if (normalized === 'actief') return 'actief';
  if (normalized === 'inactief') return 'inactief';
  if (normalized === 'alarm') return 'alarm';
  if (normalized === 'rust') return 'actief';
  if (normalized === 'sluimerend') return 'actief';
  if (normalized === 'ok') return 'actief';
  if (normalized === 'offline') return 'inactief';

  return normalized || 'inactief';
}

async function syncDiscoveredPompen(woningId?: string | null) {
  const livePompen = getPompenSnapshot().filter((record) => matchesWoningScope(record.woning, woningId));
  const registeredPumpKeys = new Set(
    (await getRegisteredPumpKeys(woningId)).map(
      (record) => `${resolveMqttWoning(record)}:${normalizePompId(record.pompId)}`
    )
  );

  for (const pomp of livePompen) {
    const pumpKey = `${pomp.woning}:${normalizePompId(pomp.id)}`;
    if (registeredPumpKeys.has(pumpKey)) {
      continue;
    }

    const discoveryKey = `${pomp.woning}:${pomp.id}`;
    if (announcedDiscoveredPompen.has(discoveryKey)) {
      continue;
    }

    announcedDiscoveredPompen.add(discoveryKey);
    recordPompInfo({
      woning: pomp.woning,
      pompId: pomp.id,
      message: 'Pomp gevonden via MQTT en nog niet in database',
      topic: pomp.statusTopic,
    });
  }
}

export async function getPompenForWoning(woningId?: string | null) {
  ensureMqttSubscription();
  await syncDiscoveredPompen(woningId);

  const livePompen = getPompenSnapshot().filter((record) => matchesWoningScope(record.woning, woningId));
  const livePompenByKey = new Map(
    livePompen.map((record) => [`${record.woning}:${normalizePompId(record.id)}`, record])
  );
  const registeredPompen = await getRegisteredPompenInScope(woningId);

  return registeredPompen.map((registered) => {
    const currentWoningId = String(registered.woningId);
    const mqttWoning = resolveMqttWoning({
      woningId: currentWoningId,
      mqttWoning: registered.mqttWoning,
    });
    const live = livePompenByKey.get(`${mqttWoning}:${normalizePompId(registered.pompId)}`);

    return {
      uniqueId: `${currentWoningId}_${registered.pompId}`,
      id: registered.pompId,
      woning: currentWoningId,
      status: live?.status ?? toApiStatus(registered.status),
      lastUpdate: live?.lastUpdate ?? registered.lastUpdate ?? registered.createdAt ?? '',
      statusTopic: live?.statusTopic ?? buildStatusTopic(mqttWoning, registered.pompId),
      commandTopic: live?.commandTopic ?? buildCommandTopic(mqttWoning, registered.pompId),
    };
  });
}

export async function getRegisteredPompEventsForWoning(woningId?: string | null) {
  ensureMqttSubscription();
  await syncDiscoveredPompen(woningId);

  const registeredPumpKeys = new Set(
    (await getRegisteredPumpKeys(woningId)).map(
      (record) => `${resolveMqttWoning(record)}:${normalizePompId(record.pompId)}`
    )
  );

  return getPompLogSnapshot().filter((item) =>
    registeredPumpKeys.has(`${item.woning}:${normalizePompId(item.pompId)}`)
  );
}

export async function getDiscoveredPompenForWoning(woningId?: string | null) {
  ensureMqttSubscription();
  await syncDiscoveredPompen(woningId);

  const livePompen = getPompenSnapshot().filter((record) => matchesWoningScope(record.woning, woningId));
  const registeredPumpKeys = new Set(
    (await getRegisteredPumpKeys(woningId)).map(
      (record) => `${resolveMqttWoning(record)}:${normalizePompId(record.pompId)}`
    )
  );

  return livePompen.filter(
    (record) => !registeredPumpKeys.has(`${record.woning}:${normalizePompId(record.id)}`)
  );
}

export async function registerDiscoveredPomp(params: {
  woningId: string;
  pompId: string;
  mqttWoning: string;
}) {
  ensureMqttSubscription();

  const livePomp = getPompenSnapshot().find(
    (record) =>
      record.woning === params.mqttWoning &&
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
    woningId: params.woningId,
    pompId: params.pompId,
    mqttWoning: params.mqttWoning,
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

export async function getAuditLogForWoning(woningId?: string | null) {
  ensureMqttSubscription();
  await syncDiscoveredPompen(woningId);

  return getPompLogSnapshot().filter((item) => matchesWoningScope(item.woning, woningId));
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
