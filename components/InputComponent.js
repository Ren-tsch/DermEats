import React, {useState, useEffect} from 'react';
import { View, TextInput, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import TaskActionButton from './TaskActionButton';
import Ingredients from './Ingredients';
import { RFValue } from "react-native-responsive-fontsize";
import colors from './colors';
import { searchFoodItems, searchMenuByName} from '../database/databaseOperations';

// InputComponent Komponente mit verschiedenen konfigurierbaren Eigenschaften
const InputComponent = ({
  showText = true, // Steuert die Anzeige des Titeltextes
  onActionPress, // Callback-Funktion für den Aktion-Button
  actionButtonTitle, // Titel für den Aktion-Button
  placeholder, // Platzhaltertext für den TextInput
  title, // Titeltext
  titleColor, // Farbe des Titeltextes
  borderColor, // Farbe des Rands des TextInputs
  onChangeText, // Callback-Funktion für Textänderungen
  textInputValue, // Wert des TextInputs
  textInputColor, // Farbe des Textes im TextInput
  backgroundColorSuggestions, // Hintergrundfarbe der Vorschläge
  onSelectFoodItem, // Callback-Funktion für die Auswahl eines Lebensmittel-Vorschlags
  onSelectMenuItem, // Callback-Funktion für die Auswahl eines Menü-Vorschlags
  showSuggestions= false, // Steuert die Anzeige der Vorschlagsliste
  showMenuSuggestion=false, // Bestimmt, ob Menü-Vorschläge angezeigt werden sollen
  showButton= true, // Steuert die Anzeige des Aktion-Buttons
  textAlignMiddle= false // Bestimmt die Textausrichtung
}) => {

  // Lokaler State für Vorschläge
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);

  // Maximale Höhe der FlatList
  const MAX_FLATLIST_HEIGHT = RFValue(95); 
  const flatListHeight = Math.min(suggestions.length * RFValue(45), MAX_FLATLIST_HEIGHT);

  // Logik für das Abrufen und Setzen von Vorschlägen
  useEffect(() => {
    if (isSuggestionSelected) {
      setIsSuggestionSelected(false);
      return;
    }

    const debounceId = setTimeout(() => {
      if (textInputValue) {
        if (!showMenuSuggestion) {
          searchFoodItems(textInputValue)
          .then((foodItems) => {
            setSuggestions(foodItems);
          })
          .catch((error) => {
            console.error("Fehler bei der Suche nach Lebensmitteln:", error);
            setSuggestions([]);
          });
        }
        if(showMenuSuggestion){
          searchMenuByName(textInputValue)
          .then((menuItems) => {
            setSuggestions(menuItems);
          })
          .catch((error) => {
            console.error("Fehler bei der Suche nach Menüs:", error);
            setSuggestions([]);
          });
        }
      } else {
        setSuggestions([]);
      }
    }, 100);
  
    return () => clearTimeout(debounceId);
  }, [textInputValue]);

  // Logik für das Auswählen eines Vorschlags
  const handleSelectSuggestion = (suggestion) => {
    setSuggestions([]);
    onChangeText(suggestion.name);
    setIsSuggestionSelected(true);
    if (!showMenuSuggestion) {
      onSelectFoodItem(suggestion.id);
    }
    if (showMenuSuggestion) {
      onSelectMenuItem(suggestion.id);
    }
    
  };

  // Styling der Komponente
  return (
    <View style={styles.container}>
      {showText && (
        <Text style={[styles.textStyle, {color: titleColor, textAlign: textAlignMiddle ? 'center' : 'left'}]}>{title}</Text>)}
        <TextInput
          style={[styles.inputStyle, {borderColor: borderColor, marginBottom: showButton ? RFValue(10) : RFValue(0), color: textInputColor}]}
          onChangeText={onChangeText}
          placeholder= {placeholder}
          value={textInputValue}
          underlineColorAndroid="transparent"
        />
        {showSuggestions &&(
          <FlatList style={[styles.flatList, { height: flatListHeight }]}
          data={suggestions}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectSuggestion(item)}>
              <Ingredients title={item.name} textColor={colors.black} backgroundColor={backgroundColorSuggestions} showSvg={false}/>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          keyboardShouldPersistTaps='handled'
          />
        )}
      {showButton && (
        <TaskActionButton
        onPress={onActionPress}
        title={actionButtonTitle}
        buttonColor={colors.black}
        textColor={colors.white}
        alignMiddle={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  textStyle: {
    fontFamily: 'Inter_700Bold',
    fontSize: RFValue(16),
    marginBottom: RFValue(5),
  },
  inputStyle: {
    borderWidth: 1.5,
    padding: RFValue(8),
    fontSize: RFValue(18),
    borderRadius: RFValue(10),
  },
  flatList: {
  },
});

export default InputComponent;