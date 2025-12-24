import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    paddingBottom: 32,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  transactionInfo: {
    flex: 1,
    maxWidth: '60%',
  },

  transactionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
    flexShrink: 1,
  },

  transactionDate: {
    fontSize: 11,
    color: '#6b7280',
  },

  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  transactionAmount: {
    fontSize: 13,
    fontWeight: '600',
  },


  emptySubtext: {
    fontSize: 13,
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
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },

  endOfList: {
    alignItems: 'center',
    paddingTop: 24,
  },

  endOfListText: {
    fontSize: 13,
    color: '#9ca3af',
    fontStyle: 'italic',
  },

  loadMoreButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 50,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
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
    paddingVertical: 10,
  },

  transactionAmountContainer: {
    alignItems: 'flex-end',
  },

  transactionIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },

  transactionItemsIcon: {

  },

  transactionScheduledIcon: {

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