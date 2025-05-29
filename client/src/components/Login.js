import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [mode, setMode] = useState('signin'); // modes: signin, signup, forgot
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === 'signup') {
        const res = await axios.post('http://localhost:5000/api/auth/register', {
          email: form.email,
          username: form.username,
          password: form.password,
        });
        setMessage(res.data.message);
        setMode('signin');
      } else if (mode === 'signin') {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem('token', res.data.token);
        window.dispatchEvent(new Event('authChange'));
        setMessage('Login successful!');
        navigate('/dashboard');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error occurred');
    }
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
                    />
                  </div>
                </>
              )}

              {(mode === 'signin' || mode === 'signup') && (
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
              )}

              {mode === 'signin' && (
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
              )}

              <button type="submit" className="btn btn-primary btn-lg w-100 mt-4">
                {mode === 'signup' ? 'Sign Up' : mode === 'signin' ? 'Login' : 'Send Reset Link'}
              </button>
            </form>

            {/* Toggle Modes */}
            <div className="text-center mt-4">
              {mode !== 'signin' && (
                <button className="btn btn-link p-0 me-3" onClick={() => setMode('signin')}>
                  Sign In
                </button>
              )}
              {mode !== 'signup' && (
                <button className="btn btn-link p-0 me-3" onClick={() => setMode('signup')}>
                  Create Account
                </button>
              )}
              {mode !== 'forgot' && (
                <button className="btn btn-link p-0" onClick={() => setMode('forgot')}>
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
