import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '',
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when form changes
  useEffect(() => {
    if (error || formError) {
      clearError();
      setFormError('');
    }
  }, [formData.name, formData.email, formData.password, formData.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    
    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    padding: '40px',
    width: '100%',
    maxWidth: '480px',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px'
  };

  const titleStyle = {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #48bb78, #38a169)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const subtitleStyle = {
    color: '#718096',
    fontSize: '1rem',
    fontWeight: '500'
  };

  const formGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '8px',
    fontSize: '0.95rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    background: '#fafafa',
    boxSizing: 'border-box'
  };

  const inputFocusStyle = {
    outline: 'none',
    borderColor: '#48bb78',
    background: 'white',
    boxShadow: '0 0 0 3px rgba(72, 187, 120, 0.1)'
  };

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 24px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    width: '100%',
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    marginTop: '10px'
  };

  const buttonHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 20px rgba(72, 187, 120, 0.3)'
  };

  const buttonDisabledStyle = {
    opacity: '0.6',
    cursor: 'not-allowed',
    transform: 'none'
  };

  const linkStyle = {
    textAlign: 'center',
    marginTop: '24px',
    color: '#718096'
  };

  const linkAnchorStyle = {
    color: '#48bb78',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.3s ease'
  };

  const errorStyle = {
    background: 'linear-gradient(135deg, #fed7d7, #feb2b2)',
    color: '#c53030',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '1px solid #fc8181',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(254, 178, 178, 0.3)'
  };

  const successStyle = {
    background: 'linear-gradient(135deg, #c6f6d5, #9ae6b4)',
    color: '#276749',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '1px solid #48bb78',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)'
  };

  const passwordHintStyle = {
    fontSize: '0.85rem',
    color: '#718096',
    marginTop: '5px',
    display: 'block'
  };

  return (
    <div style={containerStyle}>
      <div 
        style={cardStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        }}
      >
        <div style={headerStyle}>
          <h1 style={titleStyle}>Create Account</h1>
          <p style={subtitleStyle}>Join us and start managing your tasks</p>
        </div>
        
        {(error || formError) && (
          <div style={errorStyle}>
            <span style={{fontSize: '1.2rem'}}>⚠️</span>
            {error || formError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{marginBottom: '0'}}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              name="name"
              required
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.background = '#fafafa';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              name="email"
              required
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.background = '#fafafa';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div style={formGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              name="password"
              required
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.background = '#fafafa';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Create a password (min. 6 characters)"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              minLength="6"
            />
            <span style={passwordHintStyle}>Must be at least 6 characters long</span>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.background = '#fafafa';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...buttonStyle,
              ...(isLoading ? buttonDisabledStyle : {}),
              ...(!isLoading ? {':hover': buttonHoverStyle} : {})
            }}
            onMouseEnter={(e) => !isLoading && Object.assign(e.target.style, buttonHoverStyle)}
            onMouseLeave={(e) => !isLoading && (e.target.style.transform = 'translateY(0)')}
          >
            {isLoading ? (
              <>
                <span style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid currentColor',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px'
                }}></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div style={linkStyle}>
          Already have an account?{' '}
          <Link 
            to="/login" 
            style={linkAnchorStyle}
            onMouseEnter={(e) => e.target.style.color = '#38a169'}
            onMouseLeave={(e) => e.target.style.color = '#48bb78'}
          >
            Sign in here
          </Link>
        </div>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Register;