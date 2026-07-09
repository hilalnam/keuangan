import { pgTable, uuid, text, varchar, bigint, timestamp, index } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { wallet } from './wallet';
import { category } from './category';
import { savingsGoal } from './savings-goal';

export const transaction = pgTable('transaction', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  walletId: uuid('wallet_id').notNull().references(() => wallet.id, { onDelete: 'restrict' }),
  destinationWalletId: uuid('destination_wallet_id').references(() => wallet.id, { onDelete: 'restrict' }),
  savingsGoalId: uuid('savings_goal_id').references(() => savingsGoal.id, { onDelete: 'set null' }),
  categoryId: uuid('category_id').notNull().references(() => category.id, { onDelete: 'restrict' }),
  type: varchar('type', { length: 20 }).notNull(), // 'income' | 'expense' | 'transfer'
  amount: bigint('amount', { mode: 'number' }).notNull(),
  description: text('description').notNull(),
  notes: text('notes'),
  transactionDate: timestamp('transaction_date').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ([
  index('transaction_user_date_idx').on(table.userId, table.transactionDate),
  index('transaction_wallet_idx').on(table.walletId),
  index('transaction_category_idx').on(table.categoryId),
  index('transaction_savings_goal_idx').on(table.savingsGoalId),
]));
