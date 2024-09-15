import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductArea.css';

const ProductArea = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('https://game-store-server-jet.vercel.app//api/v1/games');
        setGames(response.data);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="product-area">
      <h2>Featured Games</h2>
      <div className="game-grid">
        {games.map((game) => (
          <div key={game._id} className="game-card">
            <img
              src={
                game.imageUrl
                  ? game.imageUrl
                  : game.imageFileName
                  ? `https://game-store-server-jet.vercel.app/uploads/${game.imageFileName}` // Path to the uploaded image
                  : 'default-image.jpg' // Fallback image if no URL or filename is available
              }
              alt={game.title}
              onError={(e) => (e.target.src = 'default-image.jpg')} // Fallback image on error
            />
            <h3>{game.title}</h3>
            <p className="genre">{game.genre}</p>
            <p className="platform">{game.platform.join(', ')}</p>
            <p className="price">${game.price.toFixed(2)}</p>
            {game.discountPercentage > 0 && (
              <p className="discount">{game.discountPercentage}% OFF</p>
            )}
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductArea;
