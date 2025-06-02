
const express = require('express');
const router = express.Router();
const usersController = require('./usersController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Custom middleware to bypass authorization for Super Admin (role_id = 1)
const superAdminBypass = (req, res, next) => {
    if (req.user && req.user.role_id === 1) {
        return next();
    }
    next();
};

router.post('/login', usersController.loginUser);
router.get('/get-users', authenticate, superAdminBypass, authorize('users_read'), usersController.getAllUsers);
router.get('/get-user/:id', authenticate, superAdminBypass, authorize('users_read'), usersController.getUserById);
router.post('/create-user', authenticate, superAdminBypass, authorize('users_create'), usersController.createUser);
router.put('/update-user/:id', authenticate, superAdminBypass, authorize('users_update'), usersController.updateUser);
router.delete('/delete-user/:id', authenticate, superAdminBypass, authorize('users_delete'), usersController.deleteUser);
router.put('/reset-password/:id', authenticate, superAdminBypass, authorize('users_reset_password'), usersController.resetUserPassword);
router.get('/search-users', authenticate, superAdminBypass, authorize('users_search'), usersController.searchUserByUsername);

module.exports = router;