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

  // Search Button
  searchButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  // Search Modal
  searchModalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  searchModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  clearButton: {
    marginLeft: 8,
  },

  closeButton: {
    padding: 4,
  },

  searchResultsContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingVertical: 8,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },

  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  searchResultContent: {
    flex: 1,
  },

  searchResultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 6,
  },

  searchResultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  searchResultCode: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  searchResultPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },

  searchResultType: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },

  searchResultTypeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4338ca',
    textTransform: 'uppercase',
  },

  searchResultTypeNoSku: {
    backgroundColor: '#fef3c7',
    borderColor: '#fcd34d',
  },

  searchResultTypeTextNoSku: {
    color: '#92400e',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },

  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Search Button Container
  searchButtonContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  searchActionButton: {
    borderRadius: 8,
  },

  // Searched Item Indicator
  itemHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  searchedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ede9fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },

  searchedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6d28d9',
    textTransform: 'uppercase',
  },

  
  searchResultItemDisabled: {
    opacity: 0.6,
    backgroundColor: '#f9fafb',
  },

  addedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
    position: 'absolute',
    top: 8,
    right: 8,
  },

  addedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#065f46',
    textTransform: 'uppercase',
  },
});