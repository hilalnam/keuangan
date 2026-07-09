import { eq, and, or, isNull } from 'drizzle-orm';
import { db } from '../db';
import { category } from '../db/schema';
import { AppError } from '../middleware/error.middleware';
import type { CreateCategoryInput, UpdateCategoryInput } from '../validators/category.validator';

export class CategoryService {
  async listForUser(userId: string, type?: string) {
    const conditions = [or(eq(category.userId, userId), isNull(category.userId))];

    if (type) {
      conditions.push(eq(category.type, type));
    }

    return db.query.category.findMany({
      where: and(...conditions),
      orderBy: (category, { asc }) => [asc(category.name)],
    });
  }

  async create(userId: string, data: CreateCategoryInput) {
    const [created] = await db
      .insert(category)
      .values({ ...data, userId, isDefault: false })
      .returning();

    return created;
  }

  async update(id: string, userId: string, data: UpdateCategoryInput) {
    const existing = await db.query.category.findFirst({
      where: and(eq(category.id, id), eq(category.userId, userId)),
    });

    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', 'Category not found');
    }

    if (existing.isDefault && !existing.userId) {
      throw new AppError(403, 'FORBIDDEN', 'Cannot modify system default categories');
    }

    const [updated] = await db
      .update(category)
      .set(data)
      .where(eq(category.id, id))
      .returning();

    return updated;
  }

  async delete(id: string, userId: string) {
    const existing = await db.query.category.findFirst({
      where: and(eq(category.id, id), eq(category.userId, userId)),
    });

    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', 'Category not found');
    }

    if (existing.isDefault && !existing.userId) {
      throw new AppError(403, 'FORBIDDEN', 'Cannot delete system default categories');
    }

    await db.delete(category).where(eq(category.id, id));
  }
}

export const categoryService = new CategoryService();
