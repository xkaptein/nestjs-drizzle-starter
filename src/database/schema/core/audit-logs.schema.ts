import { primaryKeyTable, table } from '@/shared/utils/database.utils';
import { relations } from 'drizzle-orm';
import { usersSchema } from './users.schema';

export const auditLogsSchema = table.pgTable('audit_logs', {
  ...primaryKeyTable,
  entityId: table.varchar('entity_id', { length: 32 }).notNull(),
  entityName: table.varchar('entity_name').notNull(),
  json: table.json('json').notNull(),
  checksum: table.text('checksum').notNull(),
  createdAt: table.timestamp('created_at', { withTimezone: true }).defaultNow(),
  createdBy: table
    .varchar('created_by', { length: 32 })
    .references(() => usersSchema.id)
    .notNull(),
});

export const auditLogsRelation = relations(auditLogsSchema, ({ one }) => ({
  performed: one(usersSchema, {
    fields: [auditLogsSchema.createdBy],
    references: [usersSchema.id],
  }),
}));
