import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    padding: 16,
  },
  attachmentsSection: {
    flex: 1,
    marginTop: 16,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyCardContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
  },
  attachmentsCount: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
    fontWeight: '500',
  },
  attachmentsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  attachmentsCardContent: {
    paddingVertical: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  attachmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  attachmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 16,
    overflow: 'hidden',
  },
  attachmentThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  attachmentInfo: {
    flex: 1,
    maxWidth: '60%',
  },
  attachmentName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
    flexShrink: 1,
  },
  attachmentDetails: {
    fontSize: 11,
    color: '#6b7280',
  },
  attachmentRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentDivider: {
    marginVertical: 0,
  },
  attachmentCardPressed: {
    backgroundColor: 'transparent',
    opacity: 0.7,
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
