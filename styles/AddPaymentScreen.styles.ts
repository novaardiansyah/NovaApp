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
  inputGroup: {
    marginBottom: 20,
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
  inputLabel: {
    fontSize: typography.label.large,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  cancelButton: {
    marginTop: -10,
  },
  addButton: {
    marginTop: 20
  },
  accordion: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: typography.label.large,
    paddingVertical: 0,
    paddingRight: 8,
  },
  accordionItem: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 0,
    paddingVertical: 4,
    marginHorizontal: -8,
    marginRight: -16,
  },
  accordionItemFirst: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 0,
    paddingVertical: 4,
    marginTop: 8,
    marginHorizontal: -8,
    marginRight: -16,
  },
  accordionTitle: {
    fontSize: typography.label.large,
  },
  accordionDescription: {
    fontSize: typography.label.small,
  },
  accordionItemTitle: {
    fontSize: typography.label.large,
  },
  accordionItemDescription: {
    fontSize: typography.label.small,
  },
});