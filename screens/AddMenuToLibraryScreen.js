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

const AddMenuToLibraryScreen = () => {

    const navigation = useNavigation();

    const [menuDescription, setMenuDescription] = useState('')
    const [foodDescription, setFoodDescription] = useState('')
    const [menuIngredients, setMenuIngredients] = useState([])
    const [lockInput, setLockInput] = useState(true)

    const AddMenuIngredientsToSummary = () => {
        if (menuDescription && foodDescription !== '') {
            const newMenu = {
                MenuName: menuDescription,
                FoodName: foodDescription,
            }

            setMenuIngredients(() => {
            const updatedIngredients = [...menuIngredients, newMenu]
            updateInputLockStatus(updatedIngredients.length)
            return updatedIngredients
            })

            setFoodDescription('')

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

    const DeleteIngredientFromSummary = (index) => {
        const newMenuIngredients = [...menuIngredients]
        newMenuIngredients.splice(index,1)
        updateInputLockStatus(newMenuIngredients.length)
        setMenuIngredients(newMenuIngredients)
    }

    const updateInputLockStatus = (length) => {
        setLockInput(!length > 0)
    }

    const navigateToDatabaseMenuScreen = () => {
        navigation.navigate('DatabaseMenuScreen');
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <MarginComponent marginTop={10}/>
                    <Title title={"Add new menu to library"} subtitleText={'Add menu'} subtitleTextColor={colors.menu} showDateContainer={false} showSubtitle={true}/>
                    <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
                        <InputComponent title={'Name of the menu'} placeholder={'Enter menu name'} onChangeText={setMenuDescription} textInputValue={menuDescription} showButton={false} borderColor={colors.menu} textInputEditable={lockInput} textInputColor={lockInput ? colors.black : colors.menu}/>
                        <MarginComponent marginTop={10}/>
                        <InputComponent title={'Menu ingredient'} titleColor={colors.food} placeholder={'Enter food'} onChangeText={setFoodDescription} textInputValue={foodDescription} showButton={true} borderColor={colors.food} actionButtonTitle={'Add ingredient'} onActionPress={AddMenuIngredientsToSummary} />
                        <MarginComponent marginTop={10}/>
                        <IngredientContainer title={'Summary'} showDelete={false} showEdit={false} showUnderline={false} titleColor={colors.black}/>
                        <View style={styles.ingredientBox}>
                            {menuIngredients.map((ingredients, index) => {
                                return (
                                    <Ingredients 
                                        key={index}
                                        title={`${ingredients.FoodName}`}
                                        backgroundColor={colors.food}
                                        textColor={colors.black}
                                        onPress={() => DeleteIngredientFromSummary(index)}
                                    />
                                );
                            })}
                        </View>
                    </ScrollView>
                    <FinishOrBackControl titleTaskButton={'Save to database'} textColorTaskButton={colors.black} colorTaskButton={colors.menu} colorArrowButton={colors.menu} onPressArrowButton={navigateToDatabaseMenuScreen}/>
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