import { POSTGRE_CONNECTION } from '@/common/const/config';
import * as schema from '@/database/schema';
import { EnvironmentService } from '@/shared/service/environment.service';
import { Provider } from '@nestjs/common';
import { seconds } from '@nestjs/throttler';
import chalk from 'chalk';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { drizzle, NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { Pool } from 'pg';
function createConnectionPool(pool: Pool, env: EnvironmentService) {
  const isDev = env.get('NODE_ENV') === 'development';
  return drizzle(pool, {
    schema,
    logger: isDev
      ? {
          logQuery(query, params) {
            console.log(
              chalk.blue('🔍 SQL:'),
              chalk.green(query),
              chalk.yellow('\nParams:'),
              chalk.rgb(254, 254, 0).bold(JSON.stringify(params)),
              `\n`,
            );
          },
        }
      : undefined,
  });
}

export const PostgreProvider: Provider = {
  provide: POSTGRE_CONNECTION,
  inject: [EnvironmentService],
  useFactory: (env: EnvironmentService) => {
    const DB_URL = env.get<string>('DATABASE_URL');
    const pool = new Pool({
      connectionString: DB_URL,
      connectionTimeoutMillis: seconds(5),
    });
    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
    });
    return createConnectionPool(pool, env);
  },
};

export type DatabasePool = ReturnType<typeof createConnectionPool>;

export type TableTransaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof import('@/database/schema'),
  ExtractTablesWithRelations<typeof import('@/database/schema')>
>;
