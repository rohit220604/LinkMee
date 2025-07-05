import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GOOGLE_AUTH_URL = 'http://localhost:5000/api/auth/google';
const Login = () => {
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ email: '', username: '', password: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === 'signup') {
        if (!otpRequested) {
          // Step 1: Request OTP for signup
          await axios.post('http://localhost:5000/api/auth/register', {
            email: form.email,
            username: form.username,
            password: form.password,
          });
          setOtpRequested(true);
          setMessage(`Check your ${form.email} for OTP.`);
        } else {
          // Step 2: Verify OTP and complete registration
          const res = await axios.post('http://localhost:5000/api/auth/verify-signup-otp', {
            email: form.email,
            otp: otp,
          });
          setMessage(res.data.message || 'Account verified successfully!');
          setMode('signin');
          setOtp('');
          setOtpRequested(false);
        }
      } else if (mode === 'signin') {
        // Login
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem('token', res.data.token);
        window.dispatchEvent(new Event('authChange'));
        setMessage('Login successful!');
        navigate('/dashboard');
      } else if (mode === 'forgot') {
        if (!otpRequested) {
          // Step 1: Request OTP for password reset
          await axios.post('http://localhost:5000/api/auth/send-reset-otp', {
            email: form.email,
          });
          setOtpRequested(true);
          setMessage(`Check your ${form.email} for OTP.`);
        } else if (!otpVerified) {
          // Step 2: Verify OTP for password reset
          const res = await axios.post('http://localhost:5000/api/auth/verify-otp-reset', {
            email: form.email,
            otp: otp,
          });
          if (res.data.success) {
            setOtpVerified(true);
            setMessage('OTP verified. Please set a new password.');
          } else {
            setMessage(res.data.message || 'Invalid or expired OTP.');
          }
        } else {
          // Step 3: Set new password
          if (form.newPassword !== form.confirmPassword) {
            setMessage('Passwords do not match.');
            return;
          }
          const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
            email: form.email,
            otp: otp,
            newPassword: form.newPassword,
          });
          setMessage(res.data.message || 'Password reset successful!');
          setMode('signin');
          setOtp('');
          setOtpRequested(false);
          setOtpVerified(false);
        }
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error occurred');
    }
  };

  const resetOtp = () => {
    setForm({ email: '', username: '', password: '', newPassword: '', confirmPassword: '' });
    setOtp('');
    setOtpRequested(false);
    setOtpVerified(false);
    setMessage('');
  };

  // Google OAuth handler
  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <div className="container vh-100 d-flex align-items-center">
      <div className="row w-100">
        <div className="col-md-6 d-flex flex-column justify-content-center px-4 py-5">
          <h1 className="text-center display-4">Welcome Back!</h1>
          <p className="mt-4 text-secondary fs-4 fw-normal lh-lg">
            Linkme is your personal hub to bring all your links together in one beautiful page.
          </p>
        </div>

        <div className="col-md-6 d-flex justify-content-center">
          <div className="card px-5 py-6 w-100" style={{ maxWidth: '450px', minHeight: '550px' }}>
            <h3 className="text-center mb-5 display-6 my-5">
              {mode === 'signin' ? 'Login' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </h3>

            {message && <div className="alert alert-info text-center">{message}</div>}

            <form onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <>
                  <div className="form-group mb-4">
                    <label className="fs-5">Email address</label>
                    <input
                      name="email"
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="Enter email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      disabled={otpRequested}
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label className="fs-5">Username</label>
                    <input
                      name="username"
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Enter username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      disabled={otpRequested}
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label className="fs-5">Password</label>
                    <input
                      name="password"
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Enter password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      disabled={otpRequested}
                    />
                  </div>
                  {otpRequested && (
                    <div className="form-group mb-4">
                      <label className="fs-5">OTP (One-Time Password)</label>
                      <input
                        name="otp"
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter OTP sent to your email"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                      <small className="text-muted">Check your {form.email} for OTP.</small>
                    </div>
                  )}
                </>
              )}

              {mode === 'signin' && (
                <>
                  <div className="form-group mb-4">
                    <label className="fs-5">Email address</label>
                    <input
                      name="email"
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="Enter email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label className="fs-5">Password</label>
                    <input
                      name="password"
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Enter password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

              {mode === 'forgot' && (
                <>
                  <div className="form-group mb-4">
                    <label className="fs-5">Email address</label>
                    <input
                      name="email"
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="Enter email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      disabled={otpRequested}
                    />
                  </div>
                  {!otpRequested && (
                    <button type="submit" className="btn btn-primary btn-lg w-100 mt-4">
                      Send Reset Link
                    </button>
                  )}
                  {otpRequested && !otpVerified && (
                    <>
                      <div className="form-group mb-4">
                        <label className="fs-5">OTP (One-Time Password)</label>
                        <input
                          name="otp"
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="Enter OTP sent to your email"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary btn-lg w-100 mt-4">
                        Verify OTP
                      </button>
                    </>
                  )}
                  {otpVerified && (
                    <>
                      <div className="form-group mb-4">
                        <label className="fs-5">New Password</label>
                        <input
                          name="newPassword"
                          type="password"
                          className="form-control form-control-lg"
                          placeholder="Enter new password"
                          value={form.newPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group mb-4">
                        <label className="fs-5">Confirm New Password</label>
                        <input
                          name="confirmPassword"
                          type="password"
                          className="form-control form-control-lg"
                          placeholder="Confirm new password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary btn-lg w-100 mt-4">
                        Reset Password
                      </button>
                    </>
                  )}
                </>
              )}

              {mode !== 'forgot' && (
                <button type="submit" className="btn btn-primary btn-lg w-100 mt-4">
                  {mode === 'signup' ? (otpRequested ? 'Sign Up' : 'Register') : 'Login'}
                </button>
              )}
            </form>

            {/* Google OAuth Button */}
            {mode === 'signin' && (
              <div className="text-center my-3">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-lg w-100"
                  onClick={handleGoogleLogin}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: 8 }}>
                    <g>
                      <path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6-6C34.1 5.1 29.3 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.5-.3-3.5z"/>
                      <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.3 16.1 18.7 13 24 13c2.7 0 5.2.9 7.2 2.4l6-6C34.1 5.1 29.3 3 24 3c-7.7 0-14.3 4.3-17.7 10.7z"/>
                      <path fill="#FBBC05" d="M24 43c5.3 0 10.1-1.8 13.8-4.9l-6.4-5c-2 1.4-4.5 2.2-7.4 2.2-5.6 0-10.3-3.7-12-8.7l-6.6 5.1C9.7 39.7 16.3 43 24 43z"/>
                      <path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.1 3-3.5 5.4-6.3 6.7l6.4 5C40.7 36.1 44 30.3 44 23c0-1.3-.1-2.5-.4-3.5z"/>
                    </g>
                  </svg>
                  Sign in with Google
                </button>
              </div>
            )}

            {/* Toggle Modes */}
            <div className="text-center mt-4">
              {mode !== 'signin' && (
                <button className="btn btn-link p-0 me-3" onClick={() => { setMode('signin'); resetOtp(); }}>
                  Sign In
                </button>
              )}
              {mode !== 'signup' && (
                <button className="btn btn-link p-0 me-3" onClick={() => { setMode('signup'); resetOtp(); }}>
                  Create Account
                </button>
              )}
              {mode !== 'forgot' && (
                <button className="btn btn-link p-0" onClick={() => { setMode('forgot'); resetOtp(); }}>
                  Forgot Password?
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
