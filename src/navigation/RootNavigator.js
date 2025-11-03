import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreenView';
import Booking from '../screens/Booking';
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
    <Stack.Screen
      name="Booking"
      component={Booking}
      options={{ title: 'Booking Ruang Meeting' }}
    />
  </Stack.Navigator>
);

export default RootNavigator;
