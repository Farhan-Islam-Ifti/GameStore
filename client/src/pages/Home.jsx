import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './Home.css';
import SideMenu from '../components/SideMenu';
import CategoryPage from '../components/CategoryPage';
import LibraryPage from '../components/LibraryPage';
import FavouritePage from '../components/FavouritePage';
import AboutUsPage from '../components/AboutUsPage';
import ProductArea from '../components/ProductArea';
import AdminAddGame from '../components/AdminAddGame';
import { useAuth } from '../context/auth';
import { toast } from 'react-hot-toast';

export default function Home() {
  const [auth] = useAuth(); // Destructure auth

  // Private route component
  const PrivateRoute = ({ children }) => {
    if (!auth?.user) {
      toast.error('You need to login first to access this page.');
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <div className="home-container">
      {/* SideMenu stays constant */}
      <SideMenu />

      {/* Links to Register and Login (shown when not logged in) */}
      {!auth?.user && (
        <div className="auth-links">
          <Link to="/register" className="hover:text-blue-400">Register</Link>
          <Link to="/login" className="hover:text-blue-400">Login</Link>
        </div>
      )}

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
              <PrivateRoute>
                <AdminAddGame />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
