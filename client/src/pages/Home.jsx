import React, { useState } from 'react';
import './Home.css';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
  };

  return (
    <div className="home-container">
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      <div className="content-section">
        <h2>Featured Items</h2>
        <div className="slider">
          <div className="slider-item">Item 1</div>
          <div className="slider-item">Item 2</div>
          <div className="slider-item">Item 3</div>
        </div>
      </div>

      <div className="content-section">
        <h2>Popular Items</h2>
        <div className="slider">
          <div className="slider-item">Item 4</div>
          <div className="slider-item">Item 5</div>
          <div className="slider-item">Item 6</div>
        </div>
      </div>
    </div>
  );
}
