import React from 'react';
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

const MenuLibraryScreen = () => {

    const navigation = useNavigation();

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
                    <ScrollView style={styles.ingredientBox}>
                            
                    </ScrollView>
                    <TaskActionButton title={'Edit menu'} buttonColor={colors.black} textColor={colors.white}/>
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
        flex: 1,
    }
});

export default MenuLibraryScreen;