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
    padding: 24,
    paddingBottom: 50,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ffffff',
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
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 4,
  },
});