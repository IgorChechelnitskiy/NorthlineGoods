import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../components/Button';
import { FormMessage } from '../components/FormMessage';
import { Panel } from '../components/Panel';
import { ProductForm } from '../components/ProductForm';
import { ProductGrid } from '../components/ProductGrid';
import {
  createProduct,
  CreateProductInput,
  deleteProduct,
  getProducts,
  Product,
  updateProduct,
} from '../lib/api';

export function ProductsPage() {
  const { role } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  const isAdmin = role === 'admin';

  function startCreateProduct() {
    setEditingProduct(null);
    setIsFormOpen(true);
    setError('');
    setMessage('');
  }

  function startEditProduct(product: Product) {
    setEditingProduct(product);
    setIsFormOpen(true);
    setError('');
    setMessage('');
  }

  async function saveProduct(input: CreateProductInput) {
    const product = editingProduct
      ? await updateProduct(editingProduct.id, input)
      : await createProduct(input);

    setProducts((currentProducts) => {
      if (editingProduct) {
        return currentProducts.map((currentProduct) =>
          currentProduct.id === product.id ? product : currentProduct,
        );
      }

      return [product, ...currentProducts];
    });
    setIsFormOpen(false);
    setEditingProduct(null);
    setMessage(editingProduct ? 'Product updated' : 'Product added');
  }

  async function removeProduct(productId: string) {
    setError('');
    setMessage('');

    try {
      await deleteProduct(productId);
      const deletedEditingProduct = editingProduct?.id === productId;

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId),
      );

      if (deletedEditingProduct) {
        setEditingProduct(null);
        setIsFormOpen(false);
      }

      setMessage('Product deleted');
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Product could not be deleted',
      );
    }
  }

  return (
    <main className="page-layout">
      <div className="products-heading">
        <div className="section-heading">
          <p className="eyebrow">Catalog</p>
          <h1>Products</h1>
        </div>

        {isAdmin && (
          <Button onClick={startCreateProduct} type="button">
            Add product
          </Button>
        )}
      </div>

      {message && <FormMessage variant="success">{message}</FormMessage>}
      {error && <FormMessage variant="error">{error}</FormMessage>}

      {isAdmin && isFormOpen && (
        <Panel as="section" className="product-management-panel">
          <div className="section-heading">
            <p className="eyebrow">Product management</p>
            <h2>{editingProduct ? 'Edit product' : 'Add product'}</h2>
          </div>
          <ProductForm
            product={editingProduct}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingProduct(null);
            }}
            onSave={saveProduct}
          />
        </Panel>
      )}

      <ProductGrid
        products={products}
        onDeleteProduct={isAdmin ? removeProduct : undefined}
        onEditProduct={isAdmin ? startEditProduct : undefined}
      />
    </main>
  );
}
