import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id: string) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: '30d',
  });
};

export const signup = async (req: Request, res: Response) => {
  const { name, dob, email } = req.body;

  if (!name || !dob || !email) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const dobAsDate = new Date(dob);

    user = await User.create({
      name,
      dob: dobAsDate,
      email,
    });

    const otp = uuidv4().substring(0, 6);
    console.log(`OTP for ${email}: ${otp}`);

    res.status(201).json({
      message: 'User signed up successfully. OTP sent for verification.',
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// This function sends an OTP for an existing user trying to log in
export const sendOtpForLogin = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Please enter your email.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No user found with that email.' });
    }

    // In a production environment, you would send this OTP via email or SMS
    const otp = uuidv4().substring(0, 6);
    console.log(`OTP for ${email}: ${otp}`);

    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or OTP.' });
    }

    const token = generateToken(user._id.toString());
    
    res.status(200).json({
      message: 'OTP verified successfully.',
      user: {
        id: user._id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: 'Invalid Google token.' });
    }

    const { email, sub: googleId } = payload;

    let user: IUser | null = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user && !user.googleId) {
      user.googleId = googleId;
      await user.save();
    }
    else if (!user) {
      user = await User.create({ email, googleId });
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      message: 'Logged in with Google successfully.',
      user: {
        id: user._id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Google authentication failed.' });
  }
};