import React, {useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import NoLogsScreen from '../components/NoLogsScreen'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Title from '../components/Title';
import Navbar from '../components/Navbar'
import MarginComponent from '../components/MarginComponent';
import LoadingScreen from '../components/LoadingScreen';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from '../components/colors';
import { getAllNonCataloguedFoodByDailyLogId, getDailyLogDetailsByTimestamp, getDailyLogFoodItemsByLogId, getDayliLogMenusByLogId, getFoodNameById, searchMenuById, getSymptomsByDate, searchMenuByName, addDailyLogFoodItem, addDailyLogMenu, addNonCataloguedFood, deleteDailyLogFoodItem, deleteDailyLogMenu, deleteNonCataloguedFoodByNameAndLogId } from '../database/databaseOperations';
import { useDate } from '../context/DateContext';
import IngredientContainer from '../components/IngredientContainer';
import MealIngredients from '../components/MealIngredients'
import Ingredients from '../components/Ingredients';
import GenericModal from '../components/GenericModal'
import FinishOrBackControl from '../components/FinishOrBackControl';
import InputComponent from '../components/InputComponent';
import differenceWith from 'lodash/differenceWith';
import isEqual from 'lodash/isEqual';

const StartScreen = () => {

    const navigation = useNavigation(); // Hook für die Navigation innerhalb der App.
    const { currentDate } = useDate(); // Custom Hook aus dem DateContext, der das aktuelle Datum bereitstellt.

    const [isLoading, setIsLoading] = useState(null) // Verwaltet, ob Daten gerade geladen werden.
    const [noEntries, setNoEntries] = useState(true) // Zeigt an, ob für den aktuellen Tag Einträge vorhanden sind.
    const [breakfastLogs, setBreakfastLogs] = useState({nonCataloguedFood: [], foodItems: [], menus: []}) // Verwaltet Daten für das Frühstück.
    const [lunchLogs, setLunchLogs] = useState({nonCataloguedFood: [], foodItems: [], menus: []}) // Verwaltet Daten für das Mittagessen.
    const [dinnerLogs, setDinnerLogs] = useState({nonCataloguedFood: [], foodItems: [], menus: []}) // Verwaltet Daten für das Abendessen.
    const [todaysSymptoms, setTodaysSymptoms] = useState([]) // Verwaltet Symptome für den aktuellen Tag.
    const [snackLogs, setSnackLogs] = useState([]) // Verwaltet Snack-Daten.
    const [editMeal, setEditMeal] = useState(false) // Verwaltet den Zustand, ob gerade eine Mahlzeit bearbeitet wird.
    const [modalData, setModalData] = useState({nonCataloguedFood: [], foodItems: [], menus: []})  // Verwaltet Daten für das Modal, das zur Bearbeitung von Mahlzeiten verwendet wird.
    const [foodDescription, setFoodDescription] = useState('')  // Verwaltet die Beschreibung des eingegebenen Textes im Lebensmittelinput.
    const [menuDescription, setMenuDescription] = useState('') // Verwaltet die Beschreibung des eingegebenen Textes im Menuinput.
    const [selectedFoodId, setSelectedFoodId] = useState() // Verwaltet die ID des ausgewählten Lebensmittels.
    const [selectedMenuId, setSelectedMenuId] = useState() // Verwaltet die ID des ausgewählten Menüs.
    const [itemsToRemove, setItemsToRemove] = useState([]) // Verwaltet die Elemente, die entfernt werden sollen.
    const [itemsToAdd, setItemsToAdd] = useState([]) // Verwaltet die Elemente, die hinzugefügt werden sollen.
    const [mealInformation, setMealInformation] = useState({}) // Verwaltet Informationen zur aktuellen Mahlzeit.

    // Funktion zur Navigation zur 'SelectionScreen' Komponente.
    const navigateToSelectionScreen = () => {
        navigation.navigate('SelectionScreen');
    };

    // useEffect Hook, um Daten bei Änderung des Datums oder des Bearbeitungsstatus neu zu laden.
    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
    
        // Asynchrone Funktion, um die täglichen Log-Daten abzurufen und zu verarbeiten.
        const fetchEntry = async () => {
            if (!isMounted) return;
    
            try {
                const existingEntry = await getDailyLogDetailsByTimestamp(currentDate);
                const existingSymptoms = await getSymptomsByDate(currentDate);
    
                const enrichedEntries = await Promise.all(existingEntry.map(async (entry) => {
                    if (!isMounted) return;
                    return await enrichEntryWithDetails(entry);
                }));
    
                if (!isMounted) return;
                
                // Temporäre Speicherung für Mahlzeiten-Logs.
                let tempSnackLogs = [];
                let tempBreakfastLog = {nonCataloguedFood: [], foodItems: [], menus: []};
                let tempLunchLog = {nonCataloguedFood: [], foodItems: [], menus: []}
                let tempDinnerLog = {nonCataloguedFood: [], foodItems: [], menus: []}

            // Verteilung der Einträge auf die entsprechenden Mahlzeiten.
            enrichedEntries.forEach(entry => {
                switch (entry.mealName) {
                    case 'Snack':
                        tempSnackLogs.push(entry);
                        break;
                    case 'Breakfast':
                        tempBreakfastLog = entry;
                        break;
                    case 'Lunch':
                        tempLunchLog = entry;
                        break;
                    case 'Dinner':
                        tempDinnerLog = entry;
                        break;
                }
            });

                // Aktualisierung der State Hooks mit den neuen Daten.
                if (isMounted) {
                    setSnackLogs(tempSnackLogs);
                    setBreakfastLogs(tempBreakfastLog)
                    setLunchLogs(tempLunchLog)
                    setDinnerLogs(tempDinnerLog)
                    setTodaysSymptoms(existingSymptoms);

                    // Überprüfung, ob alle Arrays leer sind, um den noEntries State zu aktualisieren.
                    const entriesEmpty = areAllArraysEmpty({
                        breakfastLogs: tempBreakfastLog,
                        lunchLogs: tempLunchLog,
                        dinnerLogs: tempDinnerLog,
                        snackLogs: tempSnackLogs,
                        todaysSymptoms: existingSymptoms
                    });
                
                    setNoEntries(entriesEmpty);
                }
            } catch (error) {
                console.error("Fehler beim Abrufen der DailyLog-Einträge:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
            
        };
    
        fetchEntry();
    
        return () => {
            isMounted = false;
        };
    }, [currentDate, editMeal]);


    
    // Funktion, um Einträge mit zusätzlichen Details anzureichern.
    const enrichEntryWithDetails = async (entry) => {
        const logID = entry.LogID;
        const mealName = entry.MealName;
    
        const foodItemsData = await getDailyLogFoodItemsByLogId(logID);
        const menusData = await getDayliLogMenusByLogId(logID);
        const nonCataloguedFood = await getAllNonCataloguedFoodByDailyLogId(logID);

        const foodItems = await Promise.all(foodItemsData.map(async food => {
            const name = await getFoodNameById(food.FoodID);
            return { ...food, name };
        }));
        const menus = await Promise.all(menusData.map(async menu => {
            const name = await searchMenuById(menu.MenuID);
            return { ...menu, name };
        }));
    
        return { logID, mealName, foodItems, menus, nonCataloguedFood };
    };

    // Funktion, um zu überprüfen, ob alle Mahlzeiten- und Symptom-Arrays leer sind.
    const areAllArraysEmpty = (mealTimeLogs) => {
        return Object.values(mealTimeLogs).every(logs => {
            if (Array.isArray(logs)) {
                return logs.length === 0;
            } else {
                return Object.values(logs).every(array => array.length === 0);
            }
        });
    };

    // Funktion, um den State zurückzusetzen, wenn der Pfeil gedrückt wird.
    const handleArrowPush = () => {
        setBreakfastLogs({nonCataloguedFood: [], foodItems: [], menus: []})
        setLunchLogs({nonCataloguedFood: [], foodItems: [], menus: []})
        setDinnerLogs({nonCataloguedFood: [], foodItems: [], menus: []})
        setSnackLogs([])
        setTodaysSymptoms([])
        setNoEntries(false)
    }

    // Funktion, um das Modal zum Bearbeiten oder Hinzufügen von Mahlzeiten zu öffnen.
    const openModal = (mealLogs) => {
        setModalData(mealLogs)
        setEditMeal(true)
        setMealInformation({LogID: mealLogs.logID, MealName: mealLogs.mealName})
    }

    // Funktion, um das Bearbeitungsmodal zu schließen.
    const closeModal = () => {
        setEditMeal(false)
        setFoodDescription('')
        setMenuDescription('')
        setSelectedFoodId()
        setSelectedMenuId()
        setModalData({nonCataloguedFood: [], foodItems: [], menus: []})
        setItemsToAdd([])
        setItemsToRemove([])
    }

    // Speichert die ID des ausgewählten Lebensmittels aus dem InputComponent im GenericModal
    const handleSelectFoodItem = (id) => {
        setSelectedFoodId(id);
    };

    // Speichert die ID des ausgewählten Menüs aus dem InputComponent im GenericModal
    const handleSelectMenuItem = (id) => {
        setSelectedMenuId(id);
    }

    // Funktion zum Hinzufügen von Zutaten zur Zusammenfassung im Modal.
    const AddIngredientsToSummary = async (logID, mealName) => {
        const newModalData = {
            ...modalData,
            nonCataloguedFood: [...modalData.nonCataloguedFood],
            foodItems: [...modalData.foodItems],
            menus: [...modalData.menus]
        };
        
        let newItemToAdd = null

        // Logik zum Hinzufügen von nicht katalogisierten Lebensmitteln, Lebensmitteln oder Menüs basierend auf Benutzereingaben.
        if (!selectedFoodId && !selectedMenuId && (foodDescription)) {
            newItemToAdd = {Name: foodDescription}
            newModalData.nonCataloguedFood.push({Name: foodDescription})    
        } else if (selectedFoodId && !selectedMenuId && (foodDescription)) {
            newItemToAdd = {FoodID: selectedFoodId, LogID: logID, Name: foodDescription};
            newModalData.foodItems.push({FoodID: selectedFoodId, LogID: logID, Name: foodDescription})
        } else if (menuDescription) {
            const menuIsInDatabase = await searchForMenuInDatabase()
            if (menuIsInDatabase) {
                newItemToAdd = {LogID: logID, MenuID: selectedMenuId, Name: menuDescription};
                newModalData.menus.push({LogID: logID, MenuID: selectedMenuId, Name: menuDescription})
            }    
        }

        // Aktualisiert die Listen mit hinzuzufügenden und aktuellen Modal-Daten.
        if (newItemToAdd) {
            setItemsToAdd(prevItems => [...prevItems, newItemToAdd]);
        }
        setModalData(newModalData)
        setFoodDescription('')
        setMenuDescription('')
        setSelectedFoodId()
        setSelectedMenuId()
    }

    // Funktion zur Überprüfung, ob ein Menü in der Datenbank vorhanden ist.
    const searchForMenuInDatabase = async () => {
        const returnedMenuArray = await searchMenuByName(menuDescription);
        
        const exactMatch = returnedMenuArray.some(menu => menu.name === menuDescription);

        if (!exactMatch){
            Alert.alert(
                "Menu was not found",
                "Please select a menu that is available in the database and appears in the drop-down list.",
                [
                    { text: "OK"}
                ],
                { cancelable: false }
            );

            return(false)
        } else {
            return(true)
        }
    }

    // Funktion zum Löschen einer Zutat aus der Zusammenfassung.
    const DeleteIngredientFromSummary = (index, mealName, item) => {
        const newModalData = {
            ...modalData,
            nonCataloguedFood: [...modalData.nonCataloguedFood],
            foodItems: [...modalData.foodItems],
            menus: [...modalData.menus]

        };

        newModalData[mealName].splice(index, 1);
        setModalData(newModalData)
        setItemsToRemove(prevItems => [...prevItems, item]);
    }

    // Funktion zum Aktualisieren der Datenbank basierend auf den Änderungen im Modal.
    const UpdateDatabase = async () => {
        const {added, removed} = findDifferences(itemsToRemove, itemsToAdd)

        if (added.length > 0) {
            for (let index = 0; index < added.length; index++) {
                if (added[index].FoodID) {
                    await addDailyLogFoodItem(mealInformation.LogID, added[index].FoodID)
                } else if (added[index].MenuID) {
                    await addDailyLogMenu(mealInformation.LogID, added[index].MenuID)
                } else {
                    await addNonCataloguedFood(mealInformation.LogID, added[index].Name)
                }
            }
        }

        if (removed.length > 0) {
            for (let index = 0; index < removed.length; index++) {
                if (removed[index].FoodID) {
                    await deleteDailyLogFoodItem(mealInformation.LogID, removed[index].FoodID)
                } else if (removed[index].MenuID) {
                    await deleteDailyLogMenu(mealInformation.LogID, removed[index].MenuID)
                } else {
                    await deleteNonCataloguedFoodByNameAndLogId(mealInformation.LogID, removed[index].Name)
                }   
            }
        }
        closeModal()
        setMealInformation({})
    }

    // Funktion zum Finden von Unterschieden zwischen zwei Arrays.
    const findDifferences = (array1, array2) => {
        const added = differenceWith(array2, array1, isEqual)
        const removed = differenceWith(array1, array2, isEqual)

        return {added, removed}
    }

    // Setzt die Modal-Farbe basierend auf der Mahlzeit.
    let modalColor;
    if (modalData) {
        modalColor = modalData.mealName === 'Breakfast'
        ? colors.breakfast
        : modalData.mealName === 'Lunch'
        ? colors.lunch
        : modalData.mealName === 'Dinner'
        ? colors.dinner
        : colors.snack
}

    return (
    <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <MarginComponent marginTop={10}/>
                <Title title={"Today's entries"} onPushLeftArrow={handleArrowPush} onPushRightArrow={handleArrowPush}/>
                <MarginComponent marginBottom={10}/>
                {isLoading && (
                    <LoadingScreen/>
                )}
                {noEntries && !isLoading &&(
                        <NoLogsScreen onAddPress={navigateToSelectionScreen}/>
                )}
                {!isLoading && !noEntries &&(
                <ScrollView showsVerticalScrollIndicator={false}>
                    {!(areAllArraysEmpty(breakfastLogs)) && (
                        <>
                            <IngredientContainer title={breakfastLogs.mealName} titleColor={colors.breakfast} fontSize={RFValue(22)} onPressEdit={() => openModal(breakfastLogs)}/>
                            <MarginComponent marginBottom={5}/>
                            <View style={styles.ingredientBox}>                   
                                <MealIngredients items={breakfastLogs.nonCataloguedFood} backgroundColor={colors.breakfast} textColor={colors.white} showSvg={false}/>
                                <MealIngredients items={breakfastLogs.foodItems} backgroundColor={colors.breakfast} textColor={colors.white} showSvg={false}/>
                                <MealIngredients items={breakfastLogs.menus} backgroundColor={colors.menu} textColor={colors.white} showSvg={false}/>
                            </View>
                            <MarginComponent marginBottom={RFValue(20)}/>
                        </>
                    )}
                    {!(areAllArraysEmpty(lunchLogs)) && (
                        <>
                            <IngredientContainer title={lunchLogs.mealName} titleColor={colors.lunch} fontSize={RFValue(22)} onPressEdit={() => openModal(lunchLogs)}/>
                            <MarginComponent marginBottom={5}/>
                            <View style={styles.ingredientBox}>                   
                                <MealIngredients items={lunchLogs.nonCataloguedFood} backgroundColor={colors.lunch} textColor={colors.white} showSvg={false}/>
                                <MealIngredients items={lunchLogs.foodItems} backgroundColor={colors.lunch} textColor={colors.white} showSvg={false}/>
                                <MealIngredients items={lunchLogs.menus} backgroundColor={colors.menu} textColor={colors.white} showSvg={false}/>
                            </View>
                            <MarginComponent marginBottom={RFValue(20)}/>
                        </>
                    )}
                    {!(areAllArraysEmpty(dinnerLogs)) && (
                        <>
                            <IngredientContainer title={dinnerLogs.mealName} titleColor={colors.dinner} fontSize={RFValue(22)} onPressEdit={() => openModal(dinnerLogs)}/>
                            <MarginComponent marginBottom={5}/>
                            <View style={styles.ingredientBox}>                   
                                <MealIngredients items={dinnerLogs.nonCataloguedFood} backgroundColor={colors.dinner} textColor={colors.white} showSvg={false}/>
                                <MealIngredients items={dinnerLogs.foodItems} backgroundColor={colors.dinner} textColor={colors.white} showSvg={false}/>
                                <MealIngredients items={dinnerLogs.menus} backgroundColor={colors.menu} textColor={colors.white} showSvg={false}/>
                            </View>
                            <MarginComponent marginBottom={RFValue(20)}/>
                        </>
                    )}
                    {snackLogs.map((snack, index) => (
                        <React.Fragment key={index}>
                            <IngredientContainer title={snack.mealName} titleColor={colors.snack} fontSize={RFValue(22)} onPressEdit={() => openModal(snackLogs[index])}/>
                            <MarginComponent marginBottom={5}/>
                            <View style={styles.ingredientBox}>                   
                                <MealIngredients items={snack.nonCataloguedFood} backgroundColor={colors.snack} textColor={colors.white} showSvg={false}/>
                                <MealIngredients items={snack.foodItems} backgroundColor={colors.snack} textColor={colors.white} showSvg={false}/>
                                <MealIngredients items={snack.menus} backgroundColor={colors.menu} textColor={colors.white} showSvg={false}/>
                            </View>
                            <MarginComponent marginBottom={RFValue(20)}/>
                        </React.Fragment>
                    ))}
                    {!(areAllArraysEmpty(todaysSymptoms)) && (
                        <>
                            <IngredientContainer title={'Symptoms'} titleColor={colors.symptom} fontSize={RFValue(20)}/>
                            <MarginComponent marginBottom={5}/>
                            <View style={styles.ingredientBox}>
                                {todaysSymptoms.map((symptom, index) => (
                                    <Ingredients key={index} title={symptom.Name} backgroundColor={symptom.Strenght == 'weak' ? colors.symptomWeak : (symptom.Strenght == 'medium' ? colors.symptomMiddle : colors.symptomStrong)} textColor={symptom.Strenght == 'medium' ? colors.black : colors.white} showSvg={false}/>
                                ))}
                            </View>
                            <MarginComponent marginBottom={RFValue(20)}/>
                        </>
                    )}
                </ScrollView>
                )}
                {editMeal && (
                    <GenericModal isVisible={editMeal}>
                        <IngredientContainer title={modalData.mealName} titleColor={modalColor} fontSize={RFValue(22)} showEdit={false} showDelete={false} showUnderline={false}/>
                        <View style={{ maxHeight: RFValue(330) }}>
                            <InputComponent title={'Food'} placeholder={'Search for food / add new food'} textInputValue={foodDescription} onChangeText={setFoodDescription} backgroundColorSuggestions={colors.food} showButton={foodDescription.length > 0} actionButtonTitle={'Add food'} titleColor={colors.food} borderColor={colors.food} showSuggestions={true} onSelectFoodItem={handleSelectFoodItem} onActionPress={() => AddIngredientsToSummary(modalData.logID, modalData.mealName)}/>
                            <MarginComponent marginTop={5}/>
                            <InputComponent title={'Menu'} placeholder={'Search for a menu'} showButton={menuDescription.length > 0} actionButtonTitle={'Add menu'} textInputValue={menuDescription} onChangeText={setMenuDescription} titleColor={colors.menu} borderColor={colors.menu} showSuggestions={true} showMenuSuggestion={true} backgroundColorSuggestions={colors.menu} onSelectMenuItem={handleSelectMenuItem} onActionPress={() => AddIngredientsToSummary(modalData.logID, modalData.mealName)}/>
                            <MarginComponent marginTop={5}/>
                            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled' style={styles.scrollViewFoods}>
                                <IngredientContainer title={'Summary'} fontSize={RFValue(18)} showDelete={false} showEdit={false} showUnderline={false}/>
                                <View style={styles.ingredientBox}> 
                                        <MealIngredients category={'nonCataloguedFood'} items={modalData.nonCataloguedFood} backgroundColor={modalColor} textColor={colors.white} onPress={DeleteIngredientFromSummary}/>
                                        <MealIngredients category={'foodItems'} items={modalData.foodItems} backgroundColor={modalColor} textColor={colors.white} onPress={DeleteIngredientFromSummary}/>
                                        <MealIngredients category={'menus'} items={modalData.menus} backgroundColor={colors.menu} textColor={colors.white} onPress={DeleteIngredientFromSummary}/>
                                </View>
                            </ScrollView>
                        </View>
                        <MarginComponent marginBottom={10}/>
                        <FinishOrBackControl 
                            showSaveSymbol={true}
                            titleTaskButton={'Save'}
                            colorTaskButton={modalColor}
                            textColorTaskButton={colors.white}
                            colorArrowButton={modalColor}
                            onPressArrowButton={closeModal}
                            onPressTaskButton={UpdateDatabase}
                        />
                    </GenericModal>
                )}
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
        
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: RFValue(20),
    },
    ingredientBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    scrollViewFoods: {
        maxHeight: RFValue(180),
    },
});

export default StartScreen;