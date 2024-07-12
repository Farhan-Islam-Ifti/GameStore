import { Link } from "react-router-dom";
import './Navbar.css'; // Ensure you have the appropriate CSS file

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">MyApp</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/register" className="nav-link">Register</Link>
        <Link to="/login" className="nav-link">Login</Link>
      </div>
    </nav>
  );
}
