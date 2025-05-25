const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// Get chat history with a specific user
router.get('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [messages] = await db.query(`
      SELECT m.*, 
        sender.username as sender_name, 
        receiver.username as receiver_name
      FROM chat_messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?)
      OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC
    `, [req.user.id, userId, userId, req.user.id]);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a new message
router.post('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { message } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO chat_messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [req.user.id, userId, message]
    );

    const [inserted] = await db.query(`
      SELECT m.*, 
        sender.username as sender_name, 
        receiver.username as receiver_name
      FROM chat_messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE m.id = ?
    `, [result.insertId]);

    res.status(201).json(inserted[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unread message count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const [result] = await db.query(
      'SELECT COUNT(*) as count FROM chat_messages WHERE receiver_id = ? AND read_status = false',
      [req.user.id]
    );
    
    res.json({ count: result[0].count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark messages as read
router.post('/:userId/read', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    await db.query(
      'UPDATE chat_messages SET read_status = true WHERE sender_id = ? AND receiver_id = ?',
      [userId, req.user.id]
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;