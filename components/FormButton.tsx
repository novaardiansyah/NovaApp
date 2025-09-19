import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, ButtonProps } from 'react-native-paper';
import { Colors } from '../constants/colors';

interface FormButtonProps extends Omit<ButtonProps, 'mode' | 'style' | 'labelStyle' | 'contentStyle' | 'children'> {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

const FormButton: React.FC<FormButtonProps> = ({
  title,
  loading = false,
  disabled = false,
  variant = 'primary',
  fullWidth = true,
  onPress,
  icon,
}) => {
  const getButtonStyle = () => {
    const baseStyle = { ...styles.button };

    if (fullWidth) {
      Object.assign(baseStyle, styles.fullWidth);
    }

    switch (variant) {
      case 'secondary':
        Object.assign(baseStyle, styles.secondaryButton);
        break;
      case 'outline':
        Object.assign(baseStyle, styles.outlineButton);
        break;
      default:
        Object.assign(baseStyle, styles.primaryButton);
    }

    return baseStyle;
  };

  const getLabelStyle = () => {
    const baseStyle = { ...styles.buttonLabel };

    switch (variant) {
      case 'outline':
        Object.assign(baseStyle, styles.outlineLabel);
        break;
      default:
        Object.assign(baseStyle, styles.primaryLabel);
    }

    return baseStyle;
  };

  const getContentStyle = () => {
    const contentStyle = { ...styles.buttonContent };
    if (fullWidth) {
      Object.assign(contentStyle, styles.fullWidthContent);
    }
    return contentStyle;
  };

  const getDisabledStyle = () => {
    if (disabled) {
      return styles.disabledButton;
    }
    return {};
  };

  const buttonStyle = { ...getButtonStyle() };
  if (disabled) {
    Object.assign(buttonStyle, styles.disabledButton);
  }

  return (
    <Button
      mode={variant === 'outline' ? 'outlined' : 'contained'}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      style={buttonStyle}
      labelStyle={getLabelStyle()}
      contentStyle={getContentStyle()}
      icon={icon}
    >
      {loading ? 'Loading...' : title}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  fullWidth: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.success,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  disabledButton: {
    backgroundColor: Colors.text.tertiary,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryLabel: {
    color: Colors.text.inverse,
  },
  outlineLabel: {
    color: Colors.primary,
  },
  buttonContent: {
    height: 48,
  },
  fullWidthContent: {
    width: '100%',
  },
});

export default FormButton;