export const Colors = {
  // Primary colors (Filament inspired)
  primary: '#6366f1',
  primaryHover: '#4f46e5',
  primaryLight: '#818cf8',

  // Text colors
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
  },

  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
  },

  // Border colors
  border: {
    primary: '#e5e7eb',
    secondary: '#d1d5db',
  },

  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Shadow colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.15)',
  },

  // Opacity colors
  opacity: {
    10: 'rgba(99, 102, 241, 0.1)',
    20: 'rgba(99, 102, 241, 0.2)',
    30: 'rgba(99, 102, 241, 0.3)',
    40: 'rgba(99, 102, 241, 0.4)',
    50: 'rgba(99, 102, 241, 0.5)',
  },
};

export const Theme = {
  colors: {
    primary: Colors.primary,
    background: Colors.background.primary,
    surface: Colors.background.primary,
    text: Colors.text.primary,
    placeholder: Colors.text.tertiary,
    error: Colors.error,
    onSurface: Colors.text.primary,
    onSurfaceVariant: Colors.text.secondary,
  },
  roundness: 8,
};