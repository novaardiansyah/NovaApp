import { StyleSheet } from 'react-native'

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
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  helperText: {
    marginTop: -16,
    marginLeft: -6,
    marginBottom: 6
  },
  createButton: {
    marginTop: 8,
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 18,
  },
})