import { useEffect, useState } from 'react';
import { ProductGrid } from '../components/ProductGrid';
import { getProducts, Product } from '../lib/api';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  return (
    <main className="page-layout">
      <div className="section-heading">
        <p className="eyebrow">Catalog</p>
        <h1>Products</h1>
      </div>
      <ProductGrid products={products} />
    </main>
  );
}
