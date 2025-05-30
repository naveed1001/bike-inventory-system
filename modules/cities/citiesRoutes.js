const express = require('express');
const router = express.Router();
const citiesController = require('./citiesController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Custom middleware to bypass authorization for Super Admin (role_id = 1)
const superAdminBypass = (req, res, next) => {
    if (req.user && req.user.role_id === 1) {
        return next();
    }
    next();
};

router.get('/get-cities', authenticate, superAdminBypass, authorize('cities_read'), citiesController.getAllCities);
router.get('/get-city/:id', authenticate, superAdminBypass, authorize('cities_read'), citiesController.getCityById);
router.post('/create-city', authenticate, superAdminBypass, authorize('cities_create'), citiesController.createCity);
router.put('/update-city/:id', authenticate, superAdminBypass, authorize('cities_update'), citiesController.updateCity);
router.delete('/delete-city/:id', authenticate, superAdminBypass, authorize('cities_delete'), citiesController.deleteCity);

module.exports = router;