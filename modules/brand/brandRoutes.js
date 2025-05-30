const express = require('express');
const router = express.Router();
const brandController = require('./brandController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Custom middleware to bypass authorization for Super Admin (role_id = 1)
const superAdminBypass = (req, res, next) => {
    if (req.user && req.user.role_id === 1) {
        return next();
    }
    next();
};

router.get('/get-brands', authenticate, superAdminBypass, authorize('brand_read'), brandController.getAllBrands);
router.get('/get-brand/:id', authenticate, superAdminBypass, authorize('brand_read'), brandController.getBrandById);
router.post('/create-brand', authenticate, superAdminBypass, authorize('brand_create'), brandController.createBrand);
router.put('/update-brand/:id', authenticate, superAdminBypass, authorize('brand_update'), brandController.updateBrand);
router.delete('/delete-brand/:id', authenticate, superAdminBypass, authorize('brand_delete'), brandController.deleteBrand);

module.exports = router;