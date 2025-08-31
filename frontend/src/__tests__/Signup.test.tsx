import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../components/Signup';

describe('Signup Component', () => {
    test('renders the signup form with all fields', () => {
        render(
            <BrowserRouter>
                <Signup />
            </BrowserRouter>
        );
        expect(screen.getByText('Sign up')).toBeInTheDocument();
        expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Get OTP/i })).toBeInTheDocument();
    });

    test('displays an error message when submitting an empty form', async () => {
        render(
            <BrowserRouter>
                <Signup />
            </BrowserRouter>
        );
        fireEvent.click(screen.getByRole('button', { name: /Get OTP/i }));
        await waitFor(() => {
            expect(screen.getByText('Please enter all fields.')).toBeInTheDocument();
        });
    });
});