import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import capsulesRouter from './routes/capsules.routes.js';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js';
import { subscribe as sseSubscribe } from './utils/sse.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/capsules', capsulesRouter);

// Server-Sent Events stream for unlock notifications
app.get('/api/events', sseSubscribe);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
