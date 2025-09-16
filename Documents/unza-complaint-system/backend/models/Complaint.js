//backend/models/Complaint.js
import { promisePool } from '../config/db.js';

export const createComplaint = async (data) => {
  const [result] = await promisePool.query(
    'INSERT INTO complaints (title, description, student_id, status) VALUES (?, ?, ?, ?)',
    [data.title, data.description, data.student_id, data.status || 'pending']
  );
  return result.insertId;
};

export const getComplaintsByStudent = async (student_id) => {
  const [complaints] = await promisePool.query(
    'SELECT * FROM complaints WHERE student_id = ?',
    [student_id]
  );
  return complaints;
};
