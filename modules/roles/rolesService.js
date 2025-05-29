const { validateCreateRole, validateUpdateRole } = require('./rolesValidator');
const { ApiError, ApiResponse } = require('../../utils');
const RolesRepository = require('./rolesRepository');
const { StatusCodes } = require("http-status-codes");

class RolesService {
    async getAllRoles() {
        try {
            const roles = await RolesRepository.findAll();
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Roles retrieved successfully',
                payload: roles,
            });
        } catch (error) {
            throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getRoleById(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid role ID', StatusCodes.BAD_REQUEST);
            }
            const role = await RolesRepository.findById(parsedId);
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Role retrieved successfully',
                payload: role,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('not found') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async createRole(data) {
        try {
            const { error } = validateCreateRole(data);
            if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

            const { role_name } = data;
            const role = await RolesRepository.create({ role_name });
            return new ApiResponse({
                code: StatusCodes.CREATED,
                message: 'Role created successfully',
                payload: role,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('exists') ? StatusCodes.CONFLICT : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async updateRole(id, data) {
        try {
            const { error } = validateUpdateRole(data);
            if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid role ID', StatusCodes.BAD_REQUEST);
            }
            const { role_name } = data;
            const role = await RolesRepository.update(parsedId, { role_name });
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Role updated successfully',
                payload: role,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('not found') ? StatusCodes.NOT_FOUND : error.message.includes('exists') ? StatusCodes.CONFLICT : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteRole(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid role ID', StatusCodes.BAD_REQUEST);
            }
            const result = await RolesRepository.deleteRole(parsedId);
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Role soft deleted successfully',
                payload: result,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('not found') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = new RolesService();