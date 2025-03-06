import {StyleSheet, Text, View, ViewComponent} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Splash from '../Screens/Splash';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../Screens/Home';
import AddText from '../Screens/AddText';
import InfoScreen from '../Screens/InfoScreen';
import ViewNote from '../Screens/View_Edit_Note';

const Stack = createNativeStackNavigator();
const StackNavigation = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 3000);
  });
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Splash">
        {showSplash ? (
          <Stack.Screen name="Splash" component={Splash} />
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{headerShown: false,
                animation:'slide_from_right'}}
            />
            <Stack.Screen
              name="AddText"
              component={AddText}
              options={{headerShown: false,
                animation:'slide_from_right'}}
            />
            <Stack.Screen
              name="InfoScreen"
              component={InfoScreen}
              options={{headerShown: false,animation:'slide_from_left'}}
            />
            <Stack.Screen
              name="ViewNote"
              component={ViewNote}
              options={{headerShown: false,animation:'slide_from_right'}}
            />
            
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;

const styles = StyleSheet.create({});
