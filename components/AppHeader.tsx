import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors } from '@/constants/colors';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'NovaApp',
  subtitle
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.brandContainer}>
        <Image
          source={require('@/assets/app-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
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
  logo: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  brandTagline: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
});

export default AppHeader;