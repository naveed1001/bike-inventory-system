const bankingDetailsController = require('./bankingDetailsController');
const BankingDetailsRepository = require('./bankingDetailsRepository');
const BankingDetailsService = require('./bankingDetailsService');
const bankingDetailsRouter = require('./bankingDetailsRoutes'); // Import directly, no destructuring

module.exports = {
    bankingDetailsController,
    BankingDetailsRepository,
    BankingDetailsService,
    bankingDetailsRouter,
};