import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Modal, Alert, TextInput } from 'react-native';
import { deleteAccount, generateKey } from '../config';
import { getDate, handleLogout } from '../utils';
import { Theme } from '../config/theme';
import { LinearGradient } from 'expo-linear-gradient';

export const SettingsScreen = ({ greeting }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteText, setDeleteText] = useState('delete');

    const handleCloseModal = () => {
        setModalVisible(false);
        setDeleteText('placeholder');  // Clear the input field
    };


    const handleDeleteAccount = async () => {
        if (deleteText === 'delete') {
            try {
                await deleteAccount();  // Call your delete account function here
                console.log('Account deleted successfully.');
            } catch (error) {
                console.error('Error deleting account: ', error);
            }
        } else {
            Alert.alert('Incorrect Confirmation', 'Please type "delete" to confirm.');
        }

        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{greeting},</Text>
            </View>
            <View style={styles.dateContainer}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[ Theme.lightblue, Theme.mediumblue, Theme.mediumblue ]} style={styles.dateGradient}>
                    <Text style={styles.dateText}>{getDate()}</Text>
                </LinearGradient>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Sign out</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => generateKey(true)} style={styles.button}>
                <Text style={styles.buttonText}>Generate Key</Text>
            </TouchableOpacity>

            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Type "delete" to confirm account deletion:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setDeleteText}
                            value={deleteText}
                            placeholder="type 'delete'"
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={handleDeleteAccount}
                        >
                            <Text style={styles.textStyle}>Confirm Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleCloseModal}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Text style={styles.versionText}>
                {"version 0.1 (alpha 1)" /* Keep up to date with version number */}
            </Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Theme.white
    },
    header: {
        paddingTop: 5,
        paddingLeft: 15,
        alignSelf: 'left'
    },
    headerText: {
        fontFamily: 'ComfortaaMedium',
        fontSize: 32,
        color: Theme.lightgrey
    },
    subHeaderText: {
        paddingTop: 5,
        fontFamily: 'ComfortaaBold',
        fontSize: 32,
        color: Theme.darkgrey
    },
    dateContainer: {
        paddingTop: 3,
        marginTop: 10,
        marginBottom: 62,
        marginRight: 15,
        height: 8,
        alignSelf: 'flex-start',
    },
    dateGradient: {
        paddingTop: 2,
        borderBottomRightRadius: 3.5,
        borderTopRightRadius: 3.5,
        paddingBottom: 5,
    },
    dateText: {
        fontFamily: 'ComfortaaBold',
        fontSize: 15,
        paddingTop: 3,
        paddingLeft: 15,
        color: 'transparent',
        marginRight: 5,
    },
    logoutButton: {
        paddingLeft: 15,
        borderRadius: 5,
    },
    logoutButtonText: {
        fontFamily: 'ComfortaaLight',
        color: Theme.darkgrey,
        fontSize: 25
    },
    deleteButton: {
        paddingTop: 10,
        paddingLeft: 15,
        borderRadius: 5
    },
    deleteButtonText: {
        fontFamily: 'ComfortaaLight',
        color: Theme.darkgrey,
        fontSize: 25
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    input: {
        // Styling for the input field
    },
    button: {
        // Styling for the button
    },
    buttonClose: {
        // Additional styling for the close button
    },
    buttonCancel: {
        //cancel button for modal
    },
    textStyle: {
        // Styling for the button text
    },
    modalText: {
        // Styling for the modal text
    },
    versionText: {
        fontFamily: 'ComfortaaLight',
        color: '#A6A6A6',
        fontSize: 15,
        paddingLeft: 15,
        paddingTop: 20
    }
});
