import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';
import northlineLogo from '../assets/northline-logo.png';
import { formatPrice } from '../lib/format';
import { Button } from './Button';

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logoutUser, role, user } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    cartCount,
    cartItems,
    closeCartMenu,
    isCartMenuOpen,
    openCartMenu,
    orderTotal,
    updateQuantity,
  } = useCart();

  async function handleLogout() {
    await logoutUser();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  }

  function goToCheckout() {
    closeCartMenu();
    setIsMobileMenuOpen(false);
    navigate('/checkout');
  }

  function closeMenus() {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    closeCartMenu();
  }

  return (
    <header className="site-header">
      <NavLink className="brand-button" to="/">
        <img src={northlineLogo} alt="Northline Goods" />
      </NavLink>
      <button
        aria-expanded={isMobileMenuOpen}
        aria-label="Toggle navigation menu"
        className="hamburger-button"
        onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>
      <nav
        aria-label="Primary navigation"
        className={isMobileMenuOpen ? 'nav-menu open' : 'nav-menu'}
      >
        <NavLink onClick={closeMenus} to="/">
          Main
        </NavLink>
        <NavLink onClick={closeMenus} to="/products">
          Products
        </NavLink>
        {(role === 'user' || role === 'admin') && (
          <NavLink onClick={closeMenus} to="/orders">
            Orders
          </NavLink>
        )}
        {(role === 'user' || role === 'admin') && (
          <div className="cart-menu-wrap">
            <button
              aria-expanded={isCartMenuOpen}
              className="cart-link cart-menu-button"
              onClick={() =>
                isCartMenuOpen ? closeCartMenu() : openCartMenu()
              }
              type="button"
            >
              Cart
              <span>{cartCount}</span>
            </button>

            {isCartMenuOpen && (
              <div className="cart-drawer" role="dialog" aria-label="Cart">
                <div className="cart-dropdown-header">
                  <strong>Cart</strong>
                  <button onClick={closeCartMenu} type="button">
                    Close
                  </button>
                </div>

                {cartItems.length === 0 ? (
                  <p className="muted-copy">Your cart is empty.</p>
                ) : (
                  <>
                    <div className="mini-cart-list">
                      {cartItems.map((item) => (
                        <article className="mini-cart-item" key={item.productId}>
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                          />
                          <div className="mini-cart-copy">
                            <h3>{item.product.name}</h3>
                            <p>
                              {formatPrice(item.product.price)}
                            </p>
                            <div className="mini-quantity-control">
                              <button
                                aria-label="Decrease quantity"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity - 1,
                                  )
                                }
                                type="button"
                              >
                                -
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                aria-label="Increase quantity"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity + 1,
                                  )
                                }
                                type="button"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <button
                            className="mini-remove-button"
                            onClick={() => updateQuantity(item.productId, 0)}
                            type="button"
                          >
                            Remove
                          </button>
                        </article>
                      ))}
                    </div>

                    <div className="mini-cart-total">
                      <span>Total</span>
                      <strong>{formatPrice(orderTotal)}</strong>
                    </div>

                    <div className="mini-cart-actions">
                      <Button
                        onClick={() => {
                          closeMenus();
                          navigate('/cart');
                        }}
                        type="button"
                        variant="secondary"
                      >
                        View cart
                      </Button>
                      <Button onClick={goToCheckout} type="button">
                        Checkout
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        {isAuthenticated && user ? (
          <div className="user-menu-wrap">
            <button
              aria-expanded={isUserMenuOpen}
              className="user-menu-button"
              onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
              type="button"
            >
              <span className="user-avatar" aria-hidden="true">
                {user.avatar ? (
                  <img src={user.avatar} alt="" />
                ) : (
                  user.name.slice(0, 1).toUpperCase()
                )}
              </span>
              <span>{user.name}</span>
            </button>

            {isUserMenuOpen && (
              <div className="user-dropdown">
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                  <span>{user.role}</span>
                </div>
                <Link onClick={closeMenus} to="/settings">
                  Configuration
                </Link>
                <button onClick={handleLogout} type="button">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <NavLink onClick={closeMenus} to="/login">
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
}
