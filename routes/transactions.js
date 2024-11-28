const express = require('express');
const router = express.Router();
const db = require('../server').db;
const logger = require('../server').logger;

// Route to persist transaction details
router.post('/transactions', (req, res) => {
  const { customer_id, amount } = req.body;
  
  if (!customer_id || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  
  // Insert transaction
  db.query('INSERT INTO transaction_history (customer_id, amount) VALUES (?, ?)', [customer_id, amount], (err, result) => {
    if (err) {
      logger.error('Error inserting transaction', err);
      return res.status(500).json({ error: 'Database error' });
    }
    logger.info(`Transaction recorded for customer_id: ${customer_id}`);
    res.status(201).json({ message: 'Transaction recorded', id: result.insertId });
  });
});

module.exports = router;
