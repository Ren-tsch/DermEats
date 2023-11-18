import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import LeftArrowButton from './LeftArrowButton';
import RightArrowButton from './RightArrowButton';
import colors from './colors';

const Title = ({ title, showDateContainer = true, showArrows = true, showSubtitle = false, subtitleText, subtitleTextColor, calendarMode= false}) => {
  // Erstelle ein neues Date-Objekt für das aktuelle Datum
  const currentDate = new Date();
  // Konfiguriere die Anzeigeoptionen für den Wochentag und das Datum
  const dayOptions = { weekday: 'short' };
  const dateOptions = { day: 'numeric', month: 'long' };
  const monthOptions = { month: 'long', year: 'numeric'}
  
  // Formatierung des Wochentags und des Datums entsprechend der lokalen Einstellungen
  const day = currentDate.toLocaleDateString(undefined, dayOptions).slice(0,2).toUpperCase();
  const date = currentDate.toLocaleDateString(undefined, dateOptions);
  const month = currentDate.toLocaleDateString(undefined, monthOptions);

  const handleLeftArrowClick = () => {
    // Funktion für den Linken Pfeil
    console.log("Linker Pfeil geklickt");
  };

  const handleRightArrowClick = () => {
    // Funktion für den Rechten Pfeil
    console.log("Rechter Pfeil geklickt");
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
    width: '100%', // Setzt die Breite der Box auf die gesamte verfügbare Breite
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Zentriert den Inhalt horizontal
    padding: RFValue(10), // Fügt ein wenig Abstand innerhalb der Box hinzu
    borderRadius: RFValue(16),
    minHeight: RFValue(64)
  },
  alignMiddle:{
    alignItems: 'center',
  },
  dayText: {
    // Setze hier die gewünschten Styles für den Wochentag-Text
    fontFamily: 'Inter_400Regular',
    color: colors.white,
    fontSize: RFValue(14),
  },
  dateText: {
    // Setze hier die gewünschten Styles für das Datum
    fontFamily: 'Inter_400Regular',
    color: colors.white,
    fontSize: RFValue(20),
  },
});

export default Title;
