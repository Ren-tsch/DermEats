import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import NoLogsScreen from '../components/NoLogsScreen'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Title from '../components/Title';
import Navbar from '../components/Navbar'
import MarginComponent from '../components/MarginComponent';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from '../components/colors';

const StartScreen = () => {

    const navigation = useNavigation();

    const navigateToSelectionScreen = () => {
        navigation.navigate('SelectionScreen');
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <MarginComponent marginTop={10}/>
                    <Title title={"Today's entries"}/>
                    <View style={styles.containerNoLogs}>
                        <NoLogsScreen onAddPress={navigateToSelectionScreen}/>
                    </View>
                </View>
                <Navbar/> 
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    content: {
        flex: 1,
        paddingHorizontal: RFValue(20),
    },
    containerNoLogs: {
        justifyContent: 'center',
        flex: 1,
    }
});

export default StartScreen;