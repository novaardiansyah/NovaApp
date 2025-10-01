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
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  headerIcon: {
    marginRight: 12,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },

  itemsSection: {
    marginVertical: 16,
    gap: 12,
  },

  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  itemContent: {
    paddingVertical: 16,
  },

  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  itemNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },

  input: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },

  addItemButton: {
    marginTop: 20,
    borderColor: '#6366f1',
    borderRadius: 8,
  },

  addItemButtonText: {
    color: '#6366f1',
    fontWeight: '500',
  },

  totalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 16,
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
    marginTop: 20,
    borderRadius: 8,
  },

  cancelButton: {
    marginTop: -10,
    borderColor: '#e5e7eb',
  },
});