import React, {useState, useRef} from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, Text } from 'react-native';
import colors from '../components/colors';
import Title from '../components/Title';
import NavigationButton from '../components/NavigationButton';
import MarginComponent from '../components/MarginComponent';
import { RFValue } from 'react-native-responsive-fontsize';
import FinishOrBackControl from '../components/FinishOrBackControl';
import GenericModal from '../components/GenericModal';
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';

const AllergyInfoScreen = () => {

    const navigation = useNavigation() // Hook für die Navigation innerhalb der App.

    const [showModal, setShowModal] = useState(false) // Verwaltet, ob das Modal angezeigt werden soll.
    const clickedLink = useRef('') // Speichert den Text des geklickten Links

    // Funktion zur Navigation zur 'DatabaseMenuScreen' Komponente.
    const navigateToDatabase = () => {
        navigation.navigate('DatabaseMenuScreen')
    }
 
    // Funktion zur Navigation zu externer Webseite aha Allergiezentrum
    const navigateToAha = () => {
        Linking.openURL('https://www.aha.ch/allergiezentrum-schweiz/home');
    }

    // Funktion zur Navigation zu externer Webseite mediX
    const navigateToMedix = () => {
        Linking.openURL('https://www.medix.ch/media/dossier_nahrungsmittelunvertraeglichkeit_09-21.pdf?1632918997')
    }

    // Funktion zur Navigation zu externer Webseite
    const navigateToWebsite = () => {
        if (clickedLink.current === 'aha') {
            navigateToAha()
        } else if (clickedLink.current === 'medix') {
            navigateToMedix()
        }
        closeModal()
    }

    // Funktion zum öffnen des Modals
    const openModal = (linkText) => {
        setShowModal(true)
        clickedLink.current = linkText
    }

    // Funktion zum schliessen des Modals
    const closeModal = () => {
        setShowModal(false)
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <MarginComponent marginTop={10}/>
                    <Title showDateContainer={false} title={'Allergy information'}/>
                    <View style={styles.positioning}>
                        <NavigationButton title={'aha! Allergiezentrum'} buttonColor={'#CCDA4B'} onPress={() => openModal('aha')}/>
                        <MarginComponent marginTop={20}/>
                        <NavigationButton title={'mediX'} buttonColor={'#5FB2AE'} onPress={() => openModal('medix')}/>
                    </View>
                    <FinishOrBackControl showTaskButton={false} onPressArrowButton={navigateToDatabase}/>
                    <MarginComponent marginBottom={20}/>
                    {showModal && (
                        <GenericModal>
                            <Text style={styles.infoText}>You will now be redirected to an external website that provides information about allergies. This site is not directly linked to our app. Would you like to continue?</Text>
                            <MarginComponent marginTop={20}/>
                            <FinishOrBackControl onPressArrowButton={closeModal} titleTaskButton={'Yes'} showSymbolTaskButton={false} colorTaskButton={colors.symptomWeak} textColorTaskButton={colors.white} onPressTaskButton={navigateToWebsite}/>
                        </GenericModal>
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

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
    positioning: {
        flex: 1,
        justifyContent: 'center'
    },
    infoText: {
        fontSize: RFValue(18),
        justifyContent: 'center',
        alignSelf: 'center',
    },
})

export default AllergyInfoScreen