import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { QRCodeScanner } from '../components'
import { auth, setPickedUpStatus } from '../config';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusScreen } from './StatusScreen';
import { SettingsScreen } from './SettingsScreen';
import { StaffNavBar } from '../components/NavBar';
import { am_greetings, pm_greetings, evening_greetings } from '../components/Greetings';

const handleScannedData = (data) => {
  // Handle the scanned data here.
  // For demonstration, we'll just display an alert with the scanned data.
  Alert.alert('Scanned Data', data);

  setPickedUpStatus(data);
};


const ScanScreen = () => (
  <View style={styles.QRContainer}>
    <QRCodeScanner onScan={handleScannedData} />
  </View>
);

const Tab = createBottomTabNavigator();

export const StaffHomeScreen = ({ currentUser }) => {
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
      tabBar={props => <StaffNavBar {...props} />}
      initialRouteName="Status"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabbar: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-scan" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="Status"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-information-circle-outline" color={color} size={size} />
          )
        }}
      >
        {props => <StatusScreen {...props} user={auth.currentUser} fromComponent="staff" greeting={greeting} />}
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

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  QRContainer: {
    flex: 1,
    justifyContent: 'center',
  }
});