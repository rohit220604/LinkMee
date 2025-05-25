import React from 'react';

const ProfileCard = ({ name, bio, avatarUrl, links }) => {
  return (
    <div className="container d-flex justify-content-center py-5">
      <div
        className="card shadow-lg border-0 p-4"
        style={{
          maxWidth: '600px',
          width: '100%',
          borderRadius: '20px',
          background: '#ffffff',
        }}
      >
        <div className="card-body text-center">
          <img
            src={avatarUrl || '/default-avatar.png'}
            alt={name}
            className="rounded-circle mb-4 shadow"
            style={{
              width: '140px',
              height: '140px',
              objectFit: 'cover',
              border: '4px solid #0d6efd',
            }}
          />
          <h3 className="card-title mb-2 fw-semibold">{name}</h3>
          <p className="text-muted mb-4 fs-5">{bio}</p>

          <hr className="my-4" />

          <div className="d-grid gap-3">
            {links?.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="btn btn-outline-primary py-2 fs-5 fw-medium shadow-sm link-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
