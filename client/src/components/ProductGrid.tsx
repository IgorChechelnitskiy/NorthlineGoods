import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';
import { Product } from '../lib/api';
import { formatPrice } from '../lib/format';
import { Button } from './Button';

export function ProductGrid({ products }: { products: Product[] }) {
  const { role } = useAuth();
  const { addToCart } = useCart();

  return (
    <div className="product-grid">
      {products.map((product) => (
        <article className="product-card" key={product.id}>
          <Link className="product-image-button" to={`/products/${product.id}`}>
            <img src={product.image} alt={product.name} />
          </Link>
          <div className="product-card-body">
            <p>{product.category}</p>
            <h3>{product.name}</h3>
            <div className="product-meta">
              <strong>{formatPrice(product.price)}</strong>
              <span>{product.rating}/5</span>
            </div>
            <div className="card-actions">
              <Link to={`/products/${product.id}`}>Details</Link>
              {(role === 'user' || role === 'admin') && (
                <Button onClick={() => addToCart(product.id)}>
                  Add
                </Button>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
