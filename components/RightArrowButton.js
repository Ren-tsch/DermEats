import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { TouchableOpacity } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";

// RightArrowButton Komponente mit verschiedenen konfigurierbaren Eigenschaften
const RightArrowButton = ({ 
  onPress, // Callback-Funktion, die beim Drücken des Buttons aufgerufen wird
  fillColor, // Farbe des Pfeil-Icons
  hasPadding = true // Bestimmt, ob der Button einen Innenabstand haben soll
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[{padding: hasPadding ? RFValue(10) : RFValue(0)}]}>
      <Svg width={RFValue(24)} height={RFValue(24)} viewBox="0 0 24 24">
        <Path d="M6.08925 0.938516C5.48718 1.5243 5.48718 2.47405 6.08925 3.05984L15.2771 11.9992L6.08925 20.9385C5.48718 21.5243 5.48718 22.474 6.08925 23.0598C6.69132 23.6456 7.66747 23.6456 8.26954 23.0598L19.6377 11.9992L8.26954 0.938516C7.66747 0.352729 6.69132 0.352729 6.08925 0.938516Z" fill={fillColor}/>
      </Svg>
    </TouchableOpacity>
  );
};

export default RightArrowButton;