import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const Header = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo-keno.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    borderColor: '#4c6b80',
    borderBottomWidth: 3,
    borderStyle: 'solid',
  },
  logo: {
    width: 250,
    objectFit: 'contain',
  },
});

export default Header;
