import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Title from '../components/Title';
import Navbar from '../components/Navbar';
import InputComponent from '../components/InputComponent';
import InputTime from '../components/InputTime';
import MarginComponent from '../components/MarginComponent';
import IngredientContainer from '../components/IngredientContainer';
import FinishOrBackControl from '../components/FinishOrBackControl';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from '../components/colors';

const AddMealScreen = () => {

    const navigation = useNavigation();
    
    const navigateToSelectionScreen = () => {
        navigation.navigate('SelectionScreen');
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <MarginComponent marginTop={10}/>
                        <Title title={"Add meal"} showArrows={false}/>
                        <MarginComponent marginTop={10}/>
                        <InputComponent title={'Name of the meal'} placeholder={'Enter meal name'} showButton={false} />
                        <MarginComponent marginTop={5}/>
                        <InputTime title={'Time of consumption'}/>
                        <MarginComponent marginTop={5}/>
                        <InputComponent title={'Food'} placeholder={'Enter food'} showButton={true} actionButtonTitle={'Add food'} titleColor={colors.food} borderColor={colors.food}/>
                        <MarginComponent marginTop={5}/>
                        <InputComponent title={'Menu'} placeholder={'Search for a menu'} showButton={true} actionButtonTitle={'Add menu'} titleColor={colors.menu} borderColor={colors.menu}/>
                        <MarginComponent marginTop={10}/>
                        <IngredientContainer title={'Summary'} showDelete={false} showEdit={false}/>
                        <View style={styles.ingredientBox}>

                        </View>
                    </ScrollView>
                    <FinishOrBackControl titleTaskButton={'add to entries'} colorTaskButton={colors.dermEatsColor} textColorTaskButton={colors.white} colorArrowButton={colors.dermEatsColor} onPressArrowButton={navigateToSelectionScreen}/>
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