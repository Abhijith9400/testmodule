import { UNAUTHORIZED } from '../constants/httpStatus.js';
import authMid from './auth.mid.js';

const adminMid = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(UNAUTHORIZED).send();  // Return immediately if not an admin
  }
  next();  // Proceed if the user is an admin
};

export default [authMid, adminMid];
