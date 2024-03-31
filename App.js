/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StatusBar, ScrollView, StyleSheet} from 'react-native';
import HomeScreen from './src/screens/MenuScreen';
import Header from "./src/components/Header";

function App() {

  return (
    <SafeAreaView style={{flex:1}}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <HomeScreen />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

export default App;
