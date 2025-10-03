import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },

  transactionsSection: {
    flex: 1,
  },

  transactionsList: {
    gap: 0,
  },

  transactionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  transactionInfo: {
    flex: 1,
    maxWidth: '60%',
  },

  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
    flexShrink: 1,
  },

  transactionDate: {
    fontSize: 12,
    color: '#6b7280',
  },

  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },

  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginVertical: 16,
  },

  emptyCardContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },

  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 16,
  },

  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },

  loadingMoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },

  loadingMoreText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },

  endOfList: {
    alignItems: 'center',
    paddingTop: 24,
  },

  endOfListText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },

  loadMoreButton: {
    backgroundColor: 'transparent',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6366f1',
  },

  transactionCardTouchable: {
    borderRadius: 12,
    overflow: 'hidden',
  },

  transactionCardPressed: {
    backgroundColor: 'transparent',
    opacity: 0.7,
  },

  transactionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  transactionsCardContent: {
    paddingVertical: 8,
  },

  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },

  transactionAmountContainer: {
    alignItems: 'flex-end',
  },

  transactionItemsIcon: {
    marginTop: 2,
  },

  transactionDivider: {
    marginVertical: 0,
  },

  transactionCardWithItems: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  addPaymentButton: {
    marginBottom: 16,
  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
    borderRadius: 30,
  },
});