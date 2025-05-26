const pool = require('../config/database');

class RolesRepository {
    async findAll() {
        try {
            const [rows] = await pool.query('SELECT * FROM roles WHERE deleted_at IS NULL');
            return rows;
        } catch (error) {
            throw new Error(`Failed to fetch roles: ${error.message}`);
        }
    }

    async findById(id) { 
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new Error('Invalid role ID');
            }
            const [rows] = await pool.query('SELECT * FROM roles WHERE id = ? AND deleted_at IS NULL', [parsedId]);
            if (rows.length === 0) {
                throw new Error('Role not found');
            }
            return rows[0];
        } catch (error) {
            throw new Error(`Failed to fetch role: ${error.message}`);
        }
    }

    async create(roleData) {
        let connection;
        try {
            if (!roleData || typeof roleData !== 'object' || !roleData.role_name || typeof roleData.role_name !== 'string') {
                throw new Error('Role name is required and must be a string');
            }
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'INSERT INTO roles (role_name) VALUES (?)',
                [roleData.role_name]
            );
            await connection.commit();
            return { id: result.insertId, role_name: roleData.role_name };
        } catch (error) {
            if (connection) await connection.rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Role name already exists');
            }
            throw new Error(`Failed to create role: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    async update(id, roleData) {
        let connection;
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new Error('Invalid role ID');
            }
            if (!roleData || typeof roleData !== 'object' || !roleData.role_name || typeof roleData.role_name !== 'string') {
                throw new Error('Role name is required and must be a string');
            }
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'UPDATE roles SET role_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
                [roleData.role_name, parsedId]
            );
            if (result.affectedRows === 0) {
                throw new Error('Role not found or already deleted');
            }
            await connection.commit();
            return { id: parsedId, role_name: roleData.role_name };
        } catch (error) {
            if (connection) await connection.rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Role name already exists');
            }
            throw new Error(`Failed to update role: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    async deleteRole(id) {
        let connection;
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new Error('Invalid role ID');
            }
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'UPDATE roles SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
                [parsedId]
            );
            if (result.affectedRows === 0) {
                throw new Error('Role not found or already deleted');
            }
            const [verifyRows] = await connection.query(
                'SELECT deleted_at FROM roles WHERE id = ?',
                [parsedId]
            );
            if (verifyRows.length === 0 || !verifyRows[0].deleted_at) {
                throw new Error('Failed to verify soft delete');
            }
            await connection.commit();
            return { message: 'Role soft deleted successfully', deleted_at: verifyRows[0].deleted_at };
        } catch (error) {
            if (connection) await connection.rollback();
            throw new Error(`Failed to delete role: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }
}

module.exports = new RolesRepository();