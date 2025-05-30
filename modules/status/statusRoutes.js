const express = require('express');
const router = express.Router();
const statusController = require('./statusController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Custom middleware to bypass authorization for Super Admin (role_id = 1)
const superAdminBypass = (req, res, next) => {
    if (req.user && req.user.role_id === 1) {
        return next();
    }
    next();
};

router.get('/get-statuses', authenticate, superAdminBypass, authorize('status_read'), statusController.getAllStatuses);
router.get('/get-status/:id', authenticate, superAdminBypass, authorize('status_read'), statusController.getStatusById);
router.post('/create-status', authenticate, superAdminBypass, authorize('status_create'), statusController.createStatus);
router.put('/update-status/:id', authenticate, superAdminBypass, authorize('status_update'), statusController.updateStatus);
router.delete('/delete-status/:id', authenticate, superAdminBypass, authorize('status_delete'), statusController.deleteStatus);

module.exports = router;