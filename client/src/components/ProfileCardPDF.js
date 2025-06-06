import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Link,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#f8f9fa',
    padding: 0,
    fontFamily: 'Helvetica',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 40,
    width: 420,
    minHeight: 620,
    alignItems: 'center',
    margin: '36pt auto',
    boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
  },
  avatarBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#0d6efd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    display: 'flex',
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    objectFit: 'cover',
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 2,
    textAlign: 'center',
    textTransform: 'lowercase',
  },
  username: {
    fontSize: 14,
    color: '#0d6efd',
    marginBottom: 10,
    textAlign: 'center',
  },
  bio: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6c757d',
    marginBottom: 10,
    textAlign: 'center',
    maxWidth: 320,
    alignSelf: 'center',
  },
  email: {
    fontSize: 13,
    color: '#adb5bd',
    marginBottom: 18,
    textAlign: 'center',
  },
  hr: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginVertical: 18,
  },
  linksSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1e5fd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 0,
    marginBottom: 14,
    width: 340,
    backgroundColor: '#f9fbfe',
    justifyContent: 'center',
  },
  favicon: {
    width: 22,
    height: 22,
    marginRight: 10,
    marginLeft: 10,
  },
  linkText: {
    fontSize: 16,
    color: '#0d6efd',
    fontWeight: 500,
    textAlign: 'center',
  },
  noLinksText: {
    color: '#adb5bd',
    textAlign: 'center',
    marginTop: 12,
  },
});

const getFaviconUrl = (url) => {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch (err) {
    return '/logo192.png';
  }
};

const ProfileCardPDF = ({ name, username, bio, email, avatarUrl, links }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.card}>

        <View style={styles.avatarBorder}>
          {avatarUrl && (
            <Image style={styles.avatar} src={avatarUrl} />
          )}
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.username}>@{username}</Text>
        {bio && <Text style={styles.bio}>{bio}</Text>}
        {email && <Text style={styles.email}>{email}</Text>}
        <View style={styles.hr} />
        <View style={styles.linksSection}>
          {links && links.length > 0 ? (
            links.map((link, index) => (
              <View key={index} style={styles.linkBox}>
                <Image style={styles.favicon} src='logo192.png' />
                <Link style={styles.linkText} src={link.url}>
                  {link.name}
                </Link>
              </View>
            ))
          ) : (
            <Text style={styles.noLinksText}>No links added yet.</Text>
          )}
        </View>
      </View>
    </Page>
  </Document>
);

export default ProfileCardPDF;
