import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image,
  Link,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    marginBottom: 8,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  favicon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  domainText: {
    color: 'blue',
    textDecoration: 'underline',
  },
});

const getFaviconUrl = (url) => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
  } catch (err) {
    return null;
  }
};

const getDomainName = (url) => {
  try {
    const domain = new URL(url).hostname;
    return domain.charAt(0).toUpperCase() + domain.slice(1).split('.')[0];
  } catch (err) {
    return url;
  }
};

const ProfileCardPDF = ({ name, bio, avatarUrl, socialLinks }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        {avatarUrl && (
          <Image
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              marginBottom: 10,
            }}
            src={avatarUrl}
          />
        )}
        <Text style={styles.heading}>{name}</Text>
        <Text>{bio}</Text>
      </View>

      <View style={styles.section}>
        <Text style={{ fontSize: 14, marginBottom: 8 }}>Social Links</Text>
        {socialLinks.map((link, index) => (
          <View key={index} style={styles.linkRow}>
            <Image style={styles.favicon} src={getFaviconUrl(link)} />
            <Link style={styles.domainText} src={link}>
              {getDomainName(link)}
            </Link>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ProfileCardPDF;
