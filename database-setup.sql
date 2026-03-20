-- Women Safety Database Setup Script
-- Run this script to set up the initial database

-- Create database
CREATE DATABASE IF NOT EXISTS women_safety_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE women_safety_db;

-- Note: Tables will be auto-created by Hibernate on first application run
-- This script is for reference and manual setup if needed

-- Sample Admin User
-- Password: admin123
-- (You need to generate BCrypt hash for production)
INSERT INTO admins (name, username, email, password, created_at) 
VALUES (
    'System Admin', 
    'admin', 
    'admin@womensafety.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- Password: admin123
    NOW()
) ON DUPLICATE KEY UPDATE username=username;

-- Create indexes for better performance (if tables exist)
-- Uncomment after first application run

-- CREATE INDEX idx_user_email ON users(email);
-- CREATE INDEX idx_user_phone ON users(phone);
-- CREATE INDEX idx_alert_user ON alerts(user_id);
-- CREATE INDEX idx_alert_status ON alerts(status);
-- CREATE INDEX idx_alert_active ON alerts(is_active);
-- CREATE INDEX idx_emergency_contact_user ON emergency_contacts(user_id);
-- CREATE INDEX idx_unsafe_area_status ON unsafe_areas(status);
-- CREATE INDEX idx_location_tracking_alert ON location_tracking(alert_id);
-- CREATE INDEX idx_alert_media_alert ON alert_media(alert_id);

-- Verify setup
SELECT 'Database setup complete!' AS status;
SELECT COUNT(*) AS admin_count FROM admins;
