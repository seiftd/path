-- Add subscriptions table to database
CREATE TABLE IF NOT EXISTS subscriptions (
  id VARCHAR(255) PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  clerk_user_id VARCHAR(255),
  plan VARCHAR(50) NOT NULL DEFAULT 'free', -- 'free', 'pro', 'trial'
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'canceled', 'expired'
  ideas_limit INT DEFAULT 1,
  pdfs_limit INT DEFAULT 1,
  ideas_used INT DEFAULT 0,
  pdfs_used INT DEFAULT 0,
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP NULL,
  payment_provider VARCHAR(50) DEFAULT 'manual', -- 'dodo', 'manual', 'trial'
  payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_email (user_email),
  INDEX idx_clerk_user_id (clerk_user_id),
  INDEX idx_status (status)
);

-- Grant free premium month to specific users
INSERT INTO subscriptions (
  id, 
  user_email, 
  plan, 
  status, 
  ideas_limit, 
  pdfs_limit, 
  ideas_used, 
  pdfs_used, 
  start_date, 
  end_date, 
  payment_provider
) VALUES 
(
  UUID(), 
  'loifortunss@gmail.com', 
  'pro', 
  'active', 
  50, 
  20, 
  0, 
  0, 
  NOW(), 
  DATE_ADD(NOW(), INTERVAL 1 MONTH),
  'manual'
),
(
  UUID(), 
  'nasrosardouk@gmail.com', 
  'pro', 
  'active', 
  50, 
  20, 
  0, 
  0, 
  NOW(), 
  DATE_ADD(NOW(), INTERVAL 1 MONTH),
  'manual'
)
ON DUPLICATE KEY UPDATE
  plan = 'pro',
  status = 'active',
  ideas_limit = 50,
  pdfs_limit = 20,
  end_date = DATE_ADD(NOW(), INTERVAL 1 MONTH),
  updated_at = NOW();

