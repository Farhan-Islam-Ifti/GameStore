import { Link } from "react-router-dom";
import './Navbar.css'; // Import the CSS file
import { TiShoppingCart } from "react-icons/ti";
import { IoSearchCircleSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useAuth } from '../context/auth';
import toast from "react-hot-toast";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [auth, setAuth] = useAuth();
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: null,
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
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
      if (window.innerWidth < 768) {
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
        <Link to="/" className="hover:text-blue-400">Home</Link>
        <Link to="/cart" className="hover:text-blue-400 cart-icon-container">
          <TiShoppingCart className="cart-icon" />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
        {!auth?.user ? (
                <>
                  <Link to="/register" className="hover:text-blue-400">Register</Link>
                  <Link to="/login" className="hover:text-blue-400">Login</Link>
                </>
              ) : (
                <>
                   <Link onClick={handleLogout} to="/login" className="hover:text-blue-400">Log Out</Link>
                </>
              )}
      </div>
    </nav>
  );
}
