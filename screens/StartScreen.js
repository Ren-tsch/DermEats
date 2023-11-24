import React, {useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, ScrollView } from 'react-native';
import NoLogsScreen from '../components/NoLogsScreen'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Title from '../components/Title';
import Navbar from '../components/Navbar'
import MarginComponent from '../components/MarginComponent';
import LoadingScreen from '../components/LoadingScreen';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from '../components/colors';
import {getAllNonCataloguedFoodByDailyLogId, getDailyLogDetailsByTimestamp, getDailyLogFoodItemsByLogId, getDayliLogMenusByLogId, getFoodNameById, searchMenuById} from '../database/databaseOperations';
import { useDate } from '../context/DateContext';
import IngredientContainer from '../components/IngredientContainer';
import MealIngredients from '../components/MealIngredients'
import TaskActionButton from '../components/TaskActionButton';

const StartScreen = () => {

    const navigation = useNavigation();
    const { currentDate } = useDate();

    const [formattedDate, setFormattedDate] = useState(currentDate.toISOString().split('T')[0]);
    const [isLoading, setIsLoading] = useState(null)
    const [breakfastLogs, setBreakfastLogs] = useState({nonCataloguedFood: [], foodItems: [], menus: []})
    const [lunchLogs, setLunchLogs] = useState({nonCataloguedFood: [], foodItems: [], menus: []})
    const [dinnerLogs, setDinnerLogs] = useState({nonCataloguedFood: [], foodItems: [], menus: []})
    const [snackLogs, setSnackLogs] = useState([])

    const navigateToSelectionScreen = () => {
        navigation.navigate('SelectionScreen');
    };


    useEffect(() => {
        let isMounted = true;
    
        const fetchEntry = async () => {
            if (isMounted) {
                await fetchAndDisplayDailyLogs(formattedDate)
            }
        };
    
        fetchEntry();
    
        return () => {
            isMounted = false;
        };
    }, [formattedDate]);


    const fetchAndDisplayDailyLogs = async (formattedDate) => {
        try {
            const existingEntry = await getDailyLogDetailsByTimestamp(formattedDate);
    
            const enrichedEntries = await Promise.all(existingEntry.map(async (entry) => {
                return await enrichEntryWithDetails(entry);
            }));

            let tempSnackLogs = [];

            for (let index = 0; index < enrichedEntries.length; index++) {
                const entry = enrichedEntries[index]

                if (entry.mealName == 'Snack') {
                    if (entry.mealName == 'Snack') {
                        tempSnackLogs.push(entry);
                    }
                }
                else if (entry.mealName == 'Breakfast') {
                    setBreakfastLogs(entry)
                }
                else if (entry.mealName == 'Lunch') {
                    setLunchLogs(entry)
                }
                else if (entry.mealName == 'Dinner') {
                    setDinnerLogs(entry)
                }
            }

            setSnackLogs(tempSnackLogs);
            //console.log(JSON.stringify(enrichedEntries, null, 2));
            //console.log(lunchLogs)

        } catch (error) {
            console.error("Fehler beim Abrufen der DailyLog-Einträge:", error);
        }
        
    }

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

    const areAllArraysEmpty = (mealTimeLogs) => {
        return Object.values(mealTimeLogs).every(array => array.length === 0);
    }

    const handleArrowPush = () => {
        setFormattedDate(currentDate.toISOString().split('T')[0]);
        setBreakfastLogs({nonCataloguedFood: [], foodItems: [], menus: []})
        setLunchLogs({nonCataloguedFood: [], foodItems: [], menus: []})
        setDinnerLogs({nonCataloguedFood: [], foodItems: [], menus: []})
        setSnackLogs([])
    }

    return (
    <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <MarginComponent marginTop={10}/>
                <Title title={"Today's entries"} onPushLeftArrow={handleArrowPush} onPushRightArrow={handleArrowPush}/>
                <MarginComponent marginBottom={10}/>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {!(areAllArraysEmpty(breakfastLogs)) && (
                        <>
                            <IngredientContainer title={breakfastLogs.mealName} titleColor={colors.breakfast} fontSize={RFValue(20)} showEdit={false}/>
                            <MarginComponent marginBottom={5}/>
                            <View style={styles.ingredientBox}>                   
                                <MealIngredients items={breakfastLogs.nonCataloguedFood} backgroundColor={colors.breakfast} textColor={colors.white}/>
                                <MealIngredients items={breakfastLogs.foodItems} backgroundColor={colors.breakfast} textColor={colors.white}/>
                                <MealIngredients items={breakfastLogs.menus} backgroundColor={colors.menu} textColor={colors.white}/>
                                <TaskActionButton title={'Add'} buttonColor={colors.black} textColor={colors.white} isPlacedInIngContainer={true}/>
                            </View>
                            <MarginComponent marginBottom={RFValue(10)}/>
                        </>
                    )}
                    {!(areAllArraysEmpty(lunchLogs)) && (
                        <>
                            <IngredientContainer title={lunchLogs.mealName} titleColor={colors.lunch} fontSize={RFValue(20)} showEdit={false}/>
                            <MarginComponent marginBottom={5}/>
                            <View style={styles.ingredientBox}>                   
                                <MealIngredients items={lunchLogs.nonCataloguedFood} backgroundColor={colors.lunch} textColor={colors.white}/>
                                <MealIngredients items={lunchLogs.foodItems} backgroundColor={colors.lunch} textColor={colors.white}/>
                                <MealIngredients items={lunchLogs.menus} backgroundColor={colors.menu} textColor={colors.white}/>
                                <TaskActionButton title={'Add'} buttonColor={colors.black} textColor={colors.white} isPlacedInIngContainer={true}/>
                            </View>
                            <MarginComponent marginBottom={RFValue(10)}/>
                        </>
                    )}
                    {!(areAllArraysEmpty(dinnerLogs)) && (
                        <>
                            <IngredientContainer title={dinnerLogs.mealName} titleColor={colors.dinner} fontSize={RFValue(20)} showEdit={false}/>
                            <MarginComponent marginBottom={5}/>
                            <View style={styles.ingredientBox}>                   
                                <MealIngredients items={dinnerLogs.nonCataloguedFood} backgroundColor={colors.dinner} textColor={colors.white}/>
                                <MealIngredients items={dinnerLogs.foodItems} backgroundColor={colors.dinner} textColor={colors.white}/>
                                <MealIngredients items={dinnerLogs.menus} backgroundColor={colors.menu} textColor={colors.white}/>
                                <TaskActionButton title={'Add'} buttonColor={colors.black} textColor={colors.white} hasMarginTop={true} isPlacedInIngContainer={true}/>
                            </View>
                            <MarginComponent marginBottom={RFValue(10)}/>
                        </>
                    )}
                    {snackLogs.map((snack, index) => (
                        <React.Fragment key={index}>
                            <IngredientContainer 
                                title={snack.mealName} 
                                titleColor={colors.snack} 
                                fontSize={RFValue(20)} 
                                showEdit={false}
                            />
                            <MarginComponent marginBottom={5}/>
                            <View style={styles.ingredientBox}>                   
                                <MealIngredients items={snack.nonCataloguedFood} backgroundColor={colors.snack} textColor={colors.white}/>
                                <MealIngredients items={snack.foodItems} backgroundColor={colors.snack} textColor={colors.white}/>
                                <MealIngredients items={snack.menus} backgroundColor={colors.menu} textColor={colors.white}/>
                                <TaskActionButton title={'Add'} buttonColor={colors.black} textColor={colors.white} hasMarginTop={true} isPlacedInIngContainer={true}/>
                            </View>
                            <MarginComponent marginBottom={RFValue(10)}/>
                        </React.Fragment>
                    ))}
                </ScrollView>
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
    containerNoLogs: {
        justifyContent: 'center',
        flex: 1,
    },
    ingredientBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

export default StartScreen;