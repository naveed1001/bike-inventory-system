const { validateCreateUser, validateUpdateUser, validateLoginUser } = require('./usersValidator');
const { ApiError, ApiResponse } = require('../../utils');
const UsersRepository = require('./usersRepository');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/database');

class UsersService {
    async getAllUsers() {
        const users = await UsersRepository.findAllUsers();
        return new ApiResponse({
            code: StatusCodes.OK,
            message: 'Users retrieved successfully',
            payload: { users }
        });
    }

    async getUserById(id) {
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId) || parsedId <= 0) {
            throw new ApiError('Invalid user ID', StatusCodes.BAD_REQUEST);
        }
        const user = await UsersRepository.findUserById(parsedId);
        if (!user) {
            throw new ApiError('User not found', StatusCodes.NOT_FOUND);
        }
        return new ApiResponse({
            code: StatusCodes.OK,
            message: 'User retrieved successfully',
            payload: user
        });
    }

    async createUser(data, file) {
        const { error } = validateCreateUser(data);
        if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

        const { username, email, phone, address, password, role_id, employed_at, banking_id } = data;
        const profileImage = file ? file.path : null;

        const user = await UsersRepository.createUser(
            username,
            email,
            phone,
            address,
            profileImage,
            password,
            role_id,
            employed_at,
            banking_id
        );

        return new ApiResponse({
            code: StatusCodes.CREATED,
            message: 'User Created Successfully!',
            payload: user
        });
    }

    async updateUser(id, data, file) {
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId) || parsedId <= 0) {
            throw new ApiError('Invalid user ID', StatusCodes.BAD_REQUEST);
        }
        const { error } = validateUpdateUser(data);
        if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

        const { username, email, phone, address, password, role_id, employed_at, banking_id } = data;
        const profileImage = file ? file.path : null;

        const user = await UsersRepository.updateUser(
            parsedId,
            username,
            email,
            phone,
            address,
            profileImage,
            password,
            role_id,
            employed_at,
            banking_id
        );
        if (!user) {
            throw new ApiError('User not found', StatusCodes.NOT_FOUND);
        }
        return new ApiResponse({
            code: StatusCodes.OK,
            message: 'User updated successfully',
            payload: user
        });
    }

    async loginUser(data) {
        const { error } = validateLoginUser(data);
        if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

        const { username, password } = data;
        const user = await UsersRepository.findUserByUsername(username);
        if (!user) {
            throw new ApiError('User not found', StatusCodes.NOT_FOUND);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError('Invalid credentials', StatusCodes.UNAUTHORIZED);
        }

        const [permissionsRows] = await pool.execute(
            `SELECT p.permission_key 
             FROM role_permissions rp 
             JOIN permissions p ON rp.permission_id = p.id 
             WHERE rp.role_id = ? AND rp.deleted_at IS NULL AND p.deleted_at IS NULL`,
            [user.role_id]
        );
        const permissions = permissionsRows.map(row => row.permission_key);

        if (permissions.length === 0) {
            console.log('Warning: No permissions fetched for role_id', user.role_id);
        }

        const token = jwt.sign(
            { id: user.id, role_id: user.role_id, permissions },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const updatedUser = await UsersRepository.updateLastLogin(user.id);

        return new ApiResponse({
            code: StatusCodes.OK,
            message: 'Login successful',
            payload: {
                token,
                user: {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    role_id: updatedUser.role_id,
                    last_login: updatedUser.last_login
                }
            }
        });
    }

    async deleteUser(id) {
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId) || parsedId <= 0) {
            throw new ApiError('Invalid user ID', StatusCodes.BAD_REQUEST);
        }
        const success = await UsersRepository.deleteUser(parsedId);
        if (!success) {
            throw new ApiError('User not found', StatusCodes.NOT_FOUND);
        }
        return new ApiResponse({
            code: StatusCodes.OK,
            message: 'User soft deleted successfully',
            payload: { message: 'User soft deleted successfully' }
        });
    }
}

module.exports = new UsersService();