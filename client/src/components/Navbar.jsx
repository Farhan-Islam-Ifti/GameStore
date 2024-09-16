import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post('/logout'); 
      setUser(null); 
      localStorage.removeItem('token'); 
      toast.success('Logged out successfully');
      navigate('/login'); 
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.'); // Show error message
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-filter backdrop-blur-md py-2">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">
          Home
        </Link>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="text-white text-lg">
              Welcome, {user.name} {/* Display user's name */}
            </div>
          )}
          <div className="flex space-x-4">
            {!user ? (
              <>
                <Link to="/register" className="text-white text-lg">
                  Register
                </Link>
                <Link to="/login" className="text-white text-lg">
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="text-white text-lg bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
