import './App.css';
import { Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Notes from './components/Notes';
import OTPVerification from './components/OTPVerification';

// Placeholder components for the pages
const WelcomePage = () => <div>Welcome Page</div>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<OTPVerification />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/" element={<WelcomePage />} />
    </Routes>
  );
}

export default App;