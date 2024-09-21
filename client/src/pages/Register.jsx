import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import './Login.css'; // Import the same CSS file for consistency

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false
  });

  const { name, email, password, isAdmin } = data;

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/register", {
        name,
        email,
        password,
        isAdmin
      });

      if (response.data.error) {
        toast.error(response.data.error, {
          duration: 4000, // Set duration to 4000 milliseconds (4 seconds)
        });
      } else {
        setData({
          name: "",
          email: "",
          password: "",
          isAdmin: false
        });
        toast.success("Registration Successful. Welcome!");
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error, {
          duration: 4000, // Set duration to 4000 milliseconds (4 seconds)
        });
      } else {
        toast.error("An error occurred. Please try again later.", {
          duration: 4000, // Set duration to 4000 milliseconds (4 seconds)
        });
      }
    }
  };
  
  return (
    <div className="background-image flex items-center justify-center w-full h-full">
      <div className="container">
        <form onSubmit={registerUser} className="login-form">
          <h1 className="text-4xl text-white font-bold text-center mb-6">Register</h1>
          <div className="relative my-4">
            <input
              type="text"
              id="name"
              className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
            />
            <label htmlFor="name" className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 left-0 peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
          </div>
          <div className="relative my-4">
            <input
              type="email"
              id="email"
              className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
            <label htmlFor="email" className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 left-0 peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
          </div>
          <div className="relative my-4">
            <input
              type="password"
              id="password"
              className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />
            <label htmlFor="password" className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 left-0 peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
          </div>
          <button type='submit' 
            disabled={false}
            className="w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
