import type { PompApiRecord, PompItem, PompStatus } from '../_types/pompen';

function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function normalizePompStatus(status: string): PompStatus {
  const normalized = status.trim().toLowerCase();

  if (normalized === 'ok') return 'rust';
  if (normalized === 'offline') return 'inactief';
  if (normalized === 'alarm') return 'alarm';
  if (normalized === 'sluimerend') return 'sluimerend';
  if (normalized === 'actief') return 'actief';
  if (normalized === 'rust') return 'rust';
  if (normalized === 'inactief') return 'inactief';

  return normalized || 'inactief';
}

export function formatWoningLabel(woning: string) {
  return titleCase(woning || 'woning_onbekend');
}

export function formatPompLabel(pompId: string) {
  return titleCase(pompId || 'pomp_onbekend');
}

export function formatStatusLabel(status: string) {
  const normalized = normalizePompStatus(status);
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function formatRelativeTime(value: string) {
  if (!value) {
    return 'Nog geen update';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Onbekende tijd';
  }

  const diffMs = Date.now() - date.getTime();
  const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));

  if (diffSeconds < 5) return 'Zojuist';
  if (diffSeconds < 60) return `${diffSeconds}s geleden`;

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} min geleden`;

  const formatter = new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return formatter.format(date);
}

export function mapPompenToItems(records: PompApiRecord[]): PompItem[] {
  return records.map((record) => ({
    uniqueId: record.uniqueId,
    id: record.id,
    woning: record.woning,
    name: formatPompLabel(record.id),
    location: formatWoningLabel(record.woning),
    status: normalizePompStatus(String(record.status)),
    lastUpdate: record.lastUpdate,
    lastUpdateLabel: formatRelativeTime(record.lastUpdate),
  }));
}
