import { z } from 'zod';

export const createSavingsGoalSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  icon: z.string().max(50).default('savings'),
  color: z.string().max(20).default('#2dd4bf'),
  targetAmount: z.number().int().positive('Target amount must be positive'),
  targetDate: z.string().datetime().optional(),
});

export const updateSavingsGoalSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  icon: z.string().max(50).optional(),
  color: z.string().max(20).optional(),
  targetAmount: z.number().int().positive().optional(),
  targetDate: z.string().datetime().nullable().optional(),
});

export const contributionSchema = z.object({
  amount: z.number().int().positive('Amount must be positive'),
  walletId: z.string().uuid('Valid wallet ID is required'),
  notes: z.string().max(500).optional(),
});

export type CreateSavingsGoalInput = z.infer<typeof createSavingsGoalSchema>;
export type UpdateSavingsGoalInput = z.infer<typeof updateSavingsGoalSchema>;
export type ContributionInput = z.infer<typeof contributionSchema>;
