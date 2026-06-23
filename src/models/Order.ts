import { Schema, Types, model } from 'mongoose';

export type OrderCustomerDocument = {
  name: string;
  email: string;
  address: string;
  city: string;
};

export type OrderLineDocument = {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type OrderDocument = {
  cart: Types.ObjectId;
  user: Types.ObjectId;
  customer: OrderCustomerDocument;
  items: OrderLineDocument[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'created' | 'paid' | 'cancelled';
};

const orderCustomerSchema = new Schema<OrderCustomerDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
  },
  {
    _id: false,
  },
);

const orderLineSchema = new Schema<OrderLineDocument>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  {
    _id: false,
  },
);

const orderSchema = new Schema<OrderDocument>(
  {
    cart: {
      type: Schema.Types.ObjectId,
      ref: 'Cart',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customer: {
      type: orderCustomerSchema,
      required: true,
    },
    items: {
      type: [orderLineSchema],
      required: true,
      validate: {
        validator(items: OrderLineDocument[]) {
          return items.length > 0;
        },
        message: 'Order must include at least one item',
      },
    },
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['created', 'paid', 'cancelled'],
      default: 'created',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const OrderModel = model<OrderDocument>('Order', orderSchema);
