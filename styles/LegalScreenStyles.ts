import { StyleSheet } from 'react-native';

export const legalScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 8,
  },
  content: {
    padding: 10,
    paddingTop: 0,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 32,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 12,
  },
  firstSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 0,
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    marginBottom: 16,
    textAlign: 'justify',
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    marginLeft: 16,
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 14,
    color: '#6366f1',
    marginBottom: 8,
  },
  footer: {
    marginTop: 32,
    padding: 20,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  footerText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'justify',
    fontStyle: 'italic',
  },
});

export default legalScreenStyles;