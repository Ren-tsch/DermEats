import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";

const NavigationButton = ({ onPress, title, buttonColor, textColor }) => (
<View style={styles.buttonAlign}>
    <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: buttonColor }]} onPress={onPress}>
        <Text style={[styles.buttonText, { color: textColor}]}>{title}</Text>
    </TouchableOpacity>
</View>
);

const styles = StyleSheet.create({
    buttonAlign: {
        alignItems: 'center',
    },
    buttonContainer: {
        height: RFValue(65),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: RFValue(15),
        minWidth: '50%',
    },
    buttonText: {
        fontSize: RFValue(20),
        fontFamily: 'Inter_900Black',
    }
});

export default NavigationButton;

