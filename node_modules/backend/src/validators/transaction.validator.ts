import { z } from 'zod';

export const createTransactionSchema = z.object({
  walletId: z.string().uuid(),
  destinationWalletId: z.string().uuid().optional(),
  savingsGoalId: z.string().uuid().optional(),
  categoryId: z.string().uuid(),
  type: z.enum(['income', 'expense', 'transfer']),
  amount: z.number().int().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required').max(200),
  notes: z.string().max(500).optional(),
  transactionDate: z.string().datetime(),
}).refine(
  (data) => {
    if (data.type === 'transfer') {
      return data.destinationWalletId || data.savingsGoalId;
    }
    return true;
  },
  { message: 'Transfer transactions require a destinationWalletId or savingsGoalId' },
);

export const updateTransactionSchema = z.object({
  walletId: z.string().uuid().optional(),
  destinationWalletId: z.string().uuid().nullable().optional(),
  categoryId: z.string().uuid().optional(),
  type: z.enum(['income', 'expense', 'transfer']).optional(),
  amount: z.number().int().positive().optional(),
  description: z.string().min(1).max(200).optional(),
  notes: z.string().max(500).nullable().optional(),
  transactionDate: z.string().datetime().optional(),
});

export const transactionFilterSchema = z.object({
  walletId: z.string().uuid().optional(),
  type: z.enum(['income', 'expense', 'transfer']).optional(),
  categoryId: z.string().uuid().optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionFilters = z.infer<typeof transactionFilterSchema>;
