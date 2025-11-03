import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreenView';
import DetailScreen from '../screens/DetailScreenView';
import Onboarding from '../screens/OnboardingView';
import Login from '../screens/LoginView';

const Stack = createNativeStackNavigator();

const RootNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Onboarding"
      component={Onboarding}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Login"
      component={Login}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Detail" component={DetailScreen} />
  </Stack.Navigator>
);

export default RootNavigator;
