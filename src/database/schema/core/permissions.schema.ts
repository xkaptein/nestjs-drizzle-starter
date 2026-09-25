import {
  databaseTimestampsz,
  primaryKeyTable,
  table,
} from '@/shared/utils/database.utils';
import { relations } from 'drizzle-orm';
import { resources } from './resources.schema';
import { roles } from './roles.schema';

export const permissions = table.pgTable('permissions', {
  ...primaryKeyTable,
  resourceId: table
    .varchar('resource_id', { length: 32 })
    .references(() => resources.id)
    .notNull(),
  roleId: table
    .varchar('role_id', { length: 32 })
    .references(() => roles.id)
    .notNull(),
  allowedMethod: table.json('allowed_method').notNull(),
  ...databaseTimestampsz,
});

export const permissionsRelation = relations(permissions, ({ one }) => ({
  resource: one(resources, {
    fields: [permissions.resourceId],
    references: [resources.id],
  }),
  role: one(roles, {
    fields: [permissions.roleId],
    references: [roles.id],
  }),
}));
