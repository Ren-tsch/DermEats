import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";

const InputTime = ({ title, titleColor, borderColor}) => {
  const [inputValueHour, setHourInputValue] = useState("");
  const [inputValueMinute, setMinuteInputValue] = useState("");

  return (
    <View style={styles.container}>
        <Text style={[styles.textStyle, {color: titleColor}]}>{title}
        </Text>
        <View style={styles.inputContainer}>
            <TextInput
            style={[styles.inputStyle, {borderColor: borderColor}]}
            value={inputValueHour}
            onChangeText={setHourInputValue}
            placeholder= '00'
            keyboardType="numeric"
            maxLength={2}
            underlineColorAndroid="transparent"
            />
            <TextInput
            style={[styles.inputStyle, {borderColor: borderColor}]}
            value={inputValueMinute}
            onChangeText={setMinuteInputValue}
            placeholder= '00'
            keyboardType="numeric"
            maxLength={2}
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
  },
  textStyle: {
    textAlign: 'left',
    fontFamily: 'Inter_700Bold',
    fontSize: RFValue(16),
    marginBottom: RFValue(5),
  },
  inputStyle: {
    borderWidth: 1.5,
    padding: RFValue(8),
    fontSize: RFValue(18),
    borderRadius: RFValue(10),
    textAlign: 'center',
    width: RFValue(100),
    marginRight: RFValue(10),
  }
});

export default InputTime;