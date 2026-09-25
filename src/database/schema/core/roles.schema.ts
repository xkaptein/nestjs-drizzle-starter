import {
  databaseTimestampsz,
  primaryKeyTable,
  table,
} from '@/shared/utils/database.utils';
import { relations } from 'drizzle-orm';
import { permissions } from './permissions.schema';
import { users } from './users.schema';

export const roles = table.pgTable('roles', {
  ...primaryKeyTable,
  name: table.varchar('name').notNull(),
  ...databaseTimestampsz,
});

export const rolesRelation = relations(roles, ({ many }) => ({
  user: many(users),
  permissions: many(permissions),
}));
