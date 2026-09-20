import {
  databaseTimestampsz,
  primaryKeyTable,
  table,
} from '@/shared/utils/database.utils';
import { relations } from 'drizzle-orm';
import { resourcesSchema } from './resources.schema';
import { rolesSchema } from './roles.schema';

export const permissionsSchema = table.pgTable('permissions', {
  ...primaryKeyTable,
  resourceId: table
    .varchar('resource_id', { length: 32 })
    .references(() => resourcesSchema.id)
    .notNull(),
  roleId: table
    .varchar('role_id', { length: 32 })
    .references(() => rolesSchema.id)
    .notNull(),
  allowedMethod: table.json('allowed_method').notNull(),
  ...databaseTimestampsz,
});

export const permissionsRelation = relations(permissionsSchema, ({ one }) => ({
  resource: one(resourcesSchema, {
    fields: [permissionsSchema.resourceId],
    references: [resourcesSchema.id],
  }),
  role: one(rolesSchema, {
    fields: [permissionsSchema.roleId],
    references: [rolesSchema.id],
  }),
}));
