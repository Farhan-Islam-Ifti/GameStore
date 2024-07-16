import React, { useState } from 'react';
import './Home.css';
import SideMenu from '../components/SideMenu';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
  };

  return (
    <div className="home-container">
      <div>
        <SideMenu />
      </div>
      
    </div>
  );
}
