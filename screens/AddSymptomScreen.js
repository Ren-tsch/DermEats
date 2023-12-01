import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Keyboard, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Title from '../components/Title';
import MarginComponent from '../components/MarginComponent';
import InputComponent from '../components/InputComponent';
import SymptomIntensity from '../components/SymptomIntensity';
import IngredientContainer from '../components/IngredientContainer';
import Ingredients from '../components/Ingredients'
import FinishOrBackControl from '../components/FinishOrBackControl';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from '../components/colors';
import { useDate } from '../context/DateContext';
import { addSymptom } from '../database/databaseOperations';

const AddSymptomScreen = () => {

    const { currentDate } = useDate(); // Hook aus dem DateContext für das aktuelle Datum.
    const navigation = useNavigation(); // Navigation Hook.

    const [symptomDescription, setSymptomDescription] = useState(''); // Verwaltet die Beschreibung des Symptoms.
    const [symptomIntensity, setSymptomIntensity] = useState(''); // Verwaltet die Intensität des Symptoms.
    const [addedSymptoms, setAddedSymptoms] = useState([]); // Liste der hinzugefügten Symptome.

    // Funktion, um ein Symptom zur Zusammenfassungsliste hinzuzufügen.
    const AddSymptomToSummary = () => {
        if (symptomDescription && symptomIntensity !== null) {
            const newSymptom = {
                Name: symptomDescription.trimEnd(),
                Strenght: symptomIntensity,
                Date: currentDate,
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

     // Funktion, um ein Symptom aus der Zusammenfassungsliste zu entfernen.
    const DeleteSymptomFromSummary = (index) => {
        const newAddedSymptoms = [...addedSymptoms]
        newAddedSymptoms.splice(index, 1)
        setAddedSymptoms(newAddedSymptoms)
    }

    // Funktion, um die erfassten Symptome in die Datenbank zu übertragen.
    const AddSymptomsToDatabase = async () => {
        try {
            for (let item of addedSymptoms) {
                await addSymptom(item.Name, item.Strenght, item.Date);
            }
            setSymptomDescription('');
            setSymptomIntensity('');
            setAddedSymptoms([]);

        } catch (error) {
            console.error('Fehler beim Hinzufügen der Symptome:', error);
        }
    }
    
    // Funktion zur Navigation zum SelectionScreen.
    const navigateToSelectionScreen = () => {
        navigation.navigate('SelectionScreen');
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                        <MarginComponent marginTop={10}/>
                        <Title title={"Add symptom"} showArrows={false}/>
                        <MarginComponent marginTop={10}/>
                        <InputComponent title={'Symptom description'} placeholder={'Enter symptom'} onChangeText={setSymptomDescription} textInputValue={symptomDescription} showButton={false} borderColor={colors.symptom}/>
                        <MarginComponent marginTop={5}/>
                        <SymptomIntensity title={'Symptom intensity'} onPressAddButton={AddSymptomToSummary} activeSymptomButton={setSymptomIntensity}/>
                        <MarginComponent marginTop={10}/>
                        {addedSymptoms.length > 0 && (
                            <IngredientContainer title={'Symptoms'} fontSize={RFValue(22)} showDelete={false} showEdit={false} showUnderline={false} titleColor={colors.symptom}/>
                        )}
                        <View style={styles.ingredientBox}>
                            {addedSymptoms.map((symptom, index) => {
                                let backgroundColor;
                                switch(symptom.Strenght) {
                                    case 'weak':
                                        backgroundColor = colors.symptomWeak;
                                        textColor = colors.white;
                                        break;
                                    case 'medium':
                                        backgroundColor = colors.symptomMiddle;
                                        textColor = colors.black;
                                        break;
                                    case 'strong':
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
                    <FinishOrBackControl titleTaskButton={'Save'} colorTaskButton={colors.symptom} textColorTaskButton={colors.white} colorArrowButton={colors.symptom} showSaveSymbol={true} showTaskButton={addedSymptoms.length > 0} onPressArrowButton={navigateToSelectionScreen} onPressTaskButton={AddSymptomsToDatabase}/>
                    <MarginComponent marginBottom={15}/> 
                </View>   
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
    ingredientBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

export default AddSymptomScreen;