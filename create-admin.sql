-- Create admin user for Women Safety Platform
-- Use this file in MySQL Workbench to create the admin account

USE women_safety_db;

-- Check if admin already exists and delete if present
DELETE FROM admins WHERE username = 'admin';

-- Create the admin user
-- Username: admin
-- Password: admin123 (encrypted with BCrypt)
INSERT INTO admins (name, username, email, password, created_at) 
VALUES (
    'System Admin', 
    'admin', 
    'admin@womensafety.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    NOW()
);

-- Verify the admin was created
SELECT id, name, username, email, created_at FROM admins;
