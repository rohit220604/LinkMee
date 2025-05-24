import React from 'react';

const About = () => {
  return (
    <div className="container py-5" style={{ maxWidth: '900px' }}>
      <h1 className="mb-4 text-center">About Linkme</h1>
      <p className="text-center text-secondary mb-5 fs-5">
        Linkme is a platform designed to help you unify all your important links into one beautiful, easy-to-share page.
      </p>

      <section className="mb-5">
        <h3 className="mb-3">Our Mission</h3>
        <p className="fs-5">
          Our mission is to empower users to create a personal hub that showcases their online presence effortlessly.
          Whether you’re a content creator, professional, or enthusiast, Linkme simplifies how you share your social profiles, blogs, portfolios, and more.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="mb-3">What We Offer</h3>
        <ul className="fs-5">
          <li>User-friendly link management interface</li>
          <li>Easy customization and personalization</li>
          <li>Secure authentication and password reset functionality</li>
          <li>Responsive design for all devices</li>
          <li>One link to rule them all — share everywhere</li>
        </ul>
      </section>

      <section>
        <h3 className="mb-4">Meet the Team</h3>
        <div className="row align-items-center">
          <div className="col-md-3 text-center mb-3 mb-md-0">
            <img
              src="/images.jpg"
              alt="Rohit Jaliminchi"
              className="rounded-circle"
              style={{
                width: '180px',
                height: '180px',
                objectFit: 'cover',
              }}
            />
          </div>
          <div className="col-md-9">
            <p className="mb-0 fs-5">
              <strong>Linkme</strong> was created by <strong>Rohit Jaliminchi</strong>, a passionate developer dedicated to making online sharing simple and elegant.
              We believe everyone deserves an easy way to connect with their audience and showcase what they care about most.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
