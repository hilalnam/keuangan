import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorMiddleware } from './middleware/error.middleware';
import { env } from './config/env';

export function createApp() {
  const app = express();

  // Global middleware
  app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Routes
  app.use(routes);

  // Error handler (must be last)
  app.use(errorMiddleware);

  return app;
}
