const express = require('express');
const Transaction = require('../models/Transaction');
const router = express.Router();

// POST /api/transactions/ - Create a new transaction
router.post('/', async (req, res) => {
    try {
        const { amount, transaction_type, user } = req.body;
        const transaction = await Transaction.create({ amount, transaction_type, user });
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/transactions/ - Get transactions for a specific user
router.get('/', async (req, res) => {
    try {
        const { user_id } = req.query;
        const transactions = await Transaction.find({ user: user_id });
        res.status(200).json({ transactions });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/transactions/:id - Get a specific transaction
router.get('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/transactions/:id - Update a transaction status
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['COMPLETED', 'FAILED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
