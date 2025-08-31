import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import OTPVerification from '../components/OTPVerification';

describe('OTPVerification Component', () => {
    test('renders the OTP verification form', () => {
        render(
            <MemoryRouter initialEntries={[{ pathname: '/verify-otp', state: { email: 'test@example.com' } }]}>
                <Routes>
                    <Route path="/verify-otp" element={<OTPVerification />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText('Verify OTP')).toBeInTheDocument();
        expect(screen.getByLabelText(/OTP:/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Verify/i })).toBeInTheDocument();
    });

    test('redirects to signup if no email is in state', () => {
        render(
            <MemoryRouter initialEntries={['/verify-otp']}>
                <Routes>
                    <Route path="/verify-otp" element={<OTPVerification />} />
                    <Route path="/signup" element={<div>Signup Page</div>} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText('Signup Page')).toBeInTheDocument();
    });
});