const jwt = require('jsonwebtoken');
const { JWT_ADMIN_SECRET } = require('../config');

function adminMiddleware(req, res, next) {
    const token = req.headers.token;
    const decoded = jwt.verify(token, JWT_ADMIN_SECRET);

    if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    req.userId = decoded.id;
    next();
}

module.exports = {
    adminMiddleware
};