import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductArea.css";

const CustomAlert = ({ message, onClose }) => (
  <div className="custom-alert">
    <span className="cart-icon">&#128722;</span> {/* Unicode cart icon */}
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
        imageUrl: game.imageUrl || 
                  (game.imageFileName ? 
                   `https://game-store-server-jet.vercel.app/uploads/${game.imageFileName}` : 
                   'default-image.jpg'),
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

  return (
    <div className="product-area">
      <h2>Featured Games</h2>
      {notification && (
        <CustomAlert 
          message={notification} 
          onClose={() => setNotification(null)} 
        />
      )}
      <div className="game-grid">
        {games.map((game) => (
          <div key={game._id} className="game-card">
            <img
              src={
                game.imageUrl ||
                (game.imageFileName
                  ? `https://game-store-server-jet.vercel.app/uploads/${game.imageFileName}`
                  : 'default-image.jpg')
              }
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
