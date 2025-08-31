import { Router } from 'express';
import {
  signup,
  sendOtpForLogin,
  verifyOtp,
  googleLogin
} from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/send-otp-for-login', sendOtpForLogin);
router.post('/verify-otp', verifyOtp);
router.post('/google', googleLogin);

export default router;