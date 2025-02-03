const dbcreds = require('./DbConfig');
const mysql = require('mysql2/promise'); // Using mysql2 with promises

// Create a MySQL connection pool for better performance
const pool = mysql.createPool({
    host: process.env.DB_HOST || dbcreds.DB_HOST,
    user: process.env.DB_USER || dbcreds.DB_USER,
    password: process.env.DB_PWD || dbcreds.DB_PWD,
    database: process.env.DB_DATABASE || dbcreds.DB_DATABASE,
    waitForConnections: true, // Wait if all connections are used
    connectionLimit: 10,      // Max 10 connections at a time
    queueLimit: 0             // No limit to the queue
});

// Add a new transaction (with async/await)
async function addTransaction(amount, desc) {
    try {
        const sql = "INSERT INTO transactions (amount, description) VALUES (?, ?)";
        const [result] = await pool.query(sql, [amount, desc]);
        console.log("Transaction added successfully.");
        return result; // Return result for success
    } catch (error) {
        console.error("Error adding transaction:", error);
        throw new Error('Unable to add transaction');
    }
}

// Get all transactions (with async/await)
async function getAllTransactions() {
    try {
        const sql = "SELECT * FROM transactions";
        const [rows] = await pool.query(sql);
        console.log("Retrieved all transactions.");
        return rows;
    } catch (error) {
        console.error("Error retrieving transactions:", error);
        throw new Error('Unable to retrieve transactions');
    }
}

// Find a transaction by ID (with async/await)
async function findTransactionById(id) {
    try {
        const sql = "SELECT * FROM transactions WHERE id = ?";
        const [rows] = await pool.query(sql, [id]);
        if (rows.length === 0) {
            throw new Error(`Transaction with ID ${id} not found`);
        }
        console.log(`Retrieved transaction with ID ${id}.`);
        return rows[0]; // Return the first matching row
    } catch (error) {
        console.error(`Error retrieving transaction with ID ${id}:`, error);
        throw new Error(`Unable to find transaction with ID ${id}`);
    }
}

// Delete all transactions (with async/await)
async function deleteAllTransactions() {
    try {
        const sql = "DELETE FROM transactions";
        const [result] = await pool.query(sql);
        console.log("All transactions deleted.");
        return result;
    } catch (error) {
        console.error("Error deleting all transactions:", error);
        throw new Error('Unable to delete all transactions');
    }
}

// Delete a transaction by ID (with async/await)
async function deleteTransactionById(id) {
    try {
        const sql = "DELETE FROM transactions WHERE id = ?";
        const [result] = await pool.query(sql, [id]);
        if (result.affectedRows === 0) {
            throw new Error(`Transaction with ID ${id} not found`);
        }
        console.log(`Transaction with ID ${id} deleted.`);
        return result;
    } catch (error) {
        console.error(`Error deleting transaction with ID ${id}:`, error);
        throw new Error(`Unable to delete transaction with ID ${id}`);
    }
}

// Export the functions
module.exports = {
    addTransaction,
    getAllTransactions,
    findTransactionById,
    deleteAllTransactions,
    deleteTransactionById
};
