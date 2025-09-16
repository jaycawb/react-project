// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './LoginPage.css'; // CSS file for styling

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    computer_number: '',
    password: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerData, setRegisterData] = useState({
    computer_number: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);

  const { login, register, loading, error, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location, isAuthenticated]);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!credentials.computer_number || !credentials.password) {
      return;
    }

    const result = await login(credentials);
    
    if (result.success) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  };

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!registerData.computer_number || !registerData.first_name || 
        !registerData.last_name || !registerData.email || 
        !registerData.phone || !registerData.password) {
      return;
    }

    const result = await register(registerData);
    
    if (result.success) {
      // Switch back to login form
      setIsRegistering(false);
      setCredentials({
        computer_number: registerData.computer_number,
        password: ''
      });
      // Clear registration form
      setRegisterData({
        computer_number: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        role: 'student'
      });
    }
  };

  // Handle input changes for login form
  const handleLoginChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // Handle input changes for registration form
  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <img 
            src="/assets/unza-logo.png" 
            alt="UNZA Logo" 
            className="logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h1>UNZA Complaint & Meeting System</h1>
          <p>
            {isRegistering 
              ? 'Create your account to get started' 
              : 'Sign in to access your account'
            }
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Login Form */}
        {!isRegistering ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="computer_number">Computer Number</label>
              <input
                type="text"
                className="input"
                id="computer_number"
                name="computer_number"
                value={credentials.computer_number}
                onChange={handleLoginChange}
                placeholder="e.g. 2021483525"
                pattern="[0-9]{10}"
                title="Computer number must be 10 digits"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="input"
                  value={credentials.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn btn"
              disabled={loading || !credentials.computer_number || !credentials.password}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg_first_name">First Name</label>
                <input
                  type="text"
                  className="input"
                  id="reg_first_name"
                  name="first_name"
                  value={registerData.first_name}
                  onChange={handleRegisterChange}
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg_last_name">Last Name</label>
                <input
                  type="text"
                  className="input"
                  id="reg_last_name"
                  name="last_name"
                  value={registerData.last_name}
                  onChange={handleRegisterChange}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg_computer_number">Computer Number</label>
              <input
                type="text"
                className="input"
                id="reg_computer_number"
                name="computer_number"
                value={registerData.computer_number}
                onChange={handleRegisterChange}
                placeholder="e.g. 2021483525"
                pattern="[0-9]{10}"
                title="Computer number must be 10 digits"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg_email">Email</label>
              <input
                type="email"
                className="input"
                id="reg_email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                placeholder="your.name@unza.zm"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg_phone">Phone Number</label>
              <input
                type="tel"
                className="input"
                id="reg_phone"
                name="phone"
                value={registerData.phone}
                onChange={handleRegisterChange}
                placeholder="+260977123456"
                pattern="\+260[0-9]{9}"
                title="Phone number format: +260XXXXXXXXX"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg_role">Role</label>
              <select
                id="reg_role"
                name="role"
                className="select"
                value={registerData.role}
                onChange={handleRegisterChange}
              >
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="reg_password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="reg_password"
                  name="password"
                  className="input"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="Create a strong password"
                  minLength="6"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn btn"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Toggle between login and register */}
        <div className="auth-toggle">
          {!isRegistering ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => setIsRegistering(true)}
              >
                Create one here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => setIsRegistering(false)}
              >
                Sign in here
              </button>
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>&copy; 2025 University of Zambia. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;