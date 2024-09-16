import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import './CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(savedCart);
    };

    loadCart();
    window.addEventListener('storage', loadCart);

    return () => window.removeEventListener('storage', loadCart);
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const calculateTotal = () => {
    const newTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  const updateQuantity = (id, change) => {
    const updatedCart = cartItems.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    showNotification("Item removed from cart");
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
    showNotification("Cart has been cleared");
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="cart-page">
      {/* Side Menu */}
      <div className="sidemenu">
        <h2>Side Menu</h2>
        {/* Add side menu content here */}
      </div>

      <div className="cart-container">
        <h1>Your Cart</h1>
        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}
        {cartItems.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.imageUrl} alt={item.title} />
                  <div className="item-details">
                    <h3>{item.title}</h3>
                    <p className="price">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, -1)} className="quantity-btn">
                      <Minus size={24} />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="quantity-btn">
                      <Plus size={24} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="remove-btn">
                    <Trash2 size={24} />
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <button onClick={clearCart} className="clear-cart-btn">
                Clear Cart
              </button>
              <div className="total">
                Total: ${total.toFixed(2)}
              </div>
            </div>
            <button className="checkout-btn">
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
