import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";

// MealIngredients Komponente mit verschiedenen konfigurierbaren Eigenschaften
const MarginComponent = ({
  marginTop = 0, // Oberer Randabstand
  marginRight = 0, // Rechter Randabstand
  marginBottom = 0, // Unterer Randabstand
  marginLeft = 0 // Linker Randabstand
}) => {

  // Kombinierte Stildefinitionen für die Container-View
  const containerStyles = [
    styles.container,
    {
      marginTop: RFValue(marginTop),
      marginRight: RFValue(marginRight),
      marginBottom: RFValue(marginBottom),
      marginLeft: RFValue(marginLeft),
    },
  ];

  return (
    <View style={containerStyles}></View>
  );
};


// Styling der Komponente
const styles = StyleSheet.create({
  container: {
    
  },
});

export default MarginComponent;
