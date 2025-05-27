const pool = require('../../config/database');
const logger = require('../../config/logger');

class PermissionsRepository {
    async findAll() {
        try {
            logger.debug('Fetching all permissions from database');
            const [rows] = await pool.query('SELECT * FROM permissions WHERE deleted_at IS NULL');
            logger.info('Successfully fetched all permissions', { count: rows.length });
            return rows;
        } catch (error) {
            logger.error('Failed to fetch permissions', { error: error.message });
            throw new Error(`Failed to fetch permissions: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                logger.warn(`Invalid permission ID provided: ${id}`);
                throw new Error('Invalid permission ID');
            }
            logger.debug(`Fetching permission with id: ${parsedId}`);
            const [rows] = await pool.query('SELECT * FROM permissions WHERE id = ? AND deleted_at IS NULL', [parsedId]);
            if (rows.length === 0) {
                logger.warn(`Permission not found for id: ${parsedId}`);
                throw new Error('Permission not found');
            }
            logger.info(`Successfully fetched permission with id: ${parsedId}`);
            return rows[0];
        } catch (error) {
            logger.error(`Failed to fetch permission with id: ${id}`, { error: error.message });
            throw new Error(`Failed to fetch permission: ${error.message}`);
        }
    }

    async create(permissionData) {
        let connection;
        try {
            if (!permissionData || typeof permissionData !== 'object' || !permissionData.permission_name || !permissionData.permission_key) {
                logger.warn('Invalid permission data provided', { permissionData });
                throw new Error('Permission name and key are required');
            }
            logger.debug('Creating new permission', { permission_name: permissionData.permission_name, permission_key: permissionData.permission_key });
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'INSERT INTO permissions (permission_name, permission_key) VALUES (?, ?)',
                [permissionData.permission_name, permissionData.permission_key]
            );
            await connection.commit();
            logger.info('Successfully created permission', { id: result.insertId, permission_name: permissionData.permission_name });
            return { id: result.insertId, ...permissionData };
        } catch (error) {
            if (connection) await connection.rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                logger.warn('Permission key already exists', { permission_key: permissionData?.permission_key });
                throw new Error('Permission key already exists');
            }
            logger.error('Failed to create permission', { error: error.message, permission_key: permissionData?.permission_key });
            throw new Error(`Failed to create permission: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    async update(id, permissionData) {
        let connection;
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                logger.warn(`Invalid permission ID provided: ${id}`);
                throw new Error('Invalid permission ID');
            }
            if (!permissionData || typeof permissionData !== 'object' || !permissionData.permission_name || !permissionData.permission_key) {
                logger.warn('Invalid permission data provided for update', { permissionData });
                throw new Error('Permission name and key are required');
            }
            logger.debug(`Updating permission with id: ${parsedId}`, { permission_name: permissionData.permission_name, permission_key: permissionData.permission_key });
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'UPDATE permissions SET permission_name = ?, permission_key = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
                [permissionData.permission_name, permissionData.permission_key, parsedId]
            );
            if (result.affectedRows === 0) {
                logger.warn(`Permission not found or already deleted for id: ${parsedId}`);
                throw new Error('Permission not found or already deleted');
            }
            await connection.commit();
            logger.info(`Successfully updated permission with id: ${parsedId}`, { permission_name: permissionData.permission_name });
            return { id: parsedId, ...permissionData };
        } catch (error) {
            if (connection) await connection.rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                logger.warn('Permission key already exists', { permission_key: permissionData?.permission_key });
                throw new Error('Permission key already exists');
            }
            logger.error(`Failed to update permission with id: ${id}`, { error: error.message, permission_key: permissionData?.permission_key });
            throw new Error(`Failed to update permission: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    async deletePermission(id) {
        let connection;
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                logger.warn(`Invalid permission ID provided: ${id}`);
                throw new Error('Invalid permission ID');
            }
            logger.debug(`Attempting to soft delete permission with id: ${parsedId}`);
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'UPDATE permissions SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
                [parsedId]
            );
            if (result.affectedRows === 0) {
                logger.warn(`Permission not found or already deleted for id: ${parsedId}`);
                throw new Error('Permission not found or already deleted');
            }
            const [verifyRows] = await connection.query(
                'SELECT deleted_at FROM permissions WHERE id = ?',
                [parsedId]
            );
            if (verifyRows.length === 0 || !verifyRows[0].deleted_at) {
                logger.error(`Verification failed: Permission with id ${parsedId} was not updated`);
                throw new Error('Failed to verify soft delete');
            }
            await connection.commit();
            logger.info(`Successfully soft deleted permission with id: ${parsedId}`, { deleted_at: verifyRows[0].deleted_at });
            return { message: 'Permission soft deleted successfully', deleted_at: verifyRows[0].deleted_at };
        } catch (error) {
            if (connection) await connection.rollback();
            logger.error(`Failed to delete permission with id: ${id}`, { error: error.message });
            throw new Error(`Failed to delete permission: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    async assignPermission(roleId, permissionId) {
        let connection;
        try {
            const parsedRoleId = parseInt(roleId, 10);
            const parsedPermissionId = parseInt(permissionId, 10);
            if (isNaN(parsedRoleId) || parsedRoleId <= 0 || isNaN(parsedPermissionId) || parsedPermissionId <= 0) {
                logger.warn(`Invalid role ID or permission ID provided: ${roleId}, ${permissionId}`);
                throw new Error('Invalid role ID or permission ID');
            }
            logger.debug(`Assigning permission ${parsedPermissionId} to role ${parsedRoleId}`);
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
                [parsedRoleId, parsedPermissionId]
            );
            await connection.commit();
            logger.info(`Successfully assigned permission ${parsedPermissionId} to role ${parsedRoleId}`, { assignmentId: result.insertId });
            return { id: result.insertId, role_id: parsedRoleId, permission_id: parsedPermissionId };
        } catch (error) {
            if (connection) await connection.rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                logger.warn(`Permission ${permissionId} already assigned to role ${roleId}`);
                throw new Error('Permission already assigned to role');
            }
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                logger.warn(`Role ${roleId} or permission ${permissionId} does not exist`);
                throw new Error('Role or permission does not exist');
            }
            logger.error(`Failed to assign permission to role ${roleId}`, { error: error.message });
            throw new Error(`Failed to assign permission: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    async unassignPermission(roleId, permissionId) {
        let connection;
        try {
            const parsedRoleId = parseInt(roleId, 10);
            const parsedPermissionId = parseInt(permissionId, 10);
            if (isNaN(parsedRoleId) || parsedRoleId <= 0 || isNaN(parsedPermissionId) || parsedPermissionId <= 0) {
                logger.warn(`Invalid role ID or permission ID provided: ${roleId}, ${permissionId}`);
                throw new Error('Invalid role ID or permission ID');
            }
            logger.debug(`Unassigning permission ${parsedPermissionId} from role ${parsedRoleId}`);
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'UPDATE role_permissions SET deleted_at = CURRENT_TIMESTAMP WHERE role_id = ? AND permission_id = ? AND deleted_at IS NULL',
                [parsedRoleId, parsedPermissionId]
            );
            if (result.affectedRows === 0) {
                logger.warn(`No active assignment found for role ${parsedRoleId} and permission ${parsedPermissionId}`);
                throw new Error('No active assignment found');
            }
            await connection.commit();
            logger.info(`Successfully unassigned permission ${parsedPermissionId} from role ${parsedRoleId}`);
            return { message: 'Permission unassigned successfully', role_id: parsedRoleId, permission_id: parsedPermissionId };
        } catch (error) {
            if (connection) await connection.rollback();
            logger.error(`Failed to unassign permission from role ${roleId}`, { error: error.message });
            throw new Error(`Failed to unassign permission: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }
}

module.exports = new PermissionsRepository();