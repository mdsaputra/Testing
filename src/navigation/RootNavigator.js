import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, TouchableOpacity } from 'react-native';
import HomeScreen from '../screens/HomeScreenView';
import Booking from '../screens/Booking';
import Onboarding from '../screens/OnboardingView';
import Login from '../screens/LoginView';
import JadwalRuangMeeting from '../screens/JadwalRuangMeeting';

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
      options={{
        title: 'Booking Ruang Meeting',
        headerStyle: {
          backgroundColor: '#D9D9D9',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: '100',
        },
      }}
    />
    <Stack.Screen
      name="JadwalRuangMeeting"
      component={JadwalRuangMeeting}
      options={({ navigation }) => ({
        title: 'Jadwal Ruang Meeting',
        headerStyle: {
          backgroundColor: '#D9D9D9',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: '100',
        },
        headerTitleContainerStyle: {
          justifyContent: 'center',
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.replace('Home')}
            style={{ paddingHorizontal: 15 }}
          >
            <Text style={{ fontSize: 35, color: '#000' }}>←</Text>
          </TouchableOpacity>
        ),
      })}
    />
  </Stack.Navigator>
);

export default RootNavigator;
