import { eq, and, sql } from 'drizzle-orm';
import { db } from '../db';
import { savingsGoal, savingsContribution, transaction, wallet, category } from '../db/schema';
import { AppError } from '../middleware/error.middleware';
import type {
  CreateSavingsGoalInput,
  UpdateSavingsGoalInput,
  ContributionInput,
} from '../validators/savings.validator';

export class SavingsService {
  async listByUser(userId: string) {
    return db.query.savingsGoal.findMany({
      where: eq(savingsGoal.userId, userId),
      orderBy: (goal, { desc }) => [desc(goal.createdAt)],
    });
  }

  async getById(id: string, userId: string) {
    const goal = await db.query.savingsGoal.findFirst({
      where: and(eq(savingsGoal.id, id), eq(savingsGoal.userId, userId)),
    });

    if (!goal) {
      throw new AppError(404, 'NOT_FOUND', 'Savings goal not found');
    }

    // Get contribution history
    const contributions = await db.query.savingsContribution.findMany({
      where: eq(savingsContribution.savingsGoalId, id),
      orderBy: (c, { desc }) => [desc(c.contributedAt)],
    });

    return { ...goal, contributions };
  }

  async create(userId: string, data: CreateSavingsGoalInput) {
    const [created] = await db
      .insert(savingsGoal)
      .values({
        ...data,
        userId,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
      })
      .returning();

    return created;
  }

  async update(id: string, userId: string, data: UpdateSavingsGoalInput) {
    const existing = await db.query.savingsGoal.findFirst({
      where: and(eq(savingsGoal.id, id), eq(savingsGoal.userId, userId)),
    });

    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', 'Savings goal not found');
    }

    const updateData: Record<string, unknown> = { ...data, updatedAt: new Date() };
    if (data.targetDate !== undefined) {
      updateData.targetDate = data.targetDate ? new Date(data.targetDate) : null;
    }

    const [updated] = await db
      .update(savingsGoal)
      .set(updateData)
      .where(eq(savingsGoal.id, id))
      .returning();

    return updated;
  }

  async delete(id: string, userId: string) {
    const existing = await db.query.savingsGoal.findFirst({
      where: and(eq(savingsGoal.id, id), eq(savingsGoal.userId, userId)),
    });

    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', 'Savings goal not found');
    }

    await db.delete(savingsGoal).where(eq(savingsGoal.id, id));
  }

  async addContribution(goalId: string, userId: string, data: ContributionInput) {
    // Verify savings goal
    const goal = await db.query.savingsGoal.findFirst({
      where: and(eq(savingsGoal.id, goalId), eq(savingsGoal.userId, userId)),
    });

    if (!goal) {
      throw new AppError(404, 'NOT_FOUND', 'Savings goal not found');
    }

    // Verify source wallet
    const sourceWallet = await db.query.wallet.findFirst({
      where: and(eq(wallet.id, data.walletId), eq(wallet.userId, userId)),
    });

    if (!sourceWallet) {
      throw new AppError(404, 'NOT_FOUND', 'Source wallet not found');
    }

    // Find or create a 'Savings Transfer' category
    let transferCategory = await db.query.category.findFirst({
      where: and(
        eq(category.type, 'transfer'),
        eq(category.isDefault, true),
        eq(category.name, 'Tabungan'),
      ),
    });

    if (!transferCategory) {
      const [created] = await db
        .insert(category)
        .values({
          name: 'Tabungan',
          icon: 'savings',
          color: '#2dd4bf',
          type: 'transfer',
          isDefault: true,
        })
        .returning();
      transferCategory = created;
    }

    // Use a database transaction for atomicity
    return await db.transaction(async (tx) => {
      // 1. Create the transfer transaction (deducts from wallet)
      const [txRecord] = await tx
        .insert(transaction)
        .values({
          userId,
          walletId: data.walletId,
          savingsGoalId: goalId,
          categoryId: transferCategory.id,
          type: 'transfer',
          amount: data.amount,
          description: `Tabungan: ${goal.name}`,
          notes: data.notes ?? null,
          transactionDate: new Date(),
        })
        .returning();

      // 2. Create the savings contribution record
      const [contribution] = await tx
        .insert(savingsContribution)
        .values({
          savingsGoalId: goalId,
          transactionId: txRecord.id,
          walletId: data.walletId,
          amount: data.amount,
          notes: data.notes ?? null,
        })
        .returning();

      // 3. Update the savings goal's currentAmount
      await tx
        .update(savingsGoal)
        .set({
          currentAmount: sql`${savingsGoal.currentAmount} + ${data.amount}`,
          updatedAt: new Date(),
        })
        .where(eq(savingsGoal.id, goalId));

      return { transaction: txRecord, contribution };
    });
  }
}

export const savingsService = new SavingsService();
