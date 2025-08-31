import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!otp) {
      setMessage('Please enter the OTP.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email,
        otp,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setMessage(response.data.message);
      
      navigate('/notes');
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Server error. Please try again later.');
      }
    }
  };

  if (!email) {
    return null;
  }

  return (
    <Layout>
      <div className="auth-card">
        <div className="logo-container">
          <img src="/HD-logo.png" alt="HD Logo" className="logo" />
        </div>
        <h2>Verify OTP</h2>
        <p className="tagline">An OTP has been sent to your email. Please check the server console for the OTP.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">Verify</button>
        </form>
        {message && <p className="error-message">{message}</p>}
      </div>
    </Layout>
  );
};

export default OTPVerification;