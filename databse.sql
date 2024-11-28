CREATE DATABASE transactions;
USE transactions;

CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);

CREATE TABLE transaction_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_account INT NOT NULL,
  to_account INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
