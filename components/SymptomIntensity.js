import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import TaskActionButton from './TaskActionButton';
import colors from './colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const SymptomIntensity = ({ title, titleColor }) => {
    const [activeButton, setActiveButton] = useState(null);
  
    // Stil für den aktiven Button
    const activeButtonStyle = activeButton !== null ? { borderWidth: 3, borderColor: colors.black } : {};
  
    return (
        <View style={styles.container}>
            <Text style={[styles.titleTextStyle, {color: titleColor}]}>{title}</Text>
        <View style={styles.inputContainer}>
            <View style={styles.intensityContainer}>
                <TouchableOpacity 
                style={[styles.buttonStyle, {backgroundColor: colors.symptomWeak}, activeButton === 0 && activeButtonStyle]}
                onPress={() => setActiveButton(0)}
                />
                <Text style={styles.symptomText}>weak</Text>
            </View>
            <View style={styles.intensityContainer}>
                <TouchableOpacity 
                style={[styles.buttonStyle, {backgroundColor: colors.symptomWeak}, activeButton === 1 && activeButtonStyle]}
                onPress={() => setActiveButton(1)}
                />
                <Text style={styles.symptomText}>middle</Text>
            </View>
            <View style={styles.intensityContainer}>
                <TouchableOpacity 
                style={[styles.buttonStyle, {backgroundColor: colors.symptomStrong}, activeButton === 2 && activeButtonStyle]}
                onPress={() => setActiveButton(2)}
                />
                <Text style={styles.symptomText}>hard</Text>
          </View>
        </View>
        <TaskActionButton textColor={colors.white} title={'Add symptom'} buttonColor={colors.black} alignMiddle={false}/>
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
    marginBottom: RFValue(5),
  },
  buttonStyle: {
    width: RFValue(25),
    height: RFValue(25),
    borderRadius: 10000,
  },
  symptomText: {
    fontFamily: 'Inter_700Bold',
    fontSize: RFValue(16),
    marginBottom: RFValue(5),
  },
  intensityContainer: {
    alignItems: 'center',
  },
});

export default SymptomIntensity;