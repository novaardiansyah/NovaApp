import { StyleSheet } from 'react-native'
import { typography } from './common.styles'

export const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: -6,
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
    fontSize: typography.heading.small,
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
    fontSize: typography.heading.medium,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: typography.label.small,
    color: '#6b7280',
    textAlign: 'center',
  },
  goalsList: {
    marginBottom: 24,
    marginTop: 12,
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
    fontSize: typography.label.small,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: typography.body.primary,
    color: '#6b7280',
    marginBottom: 8,
  },
  goalDates: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalDateText: {
    fontSize: typography.label.small,
    color: '#9ca3af',
    marginLeft: 4,
  },
  goalAmount: {
    fontSize: typography.label.large,
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
    fontSize: typography.body.primary,
    fontWeight: '500',
    color: '#1f2937',
  },
  progressPercentage: {
    fontSize: typography.body.primary,
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
    fontSize: typography.label.small,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: typography.label.small,
    fontWeight: '500',
    color: '#6366f1',
  },
  sectionTitle: {
    fontSize: typography.heading.small,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  loadingText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: typography.label.large,
    paddingVertical: 20,
  },
})