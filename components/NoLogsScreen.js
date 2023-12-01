import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Path } from 'react-native-svg';
import colors from './colors';
import MarginComponent from './MarginComponent';
import dermEatsLogo from '../assets/logo.png';

// NoLogsScreen Komponente
const NoLogsScreen = ({ 
  onAddPress // Callback-Funktion, die beim Drücken des + Buttons aufgerufen wird
}) => {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Nothing here</Text>
        <MarginComponent marginBottom={20}/>
        <Image source={dermEatsLogo} style={styles.image}/>
        <MarginComponent marginBottom={20}/>
        <Text style={styles.infoText}>You didn't log anything today</Text>
        <MarginComponent marginBottom={40}/>
        <View style={styles.rowContainer}>
            <Text style={styles.infoText}>Press</Text>
            <TouchableOpacity onPress={onAddPress}>
                <Svg width={RFValue(30)} height={RFValue(30)} viewBox="0 0 24 24">
                    <Path d="M14.1397 1.99918C14.1397 1.17075 13.4681 0.499176 12.6397 0.499176C11.8112 0.499176 11.1397 1.17075 11.1397 1.99918V10.4992H2.63965C1.81122 10.4992 1.13965 11.1707 1.13965 11.9992C1.13965 12.8276 1.81122 13.4992 2.63965 13.4992H11.1397V21.9992C11.1397 22.8276 11.8112 23.4992 12.6397 23.4992C13.4681 23.4992 14.1397 22.8276 14.1397 21.9992V13.4992H22.6397C23.4681 13.4992 24.1397 12.8276 24.1397 11.9992C24.1397 11.1707 23.4681 10.4992 22.6397 10.4992H14.1397V1.99918Z" fill={colors.dermEatsColor}/>
                </Svg>
            </TouchableOpacity>
            <Text style={styles.infoText}>to add</Text>
        </View>
        <MarginComponent marginBottom={10}/>
        <Text style={styles.infoText}>a <Text style={{color: colors.dermEatsColor}}>meal</Text> or <Text style={{color: colors.symptom}}>symptoms</Text></Text>
    </View>
  );
};

// Styling der Komponente
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontFamily: 'Inter_900Black',
    fontSize: RFValue(28),
  },
  image: {
    width: RFValue(75),
    height: RFValue(75),
  },
  infoText: {
    fontFamily: 'Inter_900Black',
    fontSize: RFValue(20),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: RFValue(15),
  },
});

export default NoLogsScreen;