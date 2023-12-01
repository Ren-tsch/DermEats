import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import TaskActionButton from './TaskActionButton';
import LeftArrowButton from './LeftArrowButton';

// FinishOrBackControl Komponente mit verschiedenen konfigurierbaren Eigenschaften
const FinishOrBackControl = ({
    onPressArrowButton, // Funktion, die beim Drücken des Pfeil-Buttons aufgerufen wird
    onPressTaskButton, // Funktion, die beim Drücken des Task-Buttons aufgerufen wird
    colorArrowButton, // Farbe des Pfeil-Buttons
    colorTaskButton, // Farbe des Task-Buttons
    titleTaskButton, // Titel des Task-Buttons
    textColorTaskButton, // Textfarbe des Task-Buttons
    showSymbolTaskButton = true, // Bestimmt, ob ein Symbol beim Task-Button angezeigt wird
    showTaskButton = true, // Steuert die Anzeige des Task-Buttons
    showSaveSymbol // Bestimmt, ob das Speichern-Symbol beim Task-Button angezeigt wird
  }) => (
    <View style={styles.container}>
        <LeftArrowButton onPress={onPressArrowButton} fillColor={colorArrowButton} hasPadding={false} changeSize={true} adjustedSize={28}/>
        {showTaskButton && (
        <TaskActionButton onPress={onPressTaskButton} buttonColor={colorTaskButton} title={titleTaskButton} textColor={textColorTaskButton} showSymbol={showSymbolTaskButton} showSaveSymbol={showSaveSymbol}/>
        )}
        {!showTaskButton && (
        <View style={styles.shadowElement}></View>
        )}
        <View style={styles.shadowElement}></View>
    </View>
);

// Styling der Komponente
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    shadowElement: {
        width: RFValue(28),
    },
});

export default FinishOrBackControl;