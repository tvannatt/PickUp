import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { sendVerificationEmail, auth } from '../config';
import { Theme } from '../config';

const handleLogout = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
};

export const VerifyEmail = ({ currentUser }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Please check your email and click on the link to verify your account and then proceed to log in.
            </Text>
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => sendVerificationEmail(currentUser)}
            >
                <Text style={styles.buttonText}>Resend Verification Email</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.button} 
                onPress={handleLogout}
            >
                <Text style={styles.buttonText}>Log in</Text>
            </TouchableOpacity>
            {/* Add more buttons or other elements here if needed */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'ComfortaaMedium',
        fontSize: 21,
        color: Theme.darkgrey,
        paddingTop: 5,
    },
    button: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        backgroundColor: Theme.darkblue,
        padding: 10,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 14,
        color: Theme.white,
        fontWeight: '500'
    },
    // Add styles for other elements if necessary
});
