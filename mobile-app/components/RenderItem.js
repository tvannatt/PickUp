import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { Theme } from '../config/theme';
import { checkInUser, checkOutFromQueue, setPickedUpStatus, setStatus, fetchChildrenByIds } from '../config';
import { auth } from '../config';
import { child } from '@firebase/database';

const windowWidth = Dimensions.get('window').width;

let row = [];
let prevOpenedRow;

export const RenderItem = ({ item, index, fromComponent }) => {
    const [childrenData, setChildrenData] = useState([]);

    useEffect(() => {
        fetchChildrenByIds(item.children).then(data => {
            setChildrenData(data);
        });
    }, [item.children]); // Depend on item.children to refetch when it changes

    const closeRow = (index) => {
        if (prevOpenedRow && prevOpenedRow !== row[index]) {
            prevOpenedRow.close();
        }
        prevOpenedRow = row[index];
    };

    const swipeRight = (dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-200, 0],
            outputRange: [1, 0.5],
            extrapolate: 'clamp'
        });

        //dequeueing parents from the list
        const onButtonPress = () => {
            if (fromComponent === 'guardian') {
                checkInUser(auth.currentUser.email)
            } else if (fromComponent === 'staff') {
                checkOutFromQueue(item.id, auth.currentUser.email)
            }
        };

        return (
            <Animated.View style={[styles.swipeRightContainer, { backgroundColor: Theme.statusgreen }]}>
                <TouchableOpacity style={[styles.swipeRightContent, { transform: [{ scale }] }]} onPress={onButtonPress}>
                    <Feather name="user-check" size={75} color="white" />
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const height = new Animated.Value(70);
    const animatedDelete = () => {
        Animated.timing(height, {
            toValue: 0,
            duration: 10,
            useNativeDriver: false
        }).start();
    };

    const nameFormat = (names) => {
        if (names.length > 0) {
            return (
                <>
                    <Text style={styles.itemDetailText}>Picking up:</Text>
                    {names.map((name, index) => (
                        <View key={`${name}-${index}`} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={[styles.sideLine, {
                                borderTopLeftRadius: index === 0 ? 50 : 0,
                                borderTopRightRadius: index === 0 ? 50 : 0,
                                borderBottomLeftRadius: index === names.length - 1 ? 50 : 0,
                                borderBottomRightRadius: index === names.length - 1 ? 50 : 0,
                            }]} />
                            <Text style={styles.indentDetailText}>{name}</Text>
                        </View>
                    ))}
                </>
            );
        } else {
            return <Text style={styles.itemDetailText}>Error: No children listed</Text>;
        }
    };

    const ItemContent = () => (
        <View style={styles.itemInnerContainer}>
            <View style={styles.itemTextContainer}>
                <Text style={styles.itemNameText}>{item.name}</Text>
                {fromComponent === 'guardian' ? (
                    <Text style={styles.itemDetailText}>
                        {item.vehicle === 'car' ? 'Going home by car' : 'Error'}
                    </Text>
                ) : (
                    nameFormat(childrenData) // Assuming childrenData is available in your scope
                )}
            </View>
            <View style={styles.locationContainer}>
                {/* Conditional rendering if needed */}
                {fromComponent === 'staff' && <Text style={[styles.locationText, item.loc == null && { backgroundColor: 'transparent' }]}>{item.loc}</Text>}
            </View>
            {fromComponent === 'staff' && (
                <View style={[styles.colorIndicator, { backgroundColor: getColorIndicator(item.isCheckedIn, item.loc) }]} />
            )}
        </View>
    );

    if (fromComponent === 'staff' && item.isCheckedIn) {
        return (
            <Swipeable
                ref={ref => row[index] = ref}
                renderRightActions={swipeRight}
                rightThreshold={-200}
                onSwipeableOpen={() => {
                    closeRow(index);
                    animatedDelete();
                }}
            >
                <Animated.View style={styles.itemContainer}>
                    <ItemContent />
                </Animated.View>
            </Swipeable>
        );
    } else {
        // Non-swipeable content for guardians or non-checked-in staff
        return (
            <Animated.View style={styles.itemContainer}>
                <ItemContent />
            </Animated.View>
        );
    }
};

const getColorIndicator = (isCheckedIn, loc) => {
    if (isCheckedIn) {
        if (loc != null) {
            switch (loc) {
                case '1': return Theme.palegreyblue;
                case '2': return Theme.lightblue;
                case '3': return Theme.mediumblue;
                case '4': return Theme.darkblue;
            }
        } else {
            return Theme.lightgrey;
        }
    }
};

const styles = StyleSheet.create({
    swipeRightContainer: {
        marginTop: 10,
        marginRight: 20,
        width: "30%",
        marginBottom: 10,
        justifyContent: 'center',
        borderRadius: 8
    },
    swipeRightContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 15,
        fontWeight: 'bold'
    },
    itemContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    itemInnerContainer: {
        flexDirection: 'row',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        shadowColor: Theme.lightgrey,
        elevation: 5,
        backgroundColor: Theme.white,
        borderRadius: 8,
        width: windowWidth - 40,
        height: 'auto',
    },
    itemTextContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    itemNameText: {
        fontFamily: 'ComfortaaBold',
        fontSize: 21,
        color: Theme.darkgrey,
        paddingTop: 5,
    },
    itemDetailText: {
        fontFamily: 'ComfortaaSemiBold',
        fontSize: 17,
        color: Theme.lightgrey,
        paddingTop: 17,
        paddingBottom: 5,
    },
    indentDetailText: {
        fontFamily: 'ComfortaaSemiBold',
        fontSize: 17,
        color: Theme.lightgrey,
        paddingTop: 5,
    },
    sideLine: {
        height: '100%',
        width: 3,
        borderRadius: 0,
        backgroundColor: Theme.darkgrey,
        opacity: 0.6,
        marginLeft: 14,
        marginRight: 5,
    },
    locationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 20
    },
    locationText: {
        fontFamily: 'ComfortaaBold',
        color: Theme.locnum,
        fontSize: 15,
        backgroundColor: Theme.locbox,
        padding: 10,
        borderRadius: 5,
        height: 35,
        width: 35,
        textAlign: 'center', // Center text horizontally
    },
    colorIndicator: {
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8,
        justifyContent: 'flex-end',
        width: '2.5%',
        height: '100%',
    }
});
