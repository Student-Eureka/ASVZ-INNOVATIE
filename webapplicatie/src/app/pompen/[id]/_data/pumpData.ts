import type { PumpData } from '../_types/pomp';

function resolveDisplayName(pumpId: string | string[] | undefined) {
  if (!pumpId) return 'Pomp Onbekend';

  const idString = Array.isArray(pumpId) ? pumpId[0] : pumpId;
  if (idString.includes('-')) {
    return `Pomp ${idString.split('-')[1].toUpperCase()}`;
  }
  return `Pomp ${idString}`;
}

export function createPumpData(pumpId: string | string[] | undefined): PumpData {
  const displayName = resolveDisplayName(pumpId);

  return {
    name: displayName,
    location: 'Woning A - Kamer 4 (Jan de Vries)',
    status: 'ALARM',
    alarmType: 'Obstructie gedetecteerd',
    fluidLevel: 45,
    batteryLevel: 15,
    flowRate: '120 ml/u',
    lastUpdate: 'Zojuist',
    temperature: '36.5°C',
    wifiName: 'WiFi: Eureka_2.4',
    history: [
      { id: '1', type: 'alarm', message: 'Alarm: Obstructie lijn gedetecteerd', time: 'Vandaag, 14:20' },
      { id: '2', type: 'info', message: 'Reguliere systeemcontrole uitgevoerd', time: 'Vandaag, 14:10' },
      { id: '3', type: 'info', message: 'Reguliere systeemcontrole uitgevoerd', time: 'Vandaag, 14:00' },
    ],
  };
}
