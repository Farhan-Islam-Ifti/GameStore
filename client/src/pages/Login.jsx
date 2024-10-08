import React, { useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import './Login.css'; // Import the CSS file
import { useAuth } from '../context/auth';

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useAuth(); // Custom hook to manage auth context

 const loginUser = async (e) => {
    e.preventDefault();
    const { email, password,} = data;
    setLoading(true); // Start loading
    try {
      // Send login request to the backend
      const response = await axios.post('/login', {
        email,
        password,
      });
     
      // Check if the backend returned an error
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        // Reset form data
        setData({ email: '', password: '', });
       
        // Display success message
        toast.success('Login Successful. Welcome!');

        // Extract user, token, and cart from the response
        const { user, token,refreshToken, cart, orders } = response.data;

        // Update auth context with user data and token
        setAuth({
          ...auth,
          user: {
              ...user, // Spread user to include isAdmin
          },
          token: token,
          //refreshToken: refreshToken
      });
     
        // Store user, token, and cart in localStorage
        localStorage.setItem("auth", JSON.stringify({
          user: {
              ...user, // Ensure isAdmin is included here
          },
          token: token,
          refreshToken: refreshToken
      }));

        // Store cart in localStorage
        localStorage.setItem("cart", JSON.stringify(cart || []));
       localStorage.setItem("orders", JSON.stringify(orders || []));
      
        // Navigate to the home page or any protected route
        navigate('/');
      }
    } catch (error) {
      // Handle any error during login request
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="background-image flex items-center justify-center w-full h-full">
      <div className="container">
        <form onSubmit={loginUser} className="login-form">
          <h1 className="text-4xl text-white font-bold text-center mb-6">Login</h1>
          
          {/* Email input */}
          <div className="relative my-4">
            <input
              type="email"
              id="email"
              className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <label htmlFor="email" className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 left-0 peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Email
            </label>
          </div>

          {/* Password input */}
          <div className="relative my-4">
            <input
              type="password"
              id="password"
              className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <label htmlFor="password" className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 left-0 peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Password
            </label>
          </div>

          {/* Submit button */}
          <button 
            type='submit' 
            disabled={loading}
            className="w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Display loading spinner if loading */}
        {loading && <div className="loading-spinner"></div>}
      </div>
    </div>
  );
}
