import React, { useState, useEffect } from 'react';
import './LibraryPage.css'; // Optional: Add any styles you need

const LibraryPage = () => {
  const [history, setHistory] = useState([]);

  // Fetch purchase history from localStorage when the component mounts
  useEffect(() => {
    const purchaseHistory = JSON.parse(localStorage.getItem('orders')) || [];
    setHistory(purchaseHistory);
  }, []);

  return (
    <div className="library-page">
      <h1>Purchase History</h1>
      {history.length === 0 ? (
        <p>No purchases made yet.</p>
      ) : (
        <div className="history-container">
          {history.map((purchase, index) => (
            <div key={index} className="purchase-record">
              <h3>Purchase Date: {new Date(purchase.purchasedAt).toLocaleDateString()}</h3>
              {purchase.items.map((item, idx) => (
                <div key={idx} className="history-item">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h4>{item.title}</h4>
                    <p>Price: ৳{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;

