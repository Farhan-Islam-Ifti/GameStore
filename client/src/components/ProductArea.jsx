import React, { useState, useEffect } from "react";
import axios from "axios";
import './ProductArea.css'
import { FaArrowRight } from "react-icons/fa";
import { useAuth } from '../context/auth.jsx'; // Adjust the path to where your AuthProvider is located
import { toast } from 'react-hot-toast';

const CustomAlert = ({ message, onClose }) => (
  <div className="custom-alert">
    <span className="cart-icon">&#128722;</span>
    {message}
    <button onClick={onClose}>×</button>
  </div>
);

const ProductArea = () => {
  const [games, setGames] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get("/api/v1/games");
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, []);

  const [auth] = useAuth(); // Access the auth state

  const addToCart = () => {
    if (!auth.user) {
      toast.error('You need to be logged in to add items to the cart.'); // Show toast notification for login requirement
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === game._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: game._id,
        title: game.title,
        price: game.price,
        imageUrl: getImageSrc(game),
        quantity: 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(`${game.title} added to cart!`); // Show success notification when item is added to cart
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const getImageSrc = (game) => {
    if (game.imageUrl) {
      return game.imageUrl;
    } else if (game._id) {
      // Use the game ID to construct the image URL for buffer images
      return `/api/v1/images/${game._id}`;
    } else {
      return 'default-image.jpg';
    }
  };

  return (
    <div className="product-area">
      <h2>Featured Games</h2>
      {notification && (
        <CustomAlert
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="promotion-container">
        <h3 className="sectionTitle">Games on Promotion</h3>
        <a href="#" className="viewMore" onClick={(e) => e.preventDefault()}>
          View more games <FaArrowRight className="icon" />
        </a>
      </div>
      <div className="game-grid">
        {games.map((game) => (
          <div key={game._id} className="game-card">
            <img
              src={getImageSrc(game)}
              alt={game.title}
              onError={(e) => {e.target.onerror = null; e.target.src = 'default-image.jpg';}}
            />
            <h3>{game.title}</h3>
            <p className="genre">{game.genre}</p>
            <p className="platform">{game.platform.join(", ")}</p>
            <p className="price">${game.price.toFixed(2)}</p>
            {game.discountPercentage > 0 && (
              <p className="discount">{game.discountPercentage}% OFF</p>
            )}
            <button onClick={() => addToCart(game)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductArea;
