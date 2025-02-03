const transactionService = require('./TransactionService');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// ROUTES FOR OUR API
// =======================================================

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json("Health Check Passed");
});

// ADD TRANSACTION
app.post('/transaction', async (req, res) => {
    try {
        const { amount, desc } = req.body;

        // Validate input
        if (!amount || !desc) {
            return res.status(400).json({ message: 'Invalid input: amount and description are required.' });
        }

        const timestamp = moment().unix();
        console.log(`{ "timestamp" : ${timestamp}, "msg": "Adding Expense", "amount": ${amount}, "description": "${desc}" }`);

        await transactionService.addTransaction(amount, desc);
        res.status(201).json({ message: 'Transaction added successfully' });

    } catch (err) {
        console.error("Error adding transaction:", err.message);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});

// GET ALL TRANSACTIONS
app.get('/transaction', async (req, res) => {
    try {
        const transactionList = await transactionService.getAllTransactions();

        const timestamp = moment().unix();
        console.log(`{ "timestamp": ${timestamp}, "msg": "Getting All Expenses" }`);
        console.log(`{ "expenses": ${JSON.stringify(transactionList)} }`);

        res.status(200).json({ result: transactionList });

    } catch (err) {
        console.error("Error fetching transactions:", err.message);
        res.status(500).json({ message: "Could not retrieve transactions", error: err.message });
    }
});

// DELETE ALL TRANSACTIONS
app.delete('/transaction', async (req, res) => {
    try {
        await transactionService.deleteAllTransactions();

        const timestamp = moment().unix();
        console.log(`{ "timestamp": ${timestamp}, "msg": "Deleted All Expenses" }`);

        res.status(200).json({ message: "All transactions deleted successfully." });

    } catch (err) {
        console.error("Error deleting all transactions:", err.message);
        res.status(500).json({ message: "Failed to delete all transactions", error: err.message });
    }
});

// DELETE ONE TRANSACTION
app.delete('/transaction/:id', async (req, res) => {
    const { id } = req.params;

    // Validate input
    if (!id) {
        return res.status(400).json({ message: 'Transaction ID is required.' });
    }

    try {
        await transactionService.deleteTransactionById(id);
        res.status(200).json({ message: `Transaction with ID ${id} deleted successfully.` });

    } catch (err) {
        console.error(`Error deleting transaction with ID ${id}:`, err.message);
        res.status(500).json({ message: "Failed to delete transaction", error: err.message });
    }
});

// GET SINGLE TRANSACTION BY ID
app.get('/transaction/:id', async (req, res) => {
    const { id } = req.params;

    // Validate input
    if (!id) {
        return res.status(400).json({ message: 'Transaction ID is required.' });
    }

    try {
        const transaction = await transactionService.findTransactionById(id);

        if (!transaction) {
            return res.status(404).json({ message: `Transaction with ID ${id} not found.` });
        }

        const { amount, description } = transaction;
        res.status(200).json({ id, amount, description });

    } catch (err) {
        console.error(`Error fetching transaction with ID ${id}:`, err.message);
        res.status(500).json({ message: "Failed to retrieve transaction", error: err.message });
    }
});

// Start the server
app.listen(port, () => {
    const timestamp = moment().unix();
    console.log(`{ "timestamp": ${timestamp}, "msg": "App started on port ${port}" }`);
});
