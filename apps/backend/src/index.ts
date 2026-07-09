import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`🚀 DompetKu API server running on http://localhost:${env.PORT}`);
  console.log(`📋 Health check: http://localhost:${env.PORT}/health`);
  console.log(`🔐 Auth endpoint: http://localhost:${env.PORT}/api/auth`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
});
