import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import TaskActionButton from './TaskActionButton'; // Importiere deine TaskActionButton-Komponente
import { RFValue } from "react-native-responsive-fontsize";
import colors from './colors';

const InputComponent = ({ showText = true, onActionPress, actionButtonTitle, placeholder, title, titleColor, borderColor, showButton= true, textAlignMiddle= false}) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <View style={styles.container}>
      {showText && (
        <Text style={[styles.textStyle, {color: titleColor, textAlign: textAlignMiddle ? 'center' : 'left'}]}>{title}
        </Text>)}
      <TextInput
        style={[styles.inputStyle, {borderColor: borderColor, marginBottom: showButton ? RFValue(10) : RFValue(0)}]}
        value={inputValue}
        onChangeText={setInputValue}
        placeholder= {placeholder}
        underlineColorAndroid="transparent"
      />
      {showButton && (
        <TaskActionButton
          onPress={onActionPress}
          title={actionButtonTitle}
          buttonColor={colors.black}
          textColor={colors.white}
          alignMiddle={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  textStyle: {
    fontFamily: 'Inter_700Bold',
    fontSize: RFValue(16),
    marginBottom: RFValue(5),
  },
  inputStyle: {
    borderWidth: 1.5,
    padding: RFValue(8),
    fontSize: RFValue(18),
    borderRadius: RFValue(10),
  }
});

export default InputComponent;