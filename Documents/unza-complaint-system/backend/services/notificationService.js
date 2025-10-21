import { promisePool } from '../config/db.js';

export const notificationService = {
  async createNotification(computer_number, message, type = 'system') {
    try {
      const [result] = await promisePool.query(
        `INSERT INTO notifications (computer_number, message, type, status, created_at)
         VALUES (?, ?, ?, 'sent', NOW())`,
        [computer_number, message, type]
      );
      return result.insertId;
    } catch (error) {
      console.error('Failed to create notification:', error);
      return null;
    }
  },

  async notifyComplaintUpdate(complaint_id, status, admin_response = null) {
    try {
      const [complaints] = await promisePool.query(
        `SELECT c.computer_number, c.title, c.assigned_to, c.category, u.first_name, u.email
         FROM complaints c
         LEFT JOIN users u ON c.computer_number = u.computer_number
         WHERE c.complaint_id = ?`,
        [complaint_id]
      );

      if (complaints.length === 0) {
        console.error('Complaint not found for update notification:', complaint_id);
        return;
      }
      const c = complaints[0];

      // Notify the complaint owner (if not anonymous)
      if (c.computer_number) {
        let message = `Your complaint "${c.title}" has been updated to ${status.replace('_', ' ')}.`;
        if (admin_response) message += ` Admin response: ${admin_response}`;
        await this.createNotification(c.computer_number, message, 'complaint');
      }

      // Notify the assigned user (if different from owner)
      if (c.assigned_to && c.assigned_to !== c.computer_number) {
        let assignedMessage = `Complaint "${c.title}" assigned to you has been updated to ${status.replace('_', ' ')}.`;
        if (admin_response) assignedMessage += ` Admin response: ${admin_response}`;
        await this.createNotification(c.assigned_to, assignedMessage, 'complaint');
      }

      // Notify all admins about complaint updates (new feature)
      const [admins] = await promisePool.query(
        'SELECT computer_number FROM users WHERE role = ?',
        ['admin']
      );

      for (const admin of admins) {
        let adminMessage = `Complaint update: "${c.title}" (${c.category}) status changed to ${status.replace('_', ' ')}`;
        if (admin_response) adminMessage += ` - ${admin_response}`;
        await this.createNotification(admin.computer_number, adminMessage, 'complaint');
      }
    } catch (error) {
      console.error('Failed to notify complaint update:', error);
      // Don't throw error to prevent API failure
    }
  },

  async notifyMeetingRequest(meeting_id) {
    try {
      const [meetings] = await promisePool.query(
        `SELECT m.title, m.scheduled_at,
                organizer.first_name AS organizer_name,
                organizer.computer_number AS organizer_id,
                participant.first_name AS participant_name,
                participant.computer_number AS participant_id
         FROM meetings m
         LEFT JOIN users organizer ON m.organizer_computer_number = organizer.computer_number
         LEFT JOIN users participant ON m.participant_computer_number = participant.computer_number
         WHERE m.meeting_id = ?`,
        [meeting_id]
      );
      if (meetings.length === 0) {
        console.error('Meeting not found for request notification:', meeting_id);
        return;
      }
      const m = meetings[0];
      const when = new Date(m.scheduled_at).toLocaleString();

      // Notify participant
      if (m.participant_id) {
        const participantMessage = `You have a new meeting request from ${m.organizer_name}: "${m.title}" scheduled for ${when}`;
        await this.createNotification(m.participant_id, participantMessage, 'meeting');
      }

      // Notify all admins about new meeting
      const [admins] = await promisePool.query(
        'SELECT computer_number FROM users WHERE role = ?',
        ['admin']
      );

      for (const admin of admins) {
        const adminMessage = `New meeting scheduled: "${m.title}" by ${m.organizer_name} with ${m.participant_name} for ${when}`;
        await this.createNotification(admin.computer_number, adminMessage, 'meeting');
      }
    } catch (error) {
      console.error('Failed to notify meeting request:', error);
      // Don't throw error to prevent API failure
    }
  },

  async notifyMeetingUpdate(meeting_id, status, updated_by = null) {
    try {
      const [meetings] = await promisePool.query(
        `SELECT m.title, m.scheduled_at, m.organizer_computer_number, m.participant_computer_number,
                organizer.first_name AS organizer_name,
                participant.first_name AS participant_name
         FROM meetings m
         LEFT JOIN users organizer ON m.organizer_computer_number = organizer.computer_number
         LEFT JOIN users participant ON m.participant_computer_number = participant.computer_number
         WHERE m.meeting_id = ?`,
        [meeting_id]
      );

      if (meetings.length === 0) {
        console.error('Meeting not found for notification:', meeting_id);
        return;
      }
      const m = meetings[0];

      // Notify organizer if someone else updated it
      if (updated_by !== m.organizer_computer_number && m.organizer_computer_number) {
        const organizerMessage = `Your meeting "${m.title}" has been ${status} by ${updated_by ? 'an administrator' : 'the participant'}.`;
        await this.createNotification(m.organizer_computer_number, organizerMessage, 'meeting');
      }

      // Notify participant if someone else updated it
      if (updated_by !== m.participant_computer_number && m.participant_computer_number) {
        const participantMessage = `Meeting "${m.title}" has been ${status}${updated_by === m.organizer_computer_number ? ` by ${m.organizer_name}` : ' by an administrator'}.`;
        await this.createNotification(m.participant_computer_number, participantMessage, 'meeting');
      }
    } catch (error) {
      console.error('Failed to notify meeting update:', error);
      // Don't throw error to prevent API failure
    }
  },

  async notifyMeetingRescheduled(meeting_id, updated_by) {
    try {
      const [meetings] = await promisePool.query(
        `SELECT m.title, m.scheduled_at, m.organizer_computer_number, m.participant_computer_number,
                organizer.first_name AS organizer_name,
                participant.first_name AS participant_name
         FROM meetings m
         LEFT JOIN users organizer ON m.organizer_computer_number = organizer.computer_number
         LEFT JOIN users participant ON m.participant_computer_number = participant.computer_number
         WHERE m.meeting_id = ?`,
        [meeting_id]
      );
      if (meetings.length === 0) {
        console.error('Meeting not found for reschedule notification:', meeting_id);
        return;
      }
      const m = meetings[0];
      const when = new Date(m.scheduled_at).toLocaleString();

      // Notify both organizer and participant (except the one who made the change)
      const notifications = [];

      if (m.organizer_computer_number !== updated_by && m.organizer_computer_number) {
        const message = `Your meeting "${m.title}" has been rescheduled to ${when}`;
        notifications.push(this.createNotification(m.organizer_computer_number, message, 'meeting'));
      }

      if (m.participant_computer_number !== updated_by && m.participant_computer_number) {
        const message = `Meeting "${m.title}" has been rescheduled to ${when}`;
        notifications.push(this.createNotification(m.participant_computer_number, message, 'meeting'));
      }

      await Promise.all(notifications);
    } catch (error) {
      console.error('Failed to notify meeting reschedule:', error);
      // Don't throw error to prevent API failure
    }
  },

  async notifyMeetingDetailsChanged(meeting_id, updated_by) {
    try {
      const [meetings] = await promisePool.query(
        `SELECT m.title, m.organizer_computer_number, m.participant_computer_number,
                organizer.first_name AS organizer_name,
                participant.first_name AS participant_name
         FROM meetings m
         LEFT JOIN users organizer ON m.organizer_computer_number = organizer.computer_number
         LEFT JOIN users participant ON m.participant_computer_number = participant.computer_number
         WHERE m.meeting_id = ?`,
        [meeting_id]
      );
      if (meetings.length === 0) {
        console.error('Meeting not found for details change notification:', meeting_id);
        return;
      }
      const m = meetings[0];

      // Notify both organizer and participant (except the one who made the change)
      const notifications = [];

      if (m.organizer_computer_number !== updated_by && m.organizer_computer_number) {
        const message = `The details of your meeting "${m.title}" have been updated`;
        notifications.push(this.createNotification(m.organizer_computer_number, message, 'meeting'));
      }

      if (m.participant_computer_number !== updated_by && m.participant_computer_number) {
        const message = `The details of meeting "${m.title}" have been updated`;
        notifications.push(this.createNotification(m.participant_computer_number, message, 'meeting'));
      }

      await Promise.all(notifications);
    } catch (error) {
      console.error('Failed to notify meeting details change:', error);
      // Don't throw error to prevent API failure
    }
  }
};




