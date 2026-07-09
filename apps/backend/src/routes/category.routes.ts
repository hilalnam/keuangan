import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { categoryService } from '../services/category.service';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';
import { ApiResponse } from '../utils/api-response';

const router = Router();

router.use(authMiddleware);

// GET /api/categories
router.get('/', async (req, res, next) => {
  try {
    const type = req.query.type as string | undefined;
    const categories = await categoryService.listForUser(req.user!.id, type);
    ApiResponse.success(res, categories);
  } catch (error) {
    next(error);
  }
});

// POST /api/categories
router.post('/', async (req, res, next) => {
  try {
    const data = createCategorySchema.parse(req.body);
    const cat = await categoryService.create(req.user!.id, data);
    ApiResponse.created(res, cat);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/categories/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const data = updateCategorySchema.parse(req.body);
    const cat = await categoryService.update(req.params.id, req.user!.id, data);
    ApiResponse.success(res, cat);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await categoryService.delete(req.params.id, req.user!.id);
    ApiResponse.noContent(res);
  } catch (error) {
    next(error);
  }
});

export default router;
