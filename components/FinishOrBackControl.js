import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import TaskActionButton from './TaskActionButton';
import LeftArrowButton from './LeftArrowButton';

const FinishOrBackControl = ({ onPressArrowButton, onPressTaskButton, colorArrowButton, colorTaskButton, titleTaskButton, textColorTaskButton}) => (
    <View style={styles.container}>
        <LeftArrowButton style={styles.arrowButton} onPress={onPressArrowButton} fillColor={colorArrowButton} hasPadding={false}/>
        <TaskActionButton style={styles.taskButtonAlign} onPress={onPressTaskButton} buttonColor={colorTaskButton} title={titleTaskButton} textColor={textColorTaskButton}/>
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
        width: RFValue(24),
    },
});

export default FinishOrBackControl;