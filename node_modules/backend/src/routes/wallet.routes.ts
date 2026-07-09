import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { walletService } from '../services/wallet.service';
import { createWalletSchema, updateWalletSchema } from '../validators/wallet.validator';
import { ApiResponse } from '../utils/api-response';

const router = Router();

router.use(authMiddleware);

// GET /api/wallets
router.get('/', async (req, res, next) => {
  try {
    const wallets = await walletService.listByUser(req.user!.id);
    ApiResponse.success(res, wallets);
  } catch (error) {
    next(error);
  }
});

// GET /api/wallets/:id
router.get('/:id', async (req, res, next) => {
  try {
    const wallet = await walletService.getById(req.params.id, req.user!.id);
    ApiResponse.success(res, wallet);
  } catch (error) {
    next(error);
  }
});

// POST /api/wallets
router.post('/', async (req, res, next) => {
  try {
    const data = createWalletSchema.parse(req.body);
    const wallet = await walletService.create(req.user!.id, data);
    ApiResponse.created(res, wallet);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/wallets/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const data = updateWalletSchema.parse(req.body);
    const wallet = await walletService.update(req.params.id, req.user!.id, data);
    ApiResponse.success(res, wallet);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/wallets/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await walletService.delete(req.params.id, req.user!.id);
    ApiResponse.noContent(res);
  } catch (error) {
    next(error);
  }
});

export default router;
