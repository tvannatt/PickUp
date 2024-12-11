import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../config';

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        borderRadius: 50,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Theme.white,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
        overflow: 'visible',
    },
    label: {
        fontSize: 15,
        fontFamily: 'ComfortaaMedium',
        color: Theme.white,
    },
});

export const SecondaryButton = ({ onPress, label }) => (
<TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.label}>{label}</Text>
</TouchableOpacity>
);