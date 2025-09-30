import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { TextInput, HelperText, Card } from 'react-native-paper';
import { DropdownSkeleton } from './Skeleton';

interface SelectOption {
  id: number | string;
  name: string;
  [key: string]: any;
}

interface SelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  loading?: boolean;
  error?: string;
  placeholder?: string;
  style?: object;
  disabled?: boolean;
  visible?: boolean;
  errorStyle?: object;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onValueChange,
  options,
  loading = false,
  error,
  placeholder,
  style,
  disabled = false,
  visible = true,
  errorStyle,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef<View>(null);

  const getSelectedOptionName = () => {
    if (!value) return placeholder || `Select ${label.toLowerCase()}`;
    const selectedOption = options.find(option => option.id.toString() === value);
    return selectedOption ? selectedOption.name : placeholder || `Select ${label.toLowerCase()}`;
  };

  const handleOptionPress = (optionValue: string) => {
    onValueChange(optionValue);
    setMenuVisible(false);
  };

  const updateDropdownPosition = () => {
    if (inputRef.current) {
      inputRef.current.measure((fx, fy, width, height, px, py) => {
        const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
        const dropdownHeight = Math.min(300, options.length * 48 + 16);

        // Position dropdown centered vertically on screen
        const top = (screenHeight - dropdownHeight) / 2;
        const left = (screenWidth - Math.min(width, screenWidth - 32)) / 2; // Center with max width and padding

        setDropdownPosition({
          top: top,
          left: left,
          width: Math.min(width, screenWidth - 32), // Don't exceed screen width with padding
        });
      });
    }
  };

  const handleToggleDropdown = () => {
    if (!disabled) {
      if (!menuVisible) {
        updateDropdownPosition();
      }
      setMenuVisible(!menuVisible);
    }
  };

  if (!visible) {
    return null;
  }

  if (loading) {
    return <DropdownSkeleton style={style} />;
  }

  return (
    <>
      <View ref={inputRef} collapsable={false}>
        <TouchableOpacity
          onPress={handleToggleDropdown}
          activeOpacity={disabled ? 1 : 0.7}
        >
          <TextInput
            label={label}
            value={getSelectedOptionName()}
            onChangeText={() => {}}
            mode="outlined"
            outlineColor="#e5e7eb"
            activeOutlineColor="#6366f1"
            style={style}
            editable={false}
            right={<TextInput.Icon icon="menu-down" />}
          />
        </TouchableOpacity>
        {error && <HelperText type="error" style={errorStyle ? errorStyle : { marginTop: -14, marginLeft: -6, marginBottom: 14 }}>{error}</HelperText>}
      </View>

      {menuVisible && (
        <>
          {/* Overlay backdrop */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
            }}
            onPress={() => setMenuVisible(false)}
            activeOpacity={1}
          />

          {/* Floating dropdown */}
          <Card style={{
            position: 'absolute',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            backgroundColor: '#ffffff',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            zIndex: 1001,
            maxHeight: 300,
          }}>
            <ScrollView nestedScrollEnabled={true}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 4,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f3f4f6',
                  }}
                  onPress={() => handleOptionPress(option.id.toString())}
                >
                  <TextInput
                    value={option.name}
                    onChangeText={() => {}}
                    mode="flat"
                    dense
                    disabled
                    style={{ backgroundColor: 'transparent', margin: 0, padding: 0 }}
                    textAlign="left"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Card>
        </>
      )}
    </>
  );
};

export default Select;