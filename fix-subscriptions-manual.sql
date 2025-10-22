-- Fix subscriptions to link them with Clerk user IDs
-- Run this in phpMyAdmin

-- First, let's see the current subscriptions
SELECT s.*, u.id as clerk_user_id, u.email 
FROM subscriptions s
LEFT JOIN users u ON s.user_email = u.email
WHERE s.user_email IN ('loifortunss@gmail.com', 'nasrosardouk@gmail.com');

-- Update subscriptions with clerk_user_id from users table
UPDATE subscriptions s
INNER JOIN users u ON s.user_email = u.email
SET s.clerk_user_id = u.id
WHERE s.user_email IN ('loifortunss@gmail.com', 'nasrosardouk@gmail.com');

-- Verify the update
SELECT * FROM subscriptions 
WHERE user_email IN ('loifortunss@gmail.com', 'nasrosardouk@gmail.com');

