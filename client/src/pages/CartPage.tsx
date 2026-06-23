import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';
import { EmptyState } from '../components/EmptyState';
import { OrderSummary } from '../components/OrderSummary';
import { formatPrice } from '../lib/format';

export function CartPage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const {
    cartItems,
    orderTotal,
    shipping,
    subtotal,
    updateQuantity,
  } = useCart();

  if (role === 'guest') {
    return (
      <main className="page-layout">
        <EmptyState />
      </main>
    );
  }

  return (
    <main className="cart-page">
      <section>
        <div className="section-heading">
          <p className="eyebrow">Shopping bag</p>
          <h1>Cart</h1>
        </div>
        {cartItems.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="cart-list">
            {cartItems.map((item) => (
              <article className="cart-item" key={item.productId}>
                <img src={item.product.image} alt={item.product.name} />
                <div>
                  <h2>{item.product.name}</h2>
                  <p>{item.product.category}</p>
                  <strong>{formatPrice(item.product.price)}</strong>
                </div>
                <div className="quantity-control" aria-label="Quantity controls">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <OrderSummary
        subtotal={subtotal}
        shipping={shipping}
        total={orderTotal}
        checkoutDisabled={cartItems.length === 0}
        onCheckout={() => navigate('/checkout')}
      />
    </main>
  );
}
