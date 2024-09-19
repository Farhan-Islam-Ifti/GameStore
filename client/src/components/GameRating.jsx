import { useState, useEffect, useCallback } from 'react';
import './gameRating.css';
import { FaStar } from "react-icons/fa";

function GameRating({ rating }) {
  const generateStars = useCallback(() => {
    const maxRating = 5;
    let stars = [];

    // Ensure the rating is within 0-5 range
    let fullStars = Math.max(0, Math.min(Math.floor(rating), maxRating));

    for (let i = 0; i < maxRating; i++) {
      stars.push(i < fullStars ? 'full' : 'empty');
    }

    return stars;
  }, [rating]);

  const [stars, setStars] = useState([]);

  useEffect(() => {
    setStars(generateStars());
  }, [generateStars]);

  return (
    <div className='gameRating'>
      {stars.map((star, index) => (
        <FaStar key={index} className={star === 'full' ? 'full-star' : 'empty-star'} />
      ))}
    </div>
  );
}

export default GameRating;
