import React, { useState } from 'react';
import ProfileCard from './ProfileCard';

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('view');
  const [links, setLinks] = useState([
    { id: 1, title: 'GitHub', url: 'https://github.com/yourprofile' },
    { id: 2, title: 'LinkedIn', url: 'https://linkedin.com/in/yourprofile' },
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleAddLink = () => {
    if (newTitle && newUrl) {
      const newLink = {
        id: Date.now(),
        title: newTitle,
        url: newUrl
      };
      setLinks([...links, newLink]);
      setNewTitle('');
      setNewUrl('');
      setSelectedTab('view');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Sidebar */}
        <div className="col-md-3 bg-light p-4 border-end">
          <h4 className="mb-4">Dashboard</h4>
          <button
            className={`btn w-100 mb-3 ${selectedTab === 'profile' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedTab('profile')}
          >
            View Profile
          </button>
          <button
            className={`btn w-100 mb-3 ${selectedTab === 'create' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedTab('create')}
          >
            Create Link
          </button>
          <button
            className={`btn w-100 ${selectedTab === 'view' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedTab('view')}
          >
            View Links
          </button>
        </div>

        {/* Main Content */}
        <div className="col-md-9 p-5">
          {selectedTab === 'profile' && (
            <div>
              <h3 className="mb-4">Your Public Profile</h3>
              <ProfileCard
                name="Rohit Jaliminchi"
                bio="Developer | Creator of LinkMe"
                avatarUrl="/images.jpg"
                links={links}
              />
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
                    <li key={link.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{link.title}</strong> -{' '}
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.url}
                        </a>
                      </div>
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
