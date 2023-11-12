import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts, Inter_900Black, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Title from './components/Title';
import Navbar from './components/Navbar';
import InputComponent from './components/InputComponent';
import SymptomIntensity from './components/SymptomIntensity';
import Ingredients from './components/Ingredients';
import IngredientContainer from './components/IngredientContainer';
import GenericModal from './components/GenericModal';
import InputTime from './components/InputTime';
import FinishOrBackControl from './components/FinishOrBackControl';
import TaskActionButton from './components/TaskActionButton';
import NoLogsScreen from './components/NoLogsScreen';
import colors from './components/colors';

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
          <Title title="Today's entries" showSubtitle={true} showDateContainer={true} subtitleText={'Saved food'} subtitleTextColor={colors.symptom}/>
          <NoLogsScreen/>
          <GenericModal isVisible={false}>
            <IngredientContainer title={'test'} titleColor={'green'} showDelete={false} showEdit={false}/>
            <InputComponent title={'Name of the meal'} actionButtonTitle={"Add food"}/>
            <InputTime title={'Time of consuption'}/>
          </GenericModal>
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
    backgroundColor: colors.white,
  },
});
