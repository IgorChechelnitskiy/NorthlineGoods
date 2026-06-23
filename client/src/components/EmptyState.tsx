import { Link } from 'react-router-dom';

export function EmptyState() {
  return (
    <div className="empty-state">
      <h2>Your cart is empty</h2>
      <p>Add a few products before checkout.</p>
      <Link className="primary-button" to="/products">
        Browse products
      </Link>
    </div>
  );
}
