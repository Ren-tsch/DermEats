import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import colors from './colors';
import moment from 'moment';

const CalendarComponent = ({ onDaySelect, mealsAndSymptoms }) => {
    const [markedDates, setMarkedDates] = useState({});
  
    const mealAdded = { key: 'meal added', color: colors.food };
    const symptomAdded = { key: 'symptom added', color: colors.symptom };
  
    useEffect(() => {
        const newMarkedDates = {};
        const today = moment().format('YYYY-MM-DD'); // Heutiges Datum im Format 'YYYY-MM-DD'
    
        // Markiere den heutigen Tag
        newMarkedDates[today] = {
            selected: true,
            selectedColor: colors.lightBackground,
            selectedTextColor: colors.dermEatsColor,
            dots: []
        };
    
        // Gehe durch die Liste der Mahlzeiten und Symptome
        if (mealsAndSymptoms && mealsAndSymptoms.length > 0) {
            mealsAndSymptoms.forEach(item => {
                const { date, meal, symptom } = item; // Annahme: Jedes Element hat ein 'date' und ein 'type'
                if (!newMarkedDates[date]) {
                newMarkedDates[date] = { dots: [] };
                }
                
                // Füge entsprechend den Typ hinzu (meal oder symptom)
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
        //theme={calenderTheme}
        markingType={'multi-dot'}
        markedDates={markedDates}
        hideArrows={true}
        renderHeader={(date) => {
            // Du kannst hier auch eine leere View zurückgeben, wenn du einen Platzhalter möchtest
            return null;
        }}
        />
    );
};

export default CalendarComponent;
