import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Home.css';
import SideMenu from '../components/SideMenu';
import CategoryPage from '../components/CategoryPage';
import LibraryPage from '../components/LibraryPage';
import FavouritePage from '../components/FavouritePage';
import AboutUsPage from '../components/AboutUsPage';
import ProductArea from '../components/ProductArea';
import AdminAddGame from '../components/AdminAddGame';
import { PrivateRoute, AdminRoute } from '../context/auths'; // Import the refactored routes

export default function Home() {
  return (
    <div className="home-container">
      {/* SideMenu stays constant */}
      <SideMenu />
      
      {/* Banner where the content will change based on the route */}
      <div className="banner">
        <Routes>
          {/* Define different routes for each page */}
          <Route path="/" element={<ProductArea />} />
          <Route path="/category" element={<CategoryPage />} />

          {/* Protecting routes with PrivateRoute */}
          <Route
            path="/library"
            element={
              <PrivateRoute>
                <LibraryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/favourite"
            element={
              <PrivateRoute>
                <FavouritePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/aboutus"
            element={
              <PrivateRoute>
                <AboutUsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/add-game"
            element={
              <AdminRoute>
                <AdminAddGame />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
