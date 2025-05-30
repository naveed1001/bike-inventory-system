const express = require('express');
const router = express.Router();
const bankingDetailsController = require('./bankingDetailsController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Custom middleware to bypass authorization for Super Admin (role_id = 1)
const superAdminBypass = (req, res, next) => {
    if (req.user && req.user.role_id === 1) {
        return next();
    }
    next();
};

router.get('/get-banking-details/', authenticate, superAdminBypass, authorize('banking_details_read'), bankingDetailsController.getAllBankingDetails);
router.get('/get-banking-detail/:id', authenticate, superAdminBypass, authorize('banking_details_read'), bankingDetailsController.getBankingDetailById);
router.post('/create-banking-detail/', authenticate, superAdminBypass, authorize('banking_details_create'), bankingDetailsController.createBankingDetail);
router.put('/update-banking-detail/:id', authenticate, superAdminBypass, authorize('banking_details_update'), bankingDetailsController.updateBankingDetail);
router.delete('/delete-banking-detail/:id', authenticate, superAdminBypass, authorize('banking_details_delete'), bankingDetailsController.deleteBankingDetail);

module.exports = router;