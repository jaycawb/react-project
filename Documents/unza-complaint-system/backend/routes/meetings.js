// routes/meetings.js
import express from 'express';
import { promisePool } from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { notificationService } from '../services/notificationService.js';

const router = express.Router();

// POST /meetings - Book a meeting
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      title,
      description,
      participant_computer_number,
      scheduled_at
    } = req.body;

    // Validation
    if (!title || !participant_computer_number || !scheduled_at) {
      return res.status(400).json({
        success: false,
        message: 'Title, participant, and scheduled time are required'
      });
    }

    // Validate scheduled time is in the future
    const meetingTime = new Date(scheduled_at);
    if (meetingTime <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Meeting time must be in the future'
      });
    }

    // Validate participant exists
    const [participant] = await promisePool.query(
      'SELECT computer_number, first_name, last_name FROM users WHERE computer_number = ?',
      [participant_computer_number]
    );

    if (participant.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    // Insert meeting
    const insertQuery = `
      INSERT INTO meetings (
        title, description, organizer_computer_number, 
        participant_computer_number, scheduled_at, status
      ) VALUES (?, ?, ?, ?, ?, 'pending')
    `;

    const [result] = await promisePool.query(insertQuery, [
      title,
      description,
      req.user.computer_number, // Organizer is the current user
      participant_computer_number,
      scheduled_at
    ]);

    // trigger notification to participant
    await notificationService.notifyMeetingRequest(result.insertId);

    res.status(201).json({
      success: true,
      message: 'Meeting scheduled successfully',
      data: {
        meeting_id: result.insertId,
        title,
        scheduled_at,
        status: 'pending',
        participant: {
          computer_number: participant_computer_number,
          name: `${participant[0].first_name} ${participant[0].last_name}`
        }
      }
    });

  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule meeting',
      error_code: 'CREATE_ERROR'
    });
  }
});

// GET /meetings - Get meetings (filtered by user role)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let whereConditions = [];
    let queryParams = [];

    // User can see meetings where they are organizer OR participant
    whereConditions.push('(organizer_computer_number = ? OR participant_computer_number = ?)');
    queryParams.push(req.user.computer_number, req.user.computer_number);

    if (status) {
      whereConditions.push('status = ?');
      queryParams.push(status);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM meetings ${whereClause}`;
    const [countResult] = await promisePool.query(countQuery, queryParams);
    const totalMeetings = countResult[0].total;

    // Get meetings with user details
    const query = `
      SELECT 
        m.meeting_id,
        m.title,
        m.description,
        m.scheduled_at,
        m.status,
        m.created_at,
        organizer.first_name as organizer_first_name,
        organizer.last_name as organizer_last_name,
        participant.first_name as participant_first_name,
        participant.last_name as participant_last_name
      FROM meetings m
      LEFT JOIN users organizer ON m.organizer_computer_number = organizer.computer_number
      LEFT JOIN users participant ON m.participant_computer_number = participant.computer_number
      ${whereClause}
      ORDER BY m.scheduled_at DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(parseInt(limit), offset);
    const [meetings] = await promisePool.query(query, queryParams);

    const totalPages = Math.ceil(totalMeetings / parseInt(limit));

    res.json({
      success: true,
      data: meetings,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_meetings: totalMeetings,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch meetings'
    });
  }
});

// GET /meetings/:id - Get specific meeting
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        m.*,
        organizer.first_name as organizer_first_name,
        organizer.last_name as organizer_last_name,
        organizer.email as organizer_email,
        participant.first_name as participant_first_name,
        participant.last_name as participant_last_name,
        participant.email as participant_email
      FROM meetings m
      LEFT JOIN users organizer ON m.organizer_computer_number = organizer.computer_number
      LEFT JOIN users participant ON m.participant_computer_number = participant.computer_number
      WHERE m.meeting_id = ?
    `;

    const [meetings] = await promisePool.query(query, [parseInt(id)]);

    if (meetings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    const meeting = meetings[0];

    // Check access permissions
    const canAccess = req.user.role === 'admin' ||
                     meeting.organizer_computer_number === req.user.computer_number ||
                     meeting.participant_computer_number === req.user.computer_number;

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: meeting
    });

  } catch (error) {
    console.error('Error fetching meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch meeting'
    });
  }
});

// PUT /meetings/:id - Update meeting status or reschedule
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, scheduled_at, title, description } = req.body;

    // Check if meeting exists
    const [meeting] = await promisePool.query(
      'SELECT * FROM meetings WHERE meeting_id = ?',
      [parseInt(id)]
    );

    if (meeting.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    const meetingData = meeting[0];
    const isOrganizer = meetingData.organizer_computer_number === req.user.computer_number;
    const isParticipant = meetingData.participant_computer_number === req.user.computer_number;
    const isAdmin = req.user.role === 'admin';

    // Build update query dynamically
    let updateFields = [];
    let queryParams = [];

    // Handle status updates
    if (status !== undefined) {
      const validStatuses = ['pending', 'confirmed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status',
          valid_statuses: validStatuses
        });
      }

      // Check permissions for status updates
      const canUpdateStatus = isAdmin || isParticipant;
      if (!canUpdateStatus) {
        return res.status(403).json({
          success: false,
          message: 'Only the participant or admin can update meeting status'
        });
      }

      updateFields.push('status = ?');
      queryParams.push(status);
    }

    // Handle rescheduling
    if (scheduled_at !== undefined) {
      // Validate new time is in the future
      const newMeetingTime = new Date(scheduled_at);
      if (newMeetingTime <= new Date()) {
        return res.status(400).json({
          success: false,
          message: 'New meeting time must be in the future'
        });
      }

      // Check permissions for rescheduling
      const canReschedule = isAdmin || isOrganizer || isParticipant;
      if (!canReschedule) {
        return res.status(403).json({
          success: false,
          message: 'Only organizers, participants, or admins can reschedule meetings'
        });
      }

      updateFields.push('scheduled_at = ?');
      queryParams.push(scheduled_at);
    }

    // Handle title and description updates (organizer or admin only)
    if (title !== undefined) {
      const canUpdateDetails = isAdmin || isOrganizer;
      if (!canUpdateDetails) {
        return res.status(403).json({
          success: false,
          message: 'Only the organizer or admin can update meeting details'
        });
      }
      updateFields.push('title = ?');
      queryParams.push(title);
    }

    if (description !== undefined) {
      const canUpdateDetails = isAdmin || isOrganizer;
      if (!canUpdateDetails) {
        return res.status(403).json({
          success: false,
          message: 'Only the organizer or admin can update meeting details'
        });
      }
      updateFields.push('description = ?');
      queryParams.push(description);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update'
      });
    }

    // Check if updated_at column exists, if not, skip it
    // Add updated_at only if the column exists
    try {
      const [columns] = await promisePool.query(
        "SHOW COLUMNS FROM meetings LIKE 'updated_at'"
      );
      if (columns.length > 0) {
        updateFields.push('updated_at = NOW()');
      }
    } catch (columnCheckError) {
      console.log('updated_at column check failed, skipping:', columnCheckError.message);
    }
    queryParams.push(parseInt(id));

    const updateQuery = `
      UPDATE meetings
      SET ${updateFields.join(', ')}
      WHERE meeting_id = ?
    `;

    await promisePool.query(updateQuery, queryParams);

    // Notify relevant parties about changes (wrap in try-catch to prevent API failure)
    try {
      if (status !== undefined) {
        await notificationService.notifyMeetingUpdate(parseInt(id), status, req.user.computer_number);
      }
      if (scheduled_at !== undefined) {
        await notificationService.notifyMeetingRescheduled(parseInt(id), req.user.computer_number);
      }
      if (title !== undefined || description !== undefined) {
        await notificationService.notifyMeetingDetailsChanged(parseInt(id), req.user.computer_number);
      }
    } catch (notificationError) {
      console.error('Notification error (non-blocking):', notificationError);
      // Don't fail the API call if notifications fail
    }

    res.json({
      success: true,
      message: 'Meeting updated successfully'
    });

  } catch (error) {
    console.error('Error updating meeting:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState
    });
    res.status(500).json({
      success: false,
      message: 'Failed to update meeting',
      error_details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /meetings/:id - Delete meeting (organizer or admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if meeting exists
    const [meeting] = await promisePool.query(
      'SELECT * FROM meetings WHERE meeting_id = ?',
      [parseInt(id)]
    );

    if (meeting.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Check permissions - only organizer or admin can delete
    const canDelete = req.user.role === 'admin' || 
                     meeting[0].organizer_computer_number === req.user.computer_number;

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'Only the organizer or admin can delete this meeting'
      });
    }

    await promisePool.query(
      'DELETE FROM meetings WHERE meeting_id = ?',
      [parseInt(id)]
    );

    res.json({
      success: true,
      message: 'Meeting deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete meeting'
    });
  }
});

export default router;