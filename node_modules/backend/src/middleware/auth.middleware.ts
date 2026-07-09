import type { Request, Response, NextFunction } from 'express';
import { auth } from '../config/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { env } from '../config/env';

// Extend Express Request with user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
      };
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session) {
      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      };
      next();
      return;
    }

    if (env.ALLOW_ANONYMOUS === 'true') {
      req.user = {
        id: env.DEV_USER_ID,
        name: 'Developer',
        email: 'developer@localhost',
      };
      next();
      return;
    }

    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    });
  } catch {
    if (env.ALLOW_ANONYMOUS === 'true') {
      req.user = {
        id: env.DEV_USER_ID,
        name: 'Developer',
        email: 'developer@localhost',
      };
      next();
      return;
    }

    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid or expired session' },
    });
  }
}
