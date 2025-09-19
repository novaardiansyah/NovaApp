import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { Colors } from '@/constants/colors';
import APP_CONFIG from '@/config/environment';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  iconName?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title = APP_CONFIG.APP_NAME,
  subtitle,
  iconName = 'account-circle'
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.brandContainer}>
        <View style={styles.brandCircle}>
          <Avatar.Icon
            size={32}
            icon={iconName}
            color="white"
            style={styles.brandIcon}
          />
        </View>
        <Text style={styles.brandName}>{title}</Text>
      </View>
      {subtitle && <Text style={styles.brandTagline}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandIcon: {
    backgroundColor: 'transparent',
  },
  brandName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginLeft: 12,
  },
  brandTagline: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
});

export default AppHeader;