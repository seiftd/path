-- Update ideas table to include new columns
-- Run this in Hostinger phpMyAdmin or MySQL command line

-- First, check if columns exist and add them if they don't
ALTER TABLE ideas 
ADD COLUMN IF NOT EXISTS name VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS founder_name VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS founder_email VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS founders TEXT DEFAULT NULL COMMENT 'JSON array of team members',
ADD COLUMN IF NOT EXISTS idea_type VARCHAR(100) DEFAULT 'General',
ADD COLUMN IF NOT EXISTS bmc_answers TEXT DEFAULT NULL COMMENT 'JSON object of Business Model Canvas answers',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Update existing ideas to have updated_at if it's NULL
UPDATE ideas SET updated_at = created_at WHERE updated_at IS NULL;

-- Show table structure to verify
DESCRIBE ideas;

