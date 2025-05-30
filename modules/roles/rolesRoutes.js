const express = require('express');
const rolesController = require('./rolesController');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');

// Custom middleware to bypass authorization for Super Admin (role_id = 1)
const superAdminBypass = (req, res, next) => {
    if (req.user && req.user.role_id === 1) {
        return next();
    }
    next();
};

router.get('/get-roles/', authenticate, superAdminBypass, authorize('roles_read'), rolesController.getAllRoles);
router.get('/get-role/:id', authenticate, superAdminBypass, authorize('roles_read'), rolesController.getRoleById);
router.post('/create-role/', authenticate, superAdminBypass, authorize('roles_create'), rolesController.createRole);
router.put('/update-role/:id', authenticate, superAdminBypass, authorize('roles_update'), rolesController.updateRole);
router.delete('/delete-role/:id', authenticate, superAdminBypass, authorize('roles_delete'), rolesController.deleteRole);

module.exports = router;