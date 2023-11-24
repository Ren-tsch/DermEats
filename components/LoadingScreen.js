import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import colors from './colors';

const LoadingScreen = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={colors.dermEatsColor} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;