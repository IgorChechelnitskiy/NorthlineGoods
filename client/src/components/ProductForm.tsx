import { FormEvent, useEffect, useState } from 'react';
import { CreateProductInput, Product } from '../lib/api';
import { Button } from './Button';
import { FormField } from './FormField';
import { FormMessage } from './FormMessage';

const initialForm = {
  name: '',
  category: '',
  price: '',
  rating: '',
  color: '',
  image: '',
  description: '',
};

type ProductFormProps = {
  product?: Product | null;
  onCancel: () => void;
  onSave: (input: CreateProductInput) => Promise<void>;
};

export function ProductForm({ product, onCancel, onSave }: ProductFormProps) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!product) {
      setForm(initialForm);
      return;
    }

    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      rating: String(product.rating),
      color: product.color,
      image: product.image,
      description: product.description,
    });
  }, [product]);

  async function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onSave({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        rating: Number(form.rating),
        color: form.color,
        image: form.image,
        description: form.description,
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Product could not be saved',
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

  return (
    <form className="product-form" onSubmit={submitProduct}>
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

      <div className="product-form-actions">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Saving...' : product ? 'Save product' : 'Add product'}
        </Button>
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
