import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfileCard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('/images.jpg');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        setError('Failed to fetch profile. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchAvatar = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile/avatar', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        });
        const imageUrl = URL.createObjectURL(response.data);
        setAvatarUrl(imageUrl);
      } catch (err) {
        console.error('Error fetching avatar:', err);
        setAvatarUrl('/images.jpg');
      }
    };

    if (profile) {
      fetchAvatar();
    }
  }, [profile]);

  if (loading) return <p className="text-center mt-5">Loading profile...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

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
            src={avatarUrl}
            alt={profile.username}
            className="rounded-circle mb-4 shadow"
            style={{
              width: '140px',
              height: '140px',
              objectFit: 'cover',
              border: '4px solid #0d6efd',
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images.jpg';
            }}
          />

          {/* Name and username */}
          <h2 className="fw-bold mb-1">{profile.name || profile.username}</h2>
          <h5 className="text-primary mb-3">@{profile.username}</h5>

          {/* Bio */}
          {profile.bio && (
            <p
              className="text-secondary mb-4 fs-5"
              style={{ fontStyle: 'italic', maxWidth: '450px', margin: 'auto' }}
            >
              {profile.bio}
            </p>
          )}

          {/* Email */}
          <p className="text-muted mb-4 fs-5">{profile.email}</p>

          <hr className="my-4" />

          {/* Links */}
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
                  {link.name}
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
