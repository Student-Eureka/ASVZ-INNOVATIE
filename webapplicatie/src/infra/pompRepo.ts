import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { db } from './db';

interface RegisteredPompRow extends RowDataPacket {
  dbId: string;
  pompId: string;
  woningId: string;
  status: 'Inactief' | 'Rust' | 'Actief';
  lastUpdate: string | null;
  createdAt: string | null;
}

interface RegisteredPompIdRow extends RowDataPacket {
  pompId: string;
}

export async function getRegisteredPompenByWoningId(woningId: string) {
  const [rows] = await db.query<RegisteredPompRow[]>(
    `SELECT id AS dbId,
            pomp_code AS pompId,
            woning_id AS woningId,
            status,
            laatste_update AS lastUpdate,
            created_at AS createdAt
       FROM pompen
      WHERE woning_id = ?
      ORDER BY pomp_code ASC`,
    [woningId]
  );
  return rows;
}

export async function getRegisteredPompIdsByWoningId(woningId: string) {
  const [rows] = await db.query<RegisteredPompIdRow[]>(
    'SELECT pomp_code AS pompId FROM pompen WHERE woning_id = ?',
    [woningId]
  );
  return rows.map((row) => row.pompId);
}

export async function getRegisteredPompByWoningAndId(woningId: string, pompId: string) {
  const [rows] = await db.query<RegisteredPompRow[]>(
    `SELECT id AS dbId,
            pomp_code AS pompId,
            woning_id AS woningId,
            status,
            laatste_update AS lastUpdate,
            created_at AS createdAt
       FROM pompen
      WHERE woning_id = ? AND pomp_code = ?
      LIMIT 1`,
    [woningId, pompId]
  );
  return rows[0] ?? null;
}

export async function createRegisteredPompRecord(params: {
  ownerId: string;
  woningId: string;
  pompId: string;
  status: 'Inactief' | 'Rust' | 'Actief';
  lastUpdate?: string | null;
}) {
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO pompen (woning_id, pomp_code, status, laatste_update)
     VALUES (?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))
     ON DUPLICATE KEY UPDATE
       status = VALUES(status),
       laatste_update = VALUES(laatste_update)`,
    [params.ownerId, params.pompId, params.status, params.lastUpdate ?? null]
  );
  return result;
}
