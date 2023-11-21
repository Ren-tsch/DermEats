import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Path } from 'react-native-svg';

const TaskActionButton = ({ onPress, title, buttonColor, textColor, showSymbol= true, alignMiddle= true, showSaveSymbol=false}) => (
    <View style={[styles.buttonAlign, {alignSelf: alignMiddle ? 'center' : 'flex-start'}]}>
        <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: buttonColor, paddingLeft: showSymbol ? RFValue(10) : RFValue(15)}]} onPress={onPress}>
        {(showSymbol && !showSaveSymbol) && (
            <Svg width={RFValue(20)} height={RFValue(20)} viewBox="0 0 24 24">
                <Path d="M14.1397 1.99918C14.1397 1.17075 13.4681 0.499176 12.6397 0.499176C11.8112 0.499176 11.1397 1.17075 11.1397 1.99918V10.4992H2.63965C1.81122 10.4992 1.13965 11.1707 1.13965 11.9992C1.13965 12.8276 1.81122 13.4992 2.63965 13.4992H11.1397V21.9992C11.1397 22.8276 11.8112 23.4992 12.6397 23.4992C13.4681 23.4992 14.1397 22.8276 14.1397 21.9992V13.4992H22.6397C23.4681 13.4992 24.1397 12.8276 24.1397 11.9992C24.1397 11.1707 23.4681 10.4992 22.6397 10.4992H14.1397V1.99918Z" fill={textColor}/>
            </Svg>
        )}
        {(showSymbol && showSaveSymbol) && (
            <Svg width={RFValue(20)} height={RFValue(20)} viewBox="0 0 24 24">
                <Path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" fill={textColor}/>
            </Svg>
        )}
            <Text style={[styles.buttonText, { color: textColor, marginLeft: showSymbol ? RFValue(10) : 0 }]}>{title}</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    buttonAlign: {
        alignItems: 'center',
    },
    buttonContainer: {
        height: RFValue(35),
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        paddingLeft: RFValue(10),
        paddingRight: RFValue(15),
    },
    buttonText: {
        fontSize: RFValue(16),
        fontFamily: 'Inter_400Regular',
    }
});

export default TaskActionButton;
