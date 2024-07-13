import { Link } from "react-router-dom";
import './Navbar.css'; // Import the CSS file

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="text-2xl font-bold">MyApp</Link>
      <div className="space-x-4 ml-auto">
        <Link to="/" className="hover:text-blue-400">Home</Link>
        <Link to="/register" className="hover:text-blue-400">Register</Link>
        <Link to="/login" className="hover:text-blue-400">Login</Link>
      </div>
    </nav>
  );
}
