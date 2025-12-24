import { StyleSheet } from 'react-native';
import { typography } from './common.styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: typography.heading.medium,
    fontWeight: '600',
    color: '#111827',
  },
  resetButton: {
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  resetText: {
    fontSize: typography.body.primary,
    fontWeight: '500',
    color: '#6366f1',
  },
  resetTextDisabled: {
    color: '#d1d5db',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
  },
  input: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
    fontSize: typography.label.large,
  },
  section: {
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: typography.label.large,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  dateContainer: {
    gap: 12,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  inputLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputContent: {
    flex: 1,
  },
  inputLabel: {
    fontSize: typography.label.small,
    color: '#6b7280',
    marginBottom: 4,
  },
  inputValue: {
    fontSize: typography.label.large,
    fontWeight: '500',
    color: '#111827',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dateContent: {
    flex: 1,
    marginLeft: 12,
  },
  dateLabel: {
    fontSize: typography.label.small,
    color: '#6b7280',
    marginBottom: 4,
  },
  dateText: {
    fontSize: typography.label.large,
    fontWeight: '500',
    color: '#111827',
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: '45%',
  },
  optionButtonSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  optionText: {
    marginLeft: 8,
    fontSize: typography.body.primary,
    fontWeight: '500',
    color: '#6b7280',
  },
  optionTextSelected: {
    color: '#ffffff',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    backgroundColor: '#ffffff',
  },
  applyButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  applyButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  applyButtonText: {
    fontSize: typography.label.large,
    fontWeight: '600',
    color: '#ffffff',
  },
});