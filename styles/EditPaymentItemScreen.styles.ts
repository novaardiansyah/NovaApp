import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  keyboardAvoidingView: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 16,
  },

  description: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 24,
  },

  itemInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 8,
  },

  itemInfoContent: {
    padding: 16,
  },

  itemInfoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },

  itemInfoCode: {
    fontSize: 14,
    color: '#6b7280',
  },

  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 8,
  },

  formContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },

  inputContainer: {
    marginBottom: 16,
  },

  input: {
    backgroundColor: '#ffffff',
  },

  helperText: {
    marginTop: -1,
    paddingLeft: 4,
    marginBottom: -12,
  },

  totalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 8,
  },

  totalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },

  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366f1',
  },

  saveButton: {
    marginTop: 12,
    borderRadius: 8,
  },

  cancelButton: {
    marginTop: -10,
  },
});