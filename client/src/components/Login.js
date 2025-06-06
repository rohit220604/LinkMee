import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
          const res = await axios.post('http://localhost:5000/api/auth/register', {
            email: form.email,
            username: form.username,
            password: form.password,
          });
          // Note: Your backend should send OTP to email and respond with success
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
          const res = await axios.post('http://localhost:5000/api/auth/send-reset-otp', {
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

                  {/* OTP Box - Only shown after first click */}
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

              {(mode === 'signin') && (
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
                  {/* Step 1: Request OTP */}
                  {!otpRequested && (
                    <button type="submit" className="btn btn-primary btn-lg w-100 mt-4">
                      Send Reset Link
                    </button>
                  )}
                  {/* Step 2: Verify OTP */}
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
                  {/* Step 3: Set new password */}
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

              {(mode !== 'forgot') && (
                <button type="submit" className="btn btn-primary btn-lg w-100 mt-4">
                  {mode === 'signup' ? (otpRequested ? 'Sign Up' : 'Register') : 'Login'}
                </button>
              )}
            </form>

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
