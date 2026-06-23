import { Router } from 'express';
import {
  addProduct,
  editProduct,
  getProduct,
  listProducts,
  removeProduct,
} from '../controllers/products.controller';
import { requireRole } from '../middleware/auth';

export const productsRouter = Router();

productsRouter.get('/', listProducts);
productsRouter.get('/:productId', getProduct);
productsRouter.post('/', requireRole(['admin']), addProduct);
productsRouter.patch('/:productId', requireRole(['admin']), editProduct);
productsRouter.delete('/:productId', requireRole(['admin']), removeProduct);
