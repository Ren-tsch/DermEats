import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";

const InputTime = ({ placeholder, title, titleColor, borderColor}) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <View style={styles.container}>
        <Text style={[styles.textStyle, {color: titleColor}]}>{title}
        </Text>
        <View style={styles.inputContainer}>
            <TextInput
            style={[styles.inputStyle, {borderColor: borderColor}]}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder= '00'
            underlineColorAndroid="transparent"
            />
            <TextInput
            style={[styles.inputStyle, {borderColor: borderColor}]}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder= '00'
            underlineColorAndroid="transparent"
            />
            <TextInput
            style={[styles.inputStyle, {borderColor: borderColor}]}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder= 'AM'
            underlineColorAndroid="transparent"
            />
        </View>
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
    justifyContent: 'flex-start',
    justifyContent: 'space-between',
  },
  textStyle: {
    textAlign: 'left',
    fontFamily: 'Inter_700Bold',
    fontSize: RFValue(16),
    textShadowColor: 'black',
    textShadowOffset: { width: 0.75, height: 0 },
    textShadowRadius: 1,
    marginBottom: RFValue(5),
  },
  inputStyle: {
    borderWidth: 1.5,
    padding: RFValue(8),
    fontSize: RFValue(18),
    borderRadius: RFValue(10),
    textAlign: 'center',
    width: RFValue(100)
  }
});

export default InputTime;