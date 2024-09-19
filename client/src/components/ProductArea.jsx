import React, { useState, useEffect } from "react";
import axios from "axios";
import './ProductArea.css';
import { Link } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";
import GameRating from './GameRating'; // Import the GameRating component
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
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  // 1. Add a displayLimit to control the number of visible games initially
  const [displayLimit] = useState(5); // Change this number to set how many games are displayed by default

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // 3. Display only a limited number of games if no search term is entered
  // If there's a search term, show all matching games
  const visibleGames = searchTerm ? filteredGames : filteredGames.slice(0, displayLimit);


  const addToCart = (game) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
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

    localStorage.setItem("cart", JSON.stringify(cart));
    showNotification(`${game.title} added to cart!`);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const getImageSrc = (game) => {
    if (game.imageUrl) {
      return game.imageUrl;
    } else if (game._id) {
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
        <Link to="/category" className="viewMore">
          View more games <FaArrowRight className="icon" />
        </Link>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <div className="game-grid">
        {visibleGames.map((game) => (
          <div key={game._id} className="gameCard">
            <img
              src={getImageSrc(game)}
              alt={game.title}
              onError={(e) => { e.target.onerror = null; e.target.src = 'default-image.jpg'; }}
            />
            <div className="gameFeature">
              <span className="gameType">{game.genre}</span>
              <GameRating rating={game.rating} />
            </div>
            <div className="gameTitle mt-4 mb-3">{game.title}</div>
            <div className="gamePrice">
              {game.discountPercentage > 0 && (
                <>
                  <span className="discount">
                    {game.discountPercentage}% OFF
                  </span>
                  <span className="prevPrice">${game.price.toFixed(2)}</span>
                </>
              )}
              <span className="currentPrice">
                ${(game.price - (game.price * game.discountPercentage / 100)).toFixed(2)}
              </span>
            </div>
            <button onClick={() => addToCart(game)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductArea;
