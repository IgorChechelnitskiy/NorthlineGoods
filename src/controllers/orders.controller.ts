import { NextFunction, Request, Response } from 'express';
import {
  checkoutCart,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from '../services/orders.service';

export async function createOrder(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    if (!request.user) {
      response.status(401).json({ message: 'Authentication required' });
      return;
    }

    const order = await checkoutCart(request.params.cartId, {
      userId: request.user.id,
      customer: request.body.customer,
    });

    if (!order) {
      response.status(404).json({ message: 'Cart not found' });
      return;
    }

    response.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

export async function listOrders(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    if (!request.user) {
      response.status(401).json({ message: 'Authentication required' });
      return;
    }

    const orders = await getOrders(request.user.id, request.user.role);
    response.json(orders);
  } catch (error) {
    next(error);
  }
}

export async function getOrder(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    if (!request.user) {
      response.status(401).json({ message: 'Authentication required' });
      return;
    }

    const order = await getOrderById(
      request.params.orderId,
      request.user.id,
      request.user.role,
    );

    if (!order) {
      response.status(404).json({ message: 'Order not found' });
      return;
    }

    response.json(order);
  } catch (error) {
    next(error);
  }
}

export async function changeOrderStatus(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const order = await updateOrderStatus(
      request.params.orderId,
      request.body.status,
    );

    if (!order) {
      response.status(404).json({ message: 'Order not found' });
      return;
    }

    response.json(order);
  } catch (error) {
    next(error);
  }
}

export async function removeOrder(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const order = await deleteOrder(request.params.orderId);

    if (!order) {
      response.status(404).json({ message: 'Order not found' });
      return;
    }

    response.status(204).send();
  } catch (error) {
    next(error);
  }
}
