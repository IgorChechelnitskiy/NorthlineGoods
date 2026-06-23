import { formatPrice } from '../lib/format';
import { Button } from './Button';
import { Panel } from './Panel';

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
    <Panel className="summary-panel">
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
        <Button disabled={checkoutDisabled} fullWidth onClick={onCheckout}>
          Checkout
        </Button>
      )}
    </Panel>
  );
}
