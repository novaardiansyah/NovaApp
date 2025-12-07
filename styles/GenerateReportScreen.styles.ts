import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectorTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  selectorDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  helperText: {
    marginTop: 4,
    marginLeft: 0,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 14,
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalScrollView: {
    maxHeight: 300,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    marginBottom: 8,
  },
  modalOptionSelected: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  modalOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalOptionIcon: {
    marginRight: 12,
  },
  modalOptionTextContainer: {
    flex: 1,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  modalOptionDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  modalCancelButton: {
    marginTop: 12,
  },
  cancelButton: {
    marginTop: -10,
  },
});
