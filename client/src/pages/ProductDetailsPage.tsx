import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';
import { getProduct, Product } from '../lib/api';
import { formatPrice } from '../lib/format';

export function ProductDetailsPage() {
  const { productId } = useParams();
  const { role } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null | undefined>();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      return;
    }

    getProduct(productId)
      .then(setProduct)
      .catch(() => setProduct(null));
  }, [productId]);

  if (product === undefined) {
    return null;
  }

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  function updateQuantity(value: number) {
    setQuantity(Math.max(1, Math.floor(value) || 1));
  }

  return (
    <main className="product-detail">
      <img src={product.image} alt={product.name} />
      <section className="detail-copy">
        <Link className="text-button" to="/products">
          Back to products
        </Link>
        <p className="eyebrow">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="detail-price">{formatPrice(product.price)}</p>
        <p>{product.description}</p>
        <dl className="detail-list">
          <div>
            <dt>Color</dt>
            <dd>{product.color}</dd>
          </div>
          <div>
            <dt>Rating</dt>
            <dd>{product.rating}/5</dd>
          </div>
          <div>
            <dt>Shipping</dt>
            <dd>Free over $150</dd>
          </div>
        </dl>
        {(role === 'user' || role === 'admin') && (
          <div className="detail-cart-actions">
            <label className="detail-quantity-field">
              Quantity
              <div className="detail-quantity-control">
                <button
                  aria-label="Decrease quantity"
                  onClick={() => updateQuantity(quantity - 1)}
                  type="button"
                >
                  -
                </button>
                <input
                  min="1"
                  step="1"
                  type="number"
                  value={quantity}
                  onChange={(event) => updateQuantity(Number(event.target.value))}
                />
                <button
                  aria-label="Increase quantity"
                  onClick={() => updateQuantity(quantity + 1)}
                  type="button"
                >
                  +
                </button>
              </div>
            </label>
            <button
              className="primary-button wide-button"
              onClick={() => addToCart(product.id, quantity)}
            >
              Add {quantity} to cart
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
