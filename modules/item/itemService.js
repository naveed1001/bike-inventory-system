const { validateCreateItem, validateUpdateItem } = require('./itemValidator');
const { ApiError, ApiResponse } = require('../../utils');
const ItemRepository = require('./itemRepository');
const pool = require('../../config/database');
const { StatusCodes } = require('http-status-codes');

class ItemService {
    async getAllItems() {
        const maxRetries = 3;
        let attempt = 0;
        while (attempt < maxRetries) {
            try {
                const items = await ItemRepository.findAllItems();
                return new ApiResponse({
                    code: StatusCodes.OK,
                    message: 'Items retrieved successfully',
                    payload: { items }
                });
            } catch (error) {
                if (error.code === 'ECONNRESET' || error.errno === 2013) { // Handle connection drop
                    attempt++;
                    if (attempt === maxRetries) {
                        throw new ApiError('Failed to retrieve items after multiple attempts due to connection issues', StatusCodes.INTERNAL_SERVER_ERROR);
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
                    continue;
                }
                throw error;
            }
        }
    }

    async getItemById(id) {
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId) || parsedId <= 0) {
            throw new ApiError('Invalid item ID', StatusCodes.BAD_REQUEST);
        }
        try {
            const item = await ItemRepository.findItemById(parsedId);
            if (!item) {
                throw new ApiError('Item not found', StatusCodes.NOT_FOUND);
            }
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Item retrieved successfully',
                payload: item
            });
        } catch (error) {
            throw error;
        }
    }

    async createItem(data) {
        const { error } = validateCreateItem(data);
        if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

        const { name, brand_id, model_number, identification_number, color, status_id, arrival_date, manufacturing_date, price, discount, discount_coupon, organization_id } = data;

        try {
            const [brand] = await pool.execute('SELECT id FROM brand WHERE id = ? AND deleted_at IS NULL', [brand_id]);
            if (!brand.length) {
                throw new ApiError('Invalid brand ID: referenced row does not exist', StatusCodes.BAD_REQUEST);
            }
            const [status] = await pool.execute('SELECT id FROM status WHERE id = ? AND deleted_at IS NULL', [status_id]);
            if (!status.length) {
                throw new ApiError('Invalid status ID: referenced row does not exist', StatusCodes.BAD_REQUEST);
            }
            const [organization] = await pool.execute('SELECT id FROM organization WHERE id = ? AND deleted_at IS NULL', [organization_id]);
            if (!organization.length) {
                throw new ApiError('Invalid organization ID: referenced row does not exist', StatusCodes.BAD_REQUEST);
            }

            const item = await ItemRepository.createItem(name, brand_id, model_number, identification_number, color, status_id, arrival_date, manufacturing_date, price, discount, discount_coupon, organization_id);
            return new ApiResponse({
                code: StatusCodes.CREATED,
                message: 'Item created successfully',
                payload: item
            });
        } catch (error) {
            throw error;
        }
    }

    async updateItem(id, data) {
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId) || parsedId <= 0) {
            throw new ApiError('Invalid item ID', StatusCodes.BAD_REQUEST);
        }
        const { error } = validateUpdateItem(data);
        if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

        const { name, brand_id, model_number, identification_number, color, status_id, arrival_date, manufacturing_date, price, discount, discount_coupon, organization_id } = data;
        try {
            const item = await ItemRepository.updateItem(parsedId, name, brand_id, model_number, identification_number, color, status_id, arrival_date, manufacturing_date, price, discount, discount_coupon, organization_id);
            if (!item) {
                throw new ApiError('Item not found', StatusCodes.NOT_FOUND);
            }
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Item updated successfully',
                payload: item
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteItem(id) {
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId) || parsedId <= 0) {
            throw new ApiError('Invalid item ID', StatusCodes.BAD_REQUEST);
        }
        try {
            const success = await ItemRepository.deleteItem(parsedId);
            if (!success) {
                throw new ApiError('Item not found', StatusCodes.NOT_FOUND);
            }
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Item soft deleted successfully',
                payload: { message: 'Item soft deleted successfully' }
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ItemService();