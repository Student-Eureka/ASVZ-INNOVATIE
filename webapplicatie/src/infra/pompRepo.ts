import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { db } from './db';

interface RegisteredPompRow extends RowDataPacket {
  dbId: string;
  pompId: string;
  woningId: string;
  mqttWoning: string | null;
  status: 'Inactief' | 'Rust' | 'Actief' | 'Alarm' | 'Sluimerend';
  lastUpdate: string | null;
  createdAt: string | null;
}

interface RegisteredPompIdRow extends RowDataPacket {
  woningId: string;
  pompId: string;
  mqttWoning: string | null;
}

interface ColumnExistsRow extends RowDataPacket {
  columnName: string;
}

let ensureSchemaPromise: Promise<void> | null = null;

async function ensurePompSchema() {
  if (!ensureSchemaPromise) {
    ensureSchemaPromise = (async () => {
      const dbName = process.env.DB_NAME;
      if (!dbName) {
        throw new Error('Missing env: DB_NAME');
      }

      const [rows] = await db.query<ColumnExistsRow[]>(
        `SELECT COLUMN_NAME AS columnName
           FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_SCHEMA = ?
            AND TABLE_NAME = 'pompen'
            AND COLUMN_NAME = 'mqtt_woning'`,
        [dbName]
      );

      if (rows.length === 0) {
        await db.query(
          'ALTER TABLE pompen ADD COLUMN mqtt_woning varchar(100) NULL AFTER woning_id'
        );
      }

      await db.query(
        'UPDATE pompen SET mqtt_woning = CAST(woning_id AS CHAR) WHERE mqtt_woning IS NULL OR mqtt_woning = ""'
      );
    })();
  }

  await ensureSchemaPromise;
}

export async function getRegisteredPompenByWoningId(woningId: string) {
  await ensurePompSchema();
  const [rows] = await db.query<RegisteredPompRow[]>(
    `SELECT id AS dbId,
            pomp_code AS pompId,
            woning_id AS woningId,
            mqtt_woning AS mqttWoning,
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

export async function getRegisteredPompen() {
  await ensurePompSchema();
  const [rows] = await db.query<RegisteredPompRow[]>(
    `SELECT id AS dbId,
            pomp_code AS pompId,
            woning_id AS woningId,
            mqtt_woning AS mqttWoning,
            status,
            laatste_update AS lastUpdate,
            created_at AS createdAt
       FROM pompen
      ORDER BY woning_id ASC, pomp_code ASC`,
    []
  );
  return rows;
}

export async function getRegisteredPompIdsByWoningId(woningId: string) {
  await ensurePompSchema();
  const [rows] = await db.query<RegisteredPompIdRow[]>(
    'SELECT woning_id AS woningId, pomp_code AS pompId, mqtt_woning AS mqttWoning FROM pompen WHERE woning_id = ?',
    [woningId]
  );
  return rows;
}

export async function getRegisteredPompIds() {
  await ensurePompSchema();
  const [rows] = await db.query<RegisteredPompIdRow[]>(
    'SELECT woning_id AS woningId, pomp_code AS pompId, mqtt_woning AS mqttWoning FROM pompen',
    []
  );
  return rows.map((row) => ({
    woningId: String(row.woningId),
    pompId: row.pompId,
    mqttWoning: row.mqttWoning,
  }));
}

export async function getRegisteredPompByWoningAndId(woningId: string, pompId: string) {
  await ensurePompSchema();
  const [rows] = await db.query<RegisteredPompRow[]>(
    `SELECT id AS dbId,
            pomp_code AS pompId,
            woning_id AS woningId,
            mqtt_woning AS mqttWoning,
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
  woningId: string;
  pompId: string;
  mqttWoning: string;
  status: 'Inactief' | 'Rust' | 'Actief' | 'Alarm' | 'Sluimerend';
  lastUpdate?: string | null;
}) {
  await ensurePompSchema();
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO pompen (woning_id, pomp_code, mqtt_woning, status, laatste_update)
     VALUES (?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))
     ON DUPLICATE KEY UPDATE
       mqtt_woning = VALUES(mqtt_woning),
       status = VALUES(status),
       laatste_update = VALUES(laatste_update)`,
    [params.woningId, params.pompId, params.mqttWoning, params.status, params.lastUpdate ?? null]
  );
  return result;
}
