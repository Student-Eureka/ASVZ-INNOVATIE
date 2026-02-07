import type { PompItem } from '../_types/pompen';

export const POMPEN: PompItem[] = [
  { id: 'pomp-a', name: 'Pomp A', location: 'Woning A - Kamer 4', status: 'ALARM', battery: 15 },
  { id: 'pomp-b', name: 'Pomp B', location: 'Woning A - Kamer 2', status: 'OK', battery: 88 },
  { id: 'pomp-c', name: 'Pomp C', location: 'Woning B - Kamer 1', status: 'OFFLINE', battery: 0 },
  { id: 'pomp-d', name: 'Pomp D', location: 'Woning C - Kamer 5', status: 'OK', battery: 92 },
  { id: 'pomp-e', name: 'Pomp E', location: 'Woning D - Kamer 3', status: 'OK', battery: 74 },
];
