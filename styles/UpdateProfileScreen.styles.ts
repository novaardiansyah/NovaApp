import { StyleSheet } from 'react-native';
import { typography } from './common.styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  description: {
    fontSize: typography.label.large,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 22,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarIcon: {
    backgroundColor: '#6366f1',
  },
  avatarChangeText: {
    fontSize: 14,
    color: '#6366f1',
    marginTop: 8,
    fontWeight: '500',
  },
  avatarSizeText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  avatarLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 40,
  },
  loadingIcon: {
    backgroundColor: 'transparent',
  },
  cancelButton: {
    marginTop: -10,
  },
  addButton: {
    marginTop: 20
  },
});
