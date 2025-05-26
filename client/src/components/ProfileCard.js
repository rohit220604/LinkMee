import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfileCard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p className="text-center mt-5">Loading profile...</p>;
  }

  if (!profile || !profile.username) {
    return <p className="text-center mt-5">Nothing to view.</p>;
  }

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
            src={'/default-avatar.png'}
            alt={profile.username}
            className="rounded-circle mb-4 shadow"
            style={{
              width: '140px',
              height: '140px',
              objectFit: 'cover',
              border: '4px solid #0d6efd',
            }}
          />
          <h3 className="card-title mb-2 fw-semibold">{profile.username}</h3>
          <p className="text-muted mb-4 fs-5">{profile.email}</p>

          <hr className="my-4" />

          {profile.links && profile.links.length > 0 ? (
            <div className="d-grid gap-3">
              {profile.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  className="btn btn-outline-primary py-2 fs-5 fw-medium shadow-sm link-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.title}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-muted">No links added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
