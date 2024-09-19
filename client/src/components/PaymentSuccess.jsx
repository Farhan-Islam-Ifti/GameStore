import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { gameKey } = location.state || {};

  useEffect(() => {
    // Redirect to homepage after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [navigate]);

  return (
    <div className="payment-success">
      <h2>Payment Complete</h2>
      <p>Thank you for your purchase! Your unique game key is:</p>
      <h3>{gameKey || "No game key available"}</h3>
      <p>Use this key to access your game on our website.</p>
      <p>Redirecting you to the homepage in a few seconds...</p>
    </div>
  );
};

export default PaymentSuccess;
