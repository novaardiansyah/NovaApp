import React from 'react';
import { Text, Snackbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NotificationProps {
  visible: boolean;
  message?: string;
  onDismiss: () => void;
  duration?: number;
  type?: 'success' | 'error' | 'warning' | 'info';
}

export const Notification: React.FC<NotificationProps> = ({
  visible,
  message = 'Operation completed successfully!',
  onDismiss,
  duration = 2000,
  type = 'success'
}) => {
  const insets = useSafeAreaInsets();

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return '#10b981';
    }
  };

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      style={{
        backgroundColor: getBackgroundColor(),
        borderRadius: 8,
        position: 'absolute',
        margin: 16,
        right: 0,
        left: 0,
        bottom: -6, // Same as FAB positioning
        zIndex: 9999, // Ensure notification is always on top
        elevation: 8, // Android elevation for better visibility
      }}
    >
      <Text style={{ color: 'white', fontWeight: '500' }}>
        {message}
      </Text>
    </Snackbar>
  );
};