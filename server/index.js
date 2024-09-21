const axios = require('axios');
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const { logger } = require('./middlewares/logger');
const {authMiddleware, adminMiddleware} = require('./middlewares/verifyJWT');
//const upload = require('./middlewares/upload');
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const gameRoutes = require('./routes/gameRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Database connected!!!'))
  .catch((err) => console.log('Database is not connected', err));
  axios.interceptors.request.use(
    (config) => {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        const { token } = JSON.parse(storedAuth);
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
// Middleware
app.use(logger);
app.use(cookieParser());
app.use(cors({
  origin: 'https://game-store-client.vercel.app',
  credentials: true,
}));
app.use(express.json());
// Routes
app.use('/', authRoutes);
app.use('/authMiddleware', authMiddleware);
app.use('/api/v1', imageRoutes);
app.use('/api/v1', paymentRoutes);
app.use('/api/v1', cartRoutes);
app.use('/category', categoryRoutes);
app.use('/api/v1', gameRoutes);
//app.use('/upload', upload);
// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: '404 Not Found' });
});


const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));