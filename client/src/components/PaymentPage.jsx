import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../context/auth'; // Import useAuth
import './PaymentPage.css';

const PaymentPage = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const [auth] = useAuth(); // Access auth context

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Fetch user data and token from auth context
      const { token, user } = auth;
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

      const response = await axios.post(
        '/api/v1/payment',
        {
          cartItems,
          userEmail: user.email, // Sending user email
          userName: user.name    // Sending user name
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // If you need to pass the token for authentication
          }
        }
      );

      if (response.data.success) {
        // After successful payment, save the cart items to history
        const existingHistory = JSON.parse(localStorage.getItem('orders')) || [];
      
        // Append new purchase to existing history
        const newPurchase = {
          purchasedAt: new Date().toISOString(),
          items: cartItems, // Ensure cartItems is an array of items
        };
      
        const updatedHistory = [...existingHistory, newPurchase];
        // Save updated history in localStorage
        localStorage.setItem('orders', JSON.stringify(updatedHistory));
      
        // Clear the cart after successful payment
        localStorage.removeItem('cart');
        setPaymentStatus('Payment successful!');

        // Redirect to the success page after a short delay
        setTimeout(() => {
          navigate('/payment-success', { state: { gameKey: response.data.gameKey } }); // Use navigate for redirection
        }, 2000);
      }
    } catch (error) {
      setPaymentStatus('Payment failed. Please try again.');
      console.error('Error processing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <h2>Proceed with Payment</h2>
      {paymentStatus && <p>{paymentStatus}</p>}
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default PaymentPage;
