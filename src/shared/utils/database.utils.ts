import * as table from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';

export const databaseTimestampsz = {
  createdAt: table.timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: table.timestamp('updated_at', { withTimezone: true }),
  deletedAt: table.timestamp('deleted_at', { withTimezone: true }),
};

export const primaryKeyTable = {
  id: table
    .varchar('id', { length: 32 })
    .primaryKey()
    .$default(() => ulid()),
};

export { table };
