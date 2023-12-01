import React from 'react';
import Ingredients from '../components/Ingredients';

// MealIngredients Komponente mit verschiedenen konfigurierbaren Eigenschaften
const MealIngredients = ({
    items, // Liste von Zutaten oder Elementen
    category, // Kategorie der Zutaten
    backgroundColor, // Hintergrundfarbe für jedes Zutaten-Element
    textColor, // Textfarbe für jedes Zutaten-Element
    onPress, // Callback-Funktion, die bei Druck auf ein Zutaten-Element ausgelöst wird
    showSvg // Bestimmt, ob ein SVG-Icon neben den Zutaten angezeigt wird
  }) => {
    // Nicht rendern, wenn keine Elemente vorhanden sind
    if (!items || items.length === 0) {
        return null;
    }

     // Rendert eine Liste von Ingredients-Komponenten
    return items.map((item, index) => (
        <Ingredients
            key={index}
            title={item.name || item.Name}
            backgroundColor={backgroundColor}
            textColor={textColor}
            onPress={() => onPress(index, category, item)}
            showSvg={showSvg}
        />
    ));
};

export default MealIngredients;