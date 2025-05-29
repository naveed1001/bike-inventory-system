const { validateCreateCountry, validateUpdateCountry } = require('./countriesValidator');
const { ApiError, ApiResponse } = require('../../utils');
const CountriesRepository = require('./countriesRepository');
const { StatusCodes } = require("http-status-codes");

class CountriesService {
    async getAllCountries() {
        try {
            const countries = await CountriesRepository.findAll();
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Countries retrieved successfully',
                payload: countries,
            });
        } catch (error) {
            throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getCountryById(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid country ID', StatusCodes.BAD_REQUEST);
            }
            const country = await CountriesRepository.findById(parsedId);
            if (!country) {
                throw new ApiError('Country not found', StatusCodes.NOT_FOUND);
            }
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Country retrieved successfully',
                payload: country,
            });
        } catch (error) {
            throw new ApiError(error.message, error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async createCountry(data) {
        try {
            const { error } = validateCreateCountry(data);
            if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

            const { name } = data;
            const country = await CountriesRepository.create({ name });
            return new ApiResponse({
                code: StatusCodes.CREATED,
                message: 'Country created successfully',
                payload: country,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('Duplicate') ? StatusCodes.CONFLICT : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async updateCountry(id, data) {
        try {
            const { error } = validateUpdateCountry(data);
            if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid country ID', StatusCodes.BAD_REQUEST);
            }
            const { name } = data;
            const country = await CountriesRepository.update(parsedId, { name });
            if (!country) {
                throw new ApiError('Country not found', StatusCodes.NOT_FOUND);
            }
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Country updated successfully',
                payload: country,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('Duplicate') ? StatusCodes.CONFLICT : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteCountry(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid country ID', StatusCodes.BAD_REQUEST);
            }
            const success = await CountriesRepository.delete(parsedId);
            if (!success) {
                throw new ApiError('Country not found', StatusCodes.NOT_FOUND);
            }
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Country soft deleted successfully',
                payload: { message: 'Country soft deleted successfully' },
            });
        } catch (error) {
            throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = new CountriesService();