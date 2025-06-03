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
const organization = require('./organization');
const warehouse = require('./warehouse');
const itemTypes = require('./itemTypes');
const capacityTypes = require('./capacityTypes');
const item = require('./item');
const specifications = require('./specifications');
const payment = require('./payment');
const installmentPlan = require('./InstallmentPlan');
const instruments = require('./instruments');
const installment = require('./installment');
const paymentDetail = require('./paymentDetails');


router.use('/roles', roles.router);
router.use('/permissions', permissions.router);
router.use('/banking-details', bankingDetails.bankingDetailsRouter);
router.use('/countries', countries.countriesRouter);
router.use('/cities', cities.citiesRouter);
router.use('/status', status.statusRouter);
router.use('/brand', brand.brandRouter);
router.use('/vendor', vendor.vendorRouter);
router.use('/users', users.usersRouter);
router.use('/organizations', organization.organizationRouter);
router.use('/warehouses', warehouse.warehouseRouter);
router.use('/item-types', itemTypes.itemTypesRouter);
router.use('/capacity-types', capacityTypes.capacityTypesRouter);
router.use('/items', item.itemRouter);
router.use('/specifications', specifications.specificationsRouter);
router.use('/payments', payment.paymentRouter);
router.use('/installment-plans', installmentPlan.installmentPlanRouter);
router.use('/instruments', instruments.instrumentsRouter);
router.use('/installments', installment.installmentRouter);
router.use('/payment-details', paymentDetail.paymentDetailRouter);


module.exports = router;