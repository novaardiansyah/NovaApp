import { StyleSheet } from 'react-native'
import { typography } from './common.styles';

export const styles = StyleSheet.create({
  input: {
    backgroundColor: '#ffffff',
    marginBottom: 16
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  periodCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  periodContent: {
    paddingVertical: 8,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  periodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodText: {
    fontSize: typography.body.primary,
    fontWeight: '500',
    color: '#1f2937',
    marginLeft: 8,
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryContent: {
    paddingVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: typography.heading.small,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: typography.body.primary,
    color: '#6366f1',
    fontWeight: '500',
  },
  dailySection: {
    marginBottom: 24,
  },
  dailyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dailyContent: {
    paddingVertical: 8,
  },
  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  dailyLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyRight: {
    alignItems: 'flex-end',
  },
  dailyIconContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dailyLabel: {
    fontSize: typography.body.primary,
    fontWeight: '500',
    color: '#1f2937',
  },
  dailyAmount: {
    fontSize: typography.body.primary,
    fontWeight: '500',
  },
  dailyBalance: {
    fontSize: typography.body.primary,
    fontWeight: '600',
  },
  dailyDivider: {
    marginVertical: 0,
  },
  weeklySection: {
    marginBottom: 24,
  },
  weeklyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weeklyContent: {
    paddingVertical: 8,
  },
  weeklyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  weeklyLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  weeklyRight: {
    alignItems: 'flex-end',
  },
  weeklyIconContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  weeklyLabel: {
    fontSize: typography.body.primary,
    fontWeight: '500',
    color: '#1f2937',
  },
  weeklyAmount: {
    fontSize: typography.body.primary,
    fontWeight: '500',
  },
  weeklyBalance: {
    fontSize: typography.body.primary,
    fontWeight: '600',
  },
  weeklyDivider: {
    marginVertical: 0,
  },
  financialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  financialLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  financialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  financialInfo: {
    flex: 1,
  },
  financialName: {
    fontSize: typography.body.primary,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  financialAmount: {
    fontSize: typography.body.secondary,
    color: '#6b7280',
  },
  financialRight: {
    alignItems: 'flex-end',
  },
  financialPercentage: {
    fontSize: typography.body.primary,
    fontWeight: '600',
    color: '#1f2937',
  },
  financialDivider: {
    marginVertical: 0,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
    borderRadius: 30,
  },
  helperText: {
    marginTop: -16,
    marginLeft: -6,
    marginBottom: 6
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
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
    fontSize: typography.body.secondary,
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
  modalActionButtonSelected: {
    backgroundColor: '#f0f9ff',
  },
  modalActionIcon: {
    marginRight: 16,
  },
  modalActionText: {
    fontSize: typography.body.primary,
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
    fontSize: typography.body.primary,
    fontWeight: '600',
    color: '#6366f1',
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  chartCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterLabel: {
    fontSize: typography.body.secondary,
    color: '#6b7280',
  },
  chartCenterValue: {
    fontSize: typography.body.primary,
    fontWeight: '600',
    color: '#1f2937',
  },
  chartLegend: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendLabel: {
    fontSize: typography.body.primary,
    fontWeight: '500',
    color: '#1f2937',
  },
  legendValue: {
    fontSize: typography.body.secondary,
    color: '#6b7280',
    marginTop: 2,
  },
  legendPercentage: {
    fontSize: typography.body.primary,
    fontWeight: '600',
    color: '#1f2937',
  },
})