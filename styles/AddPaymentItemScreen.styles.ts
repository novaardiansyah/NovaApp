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
    marginTop: 8,
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
    paddingVertical: 12,
  },

  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  itemNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },

  input: {
    backgroundColor: '#ffffff',
    marginBottom: 12,
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
    padding: 12,
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 4,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },

  searchResultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  searchResultCode: {
    fontSize: 11,
    color: '#6b7280',
    fontStyle: 'italic',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  searchResultPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },

  searchResultType: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },

  searchResultTypeText: {
    fontSize: 10,
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

  // Search Results Header
  searchResultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  searchResultsText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
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
    fontSize: 9,
    fontWeight: '600',
    color: '#6d28d9',
    textTransform: 'uppercase',
  },

  
  searchResultItemDisabled: {
    opacity: 0.8,
    backgroundColor: '#f3f4f6',
  },

  addedIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
});