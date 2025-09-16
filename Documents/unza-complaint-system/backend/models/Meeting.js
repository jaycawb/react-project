//backend/models/Meeting.js
import { promisePool } from '../config/db.js';


export const createMeeting = async (data) => {
  const [result] = await promisePool.query(
    `INSERT INTO meetings (title, description, organizer_computer_number, participant_computer_number, scheduled_at, status) VALUES (?, ?, ?, ?, ?, 'pending')`,
    [data.title, data.description, data.organizer_computer_number, data.participant_computer_number, data.scheduled_at]
  );
  return result.insertId;
};


export const getAllMeetings = async () => {
  const [meetings] = await promisePool.query(`
    SELECT meeting_id, title, description, organizer_computer_number, participant_computer_number, scheduled_at, status, created_at
    FROM meetings
    ORDER BY scheduled_at DESC
  `);
  return meetings;
};


export const deleteMeeting = async (meetingId) => {
  await promisePool.query('DELETE FROM meetings WHERE meeting_id = ?', [meetingId]);
};
