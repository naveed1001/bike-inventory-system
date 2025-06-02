const express = require('express');
const router = express.Router();
const organizationController = require('./organizationController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Custom middleware to bypass authorization for Super Admin (role_id = 1)
const superAdminBypass = (req, res, next) => {
    if (req.user && req.user.role_id === 1) {
        return next();
    }
    next();
};

router.get('/get-organizations', authenticate, superAdminBypass, authorize('organizations_read'), organizationController.getAllOrganizations);
router.get('/get-organization/:id', authenticate, superAdminBypass, authorize('organizations_read'), organizationController.getOrganizationById);
router.post('/create-organization', authenticate, superAdminBypass, authorize('organizations_create'), organizationController.createOrganization);
router.put('/update-organization/:id', authenticate, superAdminBypass, authorize('organizations_update'), organizationController.updateOrganization);
router.delete('/delete-organization/:id', authenticate, superAdminBypass, authorize('organizations_delete'), organizationController.deleteOrganization);

module.exports = router;