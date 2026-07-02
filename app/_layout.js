import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, ViewComponent } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Splash from './Screens/Splash';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Home';
import AddText from './Screens/AddText';
import InfoScreen from './Screens/InfoScreen';
import ViewNote from './Screens/View_Edit_Note';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SettingScreen from './Screens/SettingScreen'
import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();

const _layout = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 3000);
  });



  const [fontsLoaded] = useFonts({
    'Nunito-Regular': require('../src/assets/fonts/Nunito-Regular.ttf'),
    'Nunito-Bold': require('../src/assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../src/assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-ExtraBold': require('../src/assets/fonts/Nunito-ExtraBold.ttf'),
    'Nunito-Light': require('../src/assets/fonts/Nunito-Light.ttf'),
  });


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Splash">
        {showSplash ? (
          <Stack.Screen name="Splash" component={Splash} />
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
                animation: 'slide_from_right'
              }}
            />
            <Stack.Screen
              name="AddText"
              component={AddText}
              options={{
                headerShown: false,
                animation: 'slide_from_right'
              }}
            />
            <Stack.Screen
              name="InfoScreen"
              component={InfoScreen}
              options={{ headerShown: false, animation: 'slide_from_right' }}
            />

            <Stack.Screen name="SettingScreen" component={SettingScreen}
              options={{ headerShown: false, animation: 'slide_from_right' }}
            />

            <Stack.Screen
              name="ViewNote"
              component={ViewNote}
              options={{ headerShown: false, animation: 'slide_from_right' }}
            />

          </>
        )}
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
};

export default _layout;

const styles = StyleSheet.create({});
