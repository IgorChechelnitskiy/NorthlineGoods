import { Types } from 'mongoose';
import { HttpError } from '../errors/httpError';
import { CartModel } from '../models/Cart';
import { ProductDocument, ProductModel } from '../models/Product';

type PopulatedCartItem = {
  product: ProductDocument & { _id: Types.ObjectId };
  quantity: number;
};

type CartTotalsItem = {
  product: ProductDocument & { _id: Types.ObjectId };
  quantity: number;
  lineTotal: number;
};

export type CartSummary = {
  id: string;
  items: CartTotalsItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

export async function createCart() {
  const cart = await CartModel.create({ items: [] });
  return getCartById(cart.id);
}

export async function getCartById(cartId: string) {
  assertObjectId(cartId, 'cartId');

  const cart = await CartModel.findById(cartId).populate<{
    items: PopulatedCartItem[];
  }>('items.product');

  if (!cart) {
    return null;
  }

  const items = cart.items
    .filter((item) => item.product)
    .map((item) => ({
      product: item.product,
      quantity: item.quantity,
      lineTotal: item.product.price * item.quantity,
    }));

  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
  const shipping = calculateShipping(subtotal);

  return {
    id: cart.id,
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}

export async function addProductToCart(
  cartId: string,
  productId: string,
  quantity = 1,
) {
  assertObjectId(cartId, 'cartId');
  assertObjectId(productId, 'productId');
  assertPositiveQuantity(quantity);

  const [cart, product] = await Promise.all([
    CartModel.findById(cartId),
    ProductModel.findById(productId),
  ]);

  if (!cart) {
    return null;
  }

  if (!product) {
    throw new HttpError(404, 'Product not found');
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: new Types.ObjectId(productId),
      quantity,
    });
  }

  await cart.save();

  return getCartById(cartId);
}

export async function updateCartItemQuantity(
  cartId: string,
  productId: string,
  quantity: number,
) {
  assertObjectId(cartId, 'cartId');
  assertObjectId(productId, 'productId');
  assertNonNegativeQuantity(quantity);

  const cart = await CartModel.findById(cartId);

  if (!cart) {
    return null;
  }

  if (quantity === 0) {
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!existingItem) {
      const product = await ProductModel.exists({ _id: productId });

      if (!product) {
        throw new HttpError(404, 'Product not found');
      }

      cart.items.push({
        product: new Types.ObjectId(productId),
        quantity,
      });
    } else {
      existingItem.quantity = quantity;
    }
  }

  await cart.save();

  return getCartById(cartId);
}

export async function clearCart(cartId: string) {
  assertObjectId(cartId, 'cartId');

  const cart = await CartModel.findById(cartId);

  if (!cart) {
    return null;
  }

  cart.items = [];
  await cart.save();

  return getCartById(cartId);
}

export async function deleteCart(cartId: string) {
  assertObjectId(cartId, 'cartId');
  return CartModel.findByIdAndDelete(cartId);
}

export function calculateShipping(subtotal: number) {
  return subtotal > 0 && subtotal < 150 ? 12 : 0;
}

function assertObjectId(value: string, name: string) {
  if (!Types.ObjectId.isValid(value)) {
    throw new HttpError(400, `Invalid ${name}`);
  }
}

function assertPositiveQuantity(quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new HttpError(400, 'Quantity must be a positive integer');
  }
}

function assertNonNegativeQuantity(quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new HttpError(400, 'Quantity must be a non-negative integer');
  }
}
