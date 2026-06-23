import { Schema, model } from 'mongoose';

export type ProductDocument = {
  name: string;
  category: string;
  price: number;
  rating: number;
  color: string;
  image: string;
  description: string;
};

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true, min: 0, max: 5 },
    color: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  },
);

export const ProductModel = model<ProductDocument>('Product', productSchema);
