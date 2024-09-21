const User = require('../model/user');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const test = (req, res) => {
    res.json('test is working');
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password is required and should be at least 6 characters long' });
        }
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ error: 'Email is already taken' });
        }
        const hashedPassword = await hashPassword(password);
        const isAdmin = email === process.env.ADMIN_EMAIL; // Check if the email is the admin email
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isAdmin
        });
        return res.status(201).json({
            message: 'Registration successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = jwt.sign(
            { "UserInfo": { "email": user.email, "isAdmin": user.isAdmin } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15s' }
        );
        const refreshToken = jwt.sign(
            { "email": user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );
        res.cookie('jwt', refreshToken, {
           // secure: true,
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000,
           // domain: '.https://game-store-client.vercel.app'
        });
        const userWithCart = await User.findById(user._id).select('cart').lean();
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            },
            accessToken: accessToken,
            cart: userWithCart.cart || []
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});



const refresh = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });

            const foundUser = await User.findOne({ email: decoded.email }).exec();

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

            const accessToken = jwt.sign(
                { "UserInfo": { "email": foundUser.email } },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15s' }
            );

            res.json({ accessToken });
        }
    );
});

const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.json({ message: 'Cookie cleared' });
};


module.exports = {
    test,
    registerUser,
    loginUser,
     refresh,
    logout,
};
