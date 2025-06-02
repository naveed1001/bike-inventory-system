const express = require('express');
const router = express.Router();
const itemTypesController = require('./itemTypesController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Custom middleware to bypass authorization for Super Admin (role_id = 1)
const superAdminBypass = (req, res, next) => {
    if (req.user && req.user.role_id === 1) {
        return next();
    }
    next();
};

router.get('/get-item-types', authenticate, superAdminBypass, authorize('item_types_read'), itemTypesController.getAllItemTypes);
router.get('/get-item-type/:id', authenticate, superAdminBypass, authorize('item_types_read'), itemTypesController.getItemTypeById);
router.post('/create-item-type', authenticate, superAdminBypass, authorize('item_types_create'), itemTypesController.createItemType);
router.put('/update-item-type/:id', authenticate, superAdminBypass, authorize('item_types_update'), itemTypesController.updateItemType);
router.delete('/delete-item-type/:id', authenticate, superAdminBypass, authorize('item_types_delete'), itemTypesController.deleteItemType);

module.exports = router;