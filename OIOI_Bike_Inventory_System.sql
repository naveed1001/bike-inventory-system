CREATE DATABASE OIOI_bike_inventory_system;

USE OIOI_bike_inventory_system;

-- 1. Roles
CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    UNIQUE (role_name)
);

SELECT * FROM roles;
-- DROP TABLE roles;


CREATE TABLE permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    permission_name VARCHAR(250) NOT NULL,
    permission_key VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    UNIQUE (permission_key)
);

-- DROP TABLE permissions;
SELECT * FROM permissions;



CREATE TABLE role_permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    UNIQUE (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON UPDATE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON UPDATE CASCADE
);

SELECT * FROM role_permissions;
-- DROP TABLE role_permissions;

-- I. System Administration & Configuration Permissions
INSERT INTO permissions (permission_name, permission_key) VALUES
('Create New User Roles', 'roles_create'),
('View All Roles and Permissions', 'roles_read'),
('Modify Existing Roles', 'roles_update'),
('Delete Roles', 'roles_delete'),
('Create New Permissions', 'permissions_create'),
('View All Permissions', 'permissions_read'),
('Modify Existing Permissions', 'permissions_update'),
('Delete Permissions', 'permissions_delete'),
('Assign Permissions to Roles', 'role_permissions_assign'),
('Remove Permissions from Roles', 'role_permissions_unassign'),
('Create New User Accounts', 'users_create'),
('View All User Details', 'users_read'),
('Modify User Information', 'users_update'),
('Delete User Accounts', 'users_delete'),
('Reset User Passwords', 'users_reset_password'),
('Activate or Deactivate User Accounts', 'users_activate_deactivate'),
('Create New Organizations', 'organization_create'),
('View All Organization Details', 'organization_read'),
('Modify Organization Details', 'organization_update'),
('Delete Organizations', 'organization_delete'),
('Add New Banking Details', 'banking_details_create'),
('View All Banking Details', 'banking_details_read'),
('Modify Banking Details', 'banking_details_update'),
('Delete Banking Details', 'banking_details_delete'),
('Add New Countries', 'countries_create'),
('View All Countries', 'countries_read'),
('Modify Country Details', 'countries_update'),
('Delete Countries', 'countries_delete'),
('Add New Cities', 'cities_create'),
('View All Cities', 'cities_read'),
('Modify City Details', 'cities_update'),
('Delete Cities', 'cities_delete'),
('Add New Status Types', 'status_create'),
('View All Status Types', 'status_read'),
('Modify Status Types', 'status_update'),
('Delete Status Types', 'status_delete');


-- II. Inventory & Product Management Permissions
INSERT INTO permissions (permission_name, permission_key) VALUES
('Add New Bike Items to Inventory', 'item_create'),
('View All Item Details', 'item_read'),
('Modify Item Details', 'item_update'),
('Remove Items from Inventory', 'item_delete'),
('Transfer Items Between Warehouses', 'item_transfer'),
('Add New Bike Brands', 'brand_create'),
('View All Brand Details', 'brand_read'),
('Modify Brand Details', 'brand_update'),
('Delete Brands', 'brand_delete'),
('Add New Item Types', 'item_types_create'),
('View All Item Types', 'item_types_read'),
('Modify Item Types', 'item_types_update'),
('Delete Item Types', 'item_types_delete'),
('Add Specifications to Items', 'specifications_create'),
('View Item Specifications', 'specifications_read'),
('Modify Item Specifications', 'specifications_update'),
('Delete Item Specifications', 'specifications_delete'),
('Create New Warehouse Entries', 'warehouse_create'),
('View All Warehouse Details', 'warehouse_read'),
('Modify Warehouse Information', 'warehouse_update'),
('Delete Warehouses', 'warehouse_delete'),
('Define New Capacity Types for Warehouses', 'capacity_types_create'),
('View Warehouse Capacity Types', 'capacity_types_read'),
('Modify Warehouse Capacity Types', 'capacity_types_update'),
('Delete Warehouse Capacity Types', 'capacity_types_delete');


-- III. Sales & Customer Management Permissions
INSERT INTO permissions (permission_name, permission_key) VALUES
('Record New Sales Transactions', 'sales_create'),
('View All Sales Records', 'sales_read'),
('Modify Sales Details', 'sales_update'),
('Delete Sales Records', 'sales_delete'),
('Add New Customer Profiles', 'customer_create'),
('View All Customer Details', 'customer_read'),
('Modify Customer Information', 'customer_update'),
('Delete Customer Profiles', 'customer_delete'),
('Add New Dealer Profiles', 'dealer_create'),
('View All Dealer Details', 'dealer_read'),
('Modify Dealer Information', 'dealer_update'),
('Delete Dealer Profiles', 'dealer_delete'),
('Add New Dealership Profiles', 'dealership_create'),
('View All Dealership Details', 'dealership_read'),
('Modify Dealership Information', 'dealership_update'),
('Delete Dealership Profiles', 'dealership_delete');

-- IV. Financial & Payment Management Permissions
INSERT INTO permissions (permission_name, permission_key) VALUES
('Record New Payments', 'payment_create'),
('View All Payment Records', 'payment_read'),
('Modify Payment Details', 'payment_update'),
('Delete Payment Records', 'payment_delete'),
('Define New Installment Plans', 'installment_plan_create'),
('View All Installment Plans', 'installment_plan_read'),
('Modify Installment Plans', 'installment_plan_update'),
('Delete Installment Plans', 'installment_plan_delete'),
('Add New Instrument Details', 'instruments_create'),
('View All Instrument Details', 'instruments_read'),
('Modify Instrument Details', 'instruments_update'),
('Delete Instrument Details', 'instruments_delete'),
('Record Individual Installment Payments', 'installment_create'),
('View All Installment Records', 'installment_read'),
('Modify Installment Details', 'installment_update'),
('Delete Installment Records', 'installment_delete'),
('Add Payment Details for Sales/Purchases', 'payment_detail_create'),
('View Payment Details', 'payment_detail_read'),
('Modify Payment Details', 'payment_detail_update'),
('Delete Payment Details', 'payment_detail_delete');

-- V. Shipping & Logistics Management Permissions
INSERT INTO permissions (permission_name, permission_key) VALUES
('Add New Shipping Agents', 'shipping_agent_create'),
('View All Shipping Agent Details', 'shipping_agent_read'),
('Modify Shipping Agent Details', 'shipping_agent_update'),
('Delete Shipping Agents', 'shipping_agent_delete'),
('Create New Shipment Records', 'shipment_create'),
('View All Shipment Details', 'shipment_read'),
('Update Shipment Status and Details', 'shipment_update'),
('Delete Shipment Records', 'shipment_delete');

-- VI. Reporting & Analytics Permissions
INSERT INTO permissions (permission_name, permission_key) VALUES
('Access All System Reports', 'reports_view_all'),
('Access Dashboards and Analytical Tools', 'analytics_access');

-- 4. Banking_Details
CREATE TABLE banking_details (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    account_number VARCHAR(100) NOT NULL,
    branch VARCHAR(100),
    iban VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    UNIQUE (account_number),
    UNIQUE (iban)
);

SELECT * FROM banking_details;
-- DROP TABLE banking_details;

-- 5. Countries
CREATE TABLE countries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    UNIQUE (name)
);

SELECT * FROM countries;
-- DROP TABLE countries;


-- 6. Cities
CREATE TABLE cities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    UNIQUE (name)
);

SELECT * FROM cities;
-- DROP TABLE cities; 


-- 7. Status
CREATE TABLE status (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    value VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

SELECT * FROM status;
-- DROP TABLE status;


-- 8. Brand
CREATE TABLE brand (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    logo VARCHAR(1024),
    website VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    UNIQUE (name)
);

SELECT * FROM brand;
-- DROP TABLE brand;

-- 9. Vendor
CREATE TABLE vendor (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
	phone VARCHAR(20) NOT NULL,
	email VARCHAR(100) NOT NULL,
    banking_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (banking_id) REFERENCES banking_details(id) ON UPDATE CASCADE,
    UNIQUE (email)
);

SELECT * FROM vendor;
-- DROP TABLE vendor;