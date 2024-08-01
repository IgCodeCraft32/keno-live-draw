import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Text, View, StyleSheet} from 'react-native';

function Loader() {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{...styles.spinner, transform: [{rotate: spin}]}} />

      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 30,
    height: 30,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#006bb5',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  loadingText: {
    marginLeft: 16,
    paddingVertical: 36,
    fontSize: 24,
    color: '#006bb5',
  },
});
export default Loader;
