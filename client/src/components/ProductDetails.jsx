import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                const response = await axios.get(`/api/v1/games/${id}`);
                setGame(response.data);
            } catch (error) {
                console.error('Error fetching game details:', error);
            }
        };

        fetchGameDetails();
    }, [id]);
    const getImageSrc = (game) => {
        if (game.imageUrl) {
            return game.imageUrl;
        } else if (game._id) {
            return `/api/v1/images/${game._id}`;
        } else {
            return 'default-image.jpg';
        }
    };

    if (!game) {
        return <div>Loading...</div>;
    }

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="product-details">
            <div className="details-container">
                <div className="image-container">
                    <img
                        src={getImageSrc(game)}
                        alt={game.title}
                        className="game-image"
                    />
                </div>
                <div className="game-info">
                    <div className="text-container">
                        <h1 className="game-title">{game.title}</h1>
                        <p><strong>Description:</strong> {game.description}</p>
                        <></>
                        <></>
                        <p><strong>Genre:</strong> {game.genre}</p>
                        <p><strong>Platform:</strong> {game.platform.join(', ')}</p>
                        <p><strong>Developer:</strong> {game.developer}</p>
                        <p><strong>Publisher:</strong> {game.publisher}</p>
                        <p><strong>Release Date:</strong> {new Date(game.releaseDate).toLocaleDateString()}</p>
                        <div className="price-details">
                            <span className="currentPrice">
                                ৳{(game.price - (game.price * game.discountPercentage / 100)).toFixed(2)}
                            </span>
                        </div>
                        <button className="back-button" onClick={goBack}>
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
