import React, { useState, useEffect } from 'react';
import { 
  TextInput as RNTextInput, 
  TextInputProps, 
  StyleSheet, 
  NativeSyntheticEvent, 
  TextInputFocusEventData,
  View,
  Animated
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CustomTextInputProps extends TextInputProps {
  variant?: 'default' | 'password';
  containerStyle?: any;
  label?: string;
  required?: boolean; 
  showAnimatedLabel?: boolean;
}

const TextInput: React.FC<CustomTextInputProps> = ({ 
  variant = 'default',
  containerStyle,
  style,
  onFocus,
  onBlur,
  placeholder,
  label,
  value,
  secureTextEntry,
  required = false,
  showAnimatedLabel = true,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    if (!showAnimatedLabel) return;
    if (value) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [value, animatedValue, showAnimatedLabel]);

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    if (showAnimatedLabel) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onFocus?.(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    if (showAnimatedLabel && !value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onBlur?.(e);
  };

  const labelStyle = {
    transform: [{
      translateY: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -10],
      }),
    }],
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(255,255,255,0.5)", "rgba(255,255,255,1)"],
    }),
  };

  const displayLabel = label || placeholder;

  return (
    <View style={[styles.container, containerStyle]}>
      {showAnimatedLabel && (
        <Animated.Text style={[styles.label, labelStyle]}>
          {displayLabel} {required && (value || isFocused) && "*"}
        </Animated.Text>
      )}
      <View style={styles.inputContainer}>
        <RNTextInput
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            variant === 'password' && styles.passwordInput,
            style,
          ]}
          placeholder={showAnimatedLabel ? "" : placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          secureTextEntry={variant === 'password' ? !showPassword : secureTextEntry}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    minHeight: 60,
  },
  label: {
    position: 'absolute',
    left: 16,
    top: 20,
    zIndex: 1,
  },
  inputContainer: {
    position: 'relative',
    flex: 1,
  },
  input: {
    minHeight: 60,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    fontSize: 16,
    color: "white",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  inputFocused: {
    borderWidth: 2,
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 2,
  },
});

export default TextInput;