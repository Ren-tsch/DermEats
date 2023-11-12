import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { TouchableOpacity } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";

const LeftArrowButton = ({ onPress, fillColor, hasPadding = true }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[{padding: hasPadding ? RFValue(10) : RFValue(0)}]}>
      <Svg width={RFValue(24)} height={RFValue(24)} viewBox="0 0 24 24">
        <Path d="M19.1852 0.938516C19.7872 1.5243 19.7872 2.47405 19.1852 3.05984L9.99731 11.9992L19.1852 20.9385C19.7872 21.5243 19.7872 22.474 19.1852 23.0598C18.5831 23.6456 17.6069 23.6456 17.0049 23.0598L5.63672 11.9992L17.0049 0.938516C17.6069 0.352729 18.5831 0.352729 19.1852 0.938516Z" fill={fillColor}/>
      </Svg>
    </TouchableOpacity>
  );
};

export default LeftArrowButton;