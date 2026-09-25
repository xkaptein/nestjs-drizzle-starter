import { TAuditLogs } from '@/app/core/audit-logs/audit-logs.type';
import { emoji } from '@/common/const/emoji';
import { argonHashConfig } from '@/config';
import { createChecksum } from '@/shared/utils/hash.utils';
import { Logger } from '@nestjs/common';
import { hash } from 'argon2';
import 'dotenv/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ulid } from 'ulid';
import { auditLogs, roles, users } from '../schema';

type TUserSeed = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: string;
};
type TRole = {
  id: string;
  name: string;
};
export const rolesDataSeed: TRole[] = [
  { id: ulid(), name: 'System' },
  { id: ulid(), name: 'Admin' },
  { id: ulid(), name: 'Guest' },
];
export const usersMockup = [
  {
    id: ulid(),
    firstName: 'System',
    lastName: '-',
    email: 'system@mail.com',
    roleId: rolesDataSeed[0].id,
  },
  {
    id: ulid(),
    firstName: 'Admin',
    lastName: 'Support',
    email: 'admin-support@mail.com',
    roleId: rolesDataSeed[1].id,
  },
  {
    id: ulid(),
    firstName: 'Guest',
    lastName: '-',
    email: 'guest@mail.com',
    roleId: rolesDataSeed[2].id,
  },
];

export async function usersSeeder(db: NodePgDatabase) {
  const logger = new Logger('UserSeeder');
  logger.log(`${emoji.seed} Seeding users...`);
  const password = process.env.DEFAULT_PASSWORD;
  if (!password) throw new Error('DEFAULT_PASSWORD is not configured in env');
  const hashPassword = await hash(password, argonHashConfig);

  const usersData: TUserSeed[] = usersMockup.map((user) => ({
    ...user,
    password: hashPassword,
  }));

  const newRoles = await db.insert(roles).values(rolesDataSeed).returning();
  const newUsers = await db.insert(users).values(usersData).returning();

  const rolesAuditLogs: TAuditLogs[] = newRoles.map((r) => {
    const json = JSON.stringify(r);
    const checksum = createChecksum(json);
    return {
      actionType: 'Create',
      entityId: r.id,
      entityName: 'roles',
      json,
      checksum,
      createdBy: usersMockup[0].id,
    };
  });

  const userAuditLogs: TAuditLogs[] = newUsers.map((user) => {
    const json = JSON.stringify(user);
    const checksum = createChecksum(json);
    return {
      actionType: 'Create',
      entityId: user.id,
      entityName: 'users',
      json,
      checksum,
      createdBy: usersData[0].id,
    };
  });

  await db.insert(auditLogs).values(rolesAuditLogs).returning();
  await db.insert(auditLogs).values(userAuditLogs).returning();

  logger.log(`${emoji.check} Seeding users complete. Total ${newUsers.length}`);
}
