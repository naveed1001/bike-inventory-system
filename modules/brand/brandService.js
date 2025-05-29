const { validateCreateBrand, validateUpdateBrand } = require('./brandValidator');
const { ApiError, ApiResponse } = require('../../utils');
const BrandRepository = require('./brandRepository');
const { StatusCodes } = require('http-status-codes');

class BrandService {
    async getAllBrands() {
        try {
            const brands = await BrandRepository.findAllBrands();
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Brands retrieved successfully',
                payload: brands,
            });
        } catch (error) {
            throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getBrandById(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid brand ID', StatusCodes.BAD_REQUEST);
            }
            const brand = await BrandRepository.findBrandById(parsedId);
            if (!brand) {
                throw new ApiError('Brand not found', StatusCodes.NOT_FOUND);
            }
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Brand retrieved successfully',
                payload: brand,
            });
        } catch (error) {
            throw new ApiError(error.message, error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async createBrand(data, file) {
        try {
            const { name, website } = data;
            const logoPath = file ? file.path : null;
            const validationData = { name, website };
            const { error } = validateCreateBrand(validationData);
            if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

            const brand = await BrandRepository.createBrand(name, logoPath, website);
            return new ApiResponse({
                code: StatusCodes.CREATED,
                message: 'Brand created successfully',
                payload: brand,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('Duplicate') ? StatusCodes.CONFLICT : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async updateBrand(id, data, file) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid brand ID', StatusCodes.BAD_REQUEST);
            }
            const { name, website } = data;
            const logoPath = file ? file.path : null;
            const validationData = { name, website };
            const { error } = validateUpdateBrand(validationData);
            if (error) throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);

            const brand = await BrandRepository.updateBrand(parsedId, name, logoPath, website);
            if (!brand) {
                throw new ApiError('Brand not found', StatusCodes.NOT_FOUND);
            }
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Brand updated successfully',
                payload: brand,
            });
        } catch (error) {
            throw new ApiError(error.message, error.message.includes('Duplicate') ? StatusCodes.CONFLICT : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteBrand(id) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                throw new ApiError('Invalid brand ID', StatusCodes.BAD_REQUEST);
            }
            const success = await BrandRepository.deleteBrand(parsedId);
            if (!success) {
                throw new ApiError('Brand not found', StatusCodes.NOT_FOUND);
            }
            return new ApiResponse({
                code: StatusCodes.OK,
                message: 'Brand soft deleted successfully',
                payload: { message: 'Brand soft deleted successfully' },
            });
        } catch (error) {
            throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = new BrandService();