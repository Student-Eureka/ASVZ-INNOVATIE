export type PumpStatus = 'ALARM' | 'OK';

export interface PumpHistoryItem {
  id: string;
  type: 'alarm' | 'info';
  message: string;
  time: string;
}

export interface PumpData {
  name: string;
  location: string;
  status: PumpStatus;
  alarmType: string;
  fluidLevel: number;
  batteryLevel: number;
  flowRate: string;
  lastUpdate: string;
  temperature: string;
  wifiName: string;
  history: PumpHistoryItem[];
}
