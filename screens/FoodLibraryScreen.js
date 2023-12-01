import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Title from '../components/Title';
import Navbar from '../components/Navbar'
import MarginComponent from '../components/MarginComponent';
import FinishOrBackControl from '../components/FinishOrBackControl';
import Ingredients from '../components/Ingredients';
import GenericModal from '../components/GenericModal';
import InputComponent from '../components/InputComponent';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from '../components/colors';
import TaskActionButton from '../components/TaskActionButton';
import { getAllFood, deleteFood, updateFood } from '../database/databaseOperations';

const FoodLibraryScreen = () => {

    const navigation = useNavigation(); // Hook für die Navigation innerhalb der App.

    const [foodsDatabase, setFoodsDatabase] = useState([]); // Verwaltet die Liste der Lebensmittel.
    const [selectedFoodID, setSelectedFoodID] = useState(null); // Speichert die ID des ausgewählten Lebensmittels.
    const [editIngredient, setEditIngredient] = useState(false); // Steuert, ob das Bearbeitungsmodal geöffnet ist.
    const [selectedFoodName, setSelectedFoodName] = useState(""); // Speichert den Namen des ausgewählten Lebensmittels.

    // useEffect Hook, um die Lebensmitteldaten beim Laden der Komponente abzurufen.
    useEffect(() => {
        getAllFood().then(foods => {
            setFoodsDatabase(foods)
        })
        .catch(error => {
            console.error('Fehler beim Laden der Lebensmittel:', error);
        });
    }, [editIngredient])

    // Funktion zum Löschen eines Lebensmittels aus der Datenbank.
    const DeleteFoodFromDatabase = async (foodID) => {
        const updatedFoodDatabase = foodsDatabase.filter(food => food.FoodID !== foodID);
    
        setFoodsDatabase(updatedFoodDatabase);
        setSelectedFoodID(null);
    
        await deleteFood(foodID).catch(error => {
            console.error('Fehler beim Löschen des Lebensmittels:', error);
        });
    }

    // Funktion zum Auswählen eines Lebensmittels.
    const handleSelectIngredient = (foodID) => {
        setSelectedFoodID(selectedFood => selectedFood === foodID ? null : foodID);
    };

    // Funktion zum Öffnen des Bearbeitungsmodals.
    const OpenModal = () => {
        if (selectedFoodID !== null) {
            setEditIngredient(true)
            const selectedItem = foodsDatabase.find(food => food.FoodID === selectedFoodID);
            if (selectedItem) {
                setSelectedFoodName(selectedItem.Name);
            }
        }
    }

    // Funktion zum Schließen des Bearbeitungsmodals.
    const CloseModal = () => {
        setEditIngredient(false)
        setSelectedFoodID(null)
    }

    // Funktion zum Aktualisieren eines Lebensmittels in der Datenbank.
    const UpdateFoodInDatabase = async () => {
        await updateFood(selectedFoodID, selectedFoodName)
        setSelectedFoodID(null)
        CloseModal()
    }

    // Navigationsfunktionen zu anderen Bildschirmen.
    const navigateToDatabaseMenuScreen = () => {
        navigation.navigate('DatabaseMenuScreen');
    };
    const navigateToAddFoodToLibraryScreen = () => {
        navigation.navigate('AddFoodToLibraryScreen');
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <MarginComponent marginTop={10}/>
                    <Title title={"Food library"} showDateContainer={false} showSubtitle={true} subtitleText={'Saved food'} subtitleTextColor={colors.food}/>
                    <GenericModal isVisible={editIngredient}>
                        <InputComponent title={'Name of the food'} borderColor={colors.food} showButton={false} textInputValue={selectedFoodName} onChangeText={setSelectedFoodName}/>
                        <MarginComponent marginBottom={10}/>
                        <FinishOrBackControl colorArrowButton={colors.food} colorTaskButton={colors.food} textColorTaskButton={colors.black} titleTaskButton={'Save'} showSaveSymbol={true} onPressTaskButton={UpdateFoodInDatabase} onPressArrowButton={CloseModal}/>
                    </GenericModal>
                    <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>            
                        <View style={styles.ingredientBox}>
                            {foodsDatabase.map((food) => {
                                return (
                                    <Ingredients 
                                        key={food.FoodID}
                                        title={food.Name}
                                        backgroundColor={colors.food}
                                        isPressable={true}
                                        textColor={colors.black}
                                        onPress={() => DeleteFoodFromDatabase(food.FoodID)}
                                        onPressIngredient={() => handleSelectIngredient(food.FoodID)}
                                        isActive={selectedFoodID === food.FoodID}
                                    />
                                );
                            })}
                        </View>
                    </ScrollView>
                    <View>
                        {(selectedFoodID !== null) &&(
                            <TaskActionButton title={'Edit selected food'} buttonColor={colors.black} textColor={colors.white} showSymbol={false} onPress={OpenModal}/>
                        )}
                        <MarginComponent marginBottom={10}/>
                        <FinishOrBackControl titleTaskButton={'Add food to library'} textColorTaskButton={colors.black} colorTaskButton={colors.food} colorArrowButton={colors.food} onPressArrowButton={navigateToDatabaseMenuScreen} onPressTaskButton={navigateToAddFoodToLibraryScreen}/>
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
    ingredientBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
    }
});

export default FoodLibraryScreen;