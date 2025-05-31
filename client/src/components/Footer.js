import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <div className="container">
        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <h5>Linkme</h5>
            <p>Your personal hub to share all your links in one beautiful page.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <a
              href="https://github.com/rohit220604"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light me-3 fs-4"
              aria-label="GitHub"
            >
              <i className="bi bi-github"></i>
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light me-3 fs-4"
              aria-label="Twitter"
            >
              <i className="bi bi-twitter"></i>
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light fs-4"
              aria-label="LinkedIn"
            >
              <i className="bi bi-linkedin"></i>
            </a>
            <p className="mt-3 mb-0">&copy; 2025 Linkme. All rights reserved.</p>
          </div>
        </div>
        <div className="text-center">
          <small>
            Made with <span style={{color: 'red'}}>❤️</span> by Rohit Jaliminchi
          </small>
        </div>
      </div>
    </footer>
  );
};
