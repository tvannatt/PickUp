import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../config';
import { BlurView } from 'expo-blur';

let radius = 35;

const styles = StyleSheet.create({
  buttonBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    overflow: 'visible',
    backgroundColor: Theme.white,
    borderRadius: radius,
    shadowColor: Theme.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  buttonShadow:{
    height: '100%',
    width: '100%',
    backgroundColor: Theme.black,
    borderColor: Theme.lightgrey,
    borderRadius: radius,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
    opacity: 0.4,
  },
  buttonTop:{
    height: '100%',
    width: '100%',
    backgroundColor: Theme.white,
    borderColor: Theme.lightgrey,
    borderRadius: radius,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurComponent: {
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: radius,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Theme.darkblue,
    fontFamily: 'ComfortaaMedium',
    fontSize: 23,
    alignSelf: 'center',
    position: 'absolute',
  },
});

export const NextButton = ({ onPress, label, spacing }) => (
<TouchableOpacity style={[styles.buttonBackground, { marginTop: spacing }]} onPress={onPress}>
    <View style={styles.container}>
      <View style={styles.buttonShadow}>
        <View style={styles.buttonTop}/>
      </View>
      <BlurView intensity={3} style={styles.blurComponent}/>
      <Text style={styles.buttonText}>{label}</Text>
    </View>
</TouchableOpacity>
);