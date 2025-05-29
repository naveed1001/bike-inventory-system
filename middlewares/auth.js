const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('JWT Verify Error:', err.message);
            return res.status(401).json({ success: false, error: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

const authorize = (requiredPermission) => (req, res, next) => {
    const userPermissions = req.user?.permissions || [];
    if (!userPermissions.includes(requiredPermission)) {
        return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }
    next();
};

module.exports = { authenticate, authorize };