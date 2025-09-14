import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import itemsRouter from './routes/items.routes.js';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Global middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// API routes
app.use('/api/items', itemsRouter);

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
