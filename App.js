import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts, Inter_900Black, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Title from './components/Title';
import Navbar from './components/Navbar';
import NavigationButton from './components/NavigationButton';
import TaskActionButton from './components/TaskActionButton';
import InputComponent from './components/InputComponent';
import InputTime from './components/inputTime';

export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    Inter_900Black,
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Title title="Today's entries"/>
          <NavigationButton title="Add new food" buttonColor={'#568D31'} textColor={"white"}/>
          <TaskActionButton title="Add food" buttonColor={"black"} textColor={"white"} showSymbol={true}/>
          <InputComponent actionButtonTitle={"Add food"} placeholder={"Test"} title={"Name"} titleColor={'red'} borderColor={'red'}/>
          <InputTime title={'Time of consumption'} titleColor={'black'} borderColor={'black'}/>
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
    backgroundColor: 'white',
  },
});
