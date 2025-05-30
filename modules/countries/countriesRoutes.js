const express = require('express');
const router = express.Router();
const countriesController = require('./countriesController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Custom middleware to bypass authorization for Super Admin (role_id = 1)
const superAdminBypass = (req, res, next) => {
    if (req.user && req.user.role_id === 1) {
        return next();
    }
    next();
};

router.get('/get-countries/', authenticate, superAdminBypass, authorize('countries_read'), countriesController.getAllCountries);
router.get('/get-country/:id', authenticate, superAdminBypass, authorize('countries_read'), countriesController.getCountryById);
router.post('/create-country/', authenticate, superAdminBypass, authorize('countries_create'), countriesController.createCountry);
router.put('/update-country/:id', authenticate, superAdminBypass, authorize('countries_update'), countriesController.updateCountry);
router.delete('/delete-country/:id', authenticate, superAdminBypass, authorize('countries_delete'), countriesController.deleteCountry);

module.exports = router;