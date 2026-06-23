import { Router } from 'express';
import {
  addCartItem,
  emptyCart,
  getCart,
  openCart,
  removeCart,
  removeCartItem,
  updateCartItem,
} from '../controllers/carts.controller';
import { createOrder } from '../controllers/orders.controller';
import { requireRole } from '../middleware/auth';

export const cartsRouter = Router();

cartsRouter.use(requireRole(['user', 'admin']));

cartsRouter.post('/', openCart);
cartsRouter.get('/:cartId', getCart);
cartsRouter.delete('/:cartId', removeCart);
cartsRouter.delete('/:cartId/items', emptyCart);
cartsRouter.post('/:cartId/items', addCartItem);
cartsRouter.patch('/:cartId/items/:productId', updateCartItem);
cartsRouter.delete('/:cartId/items/:productId', removeCartItem);
cartsRouter.post('/:cartId/checkout', createOrder);
