import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Keyboard, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Title from '../components/Title';
import Navbar from '../components/Navbar'
import MarginComponent from '../components/MarginComponent';
import InputComponent from '../components/InputComponent';
import SymptomIntensity from '../components/SymptomIntensity';
import IngredientContainer from '../components/IngredientContainer';
import Ingredients from '../components/Ingredients'
import FinishOrBackControl from '../components/FinishOrBackControl';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from '../components/colors';

const AddSymptomScreen = () => {

    const navigation = useNavigation();

    const [symptomDescription, setSymptomDescription] = useState('');
    const [symptomIntensity, setSymptomIntensity] = useState(null);
    const [addedSymptoms, setAddedSymptoms] = useState([]);

    const AddSymptomToSummary = () => {
        if (symptomDescription && symptomIntensity !== null) {
            const newSymptom = {
                Name: symptomDescription,
                Strenght: symptomIntensity,
            };

            setAddedSymptoms([...addedSymptoms, newSymptom])

            setSymptomDescription('')
        } else {
            Alert.alert(
                "Input error",
                "Please enter a symptom and select the symptom intensity.",
                [
                    { text: "OK"}
                ],
                { cancelable: false }
            );
        }
        Keyboard.dismiss();
    };

    const DeleteSymptomFromSummary = (index) => {
        const newAddedSymptoms = [...addedSymptoms]
        newAddedSymptoms.splice(index, 1)
        setAddedSymptoms(newAddedSymptoms)
    }
    
    const navigateToSelectionScreen = () => {
        navigation.navigate('SelectionScreen');
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                        <MarginComponent marginTop={10}/>
                        <Title title={"Today's entries"} showArrows={false}/>
                        <MarginComponent marginTop={10}/>
                        <InputComponent title={'Symptom description'} placeholder={'Enter symptom'} onChangeText={setSymptomDescription} textInputValue={symptomDescription} showButton={false} borderColor={colors.symptom}/>
                        <MarginComponent marginTop={5}/>
                        <SymptomIntensity title={'Symptom intensity'} onPressAddButton={AddSymptomToSummary} activeSymptomButton={setSymptomIntensity}/>
                        <MarginComponent marginTop={10}/>
                        <IngredientContainer title={'Summary'} showDelete={false} showEdit={false} showUnderline={false} titleColor={colors.black}/>
                        <View style={styles.ingredientBox}>
                            {addedSymptoms.map((symptom, index) => {
                                let backgroundColor;
                                switch(symptom.Strenght) {
                                    case 0:
                                        backgroundColor = colors.symptomWeak;
                                        textColor = colors.white;
                                        break;
                                    case 1:
                                        backgroundColor = colors.symptomMiddle;
                                        textColor = colors.black;
                                        break;
                                    case 2:
                                        backgroundColor = colors.symptomStrong;
                                        textColor = colors.white;
                                        break;
                                }

                                return (
                                    <Ingredients 
                                        key={index}
                                        title={`${symptom.Name}`}
                                        backgroundColor={backgroundColor}
                                        textColor={textColor}
                                        onPress={() => DeleteSymptomFromSummary(index)}
                                    />
                                );
                            })}
                        </View>
                    </ScrollView>
                    <FinishOrBackControl titleTaskButton={'Add to entries'} colorTaskButton={colors.symptom} textColorTaskButton={colors.white} colorArrowButton={colors.symptom} onPressArrowButton={navigateToSelectionScreen}/>
                    <MarginComponent marginBottom={15}/> 
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
    ingredientBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

export default AddSymptomScreen;