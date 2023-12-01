import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import NavigationButton from '../components/NavigationButton';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Title from '../components/Title';
import Navbar from '../components/Navbar'
import FinishOrBackControl from '../components/FinishOrBackControl';
import MarginComponent from '../components/MarginComponent';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from '../components/colors';

const DatabaseMenuScreen = () => {

    const navigation = useNavigation(); // Hook für die Navigation innerhalb der App.

    // Navigationsfunktionen zu verschiedenen Bildschirmen der Datenbankverwaltung.
    const navigateToStartScreen = () => {
        navigation.navigate('StartScreen');
    };
    const navigateToFoodLibraryScreen = () => {
        navigation.navigate('FoodLibraryScreen');
    };
    const navigateToMenuLibraryScreen = () => {
        navigation.navigate('MenuLibraryScreen');
    };
    const navigateToAddFoodToLibraryScreen = () => {
        navigation.navigate('AddFoodToLibraryScreen');
    };
    const navigateToAddMenuToLibraryScreen = () => {
        navigation.navigate('AddMenuToLibraryScreen');
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <MarginComponent marginTop={10}/>
                    <Title title={"Database-Menu"} showDateContainer={false} showArrows={false}/>
                    <View style={styles.containerAddButtons}>
                        <NavigationButton title={'Food library'} textColor={colors.white} buttonColor={colors.black} onPress={navigateToFoodLibraryScreen}/>
                        <MarginComponent marginTop={5}/>
                        <NavigationButton title={'Add food to library'} textColor={colors.black} buttonColor={colors.food} onPress={navigateToAddFoodToLibraryScreen}/>
                        <MarginComponent marginTop={40}/>
                        <NavigationButton title={'Menu library'} textColor={colors.white} buttonColor={colors.black} onPress={navigateToMenuLibraryScreen}/>
                        <MarginComponent marginTop={5}/>
                        <NavigationButton title={'Add menu to library'} textColor={colors.black} buttonColor={colors.menu} onPress={navigateToAddMenuToLibraryScreen}/>
                    </View>
                    <View>
                        <FinishOrBackControl showTaskButton={false} colorArrowButton={colors.black} onPressArrowButton={navigateToStartScreen}/>
                        <MarginComponent marginBottom={15} />
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
    containerAddButtons: {
        justifyContent: 'center',
        flex: 1,
    },
});

export default DatabaseMenuScreen;