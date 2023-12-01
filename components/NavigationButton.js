import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";

// NavigationButton Komponente mit verschiedenen konfigurierbaren Eigenschaften
const NavigationButton = ({ 
    onPress, // Callback-Funktion, die beim Drücken des Buttons ausgelöst wird
    title, // Text, der auf dem Button angezeigt wird
    buttonColor, // Hintergrundfarbe des Buttons
    textColor // Textfarbe des Buttons
}) => (
<View style={styles.buttonAlign}>
    <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: buttonColor }]} onPress={onPress}>
        <Text style={[styles.buttonText, { color: textColor}]}>{title}</Text>
    </TouchableOpacity>
</View>
);

// Styling der Komponente
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
        minWidth: '75%',
    },
    buttonText: {
        fontSize: RFValue(20),
        fontFamily: 'Inter_900Black',
    }
});

export default NavigationButton;

