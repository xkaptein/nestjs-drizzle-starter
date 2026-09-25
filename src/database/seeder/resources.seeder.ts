import { TAuditLogs } from '@/app/core/audit-logs/audit-logs.type';
import { emoji } from '@/common/const/emoji';
import { createChecksum } from '@/shared/utils/hash.utils';
import { Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ulid } from 'ulid';
import { auditLogs, resources } from '../schema';
import { usersMockup } from './users-roles.seeder';

type TResourceSeeder = {
  id: string;
  name: string;
  resourceUrl: string;
};
const resourcesList = [
  'users',
  'roles',
  'resources',
  'permissions',
  'audit-logs',
];

export const resourceDataSeeder: TResourceSeeder[] = resourcesList
  .sort((a, b) => a.toLocaleLowerCase().localeCompare(b.toLowerCase()))
  .map((r) => ({
    id: ulid(),
    name: r,
    resourceUrl: `/${r.toLowerCase()}`,
  }));

export async function resourcesSeeder(db: NodePgDatabase) {
  const logger = new Logger('ResourceSeeder');
  logger.log(`${emoji.seed} Seeding resources...`);
  const result = await db
    .insert(resources)
    .values(resourceDataSeeder)
    .returning();

  const dataAuditLogs: TAuditLogs[] = result.map((r) => {
    const json = JSON.stringify(r);
    const checksum = createChecksum(json);
    return {
      actionType: 'Create',
      entityId: r.id,
      entityName: 'resources',
      checksum,
      json,
      createdBy: usersMockup[0].id,
    };
  });
  await db.insert(auditLogs).values(dataAuditLogs).returning();
  logger.log(
    `${emoji.check} Seeding resources complete. Total ${result.length}`,
  );
}
