import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import NavigationButton from '../components/NavigationButton'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Title from '../components/Title';
import Navbar from '../components/Navbar'
import MarginComponent from '../components/MarginComponent';
import FinishOrBackControl from '../components/FinishOrBackControl';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from '../components/colors';

const SelectionScreen = () => {

    const navigation = useNavigation();

    const navigateToAddMeal = () => {
        navigation.navigate('AddMealScreen');
    };

    const navigateToAddSymptom = () => {
        navigation.navigate('AddSymptomScreen');
    };

    const navigateToStartScreen = () => {
        navigation.navigate('StartScreen');
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <MarginComponent marginTop={10}/>
                    <Title title={"Today's entries"} showArrows={false}/>
                    <View style={styles.containerAddButtons}>
                        <NavigationButton title={'Add meal'} textColor={colors.white} buttonColor={colors.dermEatsColor} onPress={navigateToAddMeal}/>
                        <MarginComponent marginTop={20}/>
                        <NavigationButton title={'Add symptom'} textColor={colors.white} buttonColor={colors.symptom} onPress={navigateToAddSymptom}/>
                    </View>
                    <View>
                        <FinishOrBackControl showTaskButton={false} colorArrowButton={colors.black} onPressArrowButton={navigateToStartScreen}/>
                        <MarginComponent marginBottom={15} />
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
    containerAddButtons: {
        justifyContent: 'center',
        flex: 1,
    }
});

export default SelectionScreen;