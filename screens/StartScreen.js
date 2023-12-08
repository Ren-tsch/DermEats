import React, {useState, useEffect, useCallback} from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, Alert, Text } from 'react-native';
import NoLogsScreen from '../components/NoLogsScreen'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Title from '../components/Title';
import Navbar from '../components/Navbar'
import MarginComponent from '../components/MarginComponent';
import LoadingScreen from '../components/LoadingScreen';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from '../components/colors';
import { getAllNonCataloguedFoodByDailyLogId, getDailyLogDetailsByTimestamp, getDailyLogFoodItemsByLogId, getDayliLogMenusByLogId, getFoodNameById, searchMenuById, getSymptomsByDate, searchMenuByName, addDailyLogFoodItem, addDailyLogMenu, addNonCataloguedFood, deleteDailyLogFoodItem, deleteDailyLogMenu, deleteNonCataloguedFoodByNameAndLogId, addSymptom, deleteSymptom, deleteDailyLogMenuByID, deleteDailyLogFoodItemByID, deleteNonCataloguedFoodByLogId, deleteDailyLog, deleteSymptomsByDate } from '../database/databaseOperations';
import { useDate } from '../context/DateContext';
import IngredientContainer from '../components/IngredientContainer';
import MealIngredients from '../components/MealIngredients'
import Ingredients from '../components/Ingredients';
import GenericModal from '../components/GenericModal'
import FinishOrBackControl from '../components/FinishOrBackControl';
import InputComponent from '../components/InputComponent';
import SymptomIntensity from '../components/SymptomIntensity'
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
    const [editSymptoms, setEditSymptoms] = useState(false) // Verwaltet den Zustand, ob die Symptome bearbeitet werden.
    const [symptomDescription, setSymptomDescription] = useState('') // Verwaltet die Beschreibung des eingegebenen Textes im Symptominput.
    const [symptomIntensity, setSymptomIntensity] = useState('') // Verwaltet die Intensität des Symptoms.
    const [symptomModalData, setSymptomModalData] = useState([]) // Verwaltet Daten für das Modal, das zur Bearbeitung von Symptomen verwendet wird.
    const [openModalToDelete, setOpenModalToDelete] = useState(false) // Verwaltet den Zustand, ob das Delete Modal geöffnet werden soll.
    const [selectedLogToDelete, setSelectedLogToDelete] = useState(false) // Verwaltet die LogID der Mahlzeiten- oder das Datum der Symptomeinträge um diese zu löschen.
    const [reloadSite, setReloadSite] = useState(true) // Verwaltet den Zustand, wann die Seite neu gerendert werden soll.

    // Funktion zur Navigation zur 'SelectionScreen' Komponente.
    const navigateToSelectionScreen = () => {
        navigation.navigate('SelectionScreen');
    };

    // useFocusEffect Hook, der ausgeführt wird, wenn der Bildschirm fokussiert wird. 
    useFocusEffect(
        useCallback(() => {
            setReloadSite(prevState => !prevState);
        }, [])
    );

    // useEffect Hook, um Daten bei Änderung des Datums oder des Bearbeitungsstatus neu zu laden.
    useEffect(() => {
        let isMounted = true;
        if (!editMeal || reloadSite) {
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
            setReloadSite(false)
        
            return () => {
                isMounted = false;
            };
        }
    }, [reloadSite]);


    
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
        setReloadSite(true)
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
        setEditSymptoms(false)
        setFoodDescription('')
        setMenuDescription('')
        setSelectedFoodId()
        setSelectedMenuId()
        setModalData({nonCataloguedFood: [], foodItems: [], menus: []})
        setItemsToAdd([])
        setItemsToRemove([])
        setSymptomModalData([])
        setOpenModalToDelete(false)
        setReloadSite(true)
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

    // Funktion zum Öffnen des Symptom-Modals.
    const openSymptomModal = () => {
        setEditSymptoms(true)
        setSymptomModalData(todaysSymptoms)
    }

    // Funktion um ein Symptom im Modal zur Zusammenfassung hinzuzufügen.
    const addSymptomToSummary = () => {
        const newSymptomModalData = [...symptomModalData]
        newSymptomModalData.push({Name: symptomDescription, Strenght: symptomIntensity})
        setSymptomModalData(newSymptomModalData)
        setSymptomDescription('')
    }

    // Funktion um ein Symptom im Modal aus der Zusammenfassung zu entfernen.
    const deleteSymptomFromSummary = (index) => {
        const newSymptomModalData = [...symptomModalData]
        newSymptomModalData.splice(index, 1)
        setSymptomModalData(newSymptomModalData)
    }

    // Funktion zum Aktualisieren der Symptomdatenbank basierend auf den Änderungen im Modal.
    const updateSymptomDatabase = async () => {
        const {added, removed} = findDifferences(todaysSymptoms, symptomModalData)

        if (added.length > 0) {
            for (let index = 0; index < added.length; index++) {
                await addSymptom(added[index].Name, added[index].Strenght, currentDate )
            }   
        }

        if (removed.length > 0) {
            for (let index = 0; index < removed.length; index++) {
                await deleteSymptom(removed[index].SymptomID)
            }
        }

        closeModal()
    }

    // Funktion um das Modal für den Löschvorgang einer Mahlzeit- oder eines Symptomeintrages zu öffnen
    const openDeleteModal = (log) => {
        setSelectedLogToDelete(log)
        setOpenModalToDelete(true)
    }

    // Funktion um einen Mahlzeiten- oder Symptomeintrag zu löschen
    const deleteEntry = async () => {
        const isDateValid = (dateString) => {
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            return regex.test(dateString);
        };
    
        try {
            if (Number.isInteger(selectedLogToDelete.logID)) {
                await deleteDailyLogMenuByID(selectedLogToDelete.logID);
                await deleteDailyLogFoodItemByID(selectedLogToDelete.logID);
                await deleteNonCataloguedFoodByLogId(selectedLogToDelete.logID);
                await deleteDailyLog(selectedLogToDelete.logID);
                closeModal()
            }
            else if (isDateValid(selectedLogToDelete)) {
                await deleteSymptomsByDate(selectedLogToDelete);
                closeModal()
            }
        } catch (error) {
            console.error('Fehler beim Löschen des Eintrags:', error);
        }
        
    };

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

    // Setzt die Modal-Textfarbe basierend auf der zu löschenden Mahlzeit oder des Symptoms.
    const getColorByType = (type) => {
        const colors = {
            undefined: '#ED3241',
            Breakfast: '#568D6D',
            Lunch: '#31848D',
            Dinner: '#8D568B',
            Snack: '#8D8C56',
        };
      
        return colors[type];
      };

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
                            <IngredientContainer title={breakfastLogs.mealName} titleColor={colors.breakfast} fontSize={RFValue(22)} onPressEdit={() => openModal(breakfastLogs)} onPressDelete={() => openDeleteModal(breakfastLogs)}/>
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
                            <IngredientContainer title={lunchLogs.mealName} titleColor={colors.lunch} fontSize={RFValue(22)} onPressEdit={() => openModal(lunchLogs)} onPressDelete={() => openDeleteModal(lunchLogs)}/>
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
                            <IngredientContainer title={dinnerLogs.mealName} titleColor={colors.dinner} fontSize={RFValue(22)} onPressEdit={() => openModal(dinnerLogs)} onPressDelete={() => openDeleteModal(dinnerLogs)}/>
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
                            <IngredientContainer title={snack.mealName} titleColor={colors.snack} fontSize={RFValue(22)} onPressEdit={() => openModal(snackLogs[index])} onPressDelete={() => openDeleteModal(snackLogs[index])}/>
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
                            <IngredientContainer title={'Symptoms'} titleColor={colors.symptom} fontSize={RFValue(20)} onPressEdit={openSymptomModal} onPressDelete={() => openDeleteModal(todaysSymptoms[0].Date)}/>
                            <MarginComponent marginBottom={5}/>
                            <View style={styles.ingredientBox}>
                                {todaysSymptoms.map((symptom, index) => (
                                    <Ingredients key={index} title={symptom.Name} backgroundColor={symptom.Strenght == 'weak' ? colors.symptomWeak : (symptom.Strenght == 'medium' ? colors.symptomMiddle : colors.symptomStrong)} textColor={symptom.Strenght == 'medium' ? colors.black : colors.white} showSvg={false} />
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
                            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled' style={styles.scrollViewIngredients}>
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
                {editSymptoms && (
                    <GenericModal>
                        <IngredientContainer title={'Symptoms'} titleColor={colors.symptom} fontSize={RFValue(22)} showDelete={false} showEdit={false} showUnderline={false}/>
                        <MarginComponent marginBottom={RFValue(-10)}/>
                        <View style={{ maxHeight: RFValue(330) }}>
                            <InputComponent placeholder={'Enter symptom'} textInputValue={symptomDescription} onChangeText={setSymptomDescription} borderColor={colors.symptom} showButton={false}/>
                            <MarginComponent marginTop={5}/>
                            <SymptomIntensity title={'Symptom intensity'} showButton={symptomDescription.length > 0 && symptomIntensity.length > 0} onPressAddButton={addSymptomToSummary} activeSymptomButton={setSymptomIntensity}/>
                            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled' style={styles.scrollViewIngredients}>
                                <IngredientContainer title={'Summary'} fontSize={RFValue(18)} showDelete={false} showEdit={false} showUnderline={false}/>
                                <View style={styles.ingredientBox}> 
                                {symptomModalData.map((symptom, index) => (
                                    <Ingredients key={index} title={symptom.Name} backgroundColor={symptom.Strenght == 'weak' ? colors.symptomWeak : (symptom.Strenght == 'medium' ? colors.symptomMiddle : colors.symptomStrong)} textColor={symptom.Strenght == 'medium' ? colors.black : colors.white} onPress={() => deleteSymptomFromSummary(index)}/>
                                ))}
                                </View>
                            </ScrollView>
                        </View>
                        <MarginComponent marginBottom={10}/>
                        <FinishOrBackControl 
                            showSaveSymbol={true}
                            titleTaskButton={'Save'}
                            colorTaskButton={colors.symptom}
                            textColorTaskButton={colors.white}
                            colorArrowButton={colors.symptom}
                            onPressArrowButton={closeModal}
                            onPressTaskButton={updateSymptomDatabase}
                        />
                    </GenericModal>
                )}
                {openModalToDelete && (
                    <GenericModal>
                        <Text style={styles.deleteText}>
                            Do you really want to delete the {''}
                            <Text style={{ ...styles.highlightedText, color: getColorByType(selectedLogToDelete.mealName) }}>{selectedLogToDelete.mealName || 'Symptoms'}</Text>
                            {''} entry?
                        </Text>
                        <MarginComponent marginTop={RFValue(10)}/>
                        <FinishOrBackControl 
                            showSymbolTaskButton={false}
                            titleTaskButton={'Delete'}
                            colorTaskButton={colors.symptomStrong}
                            textColorTaskButton={colors.white}
                            colorArrowButton={colors.black}
                            onPressArrowButton={closeModal}
                            onPressTaskButton={deleteEntry}
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
    scrollViewIngredients: {
        maxHeight: RFValue(180),
    },
    deleteText: {
        fontSize: RFValue(18),
        justifyContent: 'center',
        alignSelf: 'center',
    },
    highlightedText: {
        fontWeight: 'bold',
    }
});

export default StartScreen;