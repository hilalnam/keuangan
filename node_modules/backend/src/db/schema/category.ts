import { pgTable, uuid, text, varchar, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const category = pgTable('category', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 50 }).notNull(),
  icon: varchar('icon', { length: 50 }).notNull().default('category'),
  color: varchar('color', { length: 20 }).notNull().default('#94a3b8'),
  type: varchar('type', { length: 20 }).notNull(), // 'income' | 'expense' | 'transfer'
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ([
  index('category_user_id_idx').on(table.userId),
  index('category_type_idx').on(table.type),
]));
