import { eq, and, sql } from 'drizzle-orm';
import { db } from '../db';
import { wallet, transaction } from '../db/schema';
import { AppError } from '../middleware/error.middleware';
import type { CreateWalletInput, UpdateWalletInput } from '../validators/wallet.validator';

export class WalletService {
  async listByUser(userId: string) {
    const wallets = await db.query.wallet.findMany({
      where: eq(wallet.userId, userId),
      orderBy: (wallet, { asc }) => [asc(wallet.createdAt)],
    });

    // Compute balance for each wallet
    const walletsWithBalance = await Promise.all(
      wallets.map(async (w) => ({
        ...w,
        balance: await this.computeBalance(w.id, w.initialBalance),
      })),
    );

    return walletsWithBalance;
  }

  async getById(id: string, userId: string) {
    const w = await db.query.wallet.findFirst({
      where: and(eq(wallet.id, id), eq(wallet.userId, userId)),
    });

    if (!w) {
      throw new AppError(404, 'NOT_FOUND', 'Wallet not found');
    }

    return {
      ...w,
      balance: await this.computeBalance(w.id, w.initialBalance),
    };
  }

  async create(userId: string, data: CreateWalletInput) {
    const [created] = await db
      .insert(wallet)
      .values({ ...data, userId })
      .returning();

    return { ...created, balance: created.initialBalance };
  }

  async update(id: string, userId: string, data: UpdateWalletInput) {
    const existing = await db.query.wallet.findFirst({
      where: and(eq(wallet.id, id), eq(wallet.userId, userId)),
    });

    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', 'Wallet not found');
    }

    const [updated] = await db
      .update(wallet)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(wallet.id, id))
      .returning();

    return {
      ...updated,
      balance: await this.computeBalance(updated.id, updated.initialBalance),
    };
  }

  async delete(id: string, userId: string) {
    const existing = await db.query.wallet.findFirst({
      where: and(eq(wallet.id, id), eq(wallet.userId, userId)),
    });

    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', 'Wallet not found');
    }

    // Check if wallet has transactions
    const txCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(transaction)
      .where(eq(transaction.walletId, id));

    if (txCount[0].count > 0) {
      throw new AppError(
        409,
        'CONFLICT',
        'Cannot delete wallet with existing transactions. Delete transactions first.',
      );
    }

    await db.delete(wallet).where(eq(wallet.id, id));
  }

  async computeBalance(walletId: string, initialBalance: number): Promise<number> {
    // Income to this wallet
    const incomeResult = await db
      .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
      .from(transaction)
      .where(and(eq(transaction.walletId, walletId), eq(transaction.type, 'income')));

    // Expense from this wallet
    const expenseResult = await db
      .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
      .from(transaction)
      .where(and(eq(transaction.walletId, walletId), eq(transaction.type, 'expense')));

    // Transfer out from this wallet
    const transferOutResult = await db
      .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
      .from(transaction)
      .where(and(eq(transaction.walletId, walletId), eq(transaction.type, 'transfer')));

    // Transfer in to this wallet
    const transferInResult = await db
      .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
      .from(transaction)
      .where(and(eq(transaction.destinationWalletId, walletId), eq(transaction.type, 'transfer')));

    return (
      initialBalance +
      Number(incomeResult[0].total) -
      Number(expenseResult[0].total) -
      Number(transferOutResult[0].total) +
      Number(transferInResult[0].total)
    );
  }
}

export const walletService = new WalletService();
