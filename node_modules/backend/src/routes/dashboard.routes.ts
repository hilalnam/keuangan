import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { dashboardService } from '../services/dashboard.service';
import { ApiResponse } from '../utils/api-response';

const router = Router();

router.use(authMiddleware);

// GET /api/dashboard
router.get('/', async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboard(req.user!.id);
    ApiResponse.success(res, data);
  } catch (error) {
    next(error);
  }
});

export default router;
