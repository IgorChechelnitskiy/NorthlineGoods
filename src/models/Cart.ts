import { Schema, Types, model } from 'mongoose';

export type CartLineDocument = {
  product: Types.ObjectId;
  quantity: number;
};

export type CartDocument = {
  items: CartLineDocument[];
};

const cartLineSchema = new Schema<CartLineDocument>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  {
    _id: false,
  },
);

const cartSchema = new Schema<CartDocument>(
  {
    items: {
      type: [cartLineSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const CartModel = model<CartDocument>('Cart', cartSchema);
