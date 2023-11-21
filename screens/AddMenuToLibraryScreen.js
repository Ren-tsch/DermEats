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
import { addMenu, addMenuItem } from '../database/databaseOperations';

const AddMenuToLibraryScreen = () => {

    const navigation = useNavigation();

    const [menuDescription, setMenuDescription] = useState('')
    const [foodDescription, setFoodDescription] = useState('')
    const [menuIngredients, setMenuIngredients] = useState([])
    const [editMenuName, setEditMenuName] = useState(true)
    const [showChangeMenuName, setShowChangeMenuName] = useState(false)
    const [selectedFoodId, setSelectedFoodId] = useState(null);

    const AddMenuIngredientsToSummary = () => {
        if (menuDescription && foodDescription !== '') {
            const newIngredient = {
                menuName: menuDescription.trimEnd(),
                foodName: foodDescription.trimEnd(),
                foodID: selectedFoodId
            }

            setMenuIngredients(() => {
            const updatedIngredients = [...menuIngredients, newIngredient]
            return updatedIngredients
            })

            setFoodDescription('')
            setEditMenuName(false)
            setSelectedFoodId(null)

        } else {
            Alert.alert(
                "Input error",
                "Please enter a meal name and a food name.",
                [
                    { text: "OK"}
                ],
                { cancelable: false }
            );
        }
        Keyboard.dismiss();
    }

    

    const EditMenuName = () => {
        if (menuDescription !== '') {
            setEditMenuName(!editMenuName)
            setShowChangeMenuName(!showChangeMenuName)
        } else {
            Alert.alert(
                "Input error",
                "Please enter a meal name",
                [
                    { text: "OK"}
                ],
                { cancelable: false }
            );
        }
        
    }

    const DeleteIngredientFromSummary = (index) => {
        const newMenuIngredients = [...menuIngredients]
        newMenuIngredients.splice(index,1)
        setMenuIngredients(newMenuIngredients)
    }

    // Speichert die ID des ausgewählten Lebensmittels aus dem InputComponent
    const handleSelectFoodItem = (id) => {
        setSelectedFoodId(id);
    };

    const navigateToDatabaseMenuScreen = () => {
        navigation.navigate('DatabaseMenuScreen');
    };

    //Neues Menü zur Datenbank hinzufügen
    const addMenuToDatabase = async () => {
        try {
            const menuResult = await addMenu(menuDescription);
            const newMenuID = menuResult.insertId;
    
            //Hinzufügen der Lebensmittel des Menüs zu MenuItems
            for (const ingredient of menuIngredients) {
                let foodID = null;
                let foodName = null;
    
                if (ingredient.foodID) {
                    foodID = ingredient.foodID; // ID des Lebensmittels aus der Datenbank
                } else {
                    foodName = ingredient.foodName; // Name des Lebensmittels, das nicht in der Datenbank ist
                }
    
                await addMenuItem(newMenuID, foodID, foodName);
            }
    
            //Leeren der Zutatenliste
            setMenuIngredients([]);
            setMenuDescription('');
            setEditMenuName(true);
    
            console.log("Menü erfolgreich zur Datenbank hinzugefügt.");
        } catch (error) {
            console.error("Fehler beim Hinzufügen des Menüs:", error);
        }
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <MarginComponent marginTop={10}/>
                    <Title title={"Add new menu to library"} subtitleText={'Add menu'} subtitleTextColor={colors.menu} showDateContainer={false} showSubtitle={true}/>
                    <View>
                        {editMenuName && (
                            <InputComponent title={'Name of the menu'} placeholder={'Enter menu name'} onChangeText={setMenuDescription} textInputValue={menuDescription} showButton={showChangeMenuName} actionButtonTitle={'Change menu name'} onActionPress={EditMenuName} borderColor={colors.menu}/>
                        )}
                        <MarginComponent marginTop={10}/>
                        <InputComponent title={'Menu ingredient'} titleColor={colors.food} placeholder={'Enter food'} onChangeText={setFoodDescription} textInputValue={foodDescription} showButton={true} borderColor={colors.food} actionButtonTitle={'Add ingredient'} backgroundColorSuggestions={colors.food} showSuggestions={true} onActionPress={AddMenuIngredientsToSummary} onSelectFoodItem={handleSelectFoodItem}/>
                        <MarginComponent marginTop={10}/>
                    </View>
                    <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
                        {(!editMenuName) && (
                            <IngredientContainer title={menuDescription} showDelete={false} showEdit={true} showUnderline={false} titleColor={colors.menu} fontSize={RFValue(22)} onPressEdit={EditMenuName}/>
                        )}
                        <View style={styles.ingredientBox}>
                            {menuIngredients.map((ingredients, index) => {
                                return (
                                    <Ingredients 
                                        key={index}
                                        title={`${ingredients.foodName}`}
                                        backgroundColor={colors.food}
                                        textColor={colors.black}
                                        onPress={() => DeleteIngredientFromSummary(index)}
                                    />
                                );
                            })}
                        </View>
                    </ScrollView>
                    <FinishOrBackControl titleTaskButton={'Save to database'} textColorTaskButton={colors.black} colorTaskButton={colors.menu} showTaskButton={(menuIngredients.length > 0)} colorArrowButton={colors.menu} showSaveSymbol={true} onPressArrowButton={navigateToDatabaseMenuScreen} onPressTaskButton={addMenuToDatabase}/>
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

export default AddMenuToLibraryScreen;