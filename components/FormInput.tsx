import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText, TextInputProps } from 'react-native-paper';
import { Colors } from '@/constants/colors';

interface FormInputProps extends Omit<TextInputProps, 'mode' | 'outlineColor' | 'activeOutlineColor'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  required?: boolean;
  numeric?: boolean;
  maxLength?: number;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  error,
  required = false,
  numeric = false,
  maxLength,
  left,
  right,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}) => {
  const handleChangeText = (text: string) => {
    if (numeric) {
      // Only allow numbers
      const numericText = text.replace(/[^0-9]/g, '');
      if (maxLength && numericText.length > maxLength) {
        return;
      }
      onChangeText(numericText);
    } else {
      if (maxLength && text.length > maxLength) {
        return;
      }
      onChangeText(text);
    }
  };

  const getKeyboardType = () => {
    if (numeric) return 'numeric';
    if (keyboardType) return keyboardType;
    if (label.toLowerCase().includes('email')) return 'email-address';
    return 'default';
  };

  const getAutoCapitalize = () => {
    if (autoCapitalize) return autoCapitalize;
    if (label.toLowerCase().includes('name')) return 'words';
    if (label.toLowerCase().includes('email')) return 'none';
    return 'sentences';
  };

  const getLeftIcon = () => {
    if (left) return left;

    // Default icons based on label
    if (label.toLowerCase().includes('email')) {
      return <TextInput.Icon icon="email-outline" color={Colors.text.tertiary} />;
    }
    if (label.toLowerCase().includes('password')) {
      return <TextInput.Icon icon="lock-outline" color={Colors.text.tertiary} />;
    }
    if (label.toLowerCase().includes('name')) {
      return <TextInput.Icon icon="account-outline" color={Colors.text.tertiary} />;
    }
    if (label.toLowerCase().includes('otp')) {
      return <TextInput.Icon icon="key" color={Colors.text.tertiary} />;
    }
    return undefined;
  };

  return (
    <View style={styles.container}>
      <TextInput
        label={required ? `${label} *` : label}
        value={value}
        onChangeText={handleChangeText}
        mode="outlined"
        outlineColor={Colors.border.primary}
        activeOutlineColor={Colors.primary}
        keyboardType={getKeyboardType()}
        autoCapitalize={getAutoCapitalize()}
        secureTextEntry={secureTextEntry}
        left={getLeftIcon()}
        right={right}
        style={styles.input}
        maxLength={maxLength}
      />
      {error && (
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.background.primary,
  },
});

export default FormInput;