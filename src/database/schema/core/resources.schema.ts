import {
  databaseTimestampsz,
  primaryKeyTable,
  table,
} from '@/shared/utils/database.utils';
import { relations } from 'drizzle-orm';
import { permissions } from './permissions.schema';

export const resources = table.pgTable('resources', {
  ...primaryKeyTable,
  name: table.varchar('name').notNull(),
  resourceUrl: table.varchar('resource_url').notNull(),
  ...databaseTimestampsz,
});

export const resourcesRelations = relations(resources, ({ many }) => ({
  permissions: many(permissions),
}));
