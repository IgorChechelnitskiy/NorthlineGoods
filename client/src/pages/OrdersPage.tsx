import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  deleteOrder,
  getOrders,
  Order,
  OrderStatus,
  updateOrderStatus,
} from '../lib/api';
import { formatPrice } from '../lib/format';
import { Button } from '../components/Button';
import { FormField } from '../components/FormField';
import { FormMessage } from '../components/FormMessage';

const orderStatuses: OrderStatus[] = ['created', 'paid', 'cancelled'];

export function OrdersPage() {
  const { isAuthenticated, role } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    getOrders()
      .then(setOrders)
      .catch((ordersError) =>
        setError(
          ordersError instanceof Error
            ? ordersError.message
            : 'Orders could not be loaded',
        ),
      )
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  async function changeStatus(orderId: string, status: OrderStatus) {
    setError('');

    try {
      const order = await updateOrderStatus(orderId, status);
      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.id === order.id ? order : currentOrder,
        ),
      );
    } catch (statusError) {
      setError(
        statusError instanceof Error
          ? statusError.message
          : 'Order status could not be updated',
      );
    }
  }

  async function removeOrder(orderId: string) {
    setError('');

    try {
      await deleteOrder(orderId);
      setOrders((currentOrders) =>
        currentOrders.filter((order) => order.id !== orderId),
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Order could not be deleted',
      );
    }
  }

  return (
    <main className="orders-page">
      <div className="section-heading">
        <p className="eyebrow">{role === 'admin' ? 'Admin' : 'Account'}</p>
        <h1>{role === 'admin' ? 'Orders' : 'My orders'}</h1>
      </div>

      {!isAuthenticated ? (
        <p className="muted-copy">Log in to see your order history.</p>
      ) : isLoading ? (
        <p className="muted-copy">Loading orders...</p>
      ) : error ? (
        <FormMessage variant="error">{error}</FormMessage>
      ) : orders.length === 0 ? (
        <p className="muted-copy">No orders have been placed yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <header className="order-card-header">
                <div>
                  <p className="eyebrow">{order.status}</p>
                  <h2>{order.customer.name}</h2>
                  <p>{order.customer.email}</p>
                </div>
                <strong>{formatPrice(order.total)}</strong>
              </header>

              <dl className="order-meta-list">
                <div>
                  <dt>User</dt>
                  <dd>{order.user?.email ?? 'Unknown user'}</dd>
                </div>
                <div>
                  <dt>Placed</dt>
                  <dd>{new Date(order.createdAt).toLocaleString()}</dd>
                </div>
                <div>
                  <dt>Ship to</dt>
                  <dd>
                    {order.customer.address}, {order.customer.city}
                  </dd>
                </div>
              </dl>

              <div className="order-items">
                {order.items.map((item) => (
                  <div className="order-line" key={`${order.id}-${item.product}`}>
                    <span>
                      {item.quantity} x {item.name}
                    </span>
                    <strong>{formatPrice(item.lineTotal)}</strong>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <span>Subtotal {formatPrice(order.subtotal)}</span>
                <span>Shipping {formatPrice(order.shipping)}</span>
              </div>

              {role === 'admin' && (
                <div className="order-admin-actions">
                  <FormField label="Status">
                    <select
                      value={order.status}
                      onChange={(event) =>
                        changeStatus(order.id, event.target.value as OrderStatus)
                      }
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <Button
                    onClick={() => removeOrder(order.id)}
                    type="button"
                    variant="danger"
                  >
                    Delete order
                  </Button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
