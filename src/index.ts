import cors from 'cors';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { env } from './config/env';
import { connectToDatabase, getDatabaseStatus } from './db/mongoose';
import { HttpError } from './errors/httpError';
import { authenticate } from './middleware/auth';
import { authRouter } from './routes/auth';
import { cartsRouter } from './routes/carts';
import { ordersRouter } from './routes/orders';
import { productsRouter } from './routes/products';
import { seedAuthUsersIfMissing } from './services/auth.service';
import { seedProductsIfEmpty } from './services/products.service';

const app = express();
const clientDistPath = path.resolve(process.cwd(), 'dist/client');
const clientIndexPath = path.join(clientDistPath, 'index.html');

app.use(cors());
app.use(express.json());
app.use(authenticate);

app.get('/api/health', (_request, response) => {
  response.json({
    ok: true,
    service: 'northlinegoods-api',
    database: getDatabaseStatus(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/orders', ordersRouter);

app.use(
  (
    error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(error);
    if (error instanceof HttpError) {
      response.status(error.statusCode).json({ message: error.message });
      return;
    }

    if (error instanceof mongoose.Error.ValidationError) {
      response.status(400).json({ message: error.message });
      return;
    }

    response.status(500).json({ message: 'Internal server error' });
  },
);

if (fs.existsSync(clientIndexPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (_request, response) => {
    response.sendFile(clientIndexPath);
  });
}

async function startServer() {
  try {
    await connectToDatabase();
    await seedAuthUsersIfMissing();
    await seedProductsIfEmpty();

    app.listen(env.port, () => {
      console.log(`API server listening on http://127.0.0.1:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

void startServer();
