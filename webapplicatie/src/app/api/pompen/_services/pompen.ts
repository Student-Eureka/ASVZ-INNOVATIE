// src/app/api/pompen/_services/pompen.ts
import { NextResponse } from 'next/server';

// Mock data, vervang dit met je database call
const pompenData = [
  { id: '1', woning: 'woning_1', status: 'actief' },
  { id: '2', woning: 'woning_2', status: 'rust' },
  { id: '3', woning: 'woning_3', status: 'inactief' },
];

export async function getPompen() {
  return pompenData || [];
}

export async function updatePompStatus(body: unknown) {
  // Hier zou je de status naar je database schrijven
  // await updatePompStatus(body.pomp_id, body.woning, body.status);
  console.log('Nieuwe status ontvangen:', body);
  return { status: 'ok' };
}
