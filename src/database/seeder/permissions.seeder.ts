import { TAuditLogs } from '@/app/core/audit-logs/audit-logs.type';
import { TPermissions } from '@/app/core/permissions/permissions.type';
import { emoji } from '@/common/const/emoji';
import { createChecksum } from '@/shared/utils/hash.utils';
import { Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { auditLogs, permissions } from '../schema';
import { resourceDataSeeder } from './resources.seeder';
import { rolesDataSeed, usersMockup } from './users-roles.seeder';

export async function permissionsSeeder(db: NodePgDatabase) {
  const logger = new Logger('PermissionsSeeder');
  logger.log(`${emoji.seed} Seeding permissions...`);
  const permissionsSystemDataSeed: TPermissions[] = resourceDataSeeder.map(
    (r) => ({
      allowedMethod: ['ALL'],
      resourceId: r.id,
      roleId: rolesDataSeed[0].id,
    }),
  );
  const permissionsAdminDataSeed: TPermissions[] = resourceDataSeeder.map(
    (r) => ({
      allowedMethod: ['ALL'],
      resourceId: r.id,
      roleId: rolesDataSeed[0].id,
    }),
  );
  const system = await db
    .insert(permissions)
    .values(permissionsSystemDataSeed)
    .returning();
  const admin = await db
    .insert(permissions)
    .values(permissionsAdminDataSeed)
    .returning();

  // data audit logs
  const systemAuditLogs: TAuditLogs[] = system.map((s) => {
    const json = JSON.stringify(s);
    const checksum = createChecksum(json);
    return {
      actionType: 'Create',
      entityId: s.id,
      entityName: 'permissions',
      json,
      checksum,
      createdBy: usersMockup[0].id,
    };
  });
  const adminAuditLogs: TAuditLogs[] = admin.map((s) => {
    const json = JSON.stringify(s);
    const checksum = createChecksum(json);
    return {
      actionType: 'Create',
      entityId: s.id,
      entityName: 'permissions',
      json,
      checksum,
      createdBy: usersMockup[1].id,
    };
  });
  await db.insert(auditLogs).values(systemAuditLogs).returning();
  await db.insert(auditLogs).values(adminAuditLogs).returning();
  logger.log(`${emoji.check} Seeding permissions complete.`);
}
