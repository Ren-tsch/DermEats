import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, Keyboard, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Title from '../components/Title';
import Navbar from '../components/Navbar'
import MarginComponent from '../components/MarginComponent';
import InputComponent from '../components/InputComponent';
import IngredientContainer from '../components/IngredientContainer';
import FinishOrBackControl from '../components/FinishOrBackControl';
import Ingredients from '../components/Ingredients';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from '../components/colors';
import { addFood} from '../database/databaseOperations';


const AddFoodToLibraryScreen = () => {

    const navigation = useNavigation(); // Navigations Hook

    const [foodDescription, setFoodDescription] = useState('') // Verwaltet die Beschreibung des eingegebenen Lebensmittels.
    const [addedFood, setAddedFood] = useState([]) // Speichert eine Liste der hinzugefügten Lebensmittel.

    const AddFoodToSummary = () => {
        if (foodDescription !== '') {
            const newFood = {
                Name: foodDescription
            }
            setAddedFood([...addedFood, newFood])
            setFoodDescription('')

        } else {
            Alert.alert(
                "Input error",
                "Please enter a food name.",
                [
                    { text: "OK"}
                ],
                { cancelable: false }
            );
        }
        Keyboard.dismiss();
    }

    // Funktion zum entfernen von Lebensmittel aus der Zusammenfassung
    const DeleteFoodFromSummary = (index, deleteCount) => {
        const newAddedFood = [...addedFood]
        newAddedFood.splice(index, deleteCount)
        setAddedFood(newAddedFood)
    }

    // Ermöglicht die Navigation zurück zum Datenbankmenü.
    const navigateToDatabaseMenuScreen = () => {
        navigation.navigate('DatabaseMenuScreen');
    };

    // Funktion zum hinzufügen von Lebensmitteln zur Datenbank
    const addFoodToDatabase = async () => {
        for (const element of addedFood) {
            await addFood(element.Name);
        }
    
        DeleteFoodFromSummary(0, addedFood.length);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <MarginComponent marginTop={10}/>
                    <Title title={"Add new food to library"} subtitleText={'Add food'} subtitleTextColor={colors.food} showDateContainer={false} showSubtitle={true}/>
                    <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
                        <InputComponent title={'Name of the food'} placeholder={'Enter food name'} onChangeText={setFoodDescription} textInputValue={foodDescription} showButton={true} borderColor={colors.food} actionButtonTitle={'Add food'} onActionPress={AddFoodToSummary}/>
                        <MarginComponent marginTop={10}/>
                        {(addedFood.length > 0) && (
                            <IngredientContainer title={'Summary'} showDelete={false} showEdit={false} showUnderline={false} titleColor={colors.black}/>
                        )}
                        <View style={styles.ingredientBox}>
                            {addedFood.map((food, index) => {
                                return (
                                    <Ingredients 
                                        key={index}
                                        title={`${food.Name}`}
                                        backgroundColor={colors.food}
                                        textColor={colors.black}
                                        onPress={() => DeleteFoodFromSummary(index, 1)}
                                    />
                                );
                            })}
                        </View>
                    </ScrollView>
                    <FinishOrBackControl titleTaskButton={'Save to library'} textColorTaskButton={colors.black} showTaskButton={(addedFood.length > 0)} showSaveSymbol={true} colorTaskButton={colors.food} colorArrowButton={colors.food} onPressArrowButton={navigateToDatabaseMenuScreen} onPressTaskButton={addFoodToDatabase}/>
                    <MarginComponent marginBottom={15}/>
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
    ingredientBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

export default AddFoodToLibraryScreen;