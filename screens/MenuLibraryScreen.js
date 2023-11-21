import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Title from '../components/Title';
import Navbar from '../components/Navbar'
import MarginComponent from '../components/MarginComponent';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from '../components/colors';
import TaskActionButton from '../components/TaskActionButton';
import FinishOrBackControl from '../components/FinishOrBackControl';
import Ingredients from '../components/Ingredients';
import GenericModal from '../components/GenericModal';
import InputComponent from '../components/InputComponent';
import { deleteMenu, getAllMenus, updateMenu, addMenuItem, searchMenuItems, deleteMenuItem, getFoodNameById } from '../database/databaseOperations';
import IngredientContainer from '../components/IngredientContainer';
import isEqual from 'lodash/isEqual';
import differenceWith from 'lodash/differenceWith';

// MenuLibraryScreen: Hauptkomponente für die Menübibliothek-Ansicht.
const MenuLibraryScreen = () => {

    const navigation = useNavigation();

    // Lokaler State für verschiedene Daten und UI-Steuerungen.
    const [menuDatabase, setMenuDatabase] = useState([])
    const [menuItemsData, setMenuItemsData] = useState([])
    const [menuIngredientsForModal, setMenuIngredientsForModal] = useState([])
    const [selectedMenuID, setSelectedMenuID] = useState(null);
    const [editIngredient, setEditIngredient] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState({});
    const [editMenuName, setEditMenuName] = useState(false)
    const [foodDescription, setFoodDescription] = useState('')
    const [selectedFoodId, setSelectedFoodId] = useState(null);

    // Effekt zum Laden aller Menüs aus der Datenbank beim Start der Komponente.
    useEffect(() => {
        getAllMenus().then(menus => {
            setMenuDatabase(menus)
        })
        .catch(error => {
            console.error('Fehler beim Laden der Datenbank:', error);
        });
    }, [editIngredient])

    // Funktion zum Löschen eines Menüs aus der Datenbank.
    const DeleteMenuFromDatabase = async (menuID) => {
        try {
            await deleteMenu(menuID);
            const updatedMenuDatabase = menuDatabase.filter(menu => menu.MenuID !== menuID);
            setMenuDatabase(updatedMenuDatabase);
    
            await deleteMenuItem(menuID); 

            console.log('Menü und zugehörige Menüelemente erfolgreich gelöscht');
        } catch (error) {
            console.error('Fehler beim Löschen des Menüs oder der Menüelemente:', error);
        }
        setSelectedMenu(false)
    };
    
    // Funktion zur Auswahl eines Menüs (Rand einblenden/ausblenden)
    const handleSelectIngredient = (menuID) => {
        setSelectedMenuID(selectedMenu => selectedMenu === menuID ? null : menuID);
    };

      // Funktion zum Öffnen des Modals zum Bearbeiten der Zutaten.
    const OpenModal = async () => {
        if (selectedMenuID !== null) {
            await searchMenuItems(selectedMenuID).then(menuItems => {
                setMenuIngredientsForModal(menuItems)
                setMenuItemsData(menuItems)
            })
            const selectedItem = menuDatabase.find(menu=> menu.MenuID === selectedMenuID);
            if (selectedItem) {
                setSelectedMenu(selectedItem);
            }
            setEditIngredient(true)
        }
    }

     // Funktion zum Schliessen des Modals.
    const CloseModal = () => {
        setEditIngredient(false)
        setSelectedMenuID(null)
        setFoodDescription('')
        setEditMenuName(false)
        setMenuIngredientsForModal([])
    }

    // Funktion zum Löschen einer Zutat aus der Zusammenfassung.
    const DeleteIngredientFromSummary = (index) => {
        const newIngredientForModal = [...menuIngredientsForModal]
        newIngredientForModal.splice(index,1)
        setMenuIngredientsForModal(newIngredientForModal)
    }

    // Funktion zum Hinzufügen einer Zutat zu den Zutaten.
    const AddFoodToIngredients = (foodDescription) => {
        if (selectedFoodId) {
            getFoodNameById(selectedFoodId).then(
                ingredient => {
                    newIngredientForMenu =[...menuIngredientsForModal]
                    newIngredientForMenu.push({'FoodID': selectedFoodId, 'FoodName': ingredient })
                    setMenuIngredientsForModal(newIngredientForMenu)
                    setSelectedFoodId(null)
                    setFoodDescription('')
                }
            )
        } else {
            newIngredientForMenu =[...menuIngredientsForModal]
            newIngredientForMenu.push({'FoodID': null, 'FoodName': foodDescription })
            setMenuIngredientsForModal(newIngredientForMenu)
            setFoodDescription('')
        }
    }

    // Funktion zum Finden von Unterschieden zwischen zwei Arrays.
    const findDifferences = (array1, array2) => {
        const added = differenceWith(array2, array1, isEqual)
        const removed = differenceWith(array1, array2, isEqual)

        return {added, removed}
    }

    // Funktion zum Aktualisieren der Lebensmittel in der Datenbank.
    const UpdateFoodInDatabase = async () => {
        const differencesInMenuIngredients = findDifferences(menuItemsData, menuIngredientsForModal)
        if (differencesInMenuIngredients.added.length > 0) {
            for (let item of differencesInMenuIngredients.added ) {
                if (item.FoodID != null) {
                    await addMenuItem(selectedMenuID, item.FoodID)
                } else {
                    await addMenuItem(selectedMenuID, null, item.FoodName)
                }
            }
        }

        if (differencesInMenuIngredients.removed.length > 0) {
            for (let item of differencesInMenuIngredients.removed) {
                await deleteMenuItem(item.MenuItemID, selectedMenuID)
            }
        }
        
        await updateMenu(selectedMenuID, selectedMenu.Name)
        setSelectedMenuID(null)
        CloseModal()
    }

    // Navigationsfunktionen.
    const navigateToDatabaseMenuScreen = () => {
        navigation.navigate('DatabaseMenuScreen');
    };
    const navigateToAddMenuToLibraryScreen = () => {
        navigation.navigate('AddMenuToLibraryScreen');
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <MarginComponent marginTop={10}/>
                    <Title title={"Menu library"} showDateContainer={false} showSubtitle={true} subtitleText={'Saved menus'} subtitleTextColor={colors.menu}/>
                    <GenericModal isVisible={editIngredient}>
                        {!editMenuName && (
                            <IngredientContainer title={selectedMenu.Name} showEdit={true} titleColor={colors.menu} fontSize={RFValue(22)} showUnderline={false} showDelete={false} onPressEdit={() => setEditMenuName(true)}/>
                        )}
                        <MarginComponent marginBottom={10}/>
                        {editMenuName && (
                            <InputComponent title={'Name of the menu'} textInputValue={selectedMenu.Name} onChangeText={(newName) => setSelectedMenu({...selectedMenu, Name: newName})} borderColor={colors.menu} showButton={true} actionButtonTitle={'Change menu name'} onActionPress={() => setEditMenuName(false)}/>
                        )}
                        {!editMenuName && (
                            <>
                                <InputComponent title={'Menu ingredient'} titleColor={colors.food} borderColor={colors.food} showButton={true} backgroundColorSuggestions={colors.food} textInputValue={foodDescription} onChangeText={setFoodDescription} showSuggestions={true} actionButtonTitle={'Add ingredient'} onActionPress={() => AddFoodToIngredients(foodDescription)} onSelectFoodItem={setSelectedFoodId}/>    
                                <MarginComponent marginBottom={10}/>
                                <ScrollView style={styles.scrollViewFoods} keyboardShouldPersistTaps='handled'>
                                    <View style={styles.ingredientBoxModal}>
                                        {menuIngredientsForModal.map((menuItem, index) => {
                                            return (
                                                <Ingredients 
                                                    key={index}
                                                    title={`${menuItem.FoodName}`}
                                                    backgroundColor={colors.food}
                                                    textColor={colors.black}
                                                    onPress={() => DeleteIngredientFromSummary(index)}
                                                />
                                            );
                                        })}
                                    </View>
                                </ScrollView>                       
                                <MarginComponent marginBottom={10}/>
                                <FinishOrBackControl colorArrowButton={colors.menu} colorTaskButton={colors.menu} textColorTaskButton={colors.black} titleTaskButton={'Save'} showSaveSymbol={true} onPressTaskButton={UpdateFoodInDatabase} onPressArrowButton={CloseModal}/>
                            </>
                        )}
                    </GenericModal>
                    <ScrollView keyboardShouldPersistTaps='handled'>
                        <View style={styles.ingredientBox}>
                            {menuDatabase.map((menu) => {
                                return (
                                    <Ingredients 
                                        key={menu.MenuID}
                                        title={menu.Name}
                                        backgroundColor={colors.menu}
                                        isPressable={true}
                                        textColor={colors.black}
                                        onPress={() => DeleteMenuFromDatabase(menu.MenuID)}
                                        onPressIngredient={() => handleSelectIngredient(menu.MenuID)}
                                        isActive={selectedMenuID === menu.MenuID}
                                    />
                                );
                            })}
                        </View>
                    </ScrollView>
                    {(selectedMenuID !== null) && (
                        <TaskActionButton title={'Edit menu'} buttonColor={colors.black} textColor={colors.white} onPress={OpenModal}/>
                    )}
                    <MarginComponent marginBottom={10}/>
                    <FinishOrBackControl titleTaskButton={'Add new menu'} textColorTaskButton={colors.black} colorTaskButton={colors.menu} colorArrowButton={colors.menu} onPressArrowButton={navigateToDatabaseMenuScreen} onPressTaskButton={navigateToAddMenuToLibraryScreen}/>
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
        maxHeight: RFValue(180),
    },
    ingredientBoxModal: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    scrollViewFoods: {
        maxHeight: RFValue(180),
    },
});

export default MenuLibraryScreen;