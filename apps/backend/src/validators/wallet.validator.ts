import { z } from 'zod';

export const createWalletSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  icon: z.string().max(50).default('account_balance_wallet'),
  color: z.string().max(20).default('#2dd4bf'),
  initialBalance: z.number().int().min(0).default(0),
});

export const updateWalletSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  icon: z.string().max(50).optional(),
  color: z.string().max(20).optional(),
});

export type CreateWalletInput = z.infer<typeof createWalletSchema>;
export type UpdateWalletInput = z.infer<typeof updateWalletSchema>;
