import React, { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import axios from 'axios';

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('view');
  const [links, setLinks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [name, setName] = useState('Loading...');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/images.jpg');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, linksRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/links', {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);

        setName(profileRes.data.username);
        setBio(profileRes.data.bio || '');
        setAvatarUrl(profileRes.data.avatarUrl || '/images.jpg');
        setLinks(linksRes.data);
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

  const handleAddLink = async () => {
    if (!newTitle || !newUrl) return;
  
    try {
      const res = await axios.post(
        'http://localhost:5000/api/links/add',
        { name: newTitle, url: newUrl },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setLinks(res.data.links);  // <-- use updated list from backend
      setNewTitle('');
      setNewUrl('');
      setSelectedTab('view');
    } catch (error) {
      console.error('Error adding link:', error);
    }
  };
  

  const handleDeleteLink = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/links/${id}`, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      setLinks(links.filter((link) => link._id !== id));
    } catch (err) {
      console.error('Failed to delete link:', err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(
        'http://localhost:5000/api/users/profile',
        { name, bio, avatarUrl },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Profile saved successfully!');
      // Refetch profile data or switch to profile view
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
          {['profile', 'editProfile', 'create', 'view'].map((tab) => (
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
                : tab === 'create'
                ? 'Create Link'
                : 'View Links'}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="col-md-9 p-5">
          {selectedTab === 'profile' && (
            <div>
              <h3 className="mb-4">Your Public Profile</h3>
              <ProfileCard name={name} bio={bio} avatarUrl={avatarUrl} links={links} />
            </div>
          )}

          {selectedTab === 'editProfile' && (
            <div>
              <h3 className="mb-4">Edit Profile</h3>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Profile Picture URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </div>
              <button className="btn btn-success" onClick={handleSaveProfile}>
                Save Profile
              </button>
            </div>
          )}

          {selectedTab === 'create' && (
            <div>
              <h3>Create New Link</h3>
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
          )}

          {selectedTab === 'view' && (
            <div>
              <h3>Your Links</h3>
              {links.length === 0 ? (
                <p className="text-muted">No links added yet.</p>
              ) : (
                <ul className="list-group">
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
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        console.log(link._id);
                        handleDeleteLink(link._id);
                      }}
                    >
                      Delete
                    </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
