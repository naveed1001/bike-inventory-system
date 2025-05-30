const express = require('express');
const router = express.Router();
const permissionsController = require('./permissionsController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Custom middleware to bypass authorization for Super Admin (role_id = 1)
const superAdminBypass = (req, res, next) => {
    if (req.user && req.user.role_id === 1) {
        return next();
    }
    next();
};

router.get('/get-permissions/', authenticate, superAdminBypass, authorize('permissions_read'), permissionsController.getAllPermissions);
router.get('/get-permission/:id', authenticate, superAdminBypass, authorize('permissions_read'), permissionsController.getPermissionById);
router.post('/create-permission/', authenticate, superAdminBypass, authorize('permissions_create'), permissionsController.createPermission);
router.put('/update-permission/:id', authenticate, superAdminBypass, authorize('permissions_update'), permissionsController.updatePermission);
router.delete('/delete-permission/:id', authenticate, superAdminBypass, authorize('permissions_delete'), permissionsController.deletePermission);
router.post('/assign-permission/', authenticate, superAdminBypass, authorize('role_permissions_assign'), permissionsController.assignPermission);
router.delete('/unassign-permission/', authenticate, superAdminBypass, authorize('role_permissions_unassign'), permissionsController.unassignPermission);

module.exports = router;