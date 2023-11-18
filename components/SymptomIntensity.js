import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import TaskActionButton from './TaskActionButton';
import MarginComponent from '../components/MarginComponent';
import colors from './colors';

const SymptomIntensity = ({ title, titleColor, onPressAddButton, activeSymptomButton }) => {

    const [activeButton, setActiveButton] = useState(null);

    const handleButtonPress = (buttonIndex) => {
      setActiveButton(buttonIndex);
      activeSymptomButton(buttonIndex);
    };

    const activeButtonStyle = activeButton !== null ? { borderWidth: 3, borderColor: colors.black } : {};
  
    return (
        <View style={styles.container}>
          <Text style={[styles.titleTextStyle, {color: titleColor}]}>{title}</Text>
          <MarginComponent marginBottom={10}/>
          <View style={styles.inputContainer}>
            <View style={styles.intensityContainer}>
                <TouchableOpacity 
                style={[styles.buttonStyle, {backgroundColor: colors.symptomWeak}, activeButton === 0 && activeButtonStyle]}
                onPress={() => handleButtonPress(0)}
                />
                <Text style={styles.symptomText}>weak</Text>
            </View>
            <View style={styles.intensityContainer}>
                <TouchableOpacity 
                style={[styles.buttonStyle, {backgroundColor: colors.symptomMiddle}, activeButton === 1 && activeButtonStyle]}
                onPress={() => handleButtonPress(1)}
                />
                <Text style={styles.symptomText}>middle</Text>
            </View>
            <View style={styles.intensityContainer}>
                <TouchableOpacity 
                style={[styles.buttonStyle, {backgroundColor: colors.symptomStrong}, activeButton === 2 && activeButtonStyle]}
                onPress={() => handleButtonPress(2)}
                />
                <Text style={styles.symptomText}>hard</Text>
          </View>
        </View>
        <MarginComponent marginBottom={10}/>
        <TaskActionButton textColor={colors.white} title={'Add symptom'} buttonColor={colors.black} alignMiddle={false} onPress={onPressAddButton}/>
      </View>
    );
};

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