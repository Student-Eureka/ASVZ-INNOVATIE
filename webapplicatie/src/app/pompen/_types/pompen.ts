export type PompStatus = 'actief' | 'rust' | 'inactief' | string;

export interface PompApiRecord {
  uniqueId: string;
  id: string;
  woning: string;
  status: PompStatus;
  lastUpdate: string;
  statusTopic: string;
  commandTopic: string;
}

export interface PompApiLogEntry {
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

export interface PompItem {
  uniqueId: string;
  id: string;
  woning: string;
  name: string;
  location: string;
  status: PompStatus;
  lastUpdate: string;
  lastUpdateLabel: string;
}
