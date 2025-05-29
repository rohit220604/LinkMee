  import { Link, useNavigate } from 'react-router-dom';
  import React, { useEffect, useState } from 'react';

  export const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
      const onAuthChange = () => {
        setIsLoggedIn(!!localStorage.getItem('token'));
      };

      window.addEventListener('authChange', onAuthChange);

      return () => {
        window.removeEventListener('authChange', onAuthChange);
      };
    }, []);

    const handleLogout = () => {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      window.dispatchEvent(new Event('authChange'));
      navigate('/login');
    };

    const handleLoginClick = () => {
      navigate('/login');
    };

    return (
      <nav className="navbar navbar-expand-lg bg-body-tertiary py-3">
        <div className="container-fluid px-4">
          <Link className="navbar-brand fs-3 fw-bold" to="/">LinkMe</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 fs-5">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About us</Link>
              </li>
              {isLoggedIn && (
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
              )}
            </ul>

            {!isLoggedIn ? (
              <button className="btn btn-outline-success btn-lg" onClick={handleLoginClick}>
                Login
              </button>
            ) : (
              <button className="btn btn-outline-danger btn-lg" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    );
  };
