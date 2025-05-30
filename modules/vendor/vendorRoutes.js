const express = require('express');
const router = express.Router();
const vendorController = require('./vendorController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Custom middleware to bypass authorization for Super Admin (role_id = 1)
const superAdminBypass = (req, res, next) => {
    if (req.user && req.user.role_id === 1) {
        return next();
    }
    next();
};

router.get('/get-vendors', authenticate, superAdminBypass, authorize('vendor_read'), vendorController.getAllVendors);
router.get('/get-vendor/:id', authenticate, superAdminBypass, authorize('vendor_read'), vendorController.getVendorById);
router.post('/create-vendor', authenticate, superAdminBypass, authorize('vendor_create'), vendorController.createVendor);
router.put('/update-vendor/:id', authenticate, superAdminBypass, authorize('vendor_update'), vendorController.updateVendor);
router.delete('/delete-vendor/:id', authenticate, superAdminBypass, authorize('vendor_delete'), vendorController.deleteVendor);

module.exports = router;