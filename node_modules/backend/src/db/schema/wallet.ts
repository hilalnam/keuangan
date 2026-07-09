import { pgTable, uuid, text, varchar, bigint, timestamp, index } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const wallet = pgTable('wallet', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  icon: varchar('icon', { length: 50 }).notNull().default('account_balance_wallet'),
  color: varchar('color', { length: 20 }).notNull().default('#2dd4bf'),
  initialBalance: bigint('initial_balance', { mode: 'number' }).notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ([
  index('wallet_user_id_idx').on(table.userId),
]));
