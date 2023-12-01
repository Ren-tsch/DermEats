import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Keyboard, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Title from '../components/Title';
import Navbar from '../components/Navbar';
import CalendarComponent from '../components/CalendarComponent';
import MarginComponent from '../components/MarginComponent';
import FinishOrBackControl from '../components/FinishOrBackControl';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from '../components/colors';

const CalendarScreen = () => {

    const navigation = useNavigation(); //Hook für die Navigation innerhalb der App.
    
    const navigateToStartScreen = () => { // Navigationsfunktion zum StartScreen.
        navigation.navigate('StartScreen');
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Title title={'Calendar'} calendarMode={true}/>
                    <View style={styles.calendar}>
                        <CalendarComponent />
                    </View>
                    <View>
                        <FinishOrBackControl colorArrowButton={colors.black} onPressArrowButton={navigateToStartScreen} showTaskButton={false}/>
                        <MarginComponent marginBottom={15}/>     
                    </View>
                </View>
                <Navbar/>     
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

// Styling
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    content: {
        flex: 1,
        paddingHorizontal: RFValue(20),
    },
    calendar: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default CalendarScreen;