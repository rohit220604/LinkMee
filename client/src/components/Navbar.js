import { Link } from 'react-router-dom';

export const Navbar = () => {
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
          </ul>
          <button className="btn btn-outline-success btn-lg" type="submit">Login</button>
        </div>
      </div>
    </nav>
  );
};
