const pool = require('../../config/database');

const createItem = async (name, brandId, modelNumber, identificationNumber, color, statusId, arrivalDate, manufacturingDate, price, discount, discountCoupon, organizationId) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    const [result] = await connection.execute(
        'INSERT INTO item (name, brand_id, model_number, identification_number, color, status_id, arrival_date, manufacturing_date, price, discount, discount_coupon, organization_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name, brandId, modelNumber, identificationNumber, color, statusId, arrivalDate, manufacturingDate, price, discount, discountCoupon, organizationId]
    );
    const [item] = await connection.execute(
        'SELECT id, name, brand_id, model_number, identification_number, color, status_id, arrival_date, manufacturing_date, price, discount, discount_coupon, organization_id, created_at, updated_at, deleted_at FROM item WHERE id = ?',
        [result.insertId]
    );
    await connection.commit();
    connection.release();
    return item[0];
};

const findAllItems = async () => {
    const [items] = await pool.execute(
        'SELECT id, name, brand_id, model_number, identification_number, color, status_id, arrival_date, manufacturing_date, price, discount, discount_coupon, organization_id, created_at, updated_at, deleted_at FROM item WHERE deleted_at IS NULL'
    );
    return items;
};

const findItemById = async (id) => {
    const [items] = await pool.execute(
        'SELECT id, name, brand_id, model_number, identification_number, color, status_id, arrival_date, manufacturing_date, price, discount, discount_coupon, organization_id, created_at, updated_at, deleted_at FROM item WHERE id = ? AND deleted_at IS NULL',
        [id]
    );
    return items[0] || null;
};

const updateItem = async (id, name, brandId, modelNumber, identificationNumber, color, statusId, arrivalDate, manufacturingDate, price, discount, discountCoupon, organizationId) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    const [existing] = await connection.execute(
        'SELECT id FROM item WHERE id = ? AND deleted_at IS NULL',
        [id]
    );
    if (!existing.length) throw new Error('Not found');
    await connection.execute(
        'UPDATE item SET name = ?, brand_id = ?, model_number = ?, identification_number = ?, color = ?, status_id = ?, arrival_date = ?, manufacturing_date = ?, price = ?, discount = ?, discount_coupon = ?, organization_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, brandId, modelNumber, identificationNumber, color, statusId, arrivalDate, manufacturingDate, price, discount, discountCoupon, organizationId, id]
    );
    const [updatedItem] = await connection.execute(
        'SELECT id, name, brand_id, model_number, identification_number, color, status_id, arrival_date, manufacturing_date, price, discount, discount_coupon, organization_id, created_at, updated_at, deleted_at FROM item WHERE id = ?',
        [id]
    );
    await connection.commit();
    connection.release();
    return updatedItem[0];
};

const deleteItem = async (id) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    const [existing] = await connection.execute(
        'SELECT id FROM item WHERE id = ? AND deleted_at IS NULL',
        [id]
    );
    if (!existing.length) throw new Error('Not found');
    await connection.execute('UPDATE item SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
    await connection.commit();
    connection.release();
    return true;
};

module.exports = { createItem, findAllItems, findItemById, updateItem, deleteItem };