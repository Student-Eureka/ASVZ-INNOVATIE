import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { db } from './db';

interface RegisteredPompRow extends RowDataPacket {
  dbId: string;
  pompId: string;
  woningCode: string;
  status: 'Inactief' | 'Rust' | 'Actief';
  lastUpdate: string | null;
  createdAt: string | null;
}

interface RegisteredPompIdRow extends RowDataPacket {
  pompId: string;
}

export async function getRegisteredPompenByWoningCode(woningCode: string) {
  const [rows] = await db.query<RegisteredPompRow[]>(
    `SELECT id AS dbId,
            pomp_code AS pompId,
            woning_code AS woningCode,
            status,
            laatste_update AS lastUpdate,
            created_at AS createdAt
       FROM pompen
      WHERE woning_code = ?
      ORDER BY pomp_code ASC`,
    [woningCode]
  );
  return rows;
}

export async function getRegisteredPompIdsByWoningCode(woningCode: string) {
  const [rows] = await db.query<RegisteredPompIdRow[]>(
    'SELECT pomp_code AS pompId FROM pompen WHERE woning_code = ?',
    [woningCode]
  );
  return rows.map((row) => row.pompId);
}

export async function getRegisteredPompByWoningAndCode(woningCode: string, pompId: string) {
  const [rows] = await db.query<RegisteredPompRow[]>(
    `SELECT id AS dbId,
            pomp_code AS pompId,
            woning_code AS woningCode,
            status,
            laatste_update AS lastUpdate,
            created_at AS createdAt
       FROM pompen
      WHERE woning_code = ? AND pomp_code = ?
      LIMIT 1`,
    [woningCode, pompId]
  );
  return rows[0] ?? null;
}

export async function createRegisteredPompRecord(params: {
  ownerId: string;
  woningCode: string;
  pompId: string;
  status: 'Inactief' | 'Rust' | 'Actief';
  lastUpdate?: string | null;
}) {
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO pompen (woning_id, woning_code, pomp_code, status, laatste_update)
     VALUES (?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))
     ON DUPLICATE KEY UPDATE
       woning_id = VALUES(woning_id),
       status = VALUES(status),
       laatste_update = VALUES(laatste_update)`,
    [params.ownerId, params.woningCode, params.pompId, params.status, params.lastUpdate ?? null]
  );
  return result;
}
