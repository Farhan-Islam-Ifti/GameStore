import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = data;

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/register", {
        name,
        email,
        password,
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
        });
        toast.success("Registration Successful. Welcome!");
        navigate("/");
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
    <div>
      <form onSubmit={registerUser}>
        <label>Name</label>
        <input
          type="text"
          placeholder="Enter name..."
          value={name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter an email..."
          value={email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter a password..."
          value={password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
