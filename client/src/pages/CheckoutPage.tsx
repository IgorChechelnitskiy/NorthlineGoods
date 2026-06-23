import { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';
import { EmptyState } from '../components/EmptyState';
import { OrderSummary } from '../components/OrderSummary';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { cartItems, orderTotal, placeOrder, shipping, subtotal } = useCart();

  if (role === 'guest') {
    return <Navigate to="/products" replace />;
  }

  async function submitCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await placeOrder({
      name: String(formData.get('name')),
      email: String(formData.get('email')),
      address: String(formData.get('address')),
      city: String(formData.get('city')),
    });

    navigate('/');
  }

  return (
    <main className="checkout-page">
      <section>
        <Link className="text-button" to="/cart">
          Back to cart
        </Link>
        <div className="section-heading">
          <p className="eyebrow">Almost done</p>
          <h1>Checkout</h1>
        </div>
        {cartItems.length === 0 ? (
          <EmptyState />
        ) : (
          <form className="checkout-form" onSubmit={submitCheckout}>
            <label>
              Full name
              <input required name="name" placeholder="Alex Morgan" />
            </label>
            <label>
              Email
              <input required type="email" name="email" placeholder="alex@example.com" />
            </label>
            <label>
              Address
              <input required name="address" placeholder="42 Market Street" />
            </label>
            <label>
              City
              <input required name="city" placeholder="Portland" />
            </label>
            <button className="primary-button wide-button" type="submit">
              Place order
            </button>
          </form>
        )}
      </section>

      <OrderSummary
        subtotal={subtotal}
        shipping={shipping}
        total={orderTotal}
        checkoutDisabled
      />
    </main>
  );
}
