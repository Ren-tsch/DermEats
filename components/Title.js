import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import LeftArrowButton from './LeftArrowButton';
import RightArrowButton from './RightArrowButton';
import colors from './colors';
import { useDate } from '../context/DateContext';

const Title = ({ title, showDateContainer = true, showArrows = true, showSubtitle = false, subtitleText, subtitleTextColor, onPushLeftArrow, onPushRightArrow, calendarMode= false}) => {
  
  const { currentDate, setCurrentDate } = useDate();
  const dateObj = new Date(currentDate);

  const dayOptions = { weekday: 'short' };
  const dateOptions = { day: 'numeric', month: 'long' };
  const monthOptions = { month: 'long', year: 'numeric'}
  const day = dateObj.toLocaleDateString(undefined, dayOptions).slice(0, 2).toUpperCase();
  const date = dateObj.toLocaleDateString(undefined, dateOptions);
  const month = dateObj.toLocaleDateString(undefined, monthOptions);

  const handleLeftArrowClick = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate.toISOString().split('T')[0]);
    onPushLeftArrow();
};

const handleRightArrowClick = () => {
  const newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() + 1);

  const today = new Date();
  if (newDate <= today) {
      setCurrentDate(newDate.toISOString().split('T')[0]);
      onPushRightArrow();
  }
};

  const dateContainerStyles = [
    styles.dateContainer,
    !showArrows && { justifyContent: 'center'},
  ];

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{title}</Text>
        {showSubtitle && !showDateContainer && (
          <Text style={[styles.subtitle, {color: subtitleTextColor}]}>{subtitleText}</Text>
        )}
      </View>
      {showDateContainer && (
        <View style={dateContainerStyles}>
          {showArrows && (
            <LeftArrowButton onPress={handleLeftArrowClick} fillColor={colors.white}/>
          )}
          <View style={styles.alignMiddle}>
          {!calendarMode && (
            <>
              <Text style={styles.dayText}>{day}</Text>
              <Text style={styles.dateText}>{date}</Text>
            </>
          )}
          {calendarMode && (
            <Text style={styles.dateText}>{month}</Text>
          )}
          </View>
          {showArrows && (
            <RightArrowButton onPress={handleRightArrowClick} fillColor={colors.white}/>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: RFValue(8),
  },
  titleText: {
    fontFamily: 'Inter_900Black',
    fontSize: RFValue(28),
  },
  subtitle: {
    marginTop: RFValue(15),
    fontFamily: 'Inter_900Black',
    fontSize: RFValue(22),
  },
  dateContainer: {
    backgroundColor: colors.dermEatsColor,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: RFValue(10),
    borderRadius: RFValue(16),
    minHeight: RFValue(64)
  },
  alignMiddle:{
    alignItems: 'center',
  },
  dayText: {
    fontFamily: 'Inter_400Regular',
    color: colors.white,
    fontSize: RFValue(14),
  },
  dateText: {
    fontFamily: 'Inter_400Regular',
    color: colors.white,
    fontSize: RFValue(20),
  },
});

export default Title;
