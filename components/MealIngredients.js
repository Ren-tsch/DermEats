import React from 'react';
import Ingredients from '../components/Ingredients';

const MealIngredients = ({ items, category, backgroundColor, textColor, onPress, showSvg }) => {
    if (!items || items.length === 0) {
        return null;
    }

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