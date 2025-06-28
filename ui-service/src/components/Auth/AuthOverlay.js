import React from 'react';
import { Link } from 'react-router-dom';
import AuthForm from './AuthForm';

const AuthOverlay = ({ isRegister, handleFormSubmit, apiError, isLoading }) => {

    const overlayContainerStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const glassFormWrapperStyle = {
        // --- The Glassmorphism Effect ---
        background: 'rgba(15, 20, 40, 0.45)', // Semi-transparent background
        backdropFilter: 'blur(15px) saturate(150%)', // The key blur & saturation effect
        WebkitBackdropFilter: 'blur(15px) saturate(150%)', // For Safari support
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.15)', // Subtle edge highlight
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', // Soft shadow for depth
        padding: '2rem',
    };

    const linkContainerStyle = { textAlign: 'center', marginTop: '25px', color: '#B0C4DE', fontSize: '0.9em' };
    const linkStyle = { color: '#87CEFA', textDecoration: 'none', fontWeight: 'bold' };

    return (
        <div style={overlayContainerStyle}>
            <div style={glassFormWrapperStyle}>
                <AuthForm
                    onSubmit={handleFormSubmit}
                    buttonText={isRegister ? "Create Account" : "Login"}
                    isRegisterForm={isRegister}
                    apiError={apiError}
                    isLoading={isLoading}
                />
                <p style={linkContainerStyle}>
                    {isRegister ? "Already have an account? " : "Don't have an account? "}
                    <Link to={isRegister ? "/login" : "/register"} style={linkStyle}>
                        {isRegister ? "Login here" : "Register here"}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AuthOverlay;