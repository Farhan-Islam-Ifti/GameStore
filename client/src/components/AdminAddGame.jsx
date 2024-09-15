import React, { useState, useRef } from 'react';
import axios from 'axios';
import './AdminAddGames.css';

const AdminAddGame = () => {
  const initialGameState = {
    title: '',
    description: '',
    price: '',
    imageFile: null,
    imageUrl: '',
    genre: '',
    platform: [],
    developer: '',
    publisher: '',
    releaseDate: '',
    rating: '',
    tags: [],
    inStock: true,
    discountPercentage: '0',
  };

  const [game, setGame] = useState(initialGameState);
  const [message, setMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [isUpload, setIsUpload] = useState(true);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'platform' || name === 'tags') {
      setGame(prevGame => ({ ...prevGame, [name]: value.split(',').map(item => item.trim()) }));
    } else if (type === 'checkbox') {
      setGame(prevGame => ({ ...prevGame, [name]: checked }));
    } else if (type === 'file') {
      if (files && files[0]) {
        setGame(prevGame => ({ ...prevGame, imageFile: files[0], imageUrl: '' }));
        setPreviewImage(URL.createObjectURL(files[0]));
      }
    } else if (name === 'imageUrl') {
      setGame(prevGame => ({ ...prevGame, imageUrl: value, imageFile: null }));
      setPreviewImage(value);
    } else {
      setGame(prevGame => ({ ...prevGame, [name]: value }));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const formData = new FormData();
      Object.keys(game).forEach(key => {
        if (key === 'imageFile' && game[key]) {
          formData.append('image', game[key]);
        } else if (key === 'imageUrl' && game[key]) {
          formData.append('imageUrl', game[key]);
        } else if (Array.isArray(game[key])) {
          formData.append(key, JSON.stringify(game[key]));
        } else {
          formData.append(key, game[key]);
        }
      });

      const response = await axios.post('/api/v1/games', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(`Game added successfully: ${response.data.title}`);
      setGame(initialGameState);
      setPreviewImage(null);
    } catch (error) {
      setMessage('Error adding game. Please try again.');
      console.error('Error adding game:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="admin-add-game">
      <h2>Add New Game</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={game.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={game.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={game.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="image-input-group">
          <div className="toggle-group">
            <button
              type="button"
              className={isUpload ? 'active' : ''}
              onClick={() => setIsUpload(true)}
            >
              Upload Image
            </button>
            <button
              type="button"
              className={!isUpload ? 'active' : ''}
              onClick={() => setIsUpload(false)}
            >
              Image URL
            </button>
          </div>

          {isUpload ? (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button type="button" onClick={handleUploadClick} className="file-input-label">
                Choose File
              </button>
            </>
          ) : (
            <input
              type="url"
              name="imageUrl"
              value={game.imageUrl}
              onChange={handleChange}
              placeholder="Image URL"
            />
          )}

          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="genre">Genre:</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={game.genre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="platform">Platforms (comma-separated):</label>
          <input
            type="text"
            id="platform"
            name="platform"
            value={game.platform.join(', ')}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="developer">Developer:</label>
          <input
            type="text"
            id="developer"
            name="developer"
            value={game.developer}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="publisher">Publisher:</label>
          <input
            type="text"
            id="publisher"
            name="publisher"
            value={game.publisher}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="releaseDate">Release Date:</label>
          <input
            type="date"
            id="releaseDate"
            name="releaseDate"
            value={game.releaseDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating:</label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={game.rating}
            onChange={handleChange}
            step="0.1"
            min="0"
            max="5"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated):</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={game.tags.join(', ')}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="inStock">In Stock:</label>
          <input
            type="checkbox"
            id="inStock"
            name="inStock"
            checked={game.inStock}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="discountPercentage">Discount Percentage:</label>
          <input
            type="number"
            id="discountPercentage"
            name="discountPercentage"
            value={game.discountPercentage}
            onChange={handleChange}
            min="0"
            max="100"
          />
        </div>

        <button type="submit">Add Game</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AdminAddGame;
