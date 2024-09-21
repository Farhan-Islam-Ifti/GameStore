const jwt = require('jsonwebtoken');
const User = require('../model/user'); // Adjust the path as needed

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];

        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: 'Forbidden' });
                }
                
                const user = await User.findOne({ email: decoded.UserInfo.email }).exec();
                
                if (!user) {
                    return res.status(401).json({ message: 'User not found' });
                }

                req.user = {
                    id: user._id,
                    email: user.email
                };

                next();
            }
        );
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
       /* try {
         //   const token = req.header('Authorization')?.replace('Bearer ', '');
         const authHeader = req.headers.authorization || req.headers.Authorization;
         if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
            
         //   if (!token) {
           //   return res.status(401).json({ error: 'No token provided' });
          //  }
        
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.id);
        
            if (!user) {
              return res.status(401).json({ error: 'User not found' });
            }
        
            req.user = user;
            next();
          } catch (error) {
            console.error('Auth middleware error:', error);
            res.status(401).json({ error: 'Please authenticate' });
          }*/
};

const adminMiddleware = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };
