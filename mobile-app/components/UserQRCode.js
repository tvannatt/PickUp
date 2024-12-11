import React, { useEffect, useRef, useState, } from 'react';
import { View, StyleSheet, Text, Dimensions, Share, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Theme,auth, getKey } from '../config';
import CryptoES from 'crypto-es';
import * as Brightness from 'expo-brightness';
import { AnimatedBackground } from './AnimatedBackground';
import { useIsFocused } from '@react-navigation/native';
import { SecondaryButton } from './SecondaryButton';

export const encryptData = (data, passphrase) => {
  if (!passphrase) {
    console.error('Passphrase is undefined');
    return ''; // Return an empty string or handle this case as needed
  }
  const encryptedData = CryptoES.AES.encrypt(JSON.stringify(data), passphrase).toString();
  return encryptedData;
};

export const generateQRData = async (keyName) => {
  try {
    const keyPath = `encryptionKeys/${keyName}`;
    const key = await getKey(keyPath); // Make sure getKey is implemented correctly

    if (!key) {
      console.error('Encryption key not found');
      return '';
    }

    const currentTime = new Date().toISOString();
    const dataToEncrypt = {
      email: auth.currentUser?.email, // Ensure you have a current user and email
      timestamp: currentTime,
    };

    const encryptedData = encryptData(dataToEncrypt, key);
    const qrData = `${keyName}:${encryptedData}`;
    return qrData;
  } catch (error) {
    console.error('Error generating QR data:', error);
    return '';
  }
};

const screenWidth = Dimensions.get('window').width;
const qrCodeSize = screenWidth * 0.82;

export const UserQRCode = () => {
  const [qrData, setQrData] = useState('');
  const [dataURL, setDataURL] = useState(''); // State to store the QR code data URL
  const qrRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const data = await generateQRData('keyA');
      setQrData(data);
    };

    fetchData();
  }, []);

  // Effect to generate data URL once qrData is ready
  useEffect(() => {
    if (qrData && qrRef.current) {
      qrRef.current.toDataURL((data) => {
        setDataURL(data); // Store the generated data URL
      });
    }
  }, [qrData]); // Dependency on qrData to regenerate the data URL when it changes

  const shareQRCode = () => {
    if (!dataURL) {
      console.log("QR Code is not ready for sharing.");
      return;
    }
    let shareImageBase64 = {
      title: 'QR Code',
      message: `Miller Elementary Pickup QR Code \n\nThis will be valid only for 24 hours`,
      url: `data:image/png;base64,${dataURL}`, // Use the pre-generated data URL
    };

    Share.share(shareImageBase64).catch((error) => console.log(error));
  };

  const renderContent = () => {
    if (qrData) {
      // Render QR code if qrData is available
      return (
        <>
          <View style={[styles.qrContainer, { width: qrCodeSize * 1.1, height: qrCodeSize * 1.1 }]}>
            <QRCode
              value={qrData}
              size={qrCodeSize}
              backgroundColor="white"
              getRef={qrRef} />
          </View>
        </>
      );
    } else {
      // Render a placeholder or loading indicator when qrData is not available
      return <Text style={styles.textStyle}>Generating QR code...</Text>;
    }
  };

  const boostBrightness = () => {
    const isFocused = useIsFocused();
    const grated = useRef(false);
    const [originalBrightness, setOriginalBrightness] = useState(0);

    useEffect(() => {
      (async () => {
        const { status } = await Brightness.requestPermissionsAsync();
        if (status === 'granted') {
          grated.current = true;
        }
      }
      )();
    }, []);

    useEffect(() => {
      Brightness.getBrightnessAsync().then(setOriginalBrightness);
    }, []);

    useEffect(() => {
      if (isFocused && grated.current) {
        Brightness.setBrightnessAsync(1);
      } else {
        Brightness.setBrightnessAsync(originalBrightness);
      }
    }, [isFocused, originalBrightness]);
  };

  return (
    <>
      <AnimatedBackground />
      {boostBrightness()}
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.headerText}>QR Code is Ready To Scan</Text>
        </View>
        {renderContent()}
        <View style={styles.textContainer}>
          <Text style={styles.instructionText}>Please show your device to a staff member</Text>
        </View>
        <View style={styles.buttonContainer}>
          <SecondaryButton onPress={shareQRCode} label="share QR code" />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrContainer: {
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: qrCodeSize * 0.05, // Adjust the value for more or less rounded corners
    padding: 5, // Spacing around the QR code
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    transform: [{ translateY: -40 }],
  },
  textContainer: {
    alignItems: 'center',
    paddingLeft: 40,
    paddingRight: 40,
  },
  headerText: {
    padding: 20,
    fontSize: 27,
    fontFamily: 'ComfortaaBold',
    color: Theme.white,
    textAlign: 'center', // Center text horizontally
    textShadowColor: Theme.white,
    textShadowRadius: 17,
    transform: [{ translateY: -70 }],
  },
  instructionText: {
    padding: 20,
    fontSize: 20,
    fontFamily: 'ComfortaaRegular',
    color: Theme.white,
    textAlign: 'center',
    textShadowColor: Theme.white,
    textShadowRadius: 17,
    transform: [{ translateY: -50 }],
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '40%',
    height: 45,
    transform: [{ translateY: -30 }],
  },
});
