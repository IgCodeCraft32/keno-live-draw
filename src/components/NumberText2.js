import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

const getColor = value => {
  const colors = [
    'bg-dark-red',
    'bg-dark-blue',
    'bg-dark-green',
    'bg-yellow',
    'bg-light-purple',
    'bg-orange',
    'bg-grey',
    'bg-purple',
  ];

  const index = Math.floor((value - 1) / 10);
  return colors[index] || 'bg-blank';
};

const {width} = Dimensions.get('window');
const fontSize = width * 0.045;

const NumberText2 = ({value, rate = 0}) => (
  <View style={[styles.item, styles[getColor(value)]]}>
    <Text style={[styles.number]}>{value}</Text>
    <Text style={[styles.number2]}>{` (${rate})`}</Text>
  </View>
);

const styles = StyleSheet.create({
  item: {
    width: fontSize * 3.5,
    height: fontSize * 1.5,
    marginVertical: 2,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  number: {
    lineHeight: fontSize * 1.5,
    color: 'white',
    fontWeight: 'bold',
    fontSize: fontSize,
  },
  number2: {
    lineHeight: fontSize * 1.5,
    color: 'white',
    fontWeight: 'bold',
    fontSize: fontSize * 0.75,
  },
  'bg-dark-red': {backgroundColor: '#c5202b'},
  'bg-dark-blue': {backgroundColor: '#006bb5'},
  'bg-dark-green': {backgroundColor: '#00843d'},
  'bg-yellow': {backgroundColor: '#f9a800'},
  'bg-light-purple': {backgroundColor: '#b42996'},
  'bg-orange': {backgroundColor: '#f05000'},
  'bg-grey': {backgroundColor: '#8eaac0'},
  'bg-purple': {backgroundColor: '#523191'},
  'bg-blank': {backgroundColor: '#d8e4eb'},
});

export default NumberText2;
