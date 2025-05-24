import React, { useState } from 'react';

const Login = () => {
  const [mode, setMode] = useState('signin'); // modes: signin, signup, forgot

  return (
    <div className="container vh-100 d-flex align-items-center">
      <div className="row w-100">
        {/* Left Side */}
        <div className="col-md-6 d-flex flex-column justify-content-center px-4 py-5">
          <h1 className="text-center display-4">Welcome Back!</h1>
          <p className="mt-4 text-secondary fs-4 fw-normal lh-lg">
            Linkme is your personal hub to bring all your links together in one beautiful page.
            Share your social profiles, blogs, portfolios, and websites — everything you want your audience to see — with just one easy link.
            Join for free today and start building your online presence effortlessly.
          </p>
        </div>

        {/* Right Side - Auth Box */}
        <div className="col-md-6 d-flex justify-content-center">
        <div className="card px-5 py-6 w-100" style={{ maxWidth: '550px', minHeight: '700px' }}>
            {/* Title */}
            <h3 className="text-center mb-5 display-6 my-5">
              {mode === 'signin' && 'Login'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h3>

            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()}>
              {mode === 'signup' && (   
                <>
                  <div className="form-group mb-4">
                    <label htmlFor="signupEmail" className="fs-5">Email address</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="signupEmail"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="signupUsername" className="fs-5">Username</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="signupUsername"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="signupPassword" className="fs-5">Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="signupPassword"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg w-100 mt-4">
                    Sign Up
                  </button>
                </>
              )}

              {mode === 'signin' && (
                <>
                  <div className="form-group mb-4">
                    <label htmlFor="signinUsername" className="fs-5">Username</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="signinUsername"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="signinPassword" className="fs-5">Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="signinPassword"
                      placeholder="Password"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg w-100 mt-4">
                    Login
                  </button>
                </>
              )}

              {mode === 'forgot' && (
                <>
                  <div className="form-group mb-4">
                    <label htmlFor="forgotEmail" className="fs-5">Email address</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="forgotEmail"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg w-100 mt-4">
                    Send Reset Link
                  </button>
                </>
              )}
            </form>

            {/* Toggle Links */}
            <div className="text-center mt-4">
              {mode !== 'signin' && (
                <button
                  className="btn btn-link p-0 me-3"
                  onClick={() => setMode('signin')}
                  type="button"
                >
                  Sign In
                </button>
              )}
              {mode !== 'signup' && (
                <button
                  className="btn btn-link p-0 me-3"
                  onClick={() => setMode('signup')}
                  type="button"
                >
                  Create Account
                </button>
              )}
              {mode !== 'forgot' && (
                <button
                  className="btn btn-link p-0"
                  onClick={() => setMode('forgot')}
                  type="button"
                >
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
