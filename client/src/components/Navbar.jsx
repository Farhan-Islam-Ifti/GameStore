import { Link } from "react-router-dom";
import './Navbar.css'; // Import the CSS file

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="text-2xl font-bold">
        Gamerz Arena
        <span></span>
      </Link>
      <div className="space-x-4 ml-auto">
        <Link to="/" className="hover:text-blue-400">
          Home
          <span></span>
        </Link>
        <Link to="/register" className="hover:text-blue-400">
          Register
          <span></span>
        </Link>
        <Link to="/login" className="hover:text-blue-400">
          Login
          <span></span>
        </Link>
      </div>
    </nav>
  );
}
