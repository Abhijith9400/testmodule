import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import handler from 'express-async-handler';
import { UserModel } from '../models/user.model.js';
import auth from '../middleware/auth.mid.js';

const router = Router();
const PASSWORD_HASH_SALT_ROUNDS = 10;

// Login Route
router.post(
  '/login',
  handler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log(`User Login Successful: ${user.email} | isAdmin: ${user.isAdmin}`);
      res.send(generateTokenResponse(user));
      return;
    }

    console.log(`User Login Failed for email: ${email}`);
    res.status(BAD_REQUEST).send('Username or password is invalid');
  })
);

// Register Route
router.post(
  '/register',
  handler(async (req, res) => {
    const { name, email, password, address, isAdmin = false } = req.body;

    const user = await UserModel.findOne({ email });

    if (user) {
      res.status(BAD_REQUEST).send('User already exists, please login!');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_SALT_ROUNDS);

    const newUser = await UserModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      address,
      isAdmin
    });

    console.log(`User Registered: ${newUser.email} | isAdmin: ${newUser.isAdmin}`);
    res.send(generateTokenResponse(newUser));
  })
);

// Update Profile Route
router.put(
  '/updateProfile',
  auth,
  handler(async (req, res) => {
    const { name, address } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { name, address },
      { new: true }
    );

    console.log(`User Profile Updated: ${user.email}`);
    res.send(generateTokenResponse(user));
  })
);

// Change Password Route
router.put(
  '/changePassword',
  auth,
  handler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      res.status(BAD_REQUEST).send('Change Password Failed!');
      return;
    }

    const equal = await bcrypt.compare(currentPassword, user.password);

    if (!equal) {
      res.status(BAD_REQUEST).send('Current Password Is Not Correct!');
      return;
    }

    user.password = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT_ROUNDS);
    await user.save();

    console.log(`Password Changed Successfully for user: ${user.email}`);
    res.send('Password changed successfully');
  })
);

// Generate Token Response
const generateTokenResponse = user => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    token,
  };
};

export default router;
