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
        `SELECT c.computer_number, c.title, u.first_name, u.email
         FROM complaints c
         LEFT JOIN users u ON c.computer_number = u.computer_number
         WHERE c.complaint_id = ?`,
        [complaint_id]
      );

      if (complaints.length === 0 || !complaints[0].computer_number) return;
      const c = complaints[0];
      let message = `Your complaint "${c.title}" has been ${status}.`;
      if (admin_response) message += ` Admin response: ${admin_response}`;
      await this.createNotification(c.computer_number, message, 'complaint');
    } catch (error) {
      console.error('Failed to notify complaint update:', error);
    }
  },

  async notifyMeetingRequest(meeting_id) {
    try {
      const [meetings] = await promisePool.query(
        `SELECT m.title, m.scheduled_at,
                organizer.first_name AS organizer_name,
                participant.first_name AS participant_name,
                participant.computer_number AS participant_id
         FROM meetings m
         LEFT JOIN users organizer ON m.organizer_computer_number = organizer.computer_number
         LEFT JOIN users participant ON m.participant_computer_number = participant.computer_number
         WHERE m.meeting_id = ?`,
        [meeting_id]
      );
      if (meetings.length === 0) return;
      const m = meetings[0];
      const when = new Date(m.scheduled_at).toLocaleString();
      const message = `You have a new meeting request from ${m.organizer_name}: "${m.title}" scheduled for ${when}`;
      await this.createNotification(m.participant_id, message, 'meeting');
    } catch (error) {
      console.error('Failed to notify meeting request:', error);
    }
  }
};


