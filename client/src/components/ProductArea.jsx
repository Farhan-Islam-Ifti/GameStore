import React from 'react';
import './productArea.css';

export default function ProductArea() {
  return (
    <div className="productArea">
      <h1>Products</h1>
      <div className="product">
        <img src="product1.jpg" alt="Product 1" />
        <div className="product-info">
          <h2>Product 1</h2>
          <p>Short description of product 1.</p>
        </div>
      </div>
      <div className="product">
        <img src="product2.jpg" alt="Product 2" />
        <div className="product-info">
          <h2>Product 2</h2>
          <p>Short description of product 2.</p>
        </div>
      </div>
      {/* More product items can go here */}
    </div>
  );
}

