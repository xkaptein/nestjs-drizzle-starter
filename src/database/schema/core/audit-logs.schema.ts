import { primaryKeyTable, table } from '@/shared/utils/database.utils';
import { relations } from 'drizzle-orm';
import { users } from './users.schema';

export const auditLogs = table.pgTable('audit_logs', {
  ...primaryKeyTable,
  entityId: table.varchar('entity_id', { length: 32 }).notNull(),
  entityName: table.varchar('entity_name').notNull(),
  json: table.json('json').notNull(),
  checksum: table.text('checksum').notNull(),
  createdAt: table.timestamp('created_at', { withTimezone: true }).defaultNow(),
  createdBy: table
    .varchar('created_by', { length: 32 })
    .references(() => users.id)
    .notNull(),
});

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  performed: one(users, {
    fields: [auditLogs.createdBy],
    references: [users.id],
  }),
}));
