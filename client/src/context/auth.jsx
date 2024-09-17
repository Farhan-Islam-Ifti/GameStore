import { useState, useEffect, useContext, createContext } from "react";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
  });

  useEffect(() => {
    // Fetch the auth data from localStorage on component mount
    const data = localStorage.getItem("auth");

    // Check if the data exists and is valid JSON
    if (data) {
      try {
        const parseData = JSON.parse(data);
        // Ensure that the parsed data contains both user and token
        if (parseData.user && parseData.token) {
          setAuth(parseData); // Update state with parsed data
        }
      } catch (error) {
        console.error("Failed to parse auth data from localStorage:", error);
      }
    }
  }, []);

  // Provide the auth state and setter function to children components
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
