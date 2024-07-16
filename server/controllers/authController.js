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
      //  const foundUser = await User.findOne({user}).exec()
        if(!match)  return res.status(700).json({
            error: 'Wrong password'
        });
        if (match) {
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": user.email,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )
        
            const refreshToken = jwt.sign(
                { "email": user.email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            )
        
            // Create secure cookie with refresh token 
            res.cookie('jwt', refreshToken, {
                httpOnly: true, //accessible only by web server 
                secure: true, //https
                sameSite: 'None', //cross-site cookie 
                maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
            })
        
            // Send accessToken containing username and roles 
         //   res.json({ accessToken })
            
            return res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                accessToken
            });
            
        } 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ email }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": foundUser.email,
                       // "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        })
    )
}
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    test,
    registerUser,
    loginUser,
    refresh,
    logout,
};
