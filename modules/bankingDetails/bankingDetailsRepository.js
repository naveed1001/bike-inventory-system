const pool = require('../../config/database');

class BankingDetailsRepository {
    async findAll() {
        try {
            const [rows] = await pool.query('SELECT id, name, account_number, branch, iban, created_at, updated_at, deleted_at FROM banking_details WHERE deleted_at IS NULL');
            return rows;
        } catch (error) {
            throw new Error(`Failed to fetch banking details: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new Error(`Invalid banking detail ID provided: ${id}`);
            }
            const [rows] = await pool.query('SELECT id, name, account_number, branch, iban, created_at, updated_at, deleted_at FROM banking_details WHERE id = ? AND deleted_at IS NULL', [parsedId]);
            if (rows.length === 0) {
                throw new Error(`Banking detail not found for id: ${parsedId}`);
            }
            return rows[0];
        } catch (error) {
            throw new Error(`Failed to fetch banking detail with id: ${id}`, { error: error.message });
        }
    }

    async create(bankingDetailData) {
        let connection;
        try {
            if (!bankingDetailData || !bankingDetailData.name || !bankingDetailData.account_number) {
                throw new Error('Invalid banking detail data provided', { bankingDetailData });
            }
            connection = await pool.getConnection();
            await connection.beginTransaction();

            const [result] = await connection.query(
                'INSERT INTO banking_details (name, account_number, branch, iban) VALUES (?, ?, ?, ?)',
                [bankingDetailData.name, bankingDetailData.account_number, bankingDetailData.branch, bankingDetailData.iban]
            );
            await connection.commit();
            return { id: result.insertId, ...bankingDetailData };
        } catch (error) {
            if (connection) await connection.rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Duplicate account number or IBAN detected', { account_number: bankingDetailData.account_number });
            }
            throw new Error('Failed to create banking detail', { error: error.message });
        } finally {
            if (connection) connection.release();
        }
    }

    async update(id, bankingDetailData) {
        let connection;
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new Error(`Invalid banking detail ID provided: ${id}`);
            }
            if (!bankingDetailData || !bankingDetailData.name || !bankingDetailData.account_number) {
                throw new Error('Name and account number are required, Invalid banking detail data provided for update', { bankingDetailData });
            }
            connection = await pool.getConnection();
            await connection.beginTransaction();

            const [result] = await connection.query(
                'UPDATE banking_details SET name = ?, account_number = ?, branch = ?, iban = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
                [bankingDetailData.name, bankingDetailData.account_number, bankingDetailData.branch, bankingDetailData.iban, parsedId]
            );
            if (result.affectedRows === 0) {
                throw new Error(`Banking detail not found or already deleted for id: ${parsedId}`);
            }
            await connection.commit();
            return { id: parsedId, ...bankingDetailData };
        } catch (error) {
            if (connection) await connection.rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Duplicate account number or IBAN detected', { account_number: bankingDetailData.account_number });
            }
            throw new Error(`Failed to update banking detail with id: ${id}`, { error: error.message });
        } finally {
            if (connection) connection.release();
        }
    }

    async delete(id) {
        let connection;
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new Error(`Invalid banking detail ID provided: ${id}`);
            }
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'UPDATE banking_details SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
                [parsedId]
            );
            if (result.affectedRows === 0) {
                throw new Error(`Banking detail not found or already deleted for id: ${parsedId}`);
            }
            const [verifyRows] = await connection.query(
                'SELECT deleted_at FROM banking_details WHERE id = ?',
                [parsedId]
            );
            await connection.commit();
            return { message: 'Banking detail soft deleted successfully', deleted_at: verifyRows[0].deleted_at };
        } catch (error) {
            if (connection) await connection.rollback();
            throw new Error(`Failed to delete banking detail with id: ${id}`, { error: error.message });
        } finally {
            if (connection) connection.release();
        }
    }
}

module.exports = new BankingDetailsRepository();