import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfile = () => {
  const [avatarUrl, setAvatarUrl] = useState('/images');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const profileRes = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setName(profileRes.data.name || '');
        setBio(profileRes.data.bio || '');
        setIsPublic(profileRes.data.isPublic ?? true);
        setAvatarUrl(
          profileRes.data.avatarUrl 
            ? `http://localhost:5000${profileRes.data.avatarUrl}` 
            : '/images.jpg'
        );
        
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [token, previewUrl]);

  const handleFileChange = (e) => {
    setMessage(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      await axios.post('http://localhost:5000/api/users/profile/avatar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setAvatarUrl(previewUrl);
      setSelectedFile(null);
      setPreviewUrl(null);
      setMessage('Profile photo uploaded successfully.');
    } catch (err) {
      console.error('Upload failed:', err);
      setMessage('Failed to upload profile photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm('Are you sure you want to delete your profile photo?')) return;

    setDeleting(true);
    setMessage(null);
    try {
      await axios.delete('http://localhost:5000/api/users/profile/avatar', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAvatarUrl('/images.jpg');
      setSelectedFile(null);
      setPreviewUrl(null);
      setMessage('Profile photo deleted successfully.');
    } catch (err) {
      console.error('Failed to delete avatar:', err);
      setMessage('Failed to delete profile photo. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // Upload avatar if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('avatar', selectedFile);
        await axios.post('http://localhost:5000/api/users/profile/avatar', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setAvatarUrl(previewUrl);
        setSelectedFile(null);
        setPreviewUrl(null);
      }

      // Update profile details
      await axios.put(
        'http://localhost:5000/api/users/profile',
        { name, bio, isPublic },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage('Profile info saved successfully.');
    } catch (err) {
      console.error('Failed to save profile:', err);
      setMessage('Failed to save profile info. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="text-center">
      <h3>Edit Profile</h3>

      <img
        src={previewUrl || avatarUrl}
        alt="Profile"
        className="rounded-circle mb-3 shadow"
        style={{ width: '140px', height: '140px', objectFit: 'cover', border: '4px solid #0d6efd' }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/images.jpg';
        }}
      />

      <input type="file" accept="image/*" onChange={handleFileChange} className="form-control mb-3" />

      {avatarUrl !== '/images.jpg' && !selectedFile && (
        <button onClick={handleDeleteAvatar} className="btn btn-danger mb-3" disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete Profile Photo'}
        </button>
      )}

      <div className="mb-3 text-start">
        <label className="form-label">Name</label>
        <input
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          maxLength={50}
        />
      </div>

      <div className="mb-3 text-start">
        <label className="form-label">Bio</label>
        <textarea
          className="form-control"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write a short bio"
          maxLength={160}
        />
      </div>

      <div className="form-check form-switch text-start mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={() => setIsPublic(!isPublic)}
        />
        <label className="form-check-label" htmlFor="isPublic">
          Make profile public
        </label>
      </div>

      <button className="btn btn-success" onClick={handleSaveProfile} disabled={saving}>
        {saving ? 'Saving...' : 'Save Profile'}
      </button>

      {message && (
        <p className={`mt-3 ${message.includes('Failed') ? 'text-danger' : 'text-success'}`}>{message}</p>
      )}
    </div>
  );
};

export default EditProfile;
