const express = require('express');
const router = express.Router();

const roles = require('./roles');
const permissions = require('./permissions');

router.use('/roles', roles.router);
router.use('/permissions', permissions.router);

module.exports = router;