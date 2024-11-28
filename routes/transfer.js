const express = require('express');
const router = express.Router();
const db = require('../server').db;
const logger = require('../server').logger;

// Route to transfer funds
router.post('/transfer', (req, res) => {
  const { from_account, to_account, amount } = req.body;

  if (!from_account || !to_account || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Check if sender has enough balance
  db.query('SELECT balance FROM accounts WHERE id = ?', [from_account], (err, result) => {
    if (err) {
      logger.error('Error checking balance', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!result.length || result[0].balance < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Deduct from sender and add to receiver
    db.query('START TRANSACTION', (err) => {
      if (err) {
        logger.error('Error starting transaction', err);
        return res.status(500).json({ error: 'Transaction error' });
      }

      db.query('UPDATE accounts SET balance = balance - ? WHERE id = ?', [amount, from_account], (err) => {
        if (err) {
          db.query('ROLLBACK');
          logger.error('Error updating sender balance', err);
          return res.status(500).json({ error: 'Transaction error' });
        }

        db.query('UPDATE accounts SET balance = balance + ? WHERE id = ?', [amount, to_account], (err) => {
          if (err) {
            db.query('ROLLBACK');
            logger.error('Error updating receiver balance', err);
            return res.status(500).json({ error: 'Transaction error' });
          }

          // Log the transfer
          db.query('INSERT INTO transaction_history (from_account, to_account, amount) VALUES (?, ?, ?)', [from_account, to_account, amount], (err) => {
            if (err) {
              db.query('ROLLBACK');
              logger.error('Error recording transaction', err);
              return res.status(500).json({ error: 'Transaction error' });
            }
            
            // Commit transaction
            db.query('COMMIT', (err) => {
              if (err) {
                logger.error('Error committing transaction', err);
                return res.status(500).json({ error: 'Transaction error' });
              }

              // Send message to queue
              if (channel) {
                channel.sendToQueue('transfer_queue', Buffer.from(JSON.stringify({ from_account, to_account, amount })));
              }

              logger.info(`Transfer of ${amount} from account ${from_account} to ${to_account} completed`);
              res.status(200).json({ message: 'Transfer successful' });
            });
          });
        });
      });
    });
  });
});

module.exports = router;
