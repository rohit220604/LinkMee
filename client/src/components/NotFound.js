import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100">
        <div className="col-md-7 d-flex flex-column justify-content-center align-items-center">
          <h1 className="display-1 fw-bold text-primary mb-3" style={{ letterSpacing: '2px' }}>
            404
          </h1>
          <h2 className="mb-4 text-secondary fw-semibold">Oops! Page Not Found</h2>
          <p className="fs-5 text-muted mb-4 text-center" style={{ maxWidth: 400 }}>
            Looks like you followed a broken link.<br />
            But don’t worry, your links are safe with us!
          </p>
          <Link to="/" className="btn btn-lg btn-primary px-5 shadow">
            Go Home
          </Link>
        </div>
        <div className="col-md-5 d-flex align-items-center justify-content-center">
          {/* Creative SVG illustration for a broken link */}
          <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
            <circle cx="110" cy="110" r="100" fill="#f8f9fa" />
            <rect x="60" y="100" width="100" height="20" rx="10" fill="#0d6efd" opacity="0.2"/>
            <path d="M80 110 Q90 90 110 110 Q130 130 140 110" stroke="#0d6efd" strokeWidth="6" fill="none" />
            <circle cx="80" cy="110" r="12" fill="#0d6efd" />
            <circle cx="140" cy="110" r="12" fill="#0d6efd" />
            <line x1="92" y1="110" x2="128" y2="110" stroke="#fff" strokeWidth="4" strokeDasharray="8 8"/>
            <text x="110" y="180" textAnchor="middle" fill="#adb5bd" fontSize="20" fontWeight="bold">
              Link Broken!
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
