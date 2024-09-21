import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

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
  const handleProceedToCheckout = () => {
    // Redirect to payment page
    navigate('/payment'); // Replace with your actual payment route
  };
  return (
    <div className="cart-page">
      {/* Side Menu */}
      
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
                    <p className="price">${Math.round(item.price)}</p>
                  </div>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, -1)} className="quantity-btn">
                      <span className="icon">−</span> {/* Minus icon */}
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="quantity-btn">
                      <span className="icon">+</span> {/* Plus icon */}
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="remove-btn">
                    <span className="icon">🗑️</span> {/* Trash icon */}
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <button onClick={clearCart} className="clear-cart-btn">
                Clear Cart
              </button>
              <div className="total">
                Total: ${Math.round(total)}
              </div>
            </div>
            <button className="checkout-btn" onClick={handleProceedToCheckout}> {/* Add onClick handler */}
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
