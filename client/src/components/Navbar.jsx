import { Link } from "react-router-dom";
import './Navbar.css'; // Import the CSS file
import { TiShoppingCart } from "react-icons/ti";
import { IoSearchCircleSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useAuth } from '../context/auth';
import toast from "react-hot-toast";
import axios from 'axios';
import { Badge } from "antd";
import { Popper, Box, Typography, ListItemButton } from "@mui/material";
import { usePopupState, bindHover, bindPopper } from "material-ui-popup-state/hooks";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [auth, setAuth] = useAuth();
  const popupState = usePopupState({
    variant: "popover",
    popupId: "accountPopover",
  });
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
    }
  };
  useEffect(() => {
    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalItems = savedCart.reduce((acc, item) => acc + (item.quantity || 1), 0);
      setCartCount(totalItems);
    };

    loadCart();

    // Add event listener to handle updates from other tabs
    window.addEventListener('storage', loadCart);

    return () => {
      window.removeEventListener('storage', loadCart);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setIsMobile(true);
        setShowSearchBar(false);
      } else {
        setIsMobile(false);
        setShowSearchBar(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="text-2xl font-bold navbar-title">
        Gamerz Arena
      </Link>

      {/* Search Bar with icon */}
      <div className={`search-container ${isMobile ? 'search-mobile' : ''}`}>
        {(showSearchBar || !isMobile) && (
          <input
            type="text"
            placeholder="Search games..."
            className={`search-bar ${showSearchBar ? 'visible' : ''}`}
          />
        )}
        <div className="search-icon-container" onClick={toggleSearchBar}>
          <IoSearchCircleSharp className="search-icon" />
        </div>
      </div>

      {/* Nav Links */}
      <div className={`nav-links space-x-2 ml-auto ${showSearchBar && isMobile ? 'hidden' : ''}`}>
        <>
          <Link to="/cart" className="cart-icon-container">
            <TiShoppingCart className="cart-icon" />
          </Link>
        </>
        {!auth?.user ? (
          <>
            <Link to="/register" className="hover:text-blue-400">Register</Link>
            <Link to="/login" className="hover:text-blue-400">Login</Link>
          </>
        ) : (
          <>
            {/* Added ref={popupState.anchorRef} */}
            <div
              {...bindHover(popupState)}
              style={{ display: "inline-block" }}
              ref={popupState.anchorRef} // Attach the ref here
            >
              <Link className="hover:text-blue-400">{auth.user.name}</Link>
            </div>
            {/* Provided anchorEl to Popper and updated styles */}
            <Popper
              {...bindPopper(popupState)}
              anchorEl={popupState.anchorEl} // Explicitly provide anchorEl
              sx={{ zIndex: 1300 }}
            >
              <Box
                sx={{
                  bgcolor: 'black', // Changed background color to black
                  color: 'white',   // Changed text color to white
                  border: '1px solid gray', // Changed border color for better visibility
                  width: '200px',
                  padding: '10px',
                  borderRadius: '4px', // Optional: Rounded corners for a more polished look
                }}
              >
                <Typography variant="subtitle1">Account Information</Typography>
                <Typography variant="body2">Name: {auth.user.name}</Typography>
                <Typography variant="body2">Email: {auth.user.email}</Typography>
                
                <ListItemButton component={Link} to="/profile">
                  My Profile
                </ListItemButton>
                <ListItemButton component={Link} to="/" onClick={handleLogout}>
                  Log Out
                </ListItemButton>
              </Box>
            </Popper>
          </>
        )}
      </div>
    </nav>
  );
}
