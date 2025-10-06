import React from 'react';
import { Text, Snackbar } from 'react-native-paper';

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
        marginBottom: 0,
      }}
    >
      <Text style={{ color: 'white', fontWeight: '500' }}>
        {message}
      </Text>
    </Snackbar>
  );
};