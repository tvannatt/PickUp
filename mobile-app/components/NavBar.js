import React from "react";
import { Text, View, SafeAreaView, StyleSheet, TouchableOpacity} from "react-native";
import { Theme } from "../config";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Svg, { Defs, Rect, LinearGradient, RadialGradient, Stop} from 'react-native-svg';

export const StaffNavBar = ({ navigation, state }) => {
const currentScreen = state.routes[state.index].name;
  return (
    <View style = {styles.navbarContainer}>
    <SafeAreaView>
        <View style={styles.container}>
            <TouchableOpacity style={ContainerState('Scan', currentScreen)} onPress={() => navigation.navigate('Scan')}>
                <ButtonState set_screen='Scan' active_screen={currentScreen} Lib={Ionicons} icon='scan'/>
            </TouchableOpacity>
            <TouchableOpacity style={ContainerState('Status', currentScreen)} onPress={() => navigation.navigate('Status')}>
                <ButtonState set_screen='Status' active_screen={currentScreen} Lib={Ionicons} icon='people'/>
            </TouchableOpacity>
            <TouchableOpacity style={ContainerState('Settings', currentScreen)} onPress={() => navigation.navigate('Settings')}>
                <ButtonState set_screen='Settings' active_screen={currentScreen} Lib={MaterialIcons} icon='settings'/>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
    </View>
  );

}

export const GuardianNavBar = ({ navigation, state }) => {
    const currentScreen = state.routes[state.index].name;
      return (
        <View style = {styles.navbarContainer}>
        <SafeAreaView>
            <View style={styles.container}>
                <TouchableOpacity style={ContainerState('Scan', currentScreen)} onPress={() => navigation.navigate('Scan')}>
                    <ButtonState set_screen='Scan' active_screen={currentScreen} Lib={Ionicons} icon='qr-code'/>
                </TouchableOpacity>
                <TouchableOpacity style={ContainerState('Status', currentScreen)} onPress={() => navigation.navigate('Status')}>
                    <ButtonState set_screen='Status' active_screen={currentScreen} Lib={Ionicons} icon='person'/>
                </TouchableOpacity>
                <TouchableOpacity style={ContainerState('Settings', currentScreen)} onPress={() => navigation.navigate('Settings')}>
                    <ButtonState set_screen='Settings' active_screen={currentScreen} Lib={MaterialIcons} icon='settings'/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        </View>
      );
    }

const ContainerState = ( set_screen, active_screen ) => {
    let style;
    switch (set_screen) {
        case active_screen:
          style = styles.active_container;
          break;
        default:
          style = styles.ready_container;
    }
    return style;
}

const ButtonState = ({ set_screen, active_screen, Lib, icon }) => {
    let state;
    switch (active_screen) {
        case 'Scan':
            switch (set_screen) {
                case active_screen:
                    state = <ActiveButtonDark Lib={Lib} icon={icon} screen={active_screen}/>;
                    break;
                default:
                    state = <ReadyButtonDark Lib={Lib} icon={icon}/>;
            }
            break;
        default:
            switch (set_screen) {
                case active_screen:
                    state = <ActiveButtonLight Lib={Lib} icon={icon} screen={active_screen}/>;
                    break;
                default:
                    state = <ReadyButtonLight Lib={Lib} icon={icon}/>;
            }
    }
    return state;
}

const ReadyButtonLight = ({ Lib, icon }) => {
    return(
        <Svg>
            <View style={styles.icon_center_container}>
                <Lib name={icon} size={45} color={Theme.mediumGray}/>
            </View>
            <Defs>
                <RadialGradient id="grad">
                    <Stop offset="91%" stopColor={Theme.white} stopOpacity="1" />
                    <Stop offset="91%" stopColor={Theme.lightgrey} stopOpacity="0.08" />
                    <Stop offset="100%" stopColor={Theme.lightgrey} stopOpacity="0.05" />
                </RadialGradient>
            </Defs>
            <Rect
                fill={Theme.white}
                x="0"
                y="0"
                width="100%"
                height="100%"
                fillOpacity="100%"
                rx="100%"
            />
            <Rect
                fill='url(#grad)'
                x="0"
                y="0"
                width="100%"
                height="100%"
                fillOpacity="100%"
                rx="100%"
                />
        </Svg>
    )
}

const ReadyButtonDark = ({ Lib, icon }) => {
    return(
        <Svg>
            <View style={styles.icon_center_container}>
                <Lib name={icon} size={45} color={Theme.mediumGray}/>
            </View>
            <Defs>
                <RadialGradient id="grad">
                    <Stop offset="93%" stopColor={Theme.white} stopOpacity="1" />
                    <Stop offset="93%" stopColor={Theme.lightgrey} stopOpacity="0.2" />
                    <Stop offset="100%" stopColor={Theme.black} stopOpacity="0.4" />
                </RadialGradient>
            </Defs>
            <Rect
                fill={Theme.white}
                x="0"
                y="0"
                width="100%"
                height="100%"
                fillOpacity="100%"
                rx="100%"
            />
            <Rect
                fill='url(#grad)'
                x="0"
                y="0"
                width="100%"
                height="100%"
                fillOpacity="100%"
                rx="100%"
                />
        </Svg>
    )
}

const outerRectWidth = 150;
const outerRectHeight = 90;
const round = 14

const ActiveButtonDark = ({ Lib, icon, screen }) => {
    return(
        <Svg>
            <View style={styles.icon_scan_container}>
                <Lib name={icon} size={45} color={Theme.darkgrey}/>
                <Text style={styles.label_dark}>{screen.toLowerCase()}</Text>
            </View>
        <Rect
            fill={Theme.white}
            x="0"
            y="0"
            width="100%"
            height="100%"
            fillOpacity="0.5"
            rx={round}
        />
        <Rect
            fill={Theme.white}
            x={calculatePosition(outerRectWidth, (outerRectWidth * 98) / 100)}
            y={calculatePosition(outerRectHeight, (outerRectHeight * 97) / 100)}
            width="98%"
            height="97%"
            fillOpacity="0.75"
            rx={round-1}
        />
        <Rect
            fill={Theme.white}
            x={calculatePosition(outerRectWidth, (outerRectWidth * 96) / 100)}
            y={calculatePosition(outerRectHeight, (outerRectHeight * 94) / 100)}
            width="96%"
            height="94%"
            fillOpacity="1"
            rx={round-2}
        />   
        </Svg>
    )
}

const ActiveButtonLight = ({ Lib, icon, screen}) => {
    return(
        <Svg>
            <View style={screen === 'Settings' ? styles.icon_settings_container : styles.icon_status_container}>
                <Lib name={icon} size={45} color={Theme.white}/>
                <Text style={styles.label_light}>{screen.toLowerCase()}</Text>
            </View>
        <Defs>
            <LinearGradient id="grad" x1="46%" y1="15%" x2="100%" y2="0%">
                <Stop offset="100%" stopColor={Theme.lightblue} />
                <Stop offset="0%" stopColor={Theme.mediumblue} />
            </LinearGradient>
        </Defs>
        <Rect
            fill='url(#grad)'
            x="0"
            y="0"
            width="100%"
            height="100%"
            fillOpacity="0.5"
            rx={round}
        />
        <Rect
            fill='url(#grad)'
            x={calculatePosition(outerRectWidth, (outerRectWidth * 98) / 100)}
            y={calculatePosition(outerRectHeight, (outerRectHeight * 97) / 100)}
            width="98%"
            height="97%"
            fillOpacity="0.75"
            rx={round-1}
        />
        <Rect
            fill='url(#grad)'
            x={calculatePosition(outerRectWidth, (outerRectWidth * 96) / 100)}
            y={calculatePosition(outerRectHeight, (outerRectHeight * 94) / 100)}
            width="96%"
            height="94%"
            fillOpacity="1"
            rx={round-2}
        />   
        </Svg>
    )
}

const calculatePosition = (outerWidth, innerWidth) => {
    const position = (outerWidth - innerWidth) / 2;
    return position >= 0 ? position : 0;
};

const styles = StyleSheet.create({
    navbarContainer: {
        position: "absolute",
        bottom: 0,
        width: '100%',
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 20,
        paddingRight: 20,
        height: 90,
        paddingTop: 20,
    },
    ready_container: {
        alignItems: "center",
        justifyContent: "center",
        width: 70,
        height: '100%',
    },
    active_container: {
        alignItems: "center",
        justifyContent: "center",
        width: outerRectWidth,
        height: '100%',
    },
    ready_button: {
        alignItems: "center",
        justifyContent: "center",
        width: 70,
        height: '100%',
    },
    icon_center_container: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon_scan_container: {
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 17,
        paddingRight: 27,
    },
    icon_status_container: {
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 17,
        paddingRight: 23,
    },
    icon_settings_container: {
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 17,
        paddingRight: 15,
    },
    label_dark: {
        fontFamily: 'ComfortaaMedium',
        color: Theme.darkgrey,
        fontSize: 15,
    },
    label_light: {
        fontFamily: 'ComfortaaMedium',
        color: Theme.white,
        fontSize: 15,
    }
});
