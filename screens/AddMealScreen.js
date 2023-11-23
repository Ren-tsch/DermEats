import React, {useEffect, useState} from 'react';
import { ScrollView, View, StyleSheet, Alert, Keyboard } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Title from '../components/Title';
import Navbar from '../components/Navbar';
import InputComponent from '../components/InputComponent';
import MarginComponent from '../components/MarginComponent';
import IngredientContainer from '../components/IngredientContainer';
import FinishOrBackControl from '../components/FinishOrBackControl';
import MealTypeSelector from '../components/MealTypeSelector';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from '../components/colors';
import Ingredients from '../components/Ingredients';
import { addDailyLog, addDailyLogFoodItem, addDailyLogMenu, addFood, searchMenuByName } from '../database/databaseOperations';
import { useDate } from '../context/DateContext';


const AddMealScreen = () => {

    const navigation = useNavigation();
    const { currentDate } = useDate();

    const [mealInformation, setMealInformation] = useState([])
    const [mealSelected, setMealSelected] = useState(false)
    const [foodDescription, setFoodDescription] = useState('')
    const [menuDescription, setMenuDescription] = useState('')
    const [selectedFoodId, setSelectedFoodId] = useState()
    const [selectedMenuId, setSelectedMenuId] = useState()
    const [mealIngredients, setMealIngredients] = useState([])
    const [showSaveButton, setShowSaveButton] = useState(false)
    
    const navigateToSelectionScreen = () => {
        navigation.navigate('SelectionScreen');
    };

    useEffect(() => {
        if (mealIngredients.length > 0) {
            setShowSaveButton(true)
        } else {
            setShowSaveButton(false)
        }
    }), [mealIngredients]

    const AddIngredientsToSummary = async () => {
        const returnedMenuArray = await searchMenuByName(menuDescription)
        if (returnedMenuArray.length < 1){
            Alert.alert(
                "Menu was not found",
                "Please select a menu that is available in the database and appears in the drop-down list.",
                [
                    { text: "OK"}
                ],
                { cancelable: false }
            );
        }

        else if ((foodDescription !== '' || returnedMenuArray.length > 0) && mealSelected) {
            const newIngredient = {
                foodName: foodDescription.trimEnd(),
                foodID: selectedFoodId,
                menuName: menuDescription.trimEnd(),
                menuID: selectedMenuId,
            }

            setMealIngredients(() => {
            const updatedIngredients = [...mealIngredients, newIngredient]
            return updatedIngredients
            })

            setFoodDescription('')
            setMenuDescription('')
            setSelectedFoodId(null)
            setSelectedMenuId(null)

        } else {
            Alert.alert(
                "Meal time was not selected",
                "Before a meal or menu can be added, the meal time must first be selected.",
                [
                    { text: "OK"}
                ],
                { cancelable: false }
            );
        }
        Keyboard.dismiss();
    }

    const DeleteIngredientFromSummary = (index) => {
        const newMealIngredients = [...mealIngredients]
        newMealIngredients.splice(index,1)
        setMealIngredients(newMealIngredients)
    }

    const SaveMealToDatabase = async () => {
        const formattedDate = currentDate.toISOString().split('T')[0];
        const mealName = mealInformation.Meal

        try {
            const dailyLogId = await addDailyLog(formattedDate, mealName);
            
            for (let index = 0; index < mealIngredients.length; index++) {
                if (mealIngredients[index].menuID != undefined) {
                    await addDailyLogMenu(dailyLogId, mealIngredients[index].menuID)
                } if (mealIngredients[index].foodID != undefined) {
                    await addDailyLogFoodItem(dailyLogId, mealIngredients[index].foodID)
                } if (mealIngredients[index].foodID == undefined && mealIngredients[index].foodName != ""){
                   const newFoodId = await addFood(mealIngredients[index].foodName)
                   await addDailyLogFoodItem(dailyLogId, newFoodId)
                }     
            }
        } catch (error) {
        console.error("Fehler beim Hinzufügen des Log-Eintrags:", error);
        }
        setMealInformation([])
        setMealSelected(false)
        setMealIngredients([])
        setShowSaveButton(false)
    }

    // Speichert die ID des ausgewählten Lebensmittels aus dem InputComponent
    const handleSelectFoodItem = (id) => {
        setSelectedFoodId(id);
    };

    // Speichert die ID des ausgewählten Menüs aus dem InputComponent
    const handleSelectMenuItem = (id) => {
        setSelectedMenuId(id);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <MarginComponent marginTop={10}/>
                    <Title title={"Add meal"} showArrows={false}/>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                        <MarginComponent marginTop={10}/>
                        <MealTypeSelector title={'Meal time'} onPressedButton={(mealInfo) => {setMealInformation(mealInfo), setMealSelected(true)}}/>
                        <MarginComponent marginTop={5}/>
                        <View>
                            <InputComponent title={'Food'} placeholder={'Search for food / add new food'} textInputValue={foodDescription} onChangeText={setFoodDescription} backgroundColorSuggestions={colors.food} showButton={true} actionButtonTitle={'Add food'} titleColor={colors.food} borderColor={colors.food} showSuggestions={true} onSelectFoodItem={handleSelectFoodItem} onActionPress={AddIngredientsToSummary}/>
                            <MarginComponent marginTop={5}/>
                            <InputComponent title={'Menu'} placeholder={'Search for a menu'} showButton={true} actionButtonTitle={'Add menu'} textInputValue={menuDescription} onChangeText={setMenuDescription} titleColor={colors.menu} borderColor={colors.menu} showSuggestions={true} showMenuSuggestion={true} backgroundColorSuggestions={colors.menu} onSelectMenuItem={handleSelectMenuItem} onActionPress={AddIngredientsToSummary}/>
                        </View>
                        <MarginComponent marginTop={10}/>
                        {mealSelected &&(
                            <IngredientContainer title={mealInformation.Meal} titleColor={mealInformation.Color} showUnderline={false} showEdit={false} fontSize={RFValue(22)} showDelete={false}/>
                        )}
                        
                        <View style={styles.ingredientBox}>
                            {mealIngredients.map((ingredients, index) => {
                                return(
                                    <Ingredients
                                    key={index}
                                    title={ingredients.foodName ? ingredients.foodName : ingredients.menuName}
                                    backgroundColor={ingredients.foodName ? colors.food : colors.menu}
                                    textColor={colors.black}
                                    onPress={() => DeleteIngredientFromSummary(index)}
                                    />
                                )
                            })}
                        </View>
                    </ScrollView>
                    <FinishOrBackControl titleTaskButton={'Save'} colorTaskButton={mealInformation.Color} textColorTaskButton={colors.white} colorArrowButton={mealInformation.Color} showSaveSymbol={true} showTaskButton={showSaveButton} onPressArrowButton={navigateToSelectionScreen} onPressTaskButton={SaveMealToDatabase}/>
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

export default AddMealScreen;