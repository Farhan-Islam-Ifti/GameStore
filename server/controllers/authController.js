const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth');

const test = (req, res) => {
    res.json('test is working');
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if name was entered
        if (!name) {
            return res.status(400).json({
                error: 'Name is required'
            });
        }

        // Check password
        if (!password || password.length < 6) {
            return res.status(400).json({
                error: 'Password is required and should be at least 6 characters long'
            });
        }

        // Check if email already exists
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({
                error: 'Email is already taken'
            });
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
            }
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
            return res.status(400).json({
                error: 'Email not found'
            });
        }

        // Compare passwords
        const match = await comparePassword(password, user.password);
        if (match) {
            return res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                }
            });
        } else {
            return res.status(700).json({
                error: 'Wrong password'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    test,
    registerUser,
    loginUser
};
