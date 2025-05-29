const { validateCreateBankingDetail, validateUpdateBankingDetail } = require('./bankingDetailsValidator');
const { ApiError, ApiResponse } = require('../../utils');
const BankingDetailsRepository = require('./bankingDetailsRepository');
const { StatusCodes } = require("http-status-codes");

class BankingDetailsService {
    async getAllBankingDetails() {
        try {
            const bankingDetails = await BankingDetailsRepository.findAll();
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Banking details retrieved successfully',
                payload: bankingDetails,
            });
        } catch (error) {
            throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getBankingDetailById(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid banking detail ID', StatusCodes.BAD_REQUEST);
            }
            const bankingDetail = await BankingDetailsRepository.findById(parsedId);
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Banking detail retrieved successfully',
                payload: bankingDetail,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('not found') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async createBankingDetail(data) {
        try {
            const { error } = validateCreateBankingDetail(data);
            if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

            const { name, account_number, branch, iban } = data;
            const bankingDetail = await BankingDetailsRepository.create({ name, account_number, branch, iban });
            return new ApiResponse({
                code: StatusCodes.CREATED,
                message: 'Banking detail created successfully',
                payload: bankingDetail,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('Duplicate') ? StatusCodes.CONFLICT : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async updateBankingDetail(id, data) {
        try {
            const { error } = validateUpdateBankingDetail(data);
            if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid banking detail ID', StatusCodes.BAD_REQUEST);
            }
            const { name, account_number, branch, iban } = data;
            const bankingDetail = await BankingDetailsRepository.update(parsedId, { name, account_number, branch, iban });
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Banking detail updated successfully',
                payload: bankingDetail,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('not found') ? StatusCodes.NOT_FOUND : error.message.includes('Duplicate') ? StatusCodes.CONFLICT : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteBankingDetail(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid banking detail ID', StatusCodes.BAD_REQUEST);
            }
            const result = await BankingDetailsRepository.delete(parsedId);
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Banking detail soft deleted successfully',
                payload: result,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('not found') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = new BankingDetailsService();