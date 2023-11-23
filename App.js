import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts, Inter_900Black, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import StartScreen from './screens/StartScreen';
import SelectionScreen from './screens/SelectionScreen';
import AddMealScreen from './screens/AddMealScreen';
import AddSymptomScreen from './screens/AddSymptomScreen';
import DatabaseMenuScreen from './screens/DatabaseMenuScreen';
import FoodLibraryScreen from './screens/FoodLibraryScreen';
import MenuLibraryScreen from './screens/MenuLibraryScreen';
import AddFoodToLibraryScreen from './screens/AddFoodToLibraryScreen';
import AddMenuToLibraryScreen from './screens/AddMenuToLibraryScreen';
import CalendarScreen from './screens/CalendarScreen';
import initializeDatabase from './database/database';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { DateProvider } from './context/DateContext';
import { Easing } from 'react-native';



export default function App() {

  useEffect(() => {
    initializeDatabase();
  }, []);

  const Stack = createStackNavigator();

  let [fontsLoaded, fontError] = useFonts({
    Inter_900Black,
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <DateProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="StartScreen"
          screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 500, // Dauer in Millisekunden
                  easing: Easing.out(Easing.poly(2)), // Easing-Funktion
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 500, // Gleiche Dauer für das Schließen
                  easing: Easing.out(Easing.poly(2)),
                },
              },
            },
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="SelectionScreen" component={SelectionScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="AddMealScreen" component={AddMealScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="AddSymptomScreen" component={AddSymptomScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="DatabaseMenuScreen" component={DatabaseMenuScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="FoodLibraryScreen" component={FoodLibraryScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="AddFoodToLibraryScreen" component={AddFoodToLibraryScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="MenuLibraryScreen" component={MenuLibraryScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="AddMenuToLibraryScreen" component={AddMenuToLibraryScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="CalendarScreen" component={CalendarScreen} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </DateProvider>
  );
}
