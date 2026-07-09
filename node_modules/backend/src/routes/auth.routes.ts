import { Router } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../config/auth';

const router = Router();

// Mount Better Auth handler for all auth routes
router.all('/api/auth/*splat', toNodeHandler(auth));

export default router;
