import { eq, and, sql, gte, lt, desc } from 'drizzle-orm';
import { db } from '../db';
import { wallet, transaction, category } from '../db/schema';
import { walletService } from './wallet.service';

export class DashboardService {
  async getDashboard(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Get wallets with balances
    const wallets = await walletService.listByUser(userId);
    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

    // Monthly income & expense
    const monthFilter = and(
      eq(transaction.userId, userId),
      gte(transaction.transactionDate, startOfMonth),
      lt(transaction.transactionDate, endOfMonth),
    );

    const [incomeResult, expenseResult] = await Promise.all([
      db
        .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
        .from(transaction)
        .where(and(monthFilter, eq(transaction.type, 'income'))),
      db
        .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
        .from(transaction)
        .where(and(monthFilter, eq(transaction.type, 'expense'))),
    ]);

    const monthlyIncome = Number(incomeResult[0].total);
    const monthlyExpense = Number(expenseResult[0].total);

    // Recent transactions (last 5) with category info
    const recentTransactions = await db
      .select({
        id: transaction.id,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        transactionDate: transaction.transactionDate,
        walletId: transaction.walletId,
        categoryIcon: category.icon,
        categoryColor: category.color,
        categoryName: category.name,
      })
      .from(transaction)
      .leftJoin(category, eq(transaction.categoryId, category.id))
      .where(eq(transaction.userId, userId))
      .orderBy(desc(transaction.transactionDate))
      .limit(5);

    // Map wallet names for recent transactions
    const walletMap = new Map(wallets.map((w) => [w.id, w.name]));

    return {
      totalBalance,
      monthlyChange: monthlyIncome - monthlyExpense,
      monthlyIncome,
      monthlyExpense,
      wallets: wallets.map((w) => ({
        id: w.id,
        name: w.name,
        icon: w.icon,
        color: w.color,
        balance: w.balance,
      })),
      recentTransactions: recentTransactions.map((tx) => ({
        id: tx.id,
        description: tx.description,
        amount: tx.type === 'expense' ? -tx.amount : tx.amount,
        type: tx.type,
        icon: tx.categoryIcon ?? 'receipt',
        color: tx.categoryColor ?? '#94a3b8',
        categoryName: tx.categoryName ?? 'Uncategorized',
        date: tx.transactionDate,
        walletName: walletMap.get(tx.walletId) ?? 'Unknown',
      })),
    };
  }
}

export const dashboardService = new DashboardService();
