import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';
import { Product } from '../lib/api';
import { formatPrice } from '../lib/format';
import { Button } from './Button';

type ProductGridProps = {
  onDeleteProduct?: (productId: string) => void;
  onEditProduct?: (product: Product) => void;
  products: Product[];
};

export function ProductGrid({
  onDeleteProduct,
  onEditProduct,
  products,
}: ProductGridProps) {
  const { role } = useAuth();
  const { addToCart } = useCart();
  const canManageProducts = role === 'admin' && onEditProduct;

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
              {canManageProducts && (
                <Button
                  onClick={() => onEditProduct(product)}
                  type="button"
                  variant="secondary"
                >
                  Edit
                </Button>
              )}
              {role === 'admin' && onDeleteProduct && (
                <Button
                  onClick={() => onDeleteProduct(product.id)}
                  type="button"
                  variant="danger"
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
