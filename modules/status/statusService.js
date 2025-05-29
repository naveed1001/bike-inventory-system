const { validateCreateStatus, validateUpdateStatus } = require('./statusValidator');
const { ApiError, ApiResponse } = require('../../utils');
const StatusRepository = require('./statusRepository');
const { StatusCodes } = require('http-status-codes');

class StatusService {
    async getAllStatuses() {
        try {
            const statuses = await StatusRepository.findAllStatuses();
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Statuses retrieved successfully',
                payload: statuses,
            });
        } catch (error) {
            throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getStatusById(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid status ID', StatusCodes.BAD_REQUEST);
            }
            const status = await StatusRepository.findStatusById(parsedId);
            if (!status) {
                throw new ApiError('Status not found', StatusCodes.NOT_FOUND);
            }
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Status retrieved successfully',
                payload: status,
            });
        } catch (error) {
            throw new ApiError(error.message, error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async createStatus(data) {
        try {
            const { error } = validateCreateStatus(data);
            if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

            const { name, value } = data;
            const status = await StatusRepository.createStatus(name, value);
            return new ApiResponse({
                code: StatusCodes.CREATED,
                message: 'Status created successfully',
                payload: status,
            });
        } catch (error) {
            throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async updateStatus(id, data) {
        try {
            const { error } = validateUpdateStatus(data);
            if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid status ID', StatusCodes.BAD_REQUEST);
            }
            const { name, value } = data;
            const status = await StatusRepository.updateStatus(parsedId, name, value);
            if (!status) {
                throw new ApiError('Status not found', StatusCodes.NOT_FOUND);
            }
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Status updated successfully',
                payload: status,
            });
        } catch (error) {
            throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteStatus(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid status ID', StatusCodes.BAD_REQUEST);
            }
            const success = await StatusRepository.deleteStatus(parsedId);
            if (!success) {
                throw new ApiError('Status not found', StatusCodes.NOT_FOUND);
            }
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Status soft deleted successfully',
                payload: { message: 'Status soft deleted successfully' },
            });
        } catch (error) {
            throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = new StatusService();