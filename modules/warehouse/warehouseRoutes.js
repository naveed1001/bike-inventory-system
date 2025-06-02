const express = require('express');
const router = express.Router();
const warehouseController = require('./warehouseController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Custom middleware to bypass authorization for Super Admin (role_id = 1)
const superAdminBypass = (req, res, next) => {
    if (req.user && req.user.role_id === 1) {
        return next();
    }
    next();
};

router.get('/get-warehouses', authenticate, superAdminBypass, authorize('warehouse_read'), warehouseController.getAllWarehouses);
router.get('/get-warehouse/:id', authenticate, superAdminBypass, authorize('warehouse_read'), warehouseController.getWarehouseById);
router.post('/create-warehouse', authenticate, superAdminBypass, authorize('warehouse_create'), warehouseController.createWarehouse);
router.put('/update-warehouse/:id', authenticate, superAdminBypass, authorize('warehouse_update'), warehouseController.updateWarehouse);
router.delete('/delete-warehouse/:id', authenticate, superAdminBypass, authorize('warehouse_delete'), warehouseController.deleteWarehouse);

module.exports = router;