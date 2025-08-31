import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!email) {
      setMessage('Please enter your email.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/send-otp-for-login', { email });
      
      setMessage('A new OTP has been sent. Please check the server console.');
      
      navigate('/verify-otp', { state: { email: email } });
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
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/google', {
          tokenId: tokenResponse.access_token,
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
        <h2>Sign in</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        {message && <p className="error-message">{message}</p>}
        <div className="or-separator">OR</div>
        <button type="button" onClick={() => googleLogin()} className="google-auth-button">
          Sign in with Google
        </button>
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;