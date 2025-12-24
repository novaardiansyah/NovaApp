import { StyleSheet } from 'react-native';
import { typography } from './common.styles';

export const paymentItemsStyles = StyleSheet.create({
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  headerIcon: {
    marginRight: 12,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },

  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },

  // Summary Card Styles
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 16,
  },

  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },

  summaryLeft: {
    flex: 1,
  },

  summaryRight: {
    alignItems: 'flex-end',
  },

  summaryTitle: {
    fontSize: typography.label.large,
    fontWeight: '600',
    color: '#374151',
  },

  summarySubtitle: {
    fontSize: typography.body.secondary,
    color: '#6b7280',
    marginTop: 2,
  },

  summaryTotalLabel: {
    fontSize: typography.label.small,
    color: '#6b7280',
  },

  summaryTotalAmount: {
    fontSize: typography.heading.medium,
    fontWeight: '700',
    color: '#6366f1',
  },

  summaryCode: {
    fontSize: typography.label.small,
    color: '#9ca3af',
    fontWeight: '500',
    marginTop: 2,
  },

  // Items Section Styles
  itemsSection: {
    gap: 12,
  },

  // Empty State Styles
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  emptyCardContent: {
    alignItems: 'center',
    paddingVertical: 32,
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

  emptyButton: {
    marginTop: 16,
    borderRadius: 8,
  },

  // Items Card Styles
  itemsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  itemsCardContent: {
    paddingVertical: 8,
  },

  // Item Container Styles
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 0,
  },

  itemLeft: {
    flex: 1,
    marginRight: 12,
  },

  itemName: {
    fontSize: typography.body.primary,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },

  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  itemQuantity: {
    fontSize: typography.body.secondary,
    color: '#6b7280',
  },

  itemRight: {
    alignItems: 'flex-end',
  },

  itemTotal: {
    fontSize: typography.body.primary,
    fontWeight: '600',
    color: '#6366f1',
  },

  itemPrice: {
    fontSize: typography.body.secondary,
    color: '#6b7280',
    marginTop: 2,
  },

  // Item Type Styles
  itemType: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },

  itemTypeText: {
    fontSize: typography.body.tertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  itemTypeProduct: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },

  itemTypeTextProduct: {
    color: '#166534',
  },

  itemTypeService: {
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
  },

  itemTypeTextService: {
    color: '#1e40af',
  },

  itemDivider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 0,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  modalOverlay: {
    flex: 1,
  },

  actionSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },

  actionSheetTitle: {
    textAlign: 'center',
    padding: 16,
    color: '#6b7280',
    fontSize: typography.body.primary,
  },

  actionSheetContent: {
    paddingHorizontal: 20,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    marginBottom: 8,
  },

  actionIcon: {
    marginRight: 16,
  },

  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },

  // FAB Styles
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
    borderRadius: 30,
  },

  // Loading Styles
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },

  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },

  loadingMoreContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },

  // End of List Styles
  endOfList: {
    alignItems: 'center',
    paddingTop: 16,
  },

  endOfListText: {
    fontSize: typography.body.primary,
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
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
});

export default paymentItemsStyles;