import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Path } from 'react-native-svg';

const IngredientContainer = ({ onPressDelete, onPressEdit, title, titleColor, fontSize, showUnderline=true, showDelete=true, showEdit=true}) => {

  return (
    <>
        <View style={styles.container}>
            {!showDelete && (
                <View style={styles.shadowElement}></View>
            )}
            {showDelete &&(
                <TouchableOpacity onPress={onPressDelete}>
                        <Svg width={RFValue(18)} height={RFValue(18)} viewBox="0 0 24 24">
                            <Path d="M2.57899 1.93852C3.16477 1.35273 4.11452 1.35273 4.70031 1.93852L22.7003 19.9385C23.2861 20.5243 23.2861 21.4741 22.7003 22.0598C22.1145 22.6456 21.1648 22.6456 20.579 22.0598L2.57899 4.05984C1.9932 3.47405 1.9932 2.5243 2.57899 1.93852Z" fill={titleColor}/>
                            <Path d="M22.7003 1.93852C22.1145 1.35273 21.1648 1.35273 20.579 1.93852L2.57899 19.9385C1.9932 20.5243 1.9932 21.4741 2.57899 22.0598C3.16478 22.6456 4.11452 22.6456 4.70031 22.0598L22.7003 4.05984C23.2861 3.47405 23.2861 2.5243 22.7003 1.93852Z" fill={titleColor}/>
                        </Svg>
                </TouchableOpacity>
            )}
            <Text style={[styles.textStyle, {color: titleColor, fontSize: fontSize}]}>{title}</Text>
            {showEdit && (
                <TouchableOpacity onPress={onPressEdit}>
                        <Svg width={RFValue(18)} height={RFValue(18)} viewBox="0 0 24 24">
                            <Path d="M8.77706 20.6082L18.7773 10.6079L14.0274 5.85802L4.02714 15.8582C3.88947 15.9961 3.79168 16.1686 3.74413 16.3576L2.63574 21.9996L8.27668 20.8912C8.46607 20.8438 8.63932 20.7459 8.77706 20.6082ZM22.0056 7.37963C22.4091 6.97603 22.6357 6.42871 22.6357 5.85802C22.6357 5.28733 22.4091 4.74001 22.0056 4.33641L20.2989 2.62971C19.8953 2.22623 19.348 1.99957 18.7773 1.99957C18.2066 1.99957 17.6593 2.22623 17.2557 2.62971L15.549 4.33641L20.2989 9.08633L22.0056 7.37963Z" fill={titleColor}/>
                        </Svg>
                </TouchableOpacity>
            )}
            {!showEdit && (
                <View style={styles.shadowElement}></View>
            )}
        </View>
        {showUnderline && (
        <View style={[styles.underline, {backgroundColor: titleColor}]}></View>
        )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textStyle: {
    textAlign: 'left',
    fontFamily: 'Inter_700Bold',
    fontSize: RFValue(16),
    marginBottom: RFValue(5),
  },
  underline: {
    height: 2,
  },
  shadowElement: {
    width: RFValue(18)
  },
});

export default IngredientContainer;