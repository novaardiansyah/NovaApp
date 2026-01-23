import { StyleSheet } from 'react-native';
import { typography } from './common.styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  description: {
    fontSize: typography.label.large,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 22,
  },
  input: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
    fontSize: typography.label.large,
  },
  helperText: {
    marginTop: -16,
    marginLeft: -6,
    marginBottom: 8
  },
  addButton: {
    marginTop: 20
  },
  cancelButton: {
    marginTop: -10,
  },
  goalInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  goalName: {
    fontSize: typography.heading.small,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: typography.label.small,
    color: '#6b7280',
    lineHeight: 20,
  },
  goalProgress: {
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: typography.label.small,
    color: '#6b7280',
  },
  progressValue: {
    fontSize: typography.label.small,
    fontWeight: '500',
    color: '#1f2937',
  },
  progressBar: {
    marginTop: 8,
  },
  progressBarBackground: {
    backgroundColor: '#e5e7eb',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    backgroundColor: '#3b82f6',
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: typography.body.secondary,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 4,
  },
});