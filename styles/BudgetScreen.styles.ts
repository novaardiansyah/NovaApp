import { StyleSheet } from 'react-native';
import { typography } from './common.styles';

export const styles = StyleSheet.create({
  scheduledExpenseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#6366f1',
    width: '100%',
  },
  afterScheduledLabel: {
    fontSize: typography.label.large,
    color: '#e0e7ff',
  },
  totalAfterScheduledText: {
    fontSize: typography.heading.medium,
    fontWeight: '600',
    color: '#ffffff',
  },
  accountsSection: {
    marginBottom: 24,
  },
  accountsList: {
    gap: 12,
  },
  accountsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  accountsCardContent: {
    paddingVertical: 2,
  },
  accountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  accountLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountLogo: {
    marginRight: 16,
    backgroundColor: '#ffffff',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: typography.body.primary,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: typography.body.primary,
    fontWeight: '500',
  },
  accountDivider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 0,
  },
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
    fontSize: typography.body.primary,
    fontWeight: '500',
    color: '#111827',
  },
  cancelButton: {
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6366f1',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: typography.body.primary,
    fontWeight: '600',
    color: '#6366f1',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
  },
});
