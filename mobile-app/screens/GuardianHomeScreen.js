import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SettingsScreen } from './SettingsScreen';
import { StatusScreen } from './StatusScreen';
import { Ionicons } from '@expo/vector-icons';
import { UserQRCode } from '../components';
import { GuardianNavBar } from '../components/NavBar';
import { auth } from '../config';
import { am_greetings, pm_greetings, evening_greetings } from '../components/Greetings';

const Tab = createBottomTabNavigator();

export const GuardianHomeScreen = ({ currentUser }) => {
  const hour = new Date().getHours();

  let greetings;
  switch (greetings) {
    case hour < 12:
      greetings = am_greetings;
      break;
    case hour > 17 && hour < 18:
      greetings = evening_greetings;
      break;
    default:
      greetings = pm_greetings;
  }

  const [greeting] = useState(
    greetings[Math.floor(Math.random() * greetings.length)]
  );

  return (
    <Tab.Navigator
      tabBar={props => <GuardianNavBar {...props} />}
      initialRouteName="Status"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Scan"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-scan" color={color} size={size} />
          )
        }}>
        {props => <UserQRCode {...props} userId={auth.currentUser.uid} />}
      </Tab.Screen>
      <Tab.Screen
        name="Status"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-information-circle-outline" color={color} size={size} />
          )
        }}
      >
        {props => <StatusScreen {...props} user={auth.currentUser} fromComponent="guardian" greeting={greeting} />}
      </Tab.Screen>

      <Tab.Screen name="Settings" options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="md-settings" color={color} size={size} />
        )
      }}>
        {() => <SettingsScreen greeting={greeting} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
