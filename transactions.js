const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// Record new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { 
      recycling_item_id, 
      amount, 
      description, 
      paymentMethod, 
      paymentDetails 
    } = req.body;
    const company_id = req.user.id;

    // Start transaction
    await db.query('START TRANSACTION');

    // Get recycling item details if provided
    if (recycling_item_id) {
      const [items] = await db.query(
        'SELECT user_id, status FROM recycling_items WHERE id = ?',
        [recycling_item_id]
      );

      if (items.length === 0) {
        await db.query('ROLLBACK');
        return res.status(404).json({ message: 'Recycling item not found' });
      }

      const item = items[0];
      if (item.status !== 'collected') {
        await db.query('ROLLBACK');
        return res.status(400).json({ message: 'Item must be collected before payment' });
      }

      // Record transaction with recycling item
      const [result] = await db.query(
        `INSERT INTO transactions (
          recycling_item_id, 
          company_id, 
          user_id, 
          amount, 
          description, 
          payment_method,
          payment_details,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          recycling_item_id,
          company_id,
          item.user_id,
          amount,
          description || 'Payment for recycling items',
          paymentMethod,
          JSON.stringify(paymentDetails),
          'completed'
        ]
      );

      // Update recycling item status
      await db.query(
        'UPDATE recycling_items SET status = ? WHERE id = ?',
        ['processed', recycling_item_id]
      );

      await db.query('COMMIT');

      res.status(201).json({
        id: result.insertId,
        recycling_item_id,
        amount,
        status: 'completed'
      });
    } else {
      // Record direct transaction without recycling item
      const [result] = await db.query(
        `INSERT INTO transactions (
          company_id, 
          user_id, 
          amount, 
          description, 
          payment_method,
          payment_details,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          company_id,
          req.body.userId,
          amount,
          description || 'Direct payment',
          paymentMethod,
          JSON.stringify(paymentDetails),
          'completed'
        ]
      );

      await db.query('COMMIT');

      res.status(201).json({
        id: result.insertId,
        amount,
        status: 'completed'
      });
    }
  } catch (error) {
    await db.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  }
});

// Get user's earnings history
router.get('/earnings', auth, async (req, res) => {
  try {
    const [earnings] = await db.query(`
      SELECT 
        t.*,
        r.item_type,
        r.quantity,
        u.username as company_name,
        DATE_FORMAT(t.created_at, '%Y-%m-%d %H:%i') as formatted_date
      FROM transactions t
      LEFT JOIN recycling_items r ON t.recycling_item_id = r.id
      JOIN users u ON t.company_id = u.id
      WHERE t.user_id = ?
      ORDER BY t.created_at DESC
    `, [req.user.id]);

    res.json(earnings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get company's payment history
router.get('/payments', auth, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const [payments] = await db.query(`
      SELECT 
        t.*,
        r.item_type,
        r.quantity,
        u.username as recycler_name,
        DATE_FORMAT(t.created_at, '%Y-%m-%d %H:%i') as formatted_date
      FROM transactions t
      LEFT JOIN recycling_items r ON t.recycling_item_id = r.id
      JOIN users u ON t.user_id = u.id
      WHERE t.company_id = ?
      ORDER BY t.created_at DESC
    `, [req.user.id]);

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;