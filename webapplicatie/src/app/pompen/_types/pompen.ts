export type PompStatus = 'ALARM' | 'OK' | 'OFFLINE';

export interface PompItem {
  id: string;
  name: string;
  location: string;
  status: PompStatus;
  battery: number;
}
