const express = require('express');
const router = express.Router();
const permissionsController = require('./permissionsController');

router.get('/get-permissions/', permissionsController.getAllPermissions);
router.get('/get-permission/:id', permissionsController.getPermissionById);
router.post('/create-permission/', permissionsController.createPermission);
router.put('/update-permission/:id', permissionsController.updatePermission);
router.delete('/delete-permission/:id', permissionsController.deletePermission);
router.post('/assign-permission/', permissionsController.assignPermission);
router.delete('/unassign-permission/', permissionsController.unassignPermission);

module.exports = router;