import express from 'express';
import { promisePool } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, unread_only = 'false' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = 'WHERE computer_number = ?';
    const params = [req.user.computer_number];
    if (unread_only === 'true') {
      whereClause += ' AND status = ?';
      params.push('sent');
    }

    const [rows] = await promisePool.query(
      `SELECT notification_id, message, type, status, created_at
       FROM notifications
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [count] = await promisePool.query(
      `SELECT COUNT(*) AS total FROM notifications ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: rows,
      pagination: {
        current_page: parseInt(page),
        total_notifications: count[0].total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

router.get('/unread-count', async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      `SELECT COUNT(*) AS unread_count FROM notifications
       WHERE computer_number = ? AND status = 'sent'`,
      [req.user.computer_number]
    );
    res.json({ success: true, data: { unread_count: rows[0].unread_count } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get unread count' });
  }
});

router.put('/mark-read', async (req, res) => {
  try {
    const { notification_ids } = req.body;
    if (!notification_ids || !Array.isArray(notification_ids)) {
      return res.status(400).json({ success: false, message: 'notification_ids array is required' });
    }
    if (notification_ids.length === 0) {
      return res.json({ success: true, message: 'No notifications to update' });
    }
    const placeholders = notification_ids.map(() => '?').join(',');
    await promisePool.query(
      `UPDATE notifications SET status = 'read'
       WHERE notification_id IN (${placeholders}) AND computer_number = ?`,
      [...notification_ids, req.user.computer_number]
    );
    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark notifications as read' });
  }
});

export default router;




