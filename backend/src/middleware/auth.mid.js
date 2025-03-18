import { verify } from 'jsonwebtoken';
import { UNAUTHORIZED } from '../constants/httpStatus.js';

export default (req, res, next) => {
  const token = req.headers.access_token;
  if (!token) return res.status(UNAUTHORIZED).send();

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();  // Proceed if the token is valid
  } catch (error) {
    return res.status(UNAUTHORIZED).send();  // Return immediately if the token is invalid
  }
};
