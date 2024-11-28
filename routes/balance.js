const express = require('express');
const router = express.Router();
const db = require('../server').db;
const logger = require('../server').logger;

// Route to get account balance
router.get('/balance', (req, res) => {
  const { account_id } = req.query;

  if (!account_id) {
    return res.status(400).json({ error: 'Account ID is required' });
  }

  db.query('SELECT balance FROM accounts WHERE id = ?', [account_id], (err, result) => {
    if (err) {
      logger.error('Error retrieving balance', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!result.length) {
      return res.status(404).json({ error: 'Account not found' });
    }

    logger.info(`Retrieved balance for account_id: ${account_id}`);
    res.status(200).json({ balance: result[0].balance });
  });
});

module.exports = router;
