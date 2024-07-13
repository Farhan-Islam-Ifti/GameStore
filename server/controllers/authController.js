const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');

// Function to create access and refresh tokens
const createTokens = (user) => {
  const accessToken = jwt.sign(
    { email: user.email, id: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { email: user.email, id: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

const test = (req, res) => {
  res.json('test is working');
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if name was entered
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Check password
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password is required and should be at least 6 characters long' });
    }

    // Check if email already exists
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Return successful response
    return res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not found' });
    }

    // Compare passwords
    const match = await comparePassword(password, user.password);
    if (match) {
      const { accessToken, refreshToken } = createTokens(user);
      res.cookie('accessToken', accessToken, { httpOnly: true });
      res.cookie('refreshToken', refreshToken, { httpOnly: true });

      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      return res.status(400).json({ error: 'Wrong password' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getProfile = (req, res) => {
  const { accessToken } = req.cookies;
  if (accessToken) {
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

const refreshToken = (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const { accessToken, refreshToken: newRefreshToken } = createTokens(user);
      res.cookie('accessToken', accessToken, { httpOnly: true });
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
      res.json({ accessToken, refreshToken: newRefreshToken });
    });
  } else {
    res.sendStatus(403);
  }
};

const logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};

module.exports = {
  test,
  registerUser,
  loginUser,
  getProfile,
  refreshToken,
  logout,
};
