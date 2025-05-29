const { validateCreateCity, validateUpdateCity } = require('./citiesValidator');
const { ApiError, ApiResponse } = require('../../utils');
const CitiesRepository = require('./citiesRepository');
const { StatusCodes } = require('http-status-codes');

class CitiesService {
    async getAllCities() {
        try {
            const cities = await CitiesRepository.findAllCities();
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Cities retrieved successfully',
                payload: cities,
            });
        } catch (error) {
            throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getCityById(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid city ID', StatusCodes.BAD_REQUEST);
            }
            const city = await CitiesRepository.findCityById(parsedId);
            if (!city) {
                throw new ApiError('City not found', StatusCodes.NOT_FOUND);
            }
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'City retrieved successfully',
                payload: city,
            });
        } catch (error) {
            throw new ApiError(error.message, error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async createCity(data) {
        try {
            const { error } = validateCreateCity(data);
            if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

            const { name } = data;
            const city = await CitiesRepository.createCity(name); // Updated to createCity
            return new ApiResponse({
                code: StatusCodes.CREATED,
                message: 'City created successfully',
                payload: city,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('Duplicate') ? StatusCodes.CONFLICT : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async updateCity(id, data) {
        try {
            const { error } = validateUpdateCity(data);
            if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid city ID', StatusCodes.BAD_REQUEST);
            }
            const { name } = data;
            const city = await CitiesRepository.updateCity(parsedId, name); // Updated to updateCity
            if (!city) {
                throw new ApiError('City not found', StatusCodes.NOT_FOUND);
            }
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'City updated successfully',
                payload: city,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('Duplicate') ? StatusCodes.CONFLICT : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteCity(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid city ID', StatusCodes.BAD_REQUEST);
            }
            const success = await CitiesRepository.deleteCity(parsedId); // Updated to deleteCity
            if (!success) {
                throw new ApiError('City not found', StatusCodes.NOT_FOUND);
            }
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'City soft deleted successfully',
                payload: { message: 'City soft deleted successfully' },
            });
        } catch (error) {
            throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = new CitiesService();