import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Title from '../components/Title';
import Navbar from '../components/Navbar'
import MarginComponent from '../components/MarginComponent';
import InputComponent from '../components/InputComponent';
import SymptomIntensity from '../components/SymptomIntensity';
import IngredientContainer from '../components/IngredientContainer';
import FinishOrBackControl from '../components/FinishOrBackControl';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from '../components/colors';

const AddSymptomScreen = () => {

    const navigation = useNavigation();
    
    const navigateToSelectionScreen = () => {
        navigation.navigate('SelectionScreen');
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.content}>
                    <MarginComponent marginTop={10}/>
                    <Title title={"Today's entries"} showArrows={false}/>
                    <MarginComponent marginTop={10}/>
                    <InputComponent title={'Symptom description'} placeholder={'Enter symptom'} showButton={false} borderColor={colors.symptom}/>
                    <MarginComponent marginTop={5}/>
                    <SymptomIntensity title={'Symptom intensity'}/>
                    <MarginComponent marginTop={10}/>
                    <IngredientContainer title={'Summary'} showDelete={false} showEdit={false}/>
                </ScrollView>
                <FinishOrBackControl titleTaskButton={'Add symptoms to entries'} colorTaskButton={colors.symptom} textColorTaskButton={colors.white} colorArrowButton={colors.symptom} onPressArrowButton={navigateToSelectionScreen}/>
                <MarginComponent marginBottom={15}/>              
            </SafeAreaView>
            <Navbar/> 
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: RFValue(20),
        flex: 1,
        backgroundColor: colors.white,
    },
    content: {
        flex: 1,
        paddingBottom: RFValue(70),
    },
});

export default AddSymptomScreen;