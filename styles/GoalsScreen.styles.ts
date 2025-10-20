import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
    borderRadius: 30,
  },
  goalsOverview: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 24,
  },
  overviewContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  goalsList: {
    marginBottom: 24,
  },
  goalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 12,
  },
  goalContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  goalInfo: {
    flex: 1,
    marginRight: 12,
    minWidth: 0,
    flexShrink: 1,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  goalDates: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalDateText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  goalAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366f1',
    textAlign: 'right',
    maxWidth: 100,
  },
  goalProgressContainer: {
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  goalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusActive: {
    backgroundColor: '#10b981',
  },
  statusCompleted: {
    backgroundColor: '#6366f1',
  },
  statusOverdue: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6366f1',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
})