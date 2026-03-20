USE women_safety_db;

-- Update Trisha's password to 'admin123'
UPDATE users 
SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE email = 'trisha1@gmail.com';

-- Verify the update
SELECT id, name, email, SUBSTRING(password, 1, 30) as password_hash 
FROM users 
WHERE email = 'trisha1@gmail.com';
