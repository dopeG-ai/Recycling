const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// Create new recycling request
router.post('/requests', auth, async (req, res) => {
  try {
    const { item_type, quantity, location } = req.body;
    const user_id = req.user.id;

    const [result] = await db.query(
      'INSERT INTO recycling_items (user_id, item_type, quantity, location) VALUES (?, ?, ?, ?)',
      [user_id, item_type, quantity, location]
    );

    res.status(201).json({
      id: result.insertId,
      item_type,
      quantity,
      location,
      status: 'pending'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all recycling requests (for companies)
router.get('/requests', auth, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const [requests] = await db.query(`
      SELECT r.*, u.username, u.email 
      FROM recycling_items r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.status = 'pending'
    `);

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update recycling request status
router.patch('/requests/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const [result] = await db.query(
      'UPDATE recycling_items SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's recycling history
router.get('/history', auth, async (req, res) => {
  try {
    const [history] = await db.query(
      'SELECT * FROM recycling_items WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current price list
router.get('/prices', async (req, res) => {
  try {
    const [prices] = await db.query('SELECT * FROM recycling_prices');
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update price list (companies only)
router.post('/prices', auth, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { prices } = req.body;
    await db.query('START TRANSACTION');

    // Clear existing prices for this company
    await db.query('DELETE FROM recycling_prices WHERE company_id = ?', [req.user.id]);

    // Insert new prices
    for (const price of prices) {
      await db.query(
        'INSERT INTO recycling_prices (company_id, item_type, price_per_kg) VALUES (?, ?, ?)',
        [req.user.id, price.item_type, price.price_per_kg]
      );
    }

    await db.query('COMMIT');
    res.json({ message: 'Prices updated successfully' });
  } catch (error) {
    await db.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;