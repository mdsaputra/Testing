import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const InputField = ({
  value,
  onChangeText,
  placeholder,
  icon, // can be a component (CalendarIcon) OR an element (<CalendarIcon />)
  onIconPress,
  editable = true,
}) => {
  // helper render icon safely
  const renderIcon = () => {
    if (!icon) return null;

    // jika icon sudah berupa React element: <Icon />
    if (React.isValidElement(icon)) {
      return icon;
    }

    // jika icon adalah component function/class: CalendarIcon
    if (typeof icon === 'function' || typeof icon === 'object') {
      // jika component, buat elementnya dengan props default (bisa di-override saat pass)
      try {
        const IconComp = icon;
        return <IconComp width={20} height={20} />;
      } catch (e) {
        return null;
      }
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        style={styles.input}
        editable={editable}
      />
      {icon ? (
        <TouchableOpacity onPress={onIconPress} style={styles.iconContainer}>
          {renderIcon()}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f9f7f7',
    borderWidth: 1,
    borderColor: '#f7dcdc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#000',
  },
  iconContainer: {
    marginLeft: 8,
  },
});

export default InputField;
