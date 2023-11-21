import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import TaskActionButton from './TaskActionButton';
import LeftArrowButton from './LeftArrowButton';

const FinishOrBackControl = ({ onPressArrowButton, onPressTaskButton, colorArrowButton, colorTaskButton, titleTaskButton, textColorTaskButton, showSymbolTaskButton=true, showTaskButton=true, showSaveSymbol}) => (
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