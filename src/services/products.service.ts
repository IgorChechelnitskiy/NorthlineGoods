import { ProductDocument, ProductModel } from '../models/Product';
import { seedProducts } from '../data/seedProducts';
import { assertObjectId } from '../utils/objectId';

export type CreateProductInput = ProductDocument;

export async function getProducts() {
  return ProductModel.find().sort({ createdAt: -1 });
}

export async function getProductById(productId: string) {
  assertObjectId(productId, 'productId');
  return ProductModel.findById(productId);
}

export async function createProduct(input: CreateProductInput) {
  return ProductModel.create(input);
}

export async function updateProduct(
  productId: string,
  input: Partial<CreateProductInput>,
) {
  assertObjectId(productId, 'productId');
  return ProductModel.findByIdAndUpdate(productId, input, {
    new: true,
    runValidators: true,
  });
}

export async function deleteProduct(productId: string) {
  assertObjectId(productId, 'productId');
  return ProductModel.findByIdAndDelete(productId);
}

export async function seedProductsIfEmpty() {
  const productCount = await ProductModel.estimatedDocumentCount();

  if (productCount > 0) {
    return;
  }

  await ProductModel.insertMany(seedProducts);
}
