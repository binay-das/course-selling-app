const jwt = require('jsonwebtoken');
const { JWT_ADMIN_SECRET } = require('../config');

function adminMiddleware(req, res, next) {
    const token = req.headers.authorization;
    const words = token.split(' ');
    const jwtToken = words[1];
    const decoded = jwt.verify(jwtToken, JWT_ADMIN_SECRET);

    if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    req.userId = decoded.adminId;
    next();
}

module.exports = {
    adminMiddleware
};