const jwt = require('jsonwebtoken');
const { JWT_USER_SECRET } = require('../config');

function userMiddleware(req, res, next) {
    const token = req.headers.authorization;
    const words = token.split(' ');
    const jwtToken = words[1];
    const decoded = jwt.verify(jwtToken, JWT_USER_SECRET);

    if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    req.userId = decoded.userId;
    next();
}

module.exports = {
    userMiddleware
};