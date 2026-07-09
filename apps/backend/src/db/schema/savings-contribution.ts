import { pgTable, uuid, bigint, text, timestamp, index } from 'drizzle-orm/pg-core';
import { savingsGoal } from './savings-goal';
import { transaction } from './transaction';
import { wallet } from './wallet';

export const savingsContribution = pgTable('savings_contribution', {
  id: uuid('id').primaryKey().defaultRandom(),
  savingsGoalId: uuid('savings_goal_id').notNull().references(() => savingsGoal.id, { onDelete: 'cascade' }),
  transactionId: uuid('transaction_id').notNull().references(() => transaction.id, { onDelete: 'cascade' }),
  walletId: uuid('wallet_id').notNull().references(() => wallet.id, { onDelete: 'restrict' }),
  amount: bigint('amount', { mode: 'number' }).notNull(),
  notes: text('notes'),
  contributedAt: timestamp('contributed_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ([
  index('savings_contribution_goal_idx').on(table.savingsGoalId),
  index('savings_contribution_transaction_idx').on(table.transactionId),
]));
