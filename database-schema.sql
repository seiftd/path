-- Found Your Path Database Schema
-- Run this in Hostinger's phpMyAdmin

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  idea_text TEXT NOT NULL,
  category VARCHAR(100),
  language VARCHAR(10) DEFAULT 'en',
  status ENUM('draft', 'analyzing', 'completed') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Responses table
CREATE TABLE IF NOT EXISTS responses (
  id VARCHAR(255) PRIMARY KEY,
  idea_id VARCHAR(255) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  question_type ENUM('multiple_choice', 'open_ended') DEFAULT 'open_ended',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
);

-- Paths table
CREATE TABLE IF NOT EXISTS paths (
  id VARCHAR(255) PRIMARY KEY,
  idea_id VARCHAR(255) NOT NULL,
  theme VARCHAR(50) NOT NULL,
  progress JSON,
  completion_status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
);

-- Resource categories table
CREATE TABLE IF NOT EXISTS resource_categories (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id VARCHAR(255) PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  type ENUM('course', 'article', 'book', 'tool') NOT NULL,
  title VARCHAR(500) NOT NULL,
  url VARCHAR(1000),
  description TEXT,
  language VARCHAR(10) DEFAULT 'en',
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  theme VARCHAR(20) DEFAULT 'light',
  notifications JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id VARCHAR(255) PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  user_id VARCHAR(255),
  idea_id VARCHAR(255),
  metadata JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE SET NULL
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  idea_id VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_provider VARCHAR(50),
  transaction_id VARCHAR(255),
  pdf_url VARCHAR(1000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
);

-- Insert resource categories
INSERT IGNORE INTO resource_categories (id, name, description, icon, color, sort_order) VALUES
('cat_foundation', 'Foundation', 'Legal and business setup resources', 'building', 'blue', 1),
('cat_product', 'Product Development', 'MVP and product development resources', 'code', 'green', 2),
('cat_marketing', 'Marketing & Sales', 'Marketing strategy and sales resources', 'megaphone', 'purple', 3),
('cat_operations', 'Operations', 'Business operations and management resources', 'settings', 'orange', 4),
('cat_finance', 'Finance', 'Financial planning and funding resources', 'dollar-sign', 'red', 5);

-- Insert initial resources
INSERT IGNORE INTO resources (id, category, type, title, url, description, language, is_featured, sort_order) VALUES
('res_1', 'Foundation', 'course', 'Business Structure Guide', 'https://coursera.org/business-structure', 'Complete guide to choosing the right business structure', 'en', true, 1),
('res_2', 'Foundation', 'article', 'Legal Requirements Checklist', 'https://sba.gov/legal-requirements', 'Essential legal requirements for starting a business', 'en', true, 2),
('res_3', 'Product Development', 'course', 'MVP Development Course', 'https://udemy.com/mvp-development', 'Learn to build and validate your minimum viable product', 'en', true, 1),
('res_4', 'Product Development', 'tool', 'Figma Design Tool', 'https://figma.com', 'Professional design tool for creating product mockups', 'en', false, 2),
('res_5', 'Marketing & Sales', 'course', 'Digital Marketing Strategy', 'https://coursera.org/digital-marketing', 'Comprehensive digital marketing course', 'en', true, 1),
('res_6', 'Marketing & Sales', 'book', 'Lean Startup by Eric Ries', 'https://amazon.com/lean-startup', 'Essential reading for startup methodology', 'en', true, 2),
('res_7', 'Operations', 'course', 'Operations Management', 'https://edx.org/operations-management', 'Learn to manage business operations effectively', 'en', false, 1),
('res_8', 'Operations', 'tool', 'Trello Project Management', 'https://trello.com', 'Visual project management and collaboration tool', 'en', false, 2),
('res_9', 'Finance', 'course', 'Financial Planning for Startups', 'https://coursera.org/financial-planning', 'Learn financial planning and budgeting for startups', 'en', true, 1),
('res_10', 'Finance', 'article', 'Funding Options Guide', 'https://sba.gov/funding-options', 'Complete guide to startup funding options', 'en', true, 2);

-- Show completion message
SELECT 'Database schema created successfully!' as message;
