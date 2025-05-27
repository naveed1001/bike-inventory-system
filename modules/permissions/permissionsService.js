const { validateCreatePermission, validateUpdatePermission } = require('./permissionsValidator');
const { ApiError, ApiResponse } = require('../../middlewares/utils');
const PermissionsRepository = require('./permissionsRepository');
const { StatusCodes } = require("http-status-codes");
const logger = require('../../config/logger');

class PermissionsService {
    async getAllPermissions() {
        try {
            logger.debug('Retrieving all permissions');
            const permissions = await PermissionsRepository.findAll();
            logger.info('Successfully retrieved all permissions');
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Permissions retrieved successfully',
                payload: permissions,
            });
        } catch (error) {
            logger.error('Failed to retrieve permissions', { error: error.message });
            throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getPermissionById(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                logger.warn(`Invalid permission ID provided: ${id}`);
                throw new ApiError('Invalid permission ID', StatusCodes.BAD_REQUEST);
            }
            logger.debug(`Retrieving permission with id: ${parsedId}`);
            const permission = await PermissionsRepository.findById(parsedId);
            logger.info(`Successfully retrieved permission with id: ${parsedId}`);
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Permission retrieved successfully',
                payload: permission,
            });
        } catch (error) {
            logger.error(`Failed to retrieve permission with id: ${id}`, { error: error.message });
            throw new ApiError(error.message, error.message.includes('not found') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async createPermission(data) {
        try {
            const { error } = validateCreatePermission(data);
            if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

            const { permission_name, permission_key } = data;
            logger.debug('Creating new permission', { permission_name, permission_key });
            const permission = await PermissionsRepository.create({ permission_name, permission_key });
            logger.info('Successfully created permission', { id: permission.id, permission_name });
            return new ApiResponse({
                code: StatusCodes.CREATED,
                message: 'Permission created successfully',
                payload: permission,
            });
        } catch (error) {
            logger.error('Failed to create permission', { error: error.message, permission_key: data?.permission_key });
            throw new ApiError(error.message, error.message.includes('exists') ? StatusCodes.CONFLICT : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async updatePermission(id, data) {
        try {
            const { error } = validateUpdatePermission(data);
            if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                logger.warn(`Invalid permission ID provided: ${id}`);
                throw new ApiError('Invalid permission ID', StatusCodes.BAD_REQUEST);
            }
            const { permission_name, permission_key } = data;
            logger.debug(`Updating permission with id: ${parsedId}`, { permission_name, permission_key });
            const permission = await PermissionsRepository.update(parsedId, { permission_name, permission_key });
            logger.info(`Successfully updated permission with id: ${parsedId}`, { permission_name });
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Permission updated successfully',
                payload: permission,
            });
        } catch (error) {
            logger.error(`Failed to update permission with id: ${id}`, { error: error.message, permission_key: data?.permission_key });
            throw new ApiError(error.message, error.message.includes('not found') ? StatusCodes.NOT_FOUND : error.message.includes('exists') ? StatusCodes.CONFLICT : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async deletePermission(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                logger.warn(`Invalid permission ID provided: ${id}`);
                throw new ApiError('Invalid permission ID', StatusCodes.BAD_REQUEST);
            }
            logger.debug(`Deleting permission with id: ${parsedId}`);
            const result = await PermissionsRepository.deletePermission(parsedId);
            logger.info(`Successfully deleted permission with id: ${parsedId}`);
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Permission soft deleted successfully',
                payload: result,
            });
        } catch (error) {
            logger.error(`Failed to delete permission with id: ${id}`, { error: error.message });
            throw new ApiError(error.message, error.message.includes('not found') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async assignPermission(roleId, permissionId) {
        try {
            const parsedRoleId = parseInt(roleId, 10);
            const parsedPermissionId = parseInt(permissionId, 10);
            if (isNaN(parsedRoleId) || parsedRoleId <= 0 || isNaN(parsedPermissionId) || parsedPermissionId <= 0) {
                logger.warn(`Invalid role ID or permission ID provided: ${roleId}, ${permissionId}`);
                throw new ApiError('Invalid role ID or permission ID', StatusCodes.BAD_REQUEST);
            }
            logger.debug(`Assigning permission ${parsedPermissionId} to role ${parsedRoleId}`);
            const result = await PermissionsRepository.assignPermission(parsedRoleId, parsedPermissionId);
            logger.info(`Successfully assigned permission ${parsedPermissionId} to role ${parsedRoleId}`);
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Permission assigned successfully',
                payload: result,
            });
        } catch (error) {
            logger.error(`Failed to assign permission to role ${roleId}`, { error: error.message });
            throw new ApiError(error.message, error.message.includes('does not exist') ? StatusCodes.NOT_FOUND : error.message.includes('already assigned') ? StatusCodes.CONFLICT : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async unassignPermission(roleId, permissionId) {
        try {
            const parsedRoleId = parseInt(roleId, 10);
            const parsedPermissionId = parseInt(permissionId, 10);
            if (isNaN(parsedRoleId) || parsedRoleId <= 0 || isNaN(parsedPermissionId) || parsedPermissionId <= 0) {
                logger.warn(`Invalid role ID or permission ID provided: ${roleId}, ${permissionId}`);
                throw new ApiError('Invalid role ID or permission ID', StatusCodes.BAD_REQUEST);
            }
            logger.debug(`Unassigning permission ${parsedPermissionId} from role ${parsedRoleId}`);
            const result = await PermissionsRepository.unassignPermission(parsedRoleId, parsedPermissionId);
            logger.info(`Successfully unassigned permission ${parsedPermissionId} from role ${parsedRoleId}`);
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Permission unassigned successfully',
                payload: result,
            });
        } catch (error) {
            logger.error(`Failed to unassign permission from role ${roleId}`, { error: error.message });
            throw new ApiError(error.message, error.message.includes('not found') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = new PermissionsService();