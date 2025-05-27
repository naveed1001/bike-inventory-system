const express = require('express');
const router = express.Router();

const roles = require('./roles');
const permissions = require('./permissions');
const bankingDetails = require('./bankingDetails');

router.use('/roles', roles.router);
router.use('/permissions', permissions.router);
router.use('/banking-details', bankingDetails.bankingDetailsRouter);

module.exports = router;