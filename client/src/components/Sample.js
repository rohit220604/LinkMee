import React from 'react';
import ProfileCard from './ProfileCard';

const PublicProfile = () => {
  const sampleUser = {
    name: 'Rohit Jaliminchi',
    bio: 'Passionate Developer | Building LinkMe 🔗',
    avatarUrl: '/images.jpg',
    links: [
      { title: 'GitHub', url: 'https://github.com/rohitjaliminchi' },
      { title: 'LinkedIn', url: 'https://linkedin.com/in/rohitjaliminchi' },
      { title: 'Portfolio', url: 'https://rohit.dev' },
    ],
  };

  return <ProfileCard {...sampleUser} />;
};

export default PublicProfile;
