import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// Import your page components
import MoonlitLakeScene from './components/MoonlitLakeScene'; // Your main interactive homepage
import AuthPage from './components/Auth/AuthPage'; // The page for Login/Register

// --- Example Placeholder Components for Demonstration ---
// You can replace these with your actual components or build them out.

// A simple utility function to check if a user token exists in localStorage
const isAuthenticated = () => !!localStorage.getItem('userToken');

// A component that protects routes. If not logged in, it redirects to /login.
const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// An example of a protected Dashboard page
const Dashboard = () => {
    const navigateTo = (path) => {
        window.location.href = path; // Simple navigation, you could use useNavigate() hook as well
    };
    
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigateTo('/login');
    };

    return (
        <div style={{color: 'white', textAlign: 'center', paddingTop: '50px'}}>
            <h2>Dashboard</h2>
            <p>Welcome! You are logged in.</p>
            <button onClick={handleLogout} style={{padding: '10px 20px', cursor: 'pointer'}}>Logout</button>
        </div>
    );
};

// --- Main App Component ---
function App() {
  return (
    <Router>
      <div className='App'>
        {/*
          The <Routes> component from react-router-dom will look at the current URL
          and render the first <Route> that matches.
        */}
        <Routes>
          {/* Route 1: The Homepage */}
          {/* When the URL path is exactly "/", render the MoonlitLakeScene component. */}
          <Route path="/" element={<MoonlitLakeScene />} />

          {/* Route 2: The Login Page */}
          {/* When the URL path is "/login", render the AuthPage component.
              It defaults to showing the login form because isRegisterPage is not set. */}
          <Route path="/login" element={<AuthPage />} />

          {/* Route 3: The Registration Page */}
          {/* When the URL path is "/register", render the AuthPage component
              but pass the `isRegisterPage={true}` prop to make it show the registration form. */}
          <Route path="/register" element={<AuthPage isRegisterPage={true} />} />
          
          {/* Route 4: Example of a Protected Route */}
          {/* When the URL path is "/dashboard", it will first render the ProtectedRoute component.
              ProtectedRoute will check if the user is authenticated.
              If yes, it renders its children (the <Dashboard /> component).
              If no, it redirects the user to "/login". */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Fallback Route: If no other route matches, redirect to the homepage. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;