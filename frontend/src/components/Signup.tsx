import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';
import { useGoogleLogin } from '@react-oauth/google';

const Signup = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!name || !dob || !email) {
      setMessage('Please enter all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        dob,
        email,
      });

      if (response.data.message.includes('OTP sent')) {
        navigate('/verify-otp', { state: { email: email } });
      } else {
        setMessage(response.data.message);
      }
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Server error. Please try again later.');
      }
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/google', {
          tokenId: response.access_token,
        });

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        navigate('/notes');
      } catch (error) {
        console.error(error);
        setMessage('Google authentication failed.');
      }
    },
    onError: () => {
      setMessage('Google login failed.');
    }
  });

  return (
    <Layout>
      <div className="auth-card">
        <div className="logo-container">
          <img src="/HD-logo.png" alt="HD Logo" className="logo" />
        </div>
        <h2>Sign up</h2>
        <p className="tagline">Sign up to enjoy the feature of HD</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">Get OTP</button>
        </form>
        {message && <p className="error-message">{message}</p>}
        <div className="or-separator">OR</div>
        <button type="button" onClick={() => googleLogin()} className="google-auth-button">
          Sign up with Google
        </button>
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;