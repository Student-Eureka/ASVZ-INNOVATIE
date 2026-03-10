export type PumpStatus = 'actief' | 'rust' | 'inactief' | string;

export interface PumpHistoryItem {
  id: string;
  type: 'status' | 'command' | 'info';
  message: string;
  time: string;
  topic: string;
}

export interface PumpData {
  uniqueId: string;
  id: string;
  woning: string;
  name: string;
  location: string;
  status: PumpStatus;
  statusMessage: string;
  lastUpdate: string;
  statusTopic: string;
  commandTopic: string;
  history: PumpHistoryItem[];
}
