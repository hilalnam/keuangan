import { eq, and, sql, desc, gte, lt, ilike, or } from 'drizzle-orm';
import { db } from '../db';
import { transaction, wallet, category } from '../db/schema';
import { AppError } from '../middleware/error.middleware';
import {
  type CreateTransactionInput,
  type UpdateTransactionInput,
  type TransactionFilters,
} from '../validators/transaction.validator';
import { getOffset, buildPaginatedResult, type PaginatedResult } from '../utils/pagination';

type TransactionRow = typeof transaction.$inferSelect;

export class TransactionService {
  async list(
    userId: string,
    filters: TransactionFilters,
  ): Promise<PaginatedResult<TransactionRow>> {
    const conditions = [eq(transaction.userId, userId)];

    if (filters.walletId) {
      conditions.push(
        or(
          eq(transaction.walletId, filters.walletId),
          eq(transaction.destinationWalletId, filters.walletId),
        )!,
      );
    }
    if (filters.type) {
      conditions.push(eq(transaction.type, filters.type));
    }
    if (filters.categoryId) {
      conditions.push(eq(transaction.categoryId, filters.categoryId));
    }
    if (filters.month && filters.year) {
      const startDate = new Date(filters.year, filters.month - 1, 1);
      const endDate = new Date(filters.year, filters.month, 1);
      conditions.push(gte(transaction.transactionDate, startDate));
      conditions.push(lt(transaction.transactionDate, endDate));
    } else if (filters.year) {
      const startDate = new Date(filters.year, 0, 1);
      const endDate = new Date(filters.year + 1, 0, 1);
      conditions.push(gte(transaction.transactionDate, startDate));
      conditions.push(lt(transaction.transactionDate, endDate));
    }
    if (filters.search) {
      conditions.push(ilike(transaction.description, `%${filters.search}%`));
    }

    const whereClause = and(...conditions);
    const offset = getOffset({ page: filters.page, limit: filters.limit });

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(transaction)
        .where(whereClause)
        .orderBy(desc(transaction.transactionDate))
        .limit(filters.limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(transaction)
        .where(whereClause),
    ]);

    return buildPaginatedResult(
      data,
      Number(countResult[0].count),
      { page: filters.page, limit: filters.limit },
    );
  }

  async getById(id: string, userId: string) {
    const tx = await db.query.transaction.findFirst({
      where: and(eq(transaction.id, id), eq(transaction.userId, userId)),
    });

    if (!tx) {
      throw new AppError(404, 'NOT_FOUND', 'Transaction not found');
    }

    return tx;
  }

  async create(userId: string, data: CreateTransactionInput) {
    // Verify wallet belongs to user
    const w = await db.query.wallet.findFirst({
      where: and(eq(wallet.id, data.walletId), eq(wallet.userId, userId)),
    });
    if (!w) {
      throw new AppError(404, 'NOT_FOUND', 'Source wallet not found');
    }

    // Verify destination wallet if transfer
    if (data.destinationWalletId) {
      const destWallet = await db.query.wallet.findFirst({
        where: and(eq(wallet.id, data.destinationWalletId), eq(wallet.userId, userId)),
      });
      if (!destWallet) {
        throw new AppError(404, 'NOT_FOUND', 'Destination wallet not found');
      }
    }

    const [created] = await db
      .insert(transaction)
      .values({
        ...data,
        userId,
        transactionDate: new Date(data.transactionDate),
      })
      .returning();

    return created;
  }

  async update(id: string, userId: string, data: UpdateTransactionInput) {
    const existing = await db.query.transaction.findFirst({
      where: and(eq(transaction.id, id), eq(transaction.userId, userId)),
    });

    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', 'Transaction not found');
    }

    const updateData: Record<string, unknown> = { ...data, updatedAt: new Date() };
    if (data.transactionDate) {
      updateData.transactionDate = new Date(data.transactionDate);
    }

    const [updated] = await db
      .update(transaction)
      .set(updateData)
      .where(eq(transaction.id, id))
      .returning();

    return updated;
  }

  async delete(id: string, userId: string) {
    const existing = await db.query.transaction.findFirst({
      where: and(eq(transaction.id, id), eq(transaction.userId, userId)),
    });

    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', 'Transaction not found');
    }

    await db.delete(transaction).where(eq(transaction.id, id));
  }

  async getMonthlySummary(userId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const dateFilter = and(
      eq(transaction.userId, userId),
      gte(transaction.transactionDate, startDate),
      lt(transaction.transactionDate, endDate),
    );

    const [incomeResult, expenseResult] = await Promise.all([
      db
        .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
        .from(transaction)
        .where(and(dateFilter, eq(transaction.type, 'income'))),
      db
        .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
        .from(transaction)
        .where(and(dateFilter, eq(transaction.type, 'expense'))),
    ]);

    const income = Number(incomeResult[0].total);
    const expense = Number(expenseResult[0].total);

    return {
      income,
      expense,
      net: income - expense,
      month,
      year,
    };
  }
}

export const transactionService = new TransactionService();
