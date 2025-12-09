import { StyleSheet } from 'react-native';

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
    paddingBottom: 32,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    marginBottom: 16,
  },
  helperText: {
    marginTop: -16,
    marginLeft: -6,
    marginBottom: 8
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  cancelButton: {
    marginTop: -10,
  },
  saveButton: {
    marginTop: 20
  },
  disabledLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: -12,
    marginBottom: 16,
    marginLeft: 4,
    fontStyle: 'italic',
  },
});
