import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts, Inter_900Black, Inter_400Regular } from '@expo-google-fonts/inter';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Title from './components/Title';
import Navbar from './components/Navbar';
import NavigationButton from './components/NavigationButton';

export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    Inter_900Black,
    Inter_400Regular,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Title title="Today's entries"/>
          <NavigationButton title="Add new food" buttoncolor={'#568D31'} textcolor={"white"}/>
          <StatusBar style="auto" />
        </View>
        <Navbar />
      </SafeAreaView>
    </SafeAreaProvider> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    padding: 20,
    backgroundColor: 'red',
  },
});
