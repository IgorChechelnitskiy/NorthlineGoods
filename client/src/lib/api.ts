export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  color: string;
  image: string;
  description: string;
};

export type UserRole = 'guest' | 'user' | 'admin';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
};

export type CartItem = {
  productId: string;
  quantity: number;
  product: Product;
  lineTotal: number;
};

export type Cart = {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

export type CheckoutCustomer = {
  name: string;
  email: string;
  address: string;
  city: string;
};

export type CreateProductInput = Omit<Product, 'id'>;

export type UpdateProfileInput = {
  name: string;
  email: string;
  avatar: string;
  password?: string;
};

export type OrderItem = {
  product: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  user: AuthUser | null;
  customer: CheckoutCustomer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'created' | 'paid' | 'cancelled';
  createdAt: string;
};

export type OrderStatus = Order['status'];

let authToken = localStorage.getItem('auth-token');

export function setAuthToken(token: string | null) {
  authToken = token;

  if (token) {
    localStorage.setItem('auth-token', token);
  } else {
    localStorage.removeItem('auth-token');
  }
}

export function getStoredAuthToken() {
  return authToken;
}

type ApiProduct = Omit<Product, 'id'> & {
  _id?: string;
  id?: string;
};

type ApiCart = {
  id: string;
  items: Array<{
    product: ApiProduct;
    quantity: number;
    lineTotal: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
};

type ApiOrder = Omit<Order, 'id' | 'user'> & {
  _id?: string;
  id?: string;
  user?: AuthUser | null;
};

export async function getProducts() {
  const products = await request<ApiProduct[]>('/api/products');
  return products.map(normalizeProduct);
}

export async function getProduct(productId: string) {
  const product = await request<ApiProduct>(`/api/products/${productId}`);
  return normalizeProduct(product);
}

export async function createProduct(input: CreateProductInput) {
  const product = await request<ApiProduct>('/api/products', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  return normalizeProduct(product);
}

export async function updateProduct(
  productId: string,
  input: CreateProductInput,
) {
  const product = await request<ApiProduct>(`/api/products/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });

  return normalizeProduct(product);
}

export async function deleteProduct(productId: string) {
  await request<void>(`/api/products/${productId}`, {
    method: 'DELETE',
    emptyResponse: true,
  });
}

export async function login(email: string, password: string) {
  return request<{ token: string; user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  await request<void>('/api/auth/logout', {
    method: 'POST',
    emptyResponse: true,
  });
}

export async function getCurrentUser() {
  return request<{ user: AuthUser | null }>('/api/auth/me');
}

export async function updateCurrentUser(input: UpdateProfileInput) {
  return request<{ user: AuthUser }>('/api/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function createCart() {
  const cart = await request<ApiCart>('/api/carts', {
    method: 'POST',
  });

  return normalizeCart(cart);
}

export async function getCart(cartId: string) {
  const cart = await request<ApiCart>(`/api/carts/${cartId}`);
  return normalizeCart(cart);
}

export async function addCartItem(
  cartId: string,
  productId: string,
  quantity = 1,
) {
  const cart = await request<ApiCart>(`/api/carts/${cartId}/items`, {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });

  return normalizeCart(cart);
}

export async function updateCartItem(
  cartId: string,
  productId: string,
  quantity: number,
) {
  const cart = await request<ApiCart>(
    `/api/carts/${cartId}/items/${productId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    },
  );

  return normalizeCart(cart);
}

export async function checkoutCart(cartId: string, customer: CheckoutCustomer) {
  return request(`/api/carts/${cartId}/checkout`, {
    method: 'POST',
    body: JSON.stringify({ customer }),
  });
}

export async function getOrders() {
  const orders = await request<ApiOrder[]>('/api/orders');
  return orders.map(normalizeOrder);
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
) {
  const order = await request<ApiOrder>(`/api/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  return normalizeOrder(order);
}

export async function deleteOrder(orderId: string) {
  await request<void>(`/api/orders/${orderId}`, {
    method: 'DELETE',
    emptyResponse: true,
  });
}

type ApiRequestInit = RequestInit & {
  emptyResponse?: boolean;
};

async function request<T>(path: string, options: ApiRequestInit = {}) {
  let response: Response;
  const { emptyResponse, ...fetchOptions } = options;

  try {
    response = await fetch(path, {
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    });
  } catch {
    throw new Error('API server is not reachable. Start the backend on port 3000.');
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(
      errorBody?.message ?? `Request failed with status ${response.status}`,
    );
  }

  if (emptyResponse || response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function normalizeCart(cart: ApiCart): Cart {
  return {
    id: cart.id,
    items: cart.items.map((item) => {
      const product = normalizeProduct(item.product);

      return {
        productId: product.id,
        product,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      };
    }),
    subtotal: cart.subtotal,
    shipping: cart.shipping,
    total: cart.total,
  };
}

function normalizeProduct(product: ApiProduct): Product {
  return {
    id: product.id ?? product._id ?? '',
    name: product.name,
    category: product.category,
    price: product.price,
    rating: product.rating,
    color: product.color,
    image: product.image,
    description: product.description,
  };
}

function normalizeOrder(order: ApiOrder): Order {
  return {
    id: order.id ?? order._id ?? '',
    user: order.user ?? null,
    customer: order.customer,
    items: order.items,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
  };
}
