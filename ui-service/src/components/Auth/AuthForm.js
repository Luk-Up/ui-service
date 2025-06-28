import React, { useState } from "react";

// The prop is now consistently `isRegisterForm`
const AuthForm = ({ onSubmit, buttonText, isRegisterForm = false, apiError, isLoading }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass credentials object to the parent's onSubmit function
        if (isRegisterForm) {
            onSubmit({ username, email, password });
        } else {
            onSubmit({ email, password });
        }
    };

    // --- Using the themed styles from your provided code ---
    const formStyle = { display: "flex", flexDirection: "column", width: 'clamp(300px, 80vw, 400px)', margin: '0 auto', padding: '30px 35px', backgroundColor: 'rgba(10, 25, 47, 0.85)', borderRadius: '12px', boxShadow: '0 0 25px rgba(74, 144, 226, 0.3)', border: '1px solid rgba(74, 144, 226, 0.5)' };
    const inputGroupStyle = { marginBottom: '20px' };
    const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'normal', color: '#B0C4DE', fontSize: '0.95em' };
    const inputStyle = { width: '100%', padding: '12px 15px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #2A3B65', backgroundColor: '#0A192F', color: '#E0E8FF', fontSize: '1em' };
    const buttonStyle = { padding: '12px 20px', cursor: 'pointer', backgroundColor: '#4A90E2', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '1.1em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', transition: 'background-color 0.3s ease, box-shadow 0.3s ease', boxShadow: '0 0 10px rgba(74, 144, 226, 0.5)' };
    const errorStyle = { color: '#FF6B6B', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold' };
    const titleStyle = { textAlign: 'center', color: '#E0E8FF', marginBottom: '30px', fontSize: '2em', fontWeight: '300', textShadow: '0 0 8px rgba(135, 206, 250, 0.7)' };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h2 style={titleStyle}>{buttonText}</h2>
            {/* Conditional rendering for the username field */}
            {isRegisterForm && (
                <div style={inputGroupStyle}>
                    <label htmlFor="username" style={labelStyle}>Username</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required style={inputStyle} placeholder="Choose your callsign" />
                </div>
            )}
            <div style={inputGroupStyle}>
                <label htmlFor="email" style={labelStyle}>Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} placeholder="Enter your email address" />
            </div>
            <div style={inputGroupStyle}>
                <label htmlFor="password" style={labelStyle}>Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={isRegisterForm ? 6 : undefined} style={inputStyle} placeholder={isRegisterForm ? "Minimum 6 characters" : "Enter your password"} />
            </div>
            {apiError && <p style={errorStyle}>{apiError}</p>}
            <button type="submit" disabled={isLoading} style={{ ...buttonStyle, opacity: isLoading ? 0.6 : 1 }}>
                {isLoading ? 'Connecting...' : buttonText}
            </button>
        </form>
    );
};

export default AuthForm;