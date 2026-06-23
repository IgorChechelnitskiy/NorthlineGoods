import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  addCartItem,
  CartItem,
  checkoutCart,
  CheckoutCustomer,
  createCart,
  getCart,
  updateCartItem,
} from '../lib/api';

type CartContextValue = {
  cartItems: CartItem[];
  cartCount: number;
  subtotal: number;
  shipping: number;
  orderTotal: number;
  orderPlaced: boolean;
  isCartMenuOpen: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  placeOrder: (customer: CheckoutCustomer) => Promise<void>;
  openCartMenu: () => void;
  closeCartMenu: () => void;
};

const cartStorageKey = 'northline-cart-id';
const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { role } = useAuth();
  const [cartId, setCartId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isCartMenuOpen, setIsCartMenuOpen] = useState(false);

  useEffect(() => {
    if (role === 'guest') {
      setCartId(null);
      setCartItems([]);
      setSubtotal(0);
      setShipping(0);
      setOrderTotal(0);
      setIsCartMenuOpen(false);
      return;
    }

    const storedCartId = localStorage.getItem(cartStorageKey);

    if (!storedCartId) {
      return;
    }

    getCart(storedCartId)
      .then((cart) => {
        setCartId(cart.id);
        applyCart(cart);
      })
      .catch(() => {
        localStorage.removeItem(cartStorageKey);
      });
  }, [role]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  async function addToCart(productId: string, quantity = 1) {
    setOrderPlaced(false);
    const activeCartId = await ensureCartId();
    const cart = await addCartItem(activeCartId, productId, quantity);
    applyCart(cart);
    setIsCartMenuOpen(true);
  }

  async function updateQuantity(productId: string, quantity: number) {
    const activeCartId = await ensureCartId();
    const cart = await updateCartItem(activeCartId, productId, quantity);
    applyCart(cart);

    if (cart.items.length === 0) {
      setIsCartMenuOpen(false);
    }
  }

  async function placeOrder(customer: CheckoutCustomer) {
    const activeCartId = await ensureCartId();
    await checkoutCart(activeCartId, customer);
    localStorage.removeItem(cartStorageKey);
    setCartId(null);
    setCartItems([]);
    setSubtotal(0);
    setShipping(0);
    setOrderTotal(0);
    setIsCartMenuOpen(false);
    setOrderPlaced(true);
  }

  function openCartMenu() {
    setIsCartMenuOpen(true);
  }

  function closeCartMenu() {
    setIsCartMenuOpen(false);
  }

  async function ensureCartId() {
    if (role === 'guest') {
      throw new Error('Login as user or admin to use the cart');
    }

    if (cartId) {
      return cartId;
    }

    const cart = await createCart();
    localStorage.setItem(cartStorageKey, cart.id);
    setCartId(cart.id);
    applyCart(cart);

    return cart.id;
  }

  function applyCart(cart: {
    items: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
  }) {
    setCartItems(cart.items);
    setSubtotal(cart.subtotal);
    setShipping(cart.shipping);
    setOrderTotal(cart.total);
  }

  const value = {
    cartItems,
    cartCount,
    subtotal,
    shipping,
    orderTotal,
    orderPlaced,
    isCartMenuOpen,
    addToCart,
    updateQuantity,
    placeOrder,
    openCartMenu,
    closeCartMenu,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
