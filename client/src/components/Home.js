import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import {
  pdf,
  Document,
  Page,
  Text,
  Image,
  StyleSheet,
  View
} from "@react-pdf/renderer";

// Utility: Extract domain
function extractDomain(url) {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return domain;
  } catch (e) {
    return "";
  }
}

// Utility: Convert image URL to base64
async function imageUrlToBase64(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("Could not load image:", e);
    return "";
  }
}

// PDF styles (boxShadow removed for @react-pdf compatibility)
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#f0f2f5",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #ddd"
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  bio: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  linkSection: {
    width: "100%",
    marginTop: 10,
  },
  subheader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  linkRow: {
    marginBottom: 6,
    paddingHorizontal: 10,
  },
  linkText: {
    fontSize: 12,
    color: "#007BFF",
    textDecoration: "none",
  },
});

// PDF component
const ProfileDocument = ({ user, imageBase64 }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.card}>
        {imageBase64 && <Image style={styles.image} src={imageBase64} />}
        <Text style={styles.name}>{user.name || user.username}</Text>
        {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

        {user.links?.length > 0 && (
          <View style={styles.linkSection}>
            <Text style={styles.subheader}>Links</Text>
            {user.links.map((link, idx) => (
              <View key={idx} style={styles.linkRow}>
                <Text style={styles.linkText}>
                  • {link.name}: {link.url}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  </Document>
);

// Generate PDF blob
async function generateProfileCardPDF(user) {
  let imageBase64 = "";
  try {
    imageBase64 = await imageUrlToBase64(
      `http://localhost:5000/api/users/profile/avatar/${user._id}`
    );
  } catch (e) {
    console.error("Could not load image:", e);
  }

  const blob = await pdf(
    <ProfileDocument user={user} imageBase64={imageBase64} />
  ).toBlob();
  return blob;
}

const Home = () => {
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPublicProfiles = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/public-profiles"
        );
        setPublicProfiles(res.data);
      } catch (err) {
        setError("Failed to load public profiles");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfiles();
  }, []);

  const viewProfile = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const downloadProfileCard = async (user) => {
    try {
      const blob = await generateProfileCardPDF(user);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${user.username}_profile.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading public profiles...</p>
      </div>
    );

  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Public Profiles</h2>
      {publicProfiles.length === 0 ? (
        <div className="alert alert-info">No public profiles found.</div>
      ) : (
        <div className="row">
          {publicProfiles.map((user) => (
            <div key={user._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <div className="text-center mb-3">
                    <img
                      src={`http://localhost:5000/api/users/profile/avatar/${user._id}`}
                      alt={user.name || user.username}
                      className="rounded-circle shadow"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        border: "3px solid #0d6efd",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images.jpg";
                      }}
                    />
                  </div>
                  <h3 className="card-title text-center">
                    {user.name || user.username}
                  </h3>
                  {user.bio && (
                    <p className="card-text text-center">{user.bio}</p>
                  )}
                  {user.links && user.links.length > 0 && (
                    <div className="mt-3">
                      <h6 className="card-subtitle mb-2 text-muted">Links</h6>
                      <ul className="list-group list-group-flush">
                        {user.links.map((link, idx) => {
                          const domain = extractDomain(link.url);
                          const faviconUrl = domain
                            ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
                            : "/react-logo.png";
                          return (
                            <li key={idx} className="list-group-item">
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none d-flex align-items-center"
                              >
                                <img
                                  src={faviconUrl}
                                  alt={link.name}
                                  className="me-2"
                                  style={{ width: "20px", height: "20px" }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/react-logo.png";
                                  }}
                                />
                                <span>{link.name}</span>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  <div className="mt-auto d-flex justify-content-center gap-2 pt-3">
                    <button
                      onClick={() => viewProfile(user)}
                      className="btn btn-primary btn-sm"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => downloadProfileCard(user)}
                      className="btn btn-secondary btn-sm"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={closeModal}
        centered
        dialogClassName="custom-modal"
        contentClassName="h-100"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedUser?.name || selectedUser?.username}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          <div className="text-center mb-4">
            <img
              src={`http://localhost:5000/api/users/profile/avatar/${selectedUser?._id}`}
              alt={selectedUser?.name || selectedUser?.username}
              className="rounded-circle shadow"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                border: "3px solid #0d6efd",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images.jpg";
              }}
            />
          </div>
          {selectedUser?.bio && (
            <p className="text-center">{selectedUser.bio}</p>
          )}
          {selectedUser?.links?.length > 0 && (
            <>
              <h5 className="text-center">Links</h5>
              <ul className="list-group list-group-flush">
                {selectedUser.links.map((link, idx) => {
                  const domain = extractDomain(link.url);
                  const faviconUrl = domain
                    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
                    : "/react-logo.png";
                  return (
                    <li
                      key={idx}
                      className="list-group-item d-flex align-items-center"
                    >
                      <img
                        src={faviconUrl}
                        alt={link.name}
                        className="me-2"
                        style={{ width: "20px", height: "20px" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/react-logo.png";
                        }}
                      />
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                      >
                        {link.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
