import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Modal } from 'react-native';
import { TextInput, HelperText, Card, List } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { DropdownSkeleton } from './skeleton';

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

  const getSelectedOptionName = () => {
    if (!value) return placeholder || `Pilih ${label.toLowerCase()}`;
    const selectedOption = options.find(option => option.id.toString() === value);
    return selectedOption ? selectedOption.name : placeholder || `Pilih ${label.toLowerCase()}`;
  };

  const handleOptionPress = (optionValue: string) => {
    onValueChange(optionValue);
    setMenuVisible(false);
  };

  const handleToggleDropdown = () => {
    if (!disabled) {
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
      <View>
        <TouchableOpacity
          onPress={handleToggleDropdown}
          activeOpacity={disabled ? 1 : 0.7}
        >
          <TextInput
            label={label}
            value={getSelectedOptionName()}
            onChangeText={() => { }}
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

      {/* Modal for dropdown options */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <View style={{
            width: '100%',
            maxWidth: 400,
            backgroundColor: '#ffffff',
            borderRadius: 12,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            overflow: 'hidden',
          }}>
            {/* Header */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#f3f4f6',
              backgroundColor: '#ffffff',
            }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#111827',
              }}>
                {label}
              </Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Ionicons name="close" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Scrollable Options */}
            <ScrollView
              style={{ maxHeight: 300 }}
              contentContainerStyle={{
                paddingBottom: 0,
              }}
              showsVerticalScrollIndicator={true}
            >
              <View style={{
                backgroundColor: '#ffffff',
              }}>
                {options.map((option, index) => {
                  const isLast = index === options.length - 1;
                  const isSelected = value === option.id.toString();

                  return (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => handleOptionPress(option.id.toString())}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                        borderBottomWidth: isLast ? 0 : 1,
                        borderBottomColor: '#f3f4f6',
                      }}
                    >
                      <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                        {isSelected && (
                          <Ionicons name="checkmark" size={16} color="#1e40af" style={{ marginRight: 12 }} />
                        )}
                        <Text style={{
                          fontSize: 14,
                          color: isSelected ? '#1e40af' : '#111827',
                          fontWeight: isSelected ? '600' : '400',
                          flex: 1,
                        }}>
                          {option.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Select;