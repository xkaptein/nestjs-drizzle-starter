import {
  databaseTimestampsz,
  primaryKeyTable,
  table,
} from '@/shared/utils/database.utils';
import { relations } from 'drizzle-orm';
import { permissionsSchema } from './permissions.schema';
import { usersSchema } from './users.schema';

export const rolesSchema = table.pgTable('roles', {
  ...primaryKeyTable,
  name: table.varchar('name').notNull(),
  ...databaseTimestampsz,
});

export const rolesRelation = relations(rolesSchema, ({ one, many }) => ({
  users: one(usersSchema, {
    fields: [rolesSchema.id],
    references: [usersSchema.roleId],
  }),
  permissions: many(permissionsSchema),
}));
