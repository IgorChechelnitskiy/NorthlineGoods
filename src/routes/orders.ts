import { Router } from 'express';
import {
  changeOrderStatus,
  getOrder,
  listOrders,
  removeOrder,
} from '../controllers/orders.controller';
import { requireRole } from '../middleware/auth';

export const ordersRouter = Router();

ordersRouter.get('/', requireRole(['user', 'admin']), listOrders);
ordersRouter.get('/:orderId', requireRole(['user', 'admin']), getOrder);
ordersRouter.patch('/:orderId/status', requireRole(['admin']), changeOrderStatus);
ordersRouter.delete('/:orderId', requireRole(['admin']), removeOrder);
