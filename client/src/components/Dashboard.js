import React, { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import axios from 'axios';
import EditProfile from './EditProfile';

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('view');
  const [links, setLinks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [username, setUsername] = useState('Loading...');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, linksRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/links', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const profile = profileRes.data;
        setUsername(profile.username || '');
        setName(profile.name || '');
        setBio(profile.bio || '');
        setLinks(linksRes.data || []);

        setAvatarUrl(`http://localhost:5000/api/users/profile/avatar?${Date.now()}`);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    };

    if (token) fetchData();
  }, [token]);

  useEffect(() => {
    return () => {
      if (avatarFile && avatarFile.preview) {
        URL.revokeObjectURL(avatarFile.preview);
      }
    };
  }, [avatarFile]);

  const handleAddLink = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;

    try {
      const res = await axios.post(
        'http://localhost:5000/api/links/add',
        { name: newTitle, url: newUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLinks(res.data.links);
      setNewTitle('');
      setNewUrl('');
    } catch (error) {
      console.error('Error adding link:', error);
      alert('Failed to add link.');
    }
  };

  const handleDeleteLink = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/links/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLinks(links.filter((link) => link._id !== id));
    } catch (err) {
      console.error('Failed to delete link:', err);
      alert('Failed to delete link.');
    }
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(
        'http://localhost:5000/api/users/profile',
        { name, bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        await axios.post('http://localhost:5000/api/users/profile/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        setAvatarUrl(`http://localhost:5000/api/users/profile/avatar?${Date.now()}`);
        setAvatarFile(null);
      }

      alert('Profile saved successfully!');
      setSelectedTab('profile');
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Failed to save profile');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Sidebar */}
        <div className="col-md-3 bg-light p-4 border-end">
          <h4 className="mb-4">Dashboard</h4>
          {['profile', 'editProfile', 'view'].map((tab) => (
            <button
              key={tab}
              className={`btn w-100 mb-3 ${
                selectedTab === tab ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab === 'profile'
                ? 'View Profile'
                : tab === 'editProfile'
                ? 'Edit Profile'
                : 'View Links'}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="col-md-9 p-5">
          {selectedTab === 'profile' && (
            <div>
              <h3 className="mb-4">Your Public Profile</h3>
              <ProfileCard
                name={name || username}
                bio={bio}
                avatarUrl={avatarUrl}
                links={links}
                username={username}
              />
            </div>
          )}

          {selectedTab === 'editProfile' && (
            <div>
              <h3 className="mb-4">Edit Profile</h3>
              <EditProfile
                name={name}
                setName={setName}
                bio={bio}
                setBio={setBio}
                avatarUrl={avatarUrl}
                setAvatarUrl={setAvatarUrl}
                avatarFile={avatarFile}
                setAvatarFile={setAvatarFile}
                handleSaveProfile={handleSaveProfile}
                setSelectedTab={setSelectedTab}
              />
            </div>
          )}

          {selectedTab === 'view' && (
            <div>
              <h3>Your Links</h3>
              {links.length === 0 ? (
                <p className="text-muted">No links added yet.</p>
              ) : (
                <ul className="list-group mb-4">
                  {links.map((link) => (
                    <li
                      key={link._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{link.name}</strong> -{' '}
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.url}
                        </a>
                      </div>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteLink(link._id)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Create Link Form Below Links */}
              <div>
                <h4>Create New Link</h4>
                <div className="mb-3">
                  <label className="form-label">Link Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., My Portfolio"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Link URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <button className="btn btn-success" onClick={handleAddLink}>
                  Add Link
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
