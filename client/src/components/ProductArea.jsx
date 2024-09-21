import React, { useState, useEffect } from "react";
import axios from "axios";
import './ProductArea.css';
import { Link } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";
import GameRating from './GameRating'; // Import the GameRating component
import { toast } from 'react-hot-toast';
import Slider from "react-slick"; // Import react-slick for carousel
import "slick-carousel/slick/slick.css"; // Import default styles for slick slider
import "slick-carousel/slick/slick-theme.css"; 

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
      //  console.log("Fetched games:", response.data); // Log the response for debugging
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

  // Filter games based on the search term
  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Display only a limited number of games if no search term is entered
  const visibleGames = searchTerm ? filteredGames : filteredGames.slice(0, displayLimit);
  // Filter games with discount
  const discountedGames = games.filter((game) => game.discountPercentage > 0);
  
  // Determine image source (either from URL or binary)
  const getImageSrc = (game) => {
    if (game.imageUrl) {
      //console.log(`Using image URL for ${game.title}: ${game.imageUrl}`);
      return game.imageUrl;
    } else if (game._id) {
      //console.log(`Using binary image for ${game.title}: /api/v1/images/${game._id}`);
      return `/api/v1/images/${game._id}`;
    } else {
      console.log(`Using default image for ${game.title}`);
      return 'default-image.jpg';
    }
  };

  const addToCart = (game) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.id === game._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const newCartItem = {
        id: game._id,
        title: game.title,
        price: game.price,
        imageUrl: getImageSrc(game),
        quantity: 1
      };
    //  console.log("Adding new item to cart:", newCartItem); // Debug log
      cart.push(newCartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    showNotification(`${game.title} added to cart!`);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };
  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true
  };
  return (
   <div className="product-area">
  <h2>Games on Promotion</h2>
  
  {/* Carousel for games with discount */}
  <div className="carousel-container">
    <Slider {...sliderSettings}>
      {discountedGames.map((game) => (
        <div key={game._id} className="carousel-item">
          <img
            src={getImageSrc(game)}
            alt={game.title}
            className="carousel-image"
          />
          <div className="carousel-title">{game.title}</div>
          <div className="carousel-discount">{game.discountPercentage}% OFF</div>
        </div>
      ))}
    </Slider>
  </div>

  {discountedGames.length === 0 && <p>No discounted games available at the moment.</p>}

  {notification && (
    <CustomAlert
      message={notification}
      onClose={() => setNotification(null)}
    />
  )}

  <div className="promotion-container">
    <h3 className="sectionTitle">Featured Games</h3>
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
      <Link
        to={`/games/${game._id}`}  // Navigates to the product details page
        key={game._id}
        className="gameCard"
      >
        <img
          src={getImageSrc(game)}
          alt={game.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'default-image.jpg';
          }}
        />
        <div className="gameFeature">
          <span className="gameType">{game.genre}</span>
          <GameRating rating={game.rating} />
        </div>
        <div className="gameTitle mt-4 mb-3">{game.title}</div>
        <div className="gamePrice">
          {game.discountPercentage > 0 && (
            <>
              <span className="discount">{game.discountPercentage}% OFF</span>
              <span className="prevPrice">৳{game.price.toFixed(2)}</span>
            </>
          )}
          <span className="currentPrice">
            ৳{(game.price - (game.price * game.discountPercentage / 100)).toFixed(2)}
          </span>
        </div>
        
        {/* Add to Cart button with event stopPropagation */}
        <button
          onClick={(e) => {
            e.preventDefault(); // Prevents navigation to product details
            e.stopPropagation(); // Stops event bubbling up to the Link
            addToCart(game); // Add game to cart
          }}
        >
          Add to Cart
        </button>
      </Link>
    ))}
  </div>
</div>
  );
};

export default ProductArea;
