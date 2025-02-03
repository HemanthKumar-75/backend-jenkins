-- Create the database if it does not exist
CREATE DATABASE IF NOT EXISTS transactions;

-- Switch to the 'transactions' database
USE transactions;

-- Create the table if it does not exist
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount INT,
    description VARCHAR(255)
);

-- Create the user if it does not exist
CREATE USER IF NOT EXISTS 'expense'@'%' IDENTIFIED BY 'ExpenseApp@1';

-- Grant all privileges on the 'transactions' database to the user
GRANT ALL ON transactions.* TO 'expense'@'%';

-- Apply changes made to the privileges
FLUSH PRIVILEGES;
