import React, { useState } from 'react';
import axios from 'axios';
import './AdminAddGames.css'

const AdminAddGame = () => {
  const initialGameState = {
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    imageFile: null,
    genre: '',
    platform: [],
    developer: '',
    publisher: '',
    releaseDate: '',
    rating: '',
    tags: [],
    inStock: true,
    discountPercentage: '0'
  };

  const [game, setGame] = useState(initialGameState);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'platform' || name === 'tags') {
      setGame(prevGame => ({ ...prevGame, [name]: value.split(',').map(item => item.trim()) }));
    } else if (type === 'checkbox') {
      setGame(prevGame => ({ ...prevGame, [name]: checked }));
    } else if (type === 'file') {
      setGame(prevGame => ({ ...prevGame, imageFile: files[0], imageUrl: '' }));
    } else {
      setGame(prevGame => ({ ...prevGame, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const formData = new FormData();
      Object.keys(game).forEach(key => {
        if (key === 'imageFile' && game[key]) {
          formData.append('image', game[key]);
        } else if (key !== 'imageFile') {
          formData.append(key, game[key]);
        }
      });

      const response = await axios.post('https://game-store-server-jet.vercel.app/v1/games', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(`Game added successfully: ${response.data.title}`);
      setGame(initialGameState);
    } catch (error) {
      setMessage('Error adding game. Please try again.');
      console.error('Error adding game:', error);
    }
  };

  return (
    <div className="admin-add-game">
      <h2>Add New Game</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={game.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />

        <textarea
          name="description"
          value={game.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />

        <input
          type="number"
          name="price"
          value={game.price}
          onChange={handleChange}
          step="0.01"
          min="0"
          placeholder="Price"
          required
        />

        <div className="image-input-group">
          <input
            type="url"
            name="imageUrl"
            value={game.imageUrl}
            onChange={handleChange}
            placeholder="Image URL"
          />
          <div className="file-input-wrapper">
            <input
              type="file"
              name="imageFile"
              onChange={handleChange}
              accept="image/*"
            />
            <span>Choose File</span>
          </div>
        </div>
        {game.imageFile && <p className="file-name">{game.imageFile.name}</p>}

        <input
          type="text"
          name="genre"
          value={game.genre}
          onChange={handleChange}
          placeholder="Genre"
          required
        />

        <input
          type="text"
          name="platform"
          value={game.platform.join(', ')}
          onChange={handleChange}
          placeholder="Platforms (comma-separated)"
          required
        />

        <input
          type="text"
          name="developer"
          value={game.developer}
          onChange={handleChange}
          placeholder="Developer"
          required
        />

        <input
          type="text"
          name="publisher"
          value={game.publisher}
          onChange={handleChange}
          placeholder="Publisher"
          required
        />

        <input
          type="date"
          name="releaseDate"
          value={game.releaseDate}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="rating"
          value={game.rating}
          onChange={handleChange}
          step="0.1"
          min="0"
          max="5"
          placeholder="Rating"
          required
        />

        <input
          type="text"
          name="tags"
          value={game.tags.join(', ')}
          onChange={handleChange}
          placeholder="Tags (comma-separated)"
        />

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="inStock"
            name="inStock"
            checked={game.inStock}
            onChange={handleChange}
          />
          <label htmlFor="inStock">In Stock</label>
        </div>

        <input
          type="number"
          name="discountPercentage"
          value={game.discountPercentage}
          onChange={handleChange}
          min="0"
          max="100"
          placeholder="Discount Percentage"
        />

        <button type="submit">Add Game</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AdminAddGame;