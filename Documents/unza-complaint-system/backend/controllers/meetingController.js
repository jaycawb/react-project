//backend/controllers/meetingController.js
import { createMeeting, getAllMeetings, deleteMeeting } from '../models/Meeting.js';


export const addMeeting = async (req, res) => {
  const { title, description, scheduled_at, organizer_computer_number, participant_computer_number } = req.body;
  // If organizer not provided, use current user
  const organizer = organizer_computer_number || req.user.computer_number;
  if (!title || !participant_computer_number || !scheduled_at) {
    return res.status(400).json({ success: false, message: 'Title, participant, and scheduled time are required' });
  }
  const meetingId = await createMeeting({
    title,
    description,
    organizer_computer_number: organizer,
    participant_computer_number,
    scheduled_at
  });
  res.status(201).json({ success: true, meetingId });
};


export const listMeetings = async (req, res) => {
  const meetings = await getAllMeetings();
  res.json({ success: true, meetings });
};

export const removeMeeting = async (req, res) => {
  const { id } = req.params;
  await deleteMeeting(id);
  res.json({ success: true, message: 'Meeting deleted' });
};
