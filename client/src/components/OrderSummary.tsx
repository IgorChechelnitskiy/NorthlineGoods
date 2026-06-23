import { formatPrice } from '../lib/format';

type OrderSummaryProps = {
  subtotal: number;
  shipping: number;
  total: number;
  checkoutDisabled: boolean;
  onCheckout?: () => void;
};

export function OrderSummary({
  subtotal,
  shipping,
  total,
  checkoutDisabled,
  onCheckout,
}: OrderSummaryProps) {
  return (
    <aside className="summary-panel">
      <h2>Order summary</h2>
      <div>
        <span>Subtotal</span>
        <strong>{formatPrice(subtotal)}</strong>
      </div>
      <div>
        <span>Shipping</span>
        <strong>{shipping === 0 ? 'Free' : formatPrice(shipping)}</strong>
      </div>
      <div className="summary-total">
        <span>Total</span>
        <strong>{formatPrice(total)}</strong>
      </div>
      {onCheckout && (
        <button
          className="primary-button wide-button"
          disabled={checkoutDisabled}
          onClick={onCheckout}
        >
          Checkout
        </button>
      )}
    </aside>
  );
}
