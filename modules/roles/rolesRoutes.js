const express = require('express');
const rolesController = require('./rolesController');
const router = express.Router();
// const rolesController = require('./rolesController');

router.get('/get-roles/', rolesController.getAllRoles);
router.get('/get-role/:id', rolesController.getRoleById);
router.post('/create-role/', rolesController.createRole);
router.put('/update-role/:id', rolesController.updateRole);
router.delete('/delete-role/:id', rolesController.deleteRole);

module.exports = router;