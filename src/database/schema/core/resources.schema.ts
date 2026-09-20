import {
  databaseTimestampsz,
  primaryKeyTable,
  table,
} from '@/shared/utils/database.utils';
import { relations } from 'drizzle-orm';
import { permissionsSchema } from './permissions.schema';

export const resourcesSchema = table.pgTable('resources', {
  ...primaryKeyTable,
  name: table.varchar('name').notNull(),
  resourceUrl: table.varchar('resource_url').notNull(),
  ...databaseTimestampsz,
});

export const resourcesRelation = relations(resourcesSchema, ({ many }) => ({
  permissions: many(permissionsSchema),
}));
