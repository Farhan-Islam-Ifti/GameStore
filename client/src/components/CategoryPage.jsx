import React, { useState, useEffect } from "react";
import axios from "axios";
import './CategoryPage.css';
import { useAuth } from '../context/auth.jsx'; // Adjust the path if needed
import { toast } from 'react-hot-toast';

const CategoryPage = () => {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState(['Genre: All']);
  const [selectedGenre, setSelectedGenre] = useState('Genre: All');
  const [notification, setNotification] = useState(null);

  // Fetch games
  useEffect(() => {
    const fetchAllGames = async () => {
      try {
        const response = await axios.get("/api/v1/games");
        const fetchedGames = response.data;

        setGames(fetchedGames);

        // Extract unique genres from the games
        const uniqueGenres = ['Genre: All', ...new Set(fetchedGames.map(game => game.genre))];
        setGenres(uniqueGenres);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchAllGames();
  }, []);

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

  // Filter games by genre
  const filteredGames = selectedGenre === 'Genre: All' 
    ? games 
    : games.filter((game) => game.genre === selectedGenre);

  return (
    <div className="category-page">
      {notification && (
        <div className="custom-alert">
          <span className="cart-icon">&#128722;</span>
          {notification}
          <button onClick={() => setNotification(null)}>×</button>
        </div>
      )}

      {/* Genre Dropdown */}
      <div className="genre-filter">
        <select 
          id="genre-select" 
          value={selectedGenre} 
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="game-grid">
        {filteredGames.map((game) => (
          <div key={game._id} className="game-card">
            <img
              src={getImageSrc(game)}
              alt={game.title}
              onError={(e) => { e.target.onerror = null; e.target.src = 'default-image.jpg'; }}
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

export default CategoryPage;
