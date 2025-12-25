import { StyleSheet } from 'react-native';
import { typography } from './common.styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  profileSection: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 10,
    marginTop: 26
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#6366f1',
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  userName: {
    fontSize: typography.heading.large,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: typography.label.large,
    color: '#6b7280',
    marginBottom: 2,
  },
  userId: {
    fontSize: typography.body.primary,
    color: '#9ca3af',
    fontWeight: '500',
  },
  settingsSection: {
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  logoutSection: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 4,
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 4,
  },
  logoutButtonLabel: {
    color: '#ffffff',
    fontSize: typography.label.large,
  },
  listItemTitle: {
    fontSize: typography.body.primary,
  },
  listItemDescription: {
    fontSize: typography.body.secondary,
  },
  listSubheader: {
    fontSize: typography.body.primary,
  },
});
