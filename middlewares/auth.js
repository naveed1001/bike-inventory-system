const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new ApiError('No token provided', 401);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        throw new ApiError('Invalid token', 401);
    }
};


const authorize = (requiredPermission) => (req, res, next) => {
    if (!req.user.permissions.includes(requiredPermission)) {
        throw new Error('Insufficient permissions');
    }
    next();
};


// const getPermissionsByRoleId = async (roleId) => {
//     const [permissionsRows] = await pool.execute(
//         `SELECT p.permission_key 
//          FROM role_permissions rp 
//          JOIN permissions p ON rp.permission_id = p.id 
//          WHERE rp.role_id = ? AND rp.deleted_at IS NULL AND p.deleted_at IS NULL`,
//         [roleId]
//     );
//     return permissionsRows.map(row => row.permission_key);
// };

// Fetch permissions based on role_id
const getPermissionsByRoleId = async (roleId) => {
    const [roles] = await pool.execute('SELECT permissions FROM roles WHERE id = ? AND deleted_at IS NULL', [roleId]);
    return roles[0]?.permissions || [];
};

module.exports = { authenticate, authorize, getPermissionsByRoleId };