import { NextFunction, Request, Response } from 'express';
import {
  addProductToCart,
  clearCart,
  createCart,
  deleteCart,
  getCartById,
  updateCartItemQuantity,
} from '../services/carts.service';

export async function openCart(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const cart = await createCart();
    response.status(201).json(cart);
  } catch (error) {
    next(error);
  }
}

export async function getCart(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const cart = await getCartById(request.params.cartId);

    if (!cart) {
      response.status(404).json({ message: 'Cart not found' });
      return;
    }

    response.json(cart);
  } catch (error) {
    next(error);
  }
}

export async function addCartItem(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const cart = await addProductToCart(
      request.params.cartId,
      request.body.productId,
      request.body.quantity,
    );

    if (!cart) {
      response.status(404).json({ message: 'Cart not found' });
      return;
    }

    response.json(cart);
  } catch (error) {
    next(error);
  }
}

export async function updateCartItem(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const cart = await updateCartItemQuantity(
      request.params.cartId,
      request.params.productId,
      request.body.quantity,
    );

    if (!cart) {
      response.status(404).json({ message: 'Cart not found' });
      return;
    }

    response.json(cart);
  } catch (error) {
    next(error);
  }
}

export async function removeCartItem(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const cart = await updateCartItemQuantity(
      request.params.cartId,
      request.params.productId,
      0,
    );

    if (!cart) {
      response.status(404).json({ message: 'Cart not found' });
      return;
    }

    response.json(cart);
  } catch (error) {
    next(error);
  }
}

export async function emptyCart(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const cart = await clearCart(request.params.cartId);

    if (!cart) {
      response.status(404).json({ message: 'Cart not found' });
      return;
    }

    response.json(cart);
  } catch (error) {
    next(error);
  }
}

export async function removeCart(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const cart = await deleteCart(request.params.cartId);

    if (!cart) {
      response.status(404).json({ message: 'Cart not found' });
      return;
    }

    response.status(204).send();
  } catch (error) {
    next(error);
  }
}
