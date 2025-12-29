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
    marginBottom: 24,
    lineHeight: 22,
  },
  cancelButton: {
    marginTop: -10,
  },
  addButton: {
    marginTop: 20
  },
});
