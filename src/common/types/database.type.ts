import { ExtractTablesWithRelations } from 'drizzle-orm';
import { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { PgTransaction } from 'drizzle-orm/pg-core';

export type TableTransaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof import('@/database/schema'),
  ExtractTablesWithRelations<typeof import('@/database/schema')>
>;
