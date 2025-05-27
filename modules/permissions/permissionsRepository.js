const pool = require('../../config/database');
const logger = require('../../config/logger');

class PermissionsRepository {
    async findAll() {
        try {
            const [rows] = await pool.query('SELECT * FROM permissions WHERE deleted_at IS NULL');
            return rows;
        } catch (error) {
            throw new Error(`Failed to fetch permissions: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new Error('Invalid permission ID');
            }
            const [rows] = await pool.query('SELECT * FROM permissions WHERE id = ? AND deleted_at IS NULL', [parsedId]);
            if (rows.length === 0) {
                throw new Error('Permission not found');
            }
            return rows[0];
        } catch (error) {
            throw new Error(`Failed to fetch permission: ${error.message}`);
        }
    }

    async create(permissionData) {
        let connection;
        try {
            if (!permissionData || typeof permissionData !== 'object' || !permissionData.permission_name || !permissionData.permission_key) {
                throw new Error('Permission name and key are required');
            }
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'INSERT INTO permissions (permission_name, permission_key) VALUES (?, ?)',
                [permissionData.permission_name, permissionData.permission_key]
            );
            await connection.commit();
            return { id: result.insertId, ...permissionData };
        } catch (error) {
            if (connection) await connection.rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Permission key already exists' , { permission_key: permissionData?.permission_key });
            }
            throw new Error('Failed to create permission', { error: error.message, permission_key: permissionData?.permission_key });
        } finally {
            if (connection) connection.release();
        }
    }

    async update(id, permissionData) {
        let connection;
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new Error(`Invalid permission ID provided: ${id}`);
            }
            if (!permissionData || typeof permissionData !== 'object' || !permissionData.permission_name || !permissionData.permission_key) {
                throw new Error('Permission name and key are required, Invalid permission data provided for update', { permissionData });
            }
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'UPDATE permissions SET permission_name = ?, permission_key = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
                [permissionData.permission_name, permissionData.permission_key, parsedId]
            );
            if (result.affectedRows === 0) {
                throw new Error(`Permission not found or already deleted for id: ${parsedId}`);
            }
            await connection.commit();
            return { id: parsedId, ...permissionData };
        } catch (error) {
            if (connection) await connection.rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Permission key already exists', { permission_key: permissionData?.permission_key });
            }
            throw new Error(`Failed to update permission with id: ${id}`, { error: error.message, permission_key: permissionData?.permission_key });
        } finally {
            if (connection) connection.release();
        }
    }

    async deletePermission(id) {
        let connection;
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new Error(`Invalid permission ID provided: ${id}`);
            }
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'UPDATE permissions SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
                [parsedId]
            );
            if (result.affectedRows === 0) {
                throw new Error(`Permission not found or already deleted for id: ${parsedId}`);
            }
            const [verifyRows] = await connection.query(
                'SELECT deleted_at FROM permissions WHERE id = ?',
                [parsedId]
            );
            if (verifyRows.length === 0 || !verifyRows[0].deleted_at) {
                throw new Error(`Failed to verify soft delete, Verification failed: Permission with id ${parsedId} was not updated`);
            }
            await connection.commit();
            return { message: 'Permission soft deleted successfully', deleted_at: verifyRows[0].deleted_at };
        } catch (error) {
            if (connection) await connection.rollback();
            throw new Error(`Failed to delete permission with id: ${id}`, { error: error.message });
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
                throw new Error(`Invalid role ID or permission ID provided: ${roleId}, ${permissionId}`);
            }
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
                [parsedRoleId, parsedPermissionId]
            );
            await connection.commit();
            return { id: result.insertId, role_id: parsedRoleId, permission_id: parsedPermissionId };
        } catch (error) {
            if (connection) await connection.rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error(`Permission ${permissionId} already assigned to role ${roleId}`);
            }
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new Error(`Role ${roleId} or permission ${permissionId} does not exist`);
            }
            throw new Error(`Failed to assign permission to role ${roleId}`, { error: error.message });
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
                throw new Error(`Invalid role ID or permission ID provided: ${roleId}, ${permissionId}`);
            }
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'UPDATE role_permissions SET deleted_at = CURRENT_TIMESTAMP WHERE role_id = ? AND permission_id = ? AND deleted_at IS NULL',
                [parsedRoleId, parsedPermissionId]
            );
            if (result.affectedRows === 0) {
                throw new Error(`No active assignment found for role ${parsedRoleId} and permission ${parsedPermissionId}`);
            }
            await connection.commit();
            return { message: 'Permission unassigned successfully', role_id: parsedRoleId, permission_id: parsedPermissionId };
        } catch (error) {
            if (connection) await connection.rollback();
            throw new Error(`Failed to unassign permission from role ${roleId}`, { error: error.message });
        } finally {
            if (connection) connection.release();
        }
    }
}

module.exports = new PermissionsRepository();