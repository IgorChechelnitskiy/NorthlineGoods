import { FormEvent, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  createProduct,
  deleteProduct,
  getProducts,
  Product,
  updateProduct,
} from '../lib/api';
import { formatPrice } from '../lib/format';
import { Button } from '../components/Button';
import { FormField } from '../components/FormField';
import { FormMessage } from '../components/FormMessage';
import { Panel } from '../components/Panel';

const initialForm = {
  name: '',
  category: '',
  price: '',
  rating: '',
  color: '',
  image: '',
  description: '',
};

export function AdminPage() {
  const { role } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [savedProduct, setSavedProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (role !== 'admin') {
      return;
    }

    getProducts().then(setProducts).catch(console.error);
  }, [role]);

  if (role !== 'admin') {
    return <Navigate to="/products" replace />;
  }

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );

  async function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSavedProduct(null);
    setIsSubmitting(true);

    try {
      const input = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        rating: Number(form.rating),
        color: form.color,
        image: form.image,
        description: form.description,
      };

      const product = selectedProductId
        ? await updateProduct(selectedProductId, input)
        : await createProduct(input);

      setSavedProduct(product);
      setProducts((currentProducts) => {
        if (selectedProductId) {
          return currentProducts.map((currentProduct) =>
            currentProduct.id === product.id ? product : currentProduct,
          );
        }

        return [product, ...currentProducts];
      });

      if (!selectedProductId) {
        setForm(initialForm);
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Product could not be created',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField(field: keyof typeof form, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function startCreate() {
    setSelectedProductId(null);
    setSavedProduct(null);
    setError('');
    setForm(initialForm);
  }

  function startEdit(product: Product) {
    setSelectedProductId(product.id);
    setSavedProduct(null);
    setError('');
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      rating: String(product.rating),
      color: product.color,
      image: product.image,
      description: product.description,
    });
  }

  async function removeProduct(productId: string) {
    setError('');

    try {
      await deleteProduct(productId);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId),
      );

      if (selectedProductId === productId) {
        startCreate();
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Product could not be deleted',
      );
    }
  }

  return (
    <main className="admin-page">
      <div className="section-heading admin-heading">
        <p className="eyebrow">Admin</p>
        <h1>{selectedProduct ? 'Edit product' : 'Add product'}</h1>
      </div>

      <section>
        <form className="admin-product-form" onSubmit={submitProduct}>
          <FormField label="Name">
            <input
              required
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Linen Field Jacket"
            />
          </FormField>

          <FormField label="Category">
            <input
              required
              value={form.category}
              onChange={(event) => updateField('category', event.target.value)}
              placeholder="Outerwear"
            />
          </FormField>

          <FormField label="Price">
            <input
              required
              min="0"
              step="0.01"
              type="number"
              value={form.price}
              onChange={(event) => updateField('price', event.target.value)}
              placeholder="128"
            />
          </FormField>

          <FormField label="Rating">
            <input
              required
              max="5"
              min="0"
              step="0.1"
              type="number"
              value={form.rating}
              onChange={(event) => updateField('rating', event.target.value)}
              placeholder="4.8"
            />
          </FormField>

          <FormField label="Color">
            <input
              required
              value={form.color}
              onChange={(event) => updateField('color', event.target.value)}
              placeholder="Sage"
            />
          </FormField>

          <FormField label="Image URL">
            <input
              required
              type="url"
              value={form.image}
              onChange={(event) => updateField('image', event.target.value)}
              placeholder="https://example.com/product.jpg"
            />
          </FormField>

          <FormField fullWidth label="Description">
            <textarea
              required
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="Short product description"
            />
          </FormField>

          {error && <FormMessage variant="error">{error}</FormMessage>}

          <Button disabled={isSubmitting} fullWidth type="submit">
            {isSubmitting
              ? 'Saving...'
              : selectedProduct
                ? 'Save product'
                : 'Add product'}
          </Button>

          {selectedProduct && (
            <Button fullWidth onClick={startCreate} type="button" variant="secondary">
              Add new product
            </Button>
          )}
        </form>
      </section>

      <Panel className="admin-preview">
        <h2>{savedProduct ? 'Saved product' : 'Products'}</h2>
        {savedProduct && (
          <article className="product-card admin-created-card">
            <img src={savedProduct.image} alt={savedProduct.name} />
            <div className="product-card-body">
              <p>{savedProduct.category}</p>
              <h3>{savedProduct.name}</h3>
              <div className="product-meta">
                <strong>{formatPrice(savedProduct.price)}</strong>
                <span>{savedProduct.rating}/5</span>
              </div>
              <p className="created-product-id">ID: {savedProduct.id}</p>
            </div>
          </article>
        )}

        <div className="admin-product-list">
          {products.map((product) => (
            <article
              className={
                product.id === selectedProductId
                  ? 'admin-product-row active'
                  : 'admin-product-row'
              }
              key={product.id}
            >
              <img src={product.image} alt={product.name} />
              <div>
                <h3>{product.name}</h3>
                <p>{product.category}</p>
                <strong>{formatPrice(product.price)}</strong>
              </div>
              <div className="admin-row-actions">
                <Button onClick={() => startEdit(product)} type="button" variant="secondary">
                  Edit
                </Button>
                <Button
                  onClick={() => removeProduct(product.id)}
                  type="button"
                  variant="danger"
                >
                  Delete
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </main>
  );
}
