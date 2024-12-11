import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchAllGuardianData, fetchChildrenData } from '../config';
import { getDate } from '../utils';
import { RenderItem } from '../components';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';

import Svg, { Defs, Rect, Stop } from 'react-native-svg';

import { Theme } from '../config/theme';

const sortPeople = (peopleData) => {
    // Sort the array by isCheckedIn status first, then by loc in ascending order.
    return peopleData.sort((a, b) => {
        if (a.isCheckedIn && !b.isCheckedIn) return -1;
        if (!a.isCheckedIn && b.isCheckedIn) return 1;

        const locA = a.loc !== undefined && !isNaN(parseInt(a.loc, 10)) ? parseInt(a.loc, 10) : Infinity;
        const locB = b.loc !== undefined && !isNaN(parseInt(b.loc, 10)) ? parseInt(b.loc, 10) : Infinity;

        if (locA === 1 && locB !== 1) return -1;
        if (locA !== 1 && locB === 1) return 1;

        if (locA === Infinity && locB !== Infinity) return 1;
        if (locA !== Infinity && locB === Infinity) return -1;

        return locA - locB;
    });
};

export const StatusScreen = ({ user, fromComponent, greeting }) => {
    const [people, setPeople] = useState([]);
    const email_id = user.email;
    useEffect(() => {
        let unsubscribe;

        const handleData = (data) => {
            const people = fromComponent == "staff" ? sortPeople(data) : data;
            setPeople(people);
        };

        if (fromComponent === 'guardian') {
            unsubscribe = fetchChildrenData(user.email, handleData);
        } else if (fromComponent === 'staff') {
            unsubscribe = fetchAllGuardianData(handleData);
        }

        return () => unsubscribe && unsubscribe();
    }, [fromComponent, user.email]); // Ensure user.email is a dependency if it's used in the effect
    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{greeting},</Text>
                {/*make api to get name based off user email */}
                <Text style={styles.subHeaderText}>{email_id}</Text>
            </View>
            <View style={styles.dateContainer}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[ Theme.lightblue, Theme.mediumblue, Theme.mediumblue ]} style={styles.dateGradient}>
                    <Text style={styles.dateText}>{getDate()}</Text>
                </LinearGradient>
            </View>

            <View style={styles.listContainer}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={[`rgba(${Theme.whiteAlpha}, 1)`, `rgba(${Theme.whiteAlpha}, 0)`]} style={[styles.feather, { top: 0 }]}/>
                <FlatList
                    contentContainerStyle={styles.listContent}
                    data={people}
                    renderItem={({ item, index }) => (
                        <RenderItem item={item} index={index} fromComponent={fromComponent} />
                    )}
                    keyExtractor={item => item.id}
                />
                <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} colors={[`rgba(${Theme.whiteAlpha}, 1)`, `rgba(${Theme.whiteAlpha}, 0)`]} style={[styles.feather, { bottom: 0 }]}/>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.white,
    },
    header: {
        paddingTop: 5,
        paddingLeft: 15,
        alignSelf: 'flex-start'
    },
    headerText: {
        fontFamily: 'ComfortaaMedium',
        fontSize: 32,
        color: Theme.lightgrey
    },
    subHeaderText: {
        paddingTop: 5,
        fontFamily: 'ComfortaaBold',
        fontSize: 22,
        color: Theme.darkgrey
    },
    dateContainer: {
        paddingTop: 3,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 15,
        height: 30,
        alignSelf: 'flex-start',
    },
    dateGradient: {
        paddingTop: 2,
        borderBottomRightRadius: 3.5,
        borderTopRightRadius: 3.5,
        paddingBottom: 5,
    },
    listContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        marginBottom: '22%',
    },
    listContent: {
        marginTop: 20,
        paddingBottom: 20,
    },
    dateText: {
        fontFamily: 'ComfortaaBold',
        fontSize: 15,
        paddingTop: 3,
        paddingLeft: 15,
        color: Theme.white,
        marginRight: 5,
    },
    feather: {
        height: 25,
        width: '100%',
        position: 'absolute',
        zIndex: 1,
    }
});
