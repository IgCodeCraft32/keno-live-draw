import React, {useState, useRef} from 'react';
import {View, Text, TextInput, Animated, StyleSheet} from 'react-native';

const AnimatedInput = ({
  style,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  onSubmitEditing,
  error,
}) => {
  const labelAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    Animated.timing(labelAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (!value) {
      Animated.timing(labelAnim, {
        toValue: 20,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.Text style={[styles.label, {top: labelAnim}]}>
        FilterNumber
      </Animated.Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={text => {
          onChangeText(text);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        keyboardType={keyboardType}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="done" 
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 6,
    overflow: 'hidden',
    paddingTop: 12,
    paddingBottom: 24,
  },
  label: {
    position: 'absolute',
    zIndex: 99,
    left: 10,
    fontSize: 16,
    color: '#777',
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#08b0e8',
  },
  error: {
    color: 'red',
    position: 'absolute',
    zIndex: 99,
    left: 6,
    bottom: 0,
    fontSize: 16,
  },
});

export default AnimatedInput;
