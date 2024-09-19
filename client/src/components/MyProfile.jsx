import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import axios from 'axios';
import toast from 'react-hot-toast';
import './MyProfile.css'; // Import custom CSS

export default function MyProfile() {
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('auth');

    if (token) {
      try {
        const { user } = JSON.parse(token); // Parse token and extract user data
        if (user) {
          setName(user.name);
          setEmail(user.email);
        } else {
          toast.error('User data not available in token.');
          navigate('/login'); // Redirect to login if user data is not available
        }
      } catch (error) {
        console.error('Error parsing token:', error);
        toast.error('Invalid token format.');
        navigate('/login'); // Redirect to login if there's an error parsing the token
      }
    } else {
      toast.error('No token found.');
      navigate('/login'); // Redirect to login if no token is found
    }
  }, [navigate]);
  const handleLogout = async () => {
    try {
      // Get the current cart from localStorage
      const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
      //console.log(currentCart);
  
      // Send the cart to the server to be saved
      await axios.post('/api/v1/cart/sync', { cart: currentCart }, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
  
      // Clear auth state
      setAuth({
        ...auth,
        user: null,
        token: null,
      });
  
      // Clear localStorage
      localStorage.removeItem("auth");
      localStorage.removeItem("cart");
  
      toast.success("Logout Successful");
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error("An error occurred while logging out. Your cart may not have been saved.");
    } finally {
      // Ensure the user is logged out even if there was an error syncing the cart
      setAuth({
        ...auth,
        user: null,
        token: null,
      });
      localStorage.removeItem("auth");
      localStorage.removeItem("cart");
      navigate('/');
    }
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <h1 className="text-4xl text-white font-bold text-center mb-6">My Profile</h1>
        <div className="relative my-4">
          <input
            type="text"
            id="name"
            className="profile-input"
            placeholder=" "
            value={name}
            readOnly
          />
          <label htmlFor="name" className="profile-label">Name</label>
        </div>
        <div className="relative my-4">
          <input
            type="email"
            id="email"
            className="profile-input"
            placeholder=" "
            value={email}
            readOnly
          />
          <label htmlFor="email" className="profile-label">Email</label>
        </div>
        <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
      </div>
    </div>

  );
}
