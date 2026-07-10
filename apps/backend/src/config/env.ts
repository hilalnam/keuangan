import 'dotenv/config';

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  DATABASE_URL: getEnv('DATABASE_URL'),
  BETTER_AUTH_SECRET: getEnv('BETTER_AUTH_SECRET', 'dev-secret-change-me'),
  BETTER_AUTH_URL: getEnv('BETTER_AUTH_URL', 'http://localhost:3001'),
  FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:5173'),
  PORT: parseInt(getEnv('PORT', '3001'), 10),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  ALLOW_ANONYMOUS: getEnv('ALLOW_ANONYMOUS', 'true'),
  DEV_USER_ID: getEnv('DEV_USER_ID', 'dev-user'),
} as const;
