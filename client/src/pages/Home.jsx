import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Home.css';
import SideMenu from '../components/SideMenu';
import CategoryPage from '../components/CategoryPage';
import LibraryPage from '../components/LibraryPage';
import FavouritePage from '../components/FavouritePage';
import AboutUsPage from '../components/AboutUsPage';
import ProductArea from '../components/ProductArea';

export default function Home() {
  return (
      <div className="home-container">
        {/* SideMenu stays constant */}
        <SideMenu />

        {/* Banner where the content will change based on the route */}
        <div className='banner'>
          <Routes>
            {/* Define different routes for each page */}
            <Route path="/" element={<ProductArea />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/favourite" element={<FavouritePage />} />
            <Route path="/aboutus" element={<AboutUsPage />} />
          </Routes>
        </div>
      </div>
  );
}
