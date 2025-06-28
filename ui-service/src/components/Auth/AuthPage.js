import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authApiService from '../../services/authApiService';
import MoonlitLakeScene from '../MoonlitLakeScene'; // Your main interactive scene
import AuthOverlay from './AuthOverlay';

const AuthPage = ({ isRegisterPage = false }) => {
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const passedMessage = location.state?.message;

    const handleFormSubmit = async (credentials) => {
        setIsLoading(true);
        setApiError('');
        try {
            if (isRegisterPage) {
                await authApiService.register(credentials.username, credentials.email, credentials.password);
                navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
            } else {
                const response = await authApiService.login(credentials.email, credentials.password);
                if (response.data.token) {
                    localStorage.setItem('userToken', response.data.token);
                    const fromPath = location.state?.from?.pathname || "/"; // Redirect home or to protected route
                    navigate(fromPath, { replace: true });
                }
            }
        } catch (err) {
            const errorMessage = err.response?.data?.errors
                ? err.response.data.errors.map(e => e.msg).join('. ')
                : err.response?.data?.msg || 'An error occurred. Please try again.';
            setApiError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const messageStyle = { position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', color: '#90EE90', background: 'rgba(46, 204, 113, 0.1)', padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(46, 204, 113, 0.3)', zIndex: 20 };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
            <MoonlitLakeScene />
            {passedMessage && !isRegisterPage && <p style={messageStyle}>{passedMessage}</p>}
            <AuthOverlay
                isRegister={isRegisterPage}
                handleFormSubmit={handleFormSubmit}
                apiError={apiError}
                isLoading={isLoading}
            />
        </div>
    );
};

export default AuthPage;