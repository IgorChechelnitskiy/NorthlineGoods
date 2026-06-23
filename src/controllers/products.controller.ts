import { NextFunction, Request, Response } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../services/products.service';

export async function listProducts(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const products = await getProducts();
    response.json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const product = await getProductById(request.params.productId);

    if (!product) {
      response.status(404).json({ message: 'Product not found' });
      return;
    }

    response.json(product);
  } catch (error) {
    next(error);
  }
}

export async function addProduct(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const product = await createProduct(request.body);
    response.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function editProduct(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const product = await updateProduct(request.params.productId, request.body);

    if (!product) {
      response.status(404).json({ message: 'Product not found' });
      return;
    }

    response.json(product);
  } catch (error) {
    next(error);
  }
}

export async function removeProduct(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const product = await deleteProduct(request.params.productId);

    if (!product) {
      response.status(404).json({ message: 'Product not found' });
      return;
    }

    response.status(204).send();
  } catch (error) {
    next(error);
  }
}
