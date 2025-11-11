import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors } from '@/constants/colors';

interface AppCopyrightProps {
  year?: number;
  companyName?: string;
  showVersion?: boolean;
  version?: string;
}

const AppCopyright: React.FC<AppCopyrightProps> = ({
  year = new Date().getFullYear(),
  companyName = 'Nova Ardiansyah',
  showVersion = false,
  version = '1.0.0',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.copyright}>
        © {year} {companyName}. All rights reserved.
      </Text>
      {showVersion && (
        <Text style={styles.version}>
          Nova App - Version {version}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  copyright: {
    fontSize: 11,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  version: {
    fontSize: 10,
    color: Colors.text.tertiary,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default AppCopyright;