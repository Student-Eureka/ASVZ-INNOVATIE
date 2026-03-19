import {
  formatPompLabel,
  formatRelativeTime,
  formatWoningLabel,
  normalizePompStatus,
} from '../../_data/pompen';
import type { PompApiLogEntry, PompApiRecord } from '../../_types/pompen';
import type { PumpData, PumpHistoryItem } from '../_types/pomp';

function readPumpId(pumpId: string | string[] | undefined) {
  if (Array.isArray(pumpId)) {
    return pumpId[0] ?? '';
  }

  return pumpId ?? '';
}

function resolveStatusMessage(status: string) {
  const normalized = normalizePompStatus(status);

  if (normalized === 'alarm') {
    return 'Alarm ontvangen. Deze pomp wacht op een handmatige servo-actie vanuit de webapp.';
  }

  if (normalized === 'sluimerend') {
    return 'Servo is aangestuurd. De pomp staat nu sluimerend.';
  }

  if (normalized === 'actief') {
    return 'Pomp is actief en verwerkt op dit moment een melding.';
  }

  if (normalized === 'rust') {
    return 'Pomp staat in rust en wacht op een volgende actie.';
  }

  return 'Nog geen bruikbare live status ontvangen voor deze pomp.';
}

function mapHistoryItems(items: PompApiLogEntry[]): PumpHistoryItem[] {
  return items.slice(0, 10).map((item) => ({
    id: item.id,
    type: item.kind === 'command' ? 'command' : item.kind === 'info' ? 'info' : 'status',
    message: item.message,
    time: formatRelativeTime(item.createdAt),
    topic: item.topic,
  }));
}

export function createPumpData(
  pumpId: string | string[] | undefined,
  record: PompApiRecord | null,
  logItems: PompApiLogEntry[]
): PumpData {
  const resolvedPumpId = readPumpId(pumpId) || record?.id || 'pomp_onbekend';
  const woning = record?.woning || 'woning_onbekend';
  const uniqueId = record?.uniqueId || `${woning}_${resolvedPumpId}`;
  const status = normalizePompStatus(String(record?.status ?? 'inactief'));
  const statusTopic = record?.statusTopic || `asvz/${woning}/${resolvedPumpId}/status`;
  const commandTopic = record?.commandTopic || `asvz/${woning}/${resolvedPumpId}/set`;

  return {
    uniqueId,
    id: resolvedPumpId,
    woning,
    name: formatPompLabel(resolvedPumpId),
    location: formatWoningLabel(woning),
    status,
    statusMessage: resolveStatusMessage(status),
    lastUpdate: record ? formatRelativeTime(record.lastUpdate) : 'Nog geen update',
    statusTopic,
    commandTopic,
    history: mapHistoryItems(logItems),
  };
}
