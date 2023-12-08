import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import colors from './colors';

// MealTypeSelector Komponente mit verschiedenen konfigurierbaren Eigenschaften
const MealTypeSelector = ({ 
  title, // Titel der Komponente
  titleColor, // Farbe des Titels
  onPressedButton, // Callback-Funktion, die beim Drücken eines Buttons aufgerufen wird
  resetTrigger,
}) => {

  const [buttonName, setButtonName] = useState([]) // Lokaler State für den Namen des aktiven Buttons

  // Funktion zum ermitteln welcher Button gedrückt wurde
  const handlePress = (button) => {
      switch (button) {
        case 'Breakfast':
          setButtonName('Breakfast')
          onPressedButton({'Meal': 'Breakfast', 'Color' : colors.breakfast})
          break;
        case 'Lunch':
          setButtonName('Lunch')
          onPressedButton({'Meal': 'Lunch', 'Color' : colors.lunch})
          break;
        case 'Dinner':
          setButtonName('Dinner')
          onPressedButton({'Meal': 'Dinner', 'Color' : colors.dinner})
          break;
        case 'Snack':
          setButtonName('Snack')
          onPressedButton({'Meal': 'Snack', 'Color' : colors.snack})
          break;
        default:
          break;
      }
  }

  useEffect(() => {
    setButtonName([])
  },[resetTrigger])

  return (
    <View style={styles.container}>
        <Text style={[styles.textStyle, {color: titleColor}]}>{title}
        </Text>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => handlePress('Breakfast')} style={[styles.inputStyle, buttonName == 'Breakfast' ? styles.active : styles.inactive, {backgroundColor: colors.breakfast, color: colors.white}]}>
            <Text style={[styles.textStyleButton, {color: buttonName == 'Breakfast' ? colors.white : colors.black}]}>Breakfast</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePress('Lunch')} style={[styles.inputStyle, buttonName == 'Lunch' ? styles.active : styles.inactive, {backgroundColor: colors.lunch}]}>
           <Text style={[styles.textStyleButton, {color: buttonName == 'Lunch' ? colors.white : colors.black}]}>Lunch</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePress('Dinner')} style={[styles.inputStyle, buttonName == 'Dinner' ? styles.active : styles.inactive, {backgroundColor: colors.dinner}]}>
           <Text style={[styles.textStyleButton, {color: buttonName == 'Dinner' ? colors.white : colors.black}]}>Dinner</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePress('Snack')} style={[styles.inputStyle, buttonName == 'Snack' ? styles.active : styles.inactive, {backgroundColor: colors.snack}]}>
            <Text style={[styles.textStyleButton, {color: buttonName == 'Snack' ? colors.white : colors.black}]}>Snack</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
  },
  textStyle: {
    textAlign: 'left',
    fontFamily: 'Inter_700Bold',
    fontSize: RFValue(16),
    marginBottom: RFValue(5),
  },
  textStyleButton: {
    textAlign: 'center',
    fontFamily: 'Inter_700Bold',
    fontSize: RFValue(14),
  },
  inputStyle: {
    padding: RFValue(2),
    fontSize: RFValue(18),
    borderRadius: RFValue(10),
    height: RFValue(50),
    width: '23%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  active: {
    opacity: 1,
  },
  inactive: {
    opacity: 0.3,
    backgroundColor: colors.white
  }
});

export default MealTypeSelector;