import React, {useState} from 'react';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Text,
  View,
  Animated,
} from 'react-native';

const colors = {
  'dark-red': '#c5202b',
  'dark-blue': '#006bb5',
  'dark-green': '#00843d',
  'yellow': '#f9a800',
  'light-purple': '#b42996',
  'orange': '#f05000',
  'grey': '#8eaac0',
  'purple': '#523191',
  'blank': '#d8e4eb',
};

const RippleButton = ({
  title,
  style,
  onPress,
  color = 'dark-blue',
  rounded = true,
  colorfulBackground = true,
}) => {
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const buttonScale = {
    transform: [{scale: scaleValue}],
  };

  const buttonStyle = {
    padding: 10,
    borderRadius: rounded ? 25 : 5,
    alignItems: 'center',
    minHeight: 40,
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor:"transparent",
    borderStyle:"solid"
  };

  const textStyle = {
    fontSize: 16,
  };

  const content = (
    <View
      style={[
        buttonStyle,
        colorfulBackground ? {backgroundColor:colors[color]} : {backgroundColor: 'white', borderColor:colors[color]},
      ]}>
      <Text
        style={[
          textStyle,
          colorfulBackground ? {color: 'white'} : {color: colors[color]},
        ]}>
        {title}
      </Text>
    </View>
  );

  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        style={style}
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple( 'rgba(0,0,0,0.2)', true)}>
        <Animated.View style={[buttonScale]}>{content}</Animated.View>
      </TouchableNativeFeedback>
    );
  } else {
    return (
      <TouchableOpacity
        style={style}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}>
        <Animated.View style={[buttonScale]}>{content}</Animated.View>
      </TouchableOpacity>
    );
  }
};

export default RippleButton;
