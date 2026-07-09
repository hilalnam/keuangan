import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { savingsService } from '../services/savings.service';
import {
  createSavingsGoalSchema,
  updateSavingsGoalSchema,
  contributionSchema,
} from '../validators/savings.validator';
import { ApiResponse } from '../utils/api-response';

const router = Router();

router.use(authMiddleware);

// GET /api/savings
router.get('/', async (req, res, next) => {
  try {
    const goals = await savingsService.listByUser(req.user!.id);
    ApiResponse.success(res, goals);
  } catch (error) {
    next(error);
  }
});

// GET /api/savings/:id
router.get('/:id', async (req, res, next) => {
  try {
    const goal = await savingsService.getById(req.params.id, req.user!.id);
    ApiResponse.success(res, goal);
  } catch (error) {
    next(error);
  }
});

// POST /api/savings
router.post('/', async (req, res, next) => {
  try {
    const data = createSavingsGoalSchema.parse(req.body);
    const goal = await savingsService.create(req.user!.id, data);
    ApiResponse.created(res, goal);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/savings/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const data = updateSavingsGoalSchema.parse(req.body);
    const goal = await savingsService.update(req.params.id, req.user!.id, data);
    ApiResponse.success(res, goal);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/savings/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await savingsService.delete(req.params.id, req.user!.id);
    ApiResponse.noContent(res);
  } catch (error) {
    next(error);
  }
});

// POST /api/savings/:id/contribute
router.post('/:id/contribute', async (req, res, next) => {
  try {
    const data = contributionSchema.parse(req.body);
    const result = await savingsService.addContribution(req.params.id, req.user!.id, data);
    ApiResponse.created(res, result);
  } catch (error) {
    next(error);
  }
});

export default router;
