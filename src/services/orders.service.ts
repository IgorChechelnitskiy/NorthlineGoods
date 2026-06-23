import { HttpError } from '../errors/httpError';
import { OrderCustomerDocument, OrderDocument, OrderModel } from '../models/Order';
import { CartModel } from '../models/Cart';
import { CartSummary, deleteCart, getCartById } from './carts.service';
import { UserRole } from '../models/User';
import { assertObjectId } from '../utils/objectId';

export type CheckoutInput = {
  userId: string;
  customer: OrderCustomerDocument;
};

export async function checkoutCart(cartId: string, input: CheckoutInput) {
  const cart = await getCartById(cartId);

  if (!cart) {
    return null;
  }

  if (cart.items.length === 0) {
    throw new HttpError(400, 'Cannot checkout an empty cart');
  }

  const order = await createOrderFromCart(cart, input.userId, input.customer);
  await deleteCart(cartId);

  return order;
}

export async function getOrders(userId: string, role: UserRole) {
  const filter = role === 'admin' ? {} : { user: userId };

  return OrderModel.find(filter).populate('user', 'name email role').sort({
    createdAt: -1,
  });
}

export async function getOrderById(
  orderId: string,
  userId: string,
  role: UserRole,
) {
  assertObjectId(orderId, 'orderId');

  const order = await OrderModel.findById(orderId).populate(
    'user',
    'name email role',
  );

  if (!order) {
    return null;
  }

  if (role !== 'admin' && order.user.toString() !== userId) {
    throw new HttpError(403, 'Forbidden');
  }

  return order;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderDocument['status'],
) {
  assertObjectId(orderId, 'orderId');

  if (!['created', 'paid', 'cancelled'].includes(status)) {
    throw new HttpError(400, 'Invalid order status');
  }

  return OrderModel.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true },
  ).populate('user', 'name email role');
}

export async function deleteOrder(orderId: string) {
  assertObjectId(orderId, 'orderId');
  return OrderModel.findByIdAndDelete(orderId);
}

async function createOrderFromCart(
  cart: CartSummary,
  userId: string,
  customer: OrderCustomerDocument,
) {
  const cartExists = await CartModel.exists({ _id: cart.id });

  if (!cartExists) {
    return null;
  }

  return OrderModel.create({
    cart: cart.id,
    user: userId,
    customer,
    items: cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    })),
    subtotal: cart.subtotal,
    shipping: cart.shipping,
    total: cart.total,
  });
}
