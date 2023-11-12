import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Path } from 'react-native-svg';

const Ingredients = ({ onPress, title, backgroundColor, textColor }) => (
    <View style={[styles.align]}>
        <View style={[styles.container, { backgroundColor: backgroundColor}]}>
            <TouchableOpacity onPress={onPress}>
                <Svg width={RFValue(16)} height={RFValue(16)} viewBox="0 0 24 24">
                    <Path d="M2.57899 1.93852C3.16477 1.35273 4.11452 1.35273 4.70031 1.93852L22.7003 19.9385C23.2861 20.5243 23.2861 21.4741 22.7003 22.0598C22.1145 22.6456 21.1648 22.6456 20.579 22.0598L2.57899 4.05984C1.9932 3.47405 1.9932 2.5243 2.57899 1.93852Z" fill={textColor}/>
                    <Path d="M22.7003 1.93852C22.1145 1.35273 21.1648 1.35273 20.579 1.93852L2.57899 19.9385C1.9932 20.5243 1.9932 21.4741 2.57899 22.0598C3.16478 22.6456 4.11452 22.6456 4.70031 22.0598L22.7003 4.05984C23.2861 3.47405 23.2861 2.5243 22.7003 1.93852Z" fill={textColor}/>
                </Svg>
            </TouchableOpacity>
            <Text style={[styles.text, { color: textColor}]}>{title}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    align: {
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    container: {
        height: RFValue(35),
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12.5,
        paddingLeft: RFValue(10),
        paddingRight: RFValue(15),
        marginTop: RFValue(10),
        marginRight: RFValue(10),
    },
    text: {
        marginLeft: RFValue(10),
        fontSize: RFValue(16),
        fontFamily: 'Inter_400Regular',
    }
});

export default Ingredients;