import { Logger } from '@nestjs/common';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { permissionsSeeder } from './permissions.seeder';
import { resourcesSeeder } from './resources.seeder';
import { usersSeeder } from './users-roles.seeder';

async function main() {
  const logger = new Logger('Seeder');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    logger.log('Seeding database...');
    await db.transaction(async (tx) => {
      await usersSeeder(tx);
      await resourcesSeeder(tx);
      await permissionsSeeder(tx);
    });
  } catch (error) {
    logger.error(error);
  } finally {
    await pool.end();
    logger.log(`Seeding completed.`);
    process.exit();
  }
}

void main();
