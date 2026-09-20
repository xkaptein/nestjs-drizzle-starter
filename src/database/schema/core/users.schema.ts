import {
  databaseTimestampsz,
  primaryKeyTable,
  table,
} from '@/shared/utils/database.utils';
import { relations } from 'drizzle-orm';
import { rolesSchema } from './roles.schema';
import { auditLogsSchema } from './audit-logs.schema';

export const usersSchema = table.pgTable('users', {
  ...primaryKeyTable,
  firstName: table.varchar('first_name').notNull(),
  lastName: table.varchar('last_name').notNull(),
  email: table.varchar('email').unique().notNull(),
  password: table.varchar('password').notNull(),
  roleId: table
    .varchar('role_id', { length: 32 })
    .references(() => rolesSchema.id)
    .notNull(),
  ...databaseTimestampsz,
});

export const userRelations = relations(usersSchema, ({ many }) => ({
  role: many(rolesSchema),
  logs: many(auditLogsSchema),
}));
