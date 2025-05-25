CREATE DATABASE IF NOT EXISTS recycling_db;
USE recycling_db;

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('recycler', 'company', 'transport', 'admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transport_details table if not exists
CREATE TABLE IF NOT EXISTS transport_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  vehicle_type ENUM('van', 'truck', 'pickup') NOT NULL,
  vehicle_capacity INT NOT NULL,
  service_areas TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create recycling_items table if not exists
CREATE TABLE IF NOT EXISTS recycling_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  quantity FLOAT NOT NULL,
  location VARCHAR(255) NOT NULL,
  status ENUM('pending', 'accepted', 'collected', 'processed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create transactions table if not exists
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recycling_item_id INT,
  company_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  payment_method ENUM('bank', 'card', 'ewallet') NOT NULL,
  payment_details JSON,
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recycling_item_id) REFERENCES recycling_items(id),
  FOREIGN KEY (company_id) REFERENCES users(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create locations table if not exists
CREATE TABLE IF NOT EXISTS locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  lat DECIMAL(10,8) NOT NULL,
  lng DECIMAL(11,8) NOT NULL,
  name VARCHAR(255),
  address TEXT,
  type ENUM('recycling_center', 'collection_point', 'transport') NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create recycling_prices table if not exists
CREATE TABLE IF NOT EXISTS recycling_prices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  price_per_kg DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES users(id)
);

-- Create chat_messages table if not exists
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message TEXT NOT NULL,
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

-- Create user_details table if not exists
CREATE TABLE IF NOT EXISTS user_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  payment_method VARCHAR(50),
  account_holder VARCHAR(255),
  account_type VARCHAR(50),
  branch_code VARCHAR(50),
  account_number VARCHAR(255),
  phone_number VARCHAR(50),
  alternate_phone VARCHAR(50),
  address TEXT,
  city VARCHAR(255),
  postal_code VARCHAR(20),
  emergency_contact VARCHAR(255),
  emergency_phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);