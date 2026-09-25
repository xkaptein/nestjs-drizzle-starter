import { POSTGRE_CONNECTION } from '@/common/const/config';
import * as schema from '@/database/schema';
import { EnvironmentService } from '@/shared/service/environment.service';
import { Provider } from '@nestjs/common';
import { seconds } from '@nestjs/throttler';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { drizzle, NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { PgTransaction, withReplicas } from 'drizzle-orm/pg-core';
import { Pool } from 'pg';

function createDbPool(primary: Pool, replica: Pool) {
  const primaryDb = drizzle(primary, { schema });
  const replicaDb = drizzle(replica, { schema });
  const db = withReplicas(primaryDb, [replicaDb]);
  return db;
}
export type DatabasePool = ReturnType<typeof createDbPool>;

export const PostgreProvider: Provider = {
  provide: POSTGRE_CONNECTION,
  inject: [EnvironmentService],
  useFactory: (env: EnvironmentService) => {
    const DB_PRIMARY = env.get<string>('DB_PRIMARY');
    const DB_REPLICA = env.get<string>('DB_REPLICA');

    const primaryPool = new Pool({
      connectionTimeoutMillis: seconds(5),
      connectionString: DB_PRIMARY,
    });
    const replicaPool = new Pool({
      connectionTimeoutMillis: seconds(5),
      connectionString: DB_REPLICA,
    });

    return createDbPool(primaryPool, replicaPool);
  },
};

// export type DatabasePool = ReturnType<typeof createConnectionPool>;

export type TableTransaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof import('@/database/schema'),
  ExtractTablesWithRelations<typeof import('@/database/schema')>
>;
