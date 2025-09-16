//backend/controllers/complaintController.js
import { createComplaint, getComplaintsByStudent } from '../models/Complaint.js';

export const submitComplaint = async (req, res) => {
  const { title, description } = req.body;
  const student_id = req.user.computer_number;
  const complaintId = await createComplaint({ title, description, student_id });
  res.status(201).json({ success: true, complaintId });
};

export const getMyComplaints = async (req, res) => {
  const student_id = req.user.computer_number;
  const complaints = await getComplaintsByStudent(student_id);
  res.json({ success: true, complaints });
};
