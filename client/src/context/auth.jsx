import { useState, useEffect, useContext, createContext } from "react";
import {jwtDecode} from 'jwt-decode'; // Make sure jwt-decode is correctly imported
import axios from 'axios';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
  });

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      try {
        const parseData = JSON.parse(data);
        if (parseData.user && parseData.token) {
          setAuth({ user: parseData.user, token: parseData.token });
        }
      } catch (error) {
        console.error("Failed to parse auth data:", error);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
