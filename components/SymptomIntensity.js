import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import TaskActionButton from './TaskActionButton';
import MarginComponent from '../components/MarginComponent';
import colors from './colors';

// SymptomIntensity Komponente mit verschiedenen konfigurierbaren Eigenschaften
const SymptomIntensity = ({ 
  title, // Der Titel der Komponente
  titleColor, // Farbe des Titels
  onPressAddButton, // Funktion, die beim Drücken des 'Add symptom'-Buttons aufgerufen wird
  activeSymptomButton // Funktion, die bei der Auswahl einer Symptomintensität aufgerufen wird
}) => {

  // Lokaler State für den aktiven Button
  const [activeButton, setActiveButton] = useState(null);

  // Funktion zum wechseln des aktiven Buttons der Symptomintensität
  const handleButtonPress = (buttonIndex, symptomIntensity) => {
    setActiveButton(buttonIndex);
    activeSymptomButton(symptomIntensity);
  };

  // Stil für den aktiven Button
  const activeButtonStyle = activeButton !== null ? { borderWidth: 2, borderColor: colors.black, opacity: 1 } : {};

  return (
      <View style={styles.container}>
        <Text style={[styles.titleTextStyle, {color: titleColor}]}>{title}</Text>
        <MarginComponent marginBottom={10}/>
        <View style={styles.inputContainer}>
          <View style={styles.intensityContainer}>
              <TouchableOpacity 
              style={[styles.buttonStyle, {backgroundColor: colors.symptomWeak}, activeButton === 0 && activeButtonStyle]}
              onPress={() => handleButtonPress(0, 'weak')}
              />
              <Text style={styles.symptomText}>weak</Text>
          </View>
          <View style={styles.intensityContainer}>
              <TouchableOpacity 
              style={[styles.buttonStyle, {backgroundColor: colors.symptomMiddle}, activeButton === 1 && activeButtonStyle]}
              onPress={() => handleButtonPress(1, 'medium')}
              />
              <Text style={styles.symptomText}>medium</Text>
          </View>
          <View style={styles.intensityContainer}>
              <TouchableOpacity 
              style={[styles.buttonStyle, {backgroundColor: colors.symptomStrong}, activeButton === 2 && activeButtonStyle]}
              onPress={() => handleButtonPress(2, 'strong')}
              />
              <Text style={styles.symptomText}>strong</Text>
        </View>
      </View>
      <MarginComponent marginBottom={10}/>
      <TaskActionButton textColor={colors.white} title={'Add symptom'} buttonColor={colors.black} alignMiddle={false} onPress={onPressAddButton}/>
    </View>
  );
};

// Styling der Komponente
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  titleTextStyle: {
    textAlign: 'left',
    fontFamily: 'Inter_700Bold',
    fontSize: RFValue(16),
  },
  buttonStyle: {
    width: RFValue(30),
    height: RFValue(30),
    padding: RFValue(10),
    borderRadius: 10000,
    opacity: 0.3
  },
  symptomText: {
    fontFamily: 'Inter_700Bold',
    fontSize: RFValue(16),
  },
  intensityContainer: {
    alignItems: 'center',
  },
});

export default SymptomIntensity;