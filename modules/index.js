const express = require('express');
const router = express.Router();

const roles = require('./roles');
const permissions = require('./permissions');
const bankingDetails = require('./bankingDetails');
const countries = require('./countries');
const cities = require('./cities');
const status = require('./status');

router.use('/roles', roles.router);
router.use('/permissions', permissions.router);
router.use('/banking-details', bankingDetails.bankingDetailsRouter);
router.use('/countries', countries.countriesRouter);
router.use('/cities', cities.citiesRouter);
router.use('/status', status.statusRouter);

module.exports = router;