import {
  databaseTimestampsz,
  primaryKeyTable,
  table,
} from '@/shared/utils/database.utils';
import { relations } from 'drizzle-orm';
import { auditLogs } from './audit-logs.schema';
import { roles } from './roles.schema';

export const users = table.pgTable('users', {
  ...primaryKeyTable,
  firstName: table.varchar('first_name').notNull(),
  lastName: table.varchar('last_name').notNull(),
  email: table.varchar('email').unique().notNull(),
  password: table.varchar('password').notNull(),
  roleId: table
    .varchar('role_id', { length: 32 })
    .references(() => roles.id)
    .notNull(),
  ...databaseTimestampsz,
});

export const userRelations = relations(users, ({ many, one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  logs: many(auditLogs),
}));
