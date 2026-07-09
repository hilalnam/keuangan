import { pgTable, uuid, text, varchar, bigint, timestamp, index } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const savingsGoal = pgTable('savings_goal', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  icon: varchar('icon', { length: 50 }).notNull().default('savings'),
  color: varchar('color', { length: 20 }).notNull().default('#2dd4bf'),
  targetAmount: bigint('target_amount', { mode: 'number' }).notNull(),
  currentAmount: bigint('current_amount', { mode: 'number' }).notNull().default(0),
  targetDate: timestamp('target_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ([
  index('savings_goal_user_id_idx').on(table.userId),
]));
