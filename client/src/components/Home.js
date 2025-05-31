import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicProfiles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/public-profiles');
        setPublicProfiles(res.data);
      } catch (err) {
        setError('Failed to load public profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfiles();
  }, []);

  if (loading) return <p>Loading public profiles...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Public Profiles</h2>
      {publicProfiles.length === 0 ? (
        <p>No public profiles found.</p>
      ) : (
        publicProfiles.map((user) => (
          <div key={user._id} style={{ borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
            <h3>{user.name || user.username}</h3>
            <p>{user.bio}</p>
            <ul>
              {user.links && user.links.map(link => (
                <li key={link._id}>
                  <a href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
