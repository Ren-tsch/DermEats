import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import colors from './colors';
import moment from 'moment';

// CalendarComponent Komponente mit verschiedenen konfigurierbaren Eigenschaften
const CalendarComponent = ({ 
    onDaySelect, // Callback-Funktion, die bei der Auswahl eines Tages aufgerufen wird
    mealsAndSymptoms // Daten über Mahlzeiten und Symptome
  }) => {
    const [markedDates, setMarkedDates] = useState({}); // Lokaler State für markierte Tage
  
    // Konfiguration für Markierungen
    const mealAdded = { key: 'meal added', color: colors.food };
    const symptomAdded = { key: 'symptom added', color: colors.symptom };
  
    // useEffekt zum Aktualisieren der markierten Tage und einfügen von Einträgeinformationen
    useEffect(() => {
        const newMarkedDates = {};
        const today = moment().format('YYYY-MM-DD');
    
        newMarkedDates[today] = {
            selected: true,
            selectedColor: colors.lightBackground,
            selectedTextColor: colors.dermEatsColor,
            dots: []
        };

        if (mealsAndSymptoms && mealsAndSymptoms.length > 0) {
            mealsAndSymptoms.forEach(item => {
                const { date, meal, symptom } = item;
                if (!newMarkedDates[date]) {
                newMarkedDates[date] = { dots: [] };
                }
                
                if (meal === true) {
                newMarkedDates[date].dots.push(mealAdded);
                } if (symptom === true) {
                newMarkedDates[date].dots.push(symptomAdded);
                }
            });
        }     
    
        setMarkedDates(newMarkedDates);
    }, [mealsAndSymptoms]);

    return (
        <Calendar
        onDayPress={onDaySelect}
        markingType={'multi-dot'}
        markedDates={markedDates}
        hideArrows={true}
        renderHeader={(date) => {
            return null;
        }}
        />
    );
};

export default CalendarComponent;
