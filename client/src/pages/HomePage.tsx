import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import { ProductGrid } from '../components/ProductGrid';
import { getProducts, Product } from '../lib/api';

export function HomePage() {
  const { orderPlaced } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const featuredProducts = products.slice(0, 3);
  const heroProduct = products[0];

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Everyday essentials</p>
          <h1>Quiet goods for home, work, and weekends.</h1>
          <p>
            A small catalog of durable pieces with clean shapes, practical
            materials, and no seasonal clutter.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/products">
              Shop products
            </Link>
            <Link
              className="secondary-button"
              to={heroProduct ? `/products/${heroProduct.id}` : '/products'}
            >
              View jacket
            </Link>
          </div>
        </div>
        {heroProduct && (
          <img
            src={heroProduct.image}
            alt={heroProduct.name}
            className="hero-image"
          />
        )}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Featured</p>
          <h2>Fresh picks</h2>
        </div>
        {featuredProducts.length > 0 && <ProductGrid products={featuredProducts} />}
      </section>

      {orderPlaced && (
        <aside className="success-banner">
          Order placed. Your cart is clear and the order was saved.
        </aside>
      )}
    </main>
  );
}
