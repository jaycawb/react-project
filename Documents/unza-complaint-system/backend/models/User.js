//backend/models/User.js
import { promisePool } from '../config/db.js';

export const findUserByComputerNumber = async (computer_number) => {
  const [users] = await promisePool.query(
    'SELECT * FROM users WHERE computer_number = ?',
    [computer_number]
  );
  return users[0];
};

