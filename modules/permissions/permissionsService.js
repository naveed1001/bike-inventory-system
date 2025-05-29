const { validateCreatePermission, validateUpdatePermission } = require('./permissionsValidator');
const { ApiError, ApiResponse } = require('../../utils');
const PermissionsRepository = require('./permissionsRepository');
const { StatusCodes } = require("http-status-codes");

class PermissionsService {
    async getAllPermissions() {
        try {
            const permissions = await PermissionsRepository.findAll();
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Permissions retrieved successfully',
                payload: permissions,
            });
        } catch (error) {
            throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getPermissionById(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid permission ID', StatusCodes.BAD_REQUEST);
            }
            const permission = await PermissionsRepository.findById(parsedId);
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Permission retrieved successfully',
                payload: permission,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('not found') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async createPermission(data) {
        try {
            const { error } = validateCreatePermission(data);
            if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

            const { permission_name, permission_key } = data;
            const permission = await PermissionsRepository.create({ permission_name, permission_key });
            return new ApiResponse({
                code: StatusCodes.CREATED,
                message: 'Permission created successfully',
                payload: permission,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('exists') ? StatusCodes.CONFLICT : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async updatePermission(id, data) {
        try {
            const { error } = validateUpdatePermission(data);
            if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid permission ID', StatusCodes.BAD_REQUEST);
            }
            const { permission_name, permission_key } = data;
            const permission = await PermissionsRepository.update(parsedId, { permission_name, permission_key });
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Permission updated successfully',
                payload: permission,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('not found') ? StatusCodes.NOT_FOUND : error.message.includes('exists') ? StatusCodes.CONFLICT : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async deletePermission(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid permission ID', StatusCodes.BAD_REQUEST);
            }
            const result = await PermissionsRepository.deletePermission(parsedId);
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Permission soft deleted successfully',
                payload: result,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('not found') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async assignPermission(roleId, permissionId) {
        try {
            const parsedRoleId = parseInt(roleId, 10);
            const parsedPermissionId = parseInt(permissionId, 10);
            if (isNaN(parsedRoleId) || parsedRoleId <= 0 || isNaN(parsedPermissionId) || parsedPermissionId <= 0) {
                throw new ApiError('Invalid role ID or permission ID', StatusCodes.BAD_REQUEST);
            }
            const result = await PermissionsRepository.assignPermission(parsedRoleId, parsedPermissionId);
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Permission assigned successfully',
                payload: result,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('does not exist') ? StatusCodes.NOT_FOUND : error.message.includes('already assigned') ? StatusCodes.CONFLICT : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async unassignPermission(roleId, permissionId) {
        try {
            const parsedRoleId = parseInt(roleId, 10);
            const parsedPermissionId = parseInt(permissionId, 10);
            if (isNaN(parsedRoleId) || parsedRoleId <= 0 || isNaN(parsedPermissionId) || parsedPermissionId <= 0) {
                throw new ApiError('Invalid role ID or permission ID', StatusCodes.BAD_REQUEST);
            }
            const result = await PermissionsRepository.unassignPermission(parsedRoleId, parsedPermissionId);
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Permission unassigned successfully',
                payload: result,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('not found') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = new PermissionsService();