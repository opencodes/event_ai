import express, { Express } from 'express';
import cors from 'cors';
import { config } from '../config/index.js';
import { responseMiddleware } from './core/shared/middleware/response.js';
import { authRoutes } from './core/auth/index.js';
import { adminRoutes } from './core/admin/index.js';
import morgan from 'morgan';

const app: Express = express();

morgan.token('body', (req) => {
  return JSON.stringify((req as any).body);
});
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(responseMiddleware);
app.use(morgan('dev'));

app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);

export default app;
