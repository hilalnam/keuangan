import 'dotenv/config';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { category, wallet, transaction } from './schema';

const DEFAULT_CATEGORIES = [
  // Expense categories
  { name: 'Makanan', icon: 'restaurant', color: '#ef4444', type: 'expense', isDefault: true },
  { name: 'Minuman', icon: 'local_cafe', color: '#f97316', type: 'expense', isDefault: true },
  { name: 'Transportasi', icon: 'directions_car', color: '#3b82f6', type: 'expense', isDefault: true },
  { name: 'Belanja', icon: 'shopping_bag', color: '#ec4899', type: 'expense', isDefault: true },
  { name: 'Hiburan', icon: 'movie', color: '#8b5cf6', type: 'expense', isDefault: true },
  { name: 'Tagihan', icon: 'receipt_long', color: '#f59e0b', type: 'expense', isDefault: true },
  { name: 'Kesehatan', icon: 'medical_services', color: '#10b981', type: 'expense', isDefault: true },
  { name: 'Pendidikan', icon: 'school', color: '#6366f1', type: 'expense', isDefault: true },
  { name: 'Lainnya', icon: 'more_horiz', color: '#94a3b8', type: 'expense', isDefault: true },

  // Income categories
  { name: 'Gaji', icon: 'payments', color: '#14b8a6', type: 'income', isDefault: true },
  { name: 'Freelance', icon: 'work', color: '#06b6d4', type: 'income', isDefault: true },
  { name: 'Investasi', icon: 'trending_up', color: '#22c55e', type: 'income', isDefault: true },
  { name: 'Hadiah', icon: 'redeem', color: '#a855f7', type: 'income', isDefault: true },
  { name: 'Lainnya', icon: 'more_horiz', color: '#94a3b8', type: 'income', isDefault: true },

  // Transfer categories
  { name: 'Transfer', icon: 'swap_horiz', color: '#64748b', type: 'transfer', isDefault: true },
  { name: 'Tabungan', icon: 'savings', color: '#2dd4bf', type: 'transfer', isDefault: true },
] as const;

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }

  const client = postgres(connectionString);
  const db = drizzle(client);
  const userId = process.env.DEV_USER_ID || 'dev-user';

  console.log('🌱 Seeding default categories...');

  for (const cat of DEFAULT_CATEGORIES) {
    await db
      .insert(category)
      .values({
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        type: cat.type,
        isDefault: cat.isDefault,
        userId: null,
      })
      .onConflictDoNothing();
  }

  const existingWallets = await db.select().from(wallet).where(eq(wallet.userId, userId));
  if (existingWallets.length === 0) {
    const [mainWallet] = await db.insert(wallet).values({
      userId,
      name: 'Dompet Utama',
      icon: 'account_balance_wallet',
      color: '#2dd4bf',
      initialBalance: 5000000,
    }).returning();

    const [cashWallet] = await db.insert(wallet).values({
      userId,
      name: 'Cash',
      icon: 'wallet',
      color: '#f59e0b',
      initialBalance: 750000,
    }).returning();

    const expenseCategory = (await db.select().from(category).where(and(eq(category.type, 'expense'), eq(category.isDefault, true), eq(category.name, 'Makanan')))).at(0);
    const incomeCategory = (await db.select().from(category).where(and(eq(category.type, 'income'), eq(category.isDefault, true), eq(category.name, 'Gaji')))).at(0);
    const transferCategory = (await db.select().from(category).where(and(eq(category.type, 'transfer'), eq(category.isDefault, true), eq(category.name, 'Transfer')))).at(0);

    if (mainWallet && expenseCategory && incomeCategory && transferCategory) {
      await db.insert(transaction).values([
        {
          userId,
          walletId: mainWallet.id,
          categoryId: expenseCategory.id,
          type: 'expense',
          amount: 25000,
          description: 'Makan Siang',
          transactionDate: new Date('2026-07-10T12:30:00Z'),
        },
        {
          userId,
          walletId: mainWallet.id,
          categoryId: incomeCategory.id,
          type: 'income',
          amount: 3000000,
          description: 'Gaji Bulanan',
          transactionDate: new Date('2026-07-01T10:00:00Z'),
        },
        {
          userId,
          walletId: mainWallet.id,
          categoryId: transferCategory.id,
          type: 'transfer',
          amount: 1000000,
          description: 'Transfer ke Cash',
          destinationWalletId: cashWallet.id,
          transactionDate: new Date('2026-07-03T09:00:00Z'),
        },
      ]);
    }
  }

  console.log(`✅ Seeded ${DEFAULT_CATEGORIES.length} default categories and demo data`);
  await client.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
