import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";

const MarginComponent = ({ marginTop = 0, marginRight = 0, marginBottom = 0, marginLeft = 0 }) => {

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

const styles = StyleSheet.create({
  container: {
    
  },
});

export default MarginComponent;
