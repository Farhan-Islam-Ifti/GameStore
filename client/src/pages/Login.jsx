import React, { useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import './Login.css'; // Import the CSS file

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;
    setLoading(true); // Start loading
    try {
      const response = await axios.post('/login', {
        email,
        password
      });
      
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        setData({});
        toast.success('Login Successful. Welcome!');
        navigate('/');
      }
    } catch (error) {
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
    <div className="login-container">
      <form onSubmit={loginUser} className="login-form">
        <h2>Login</h2>
        <label>Email</label>
        <input 
          type="email" 
          placeholder='Enter your email...' 
          value={data.email} 
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <label>Password</label>
        <input 
          type="password" 
          placeholder='Enter your password...' 
          value={data.password} 
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <button type='submit' disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {loading && <div className="loading-spinner"></div>} {/* Loading animation */}
    </div>
  );
}
