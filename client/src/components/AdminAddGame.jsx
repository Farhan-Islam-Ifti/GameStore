import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaUpload } from 'react-icons/fa';
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
  const [games, setGames] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [isUpload, setIsUpload] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get('/api/v1/games');
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'platform' || name === 'tags') {
      setGame(prevGame => ({
        ...prevGame,
        [name]: value.split(',').map(item => item.trim())
      }));
    } else if (type === 'checkbox') {
      setGame(prevGame => ({
        ...prevGame,
        [name]: checked
      }));
    } else if (type === 'file') {
      if (files && files[0]) {
        setGame(prevGame => ({
          ...prevGame,
          imageFile: files[0],
          imageUrl: ''
        }));
        setPreviewImage(URL.createObjectURL(files[0]));
      }
    } else if (name === 'imageUrl') {
      setGame(prevGame => ({
        ...prevGame,
        imageUrl: value,
        imageFile: null
      }));
      setPreviewImage(value);
    } else {
      setGame(prevGame => ({
        ...prevGame,
        [name]: value
      }));
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

      let response;
      if (editingId) {
        response = await axios.put(`/api/v1/games/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Game updated successfully!');
      } else {
        response = await axios.post('/api/v1/games', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Game added successfully!');
      }

      setGame(initialGameState);
      setPreviewImage(null);
      setEditingId(null);
      fetchGames();
    } catch (error) {
      setMessage('Error processing game. Please try again.');
      console.error('Error processing game:', error);
    }
  };

  const handleEdit = (gameToEdit) => {
    setGame({
      ...gameToEdit,
      imageFile: null,
      platform: Array.isArray(gameToEdit.platform) ? gameToEdit.platform : [],
      tags: Array.isArray(gameToEdit.tags) ? gameToEdit.tags : []
    });
    setPreviewImage(gameToEdit.imageUrl || null);
    setEditingId(gameToEdit._id);
    setIsUpload(!gameToEdit.imageUrl);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        await axios.delete(`/api/v1/games/${id}`);
        setMessage('Game deleted successfully!');
        fetchGames();
      } catch (error) {
        setMessage('Error deleting game. Please try again.');
        console.error('Error deleting game:', error);
      }
    }
  };

  return (
    <div className="admin-add-game">
      <h2>{editingId ? 'Edit Game' : 'Add New Game'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title</label>
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
            <label htmlFor="price">Price</label>
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
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={game.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="genre">Genre</label>
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
            <label htmlFor="platform">Platforms</label>
            <input
              type="text"
              id="platform"
              name="platform"
              value={Array.isArray(game.platform) ? game.platform.join(', ') : ''}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="developer">Developer</label>
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
            <label htmlFor="publisher">Publisher</label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              value={game.publisher}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="releaseDate">Release Date</label>
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
            <label htmlFor="rating">Rating</label>
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
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={Array.isArray(game.tags) ? game.tags.join(', ') : ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group checkbox-group">
            <label htmlFor="inStock">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={game.inStock}
                onChange={handleChange}
              />
              In Stock
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="discountPercentage">Discount %</label>
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
            <div className="file-input-wrapper">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button type="button" onClick={handleUploadClick} className="file-input-label">
                <FaUpload /> Choose File
              </button>
            </div>
          ) : (
            <input
              type="url"
              name="imageUrl"
              value={game.imageUrl}
              onChange={handleChange}
              placeholder="Image URL"
              className="image-url-input"
            />
          )}

          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Preview" />
            </div>
          )}
        </div>
        <button type="submit">{editingId ? 'Update Game' : 'Add Game'}</button>
      </form>
      {message && <p className="message">{message}</p>}
      
      <h3>Game List</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {games.map(game => (
            <tr key={game._id}>
              <td>{game.title}</td>
              <td>${game.price}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(game)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(game._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAddGame;