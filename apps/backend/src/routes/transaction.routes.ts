import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { transactionService } from '../services/transaction.service';
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionFilterSchema,
} from '../validators/transaction.validator';
import { ApiResponse } from '../utils/api-response';

const router = Router();

router.use(authMiddleware);

// GET /api/transactions/summary
router.get('/summary', async (req, res, next) => {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();
    const summary = await transactionService.getMonthlySummary(req.user!.id, month, year);
    ApiResponse.success(res, summary);
  } catch (error) {
    next(error);
  }
});

// GET /api/transactions
router.get('/', async (req, res, next) => {
  try {
    const filters = transactionFilterSchema.parse(req.query);
    const result = await transactionService.list(req.user!.id, filters);
    ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
});

// GET /api/transactions/:id
router.get('/:id', async (req, res, next) => {
  try {
    const tx = await transactionService.getById(req.params.id, req.user!.id);
    ApiResponse.success(res, tx);
  } catch (error) {
    next(error);
  }
});

// POST /api/transactions
router.post('/', async (req, res, next) => {
  try {
    const data = createTransactionSchema.parse(req.body);
    const tx = await transactionService.create(req.user!.id, data);
    ApiResponse.created(res, tx);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/transactions/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const data = updateTransactionSchema.parse(req.body);
    const tx = await transactionService.update(req.params.id, req.user!.id, data);
    ApiResponse.success(res, tx);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await transactionService.delete(req.params.id, req.user!.id);
    ApiResponse.noContent(res);
  } catch (error) {
    next(error);
  }
});

export default router;
