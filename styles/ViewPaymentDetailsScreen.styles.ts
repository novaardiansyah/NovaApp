import { StyleSheet } from 'react-native';
import { typography } from './common.styles';

export const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: typography.body.primary,
    color: '#6b7280',
  },
  nameCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  nameCardTitle: {
    fontSize: typography.body.primary,
    fontWeight: '600',
    color: '#111827',
  },
  nameCardText: {
    fontSize: typography.body.primary,
    fontWeight: '500',
    color: '#374151',
    lineHeight: 18,
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: typography.body.primary,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  infoCardTitle: {
    fontSize: typography.body.primary,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 0,
  },
  cardDivider: {
    marginVertical: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoLabel: {
    fontSize: typography.body.primary,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: typography.body.primary,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: typography.body.primary,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: typography.body.secondary,
    color: '#6b7280',
  },
  actionCardContent: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  bottomSpacing: {
    height: 16,
  },
  actionCardWithItems: {
    marginBottom: 8,
  },
  lastActionCard: {
    marginBottom: 8,
  },
  actionCardPressed: {
    backgroundColor: 'transparent',
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: -6,
    backgroundColor: '#6366f1',
    borderRadius: 30,
  },
  fabSkeleton: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: -6,
    width: 56,
    height: 56,
    backgroundColor: '#6366f1',
    borderRadius: 28,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalTitle: {
    textAlign: 'center',
    padding: 16,
    color: '#6b7280',
    fontSize: typography.modal.title,
  },
  modalActionsContainer: {
    paddingHorizontal: 20,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    marginBottom: 8,
  },
  modalActionIcon: {
    marginRight: 16,
  },
  modalActionText: {
    fontSize: typography.label.large,
    fontWeight: '500',
    color: '#111827',
  },
  modalCancelButton: {
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6366f1',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: typography.label.large,
    fontWeight: '600',
    color: '#6366f1',
  },
});

