const express = require('express');
const router = express.Router();

const roles = require('./roles');
const permissions = require('./permissions');
const bankingDetails = require('./bankingDetails');
const countries = require('./countries');
const cities = require('./cities');
const status = require('./status');
const brand = require('./brand');
const vendor = require('./vendor');
const users = require('./users');

router.use('/roles', roles.router);
router.use('/permissions', permissions.router);
router.use('/banking-details', bankingDetails.bankingDetailsRouter);
router.use('/countries', countries.countriesRouter);
router.use('/cities', cities.citiesRouter);
router.use('/status', status.statusRouter);
router.use('/brand', brand.brandRouter);
router.use('/vendor', vendor.vendorRouter);
router.use('/users', users.usersRouter);

module.exports = router;