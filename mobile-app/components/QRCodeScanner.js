import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Text, View, StyleSheet } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { AnimatedBackground } from './AnimatedBackground';
import { Theme, getKey, checkInUser, isUserCheckedIn } from '../config';
import CryptoES from 'crypto-es';

export const decryptData = (encryptedData, passphrase) => {
  const bytes = CryptoES.AES.decrypt(encryptedData, passphrase);
  const originalData = bytes.toString(CryptoES.enc.Utf8);
  return originalData;
};


// Comment out to test 
export const QRCodeScanner = () => {
   const [hasPermission, setHasPermission] = useState(null);
   const [isScannerActive, setIsScannerActive] = useState(true);
   const isFocused = useIsFocused();
  const cameraRef = useRef(null);

// Changes 


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);



  useFocusEffect(
    useCallback(() => {
      // Activate scanner when screen is focused
      setIsScannerActive(true);

      return () => {
        // Deactivate scanner when screen is unfocused
        setIsScannerActive(false);
      };
    }, [])
  );

  const handleBarCodeScanned = async (data) => {
    if (isScannerActive) {
      setIsScannerActive(false);

      // Check if data is a string
      if (typeof data.data !== 'string') {
        console.error('Scanned data is not a string:', data);
        // Handle the error appropriately
        // For example, set the scanner active again and return
        setIsScannerActive(true);
        return;
      }
      // cameraRef.current.pausePreview();

      try {
        const [keyName, encryptedData] = data.data.split(":");
        const key = await getKey(`encryptionKeys/${keyName}`);
        if (!key) {
          throw new Error('Encryption key not found');
        }

        const decryptedData = decryptData(encryptedData, key);

        const scannedData = JSON.parse(decryptedData);
        const scannedTimestamp = new Date(scannedData.timestamp);
        const currentTime = new Date();
        const timeDifference = currentTime - scannedTimestamp;
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        // cameraRef.current.resumePreview()
        if (hoursDifference <= 24) {
          const isCheckedIn = await isUserCheckedIn(scannedData.email);
          if (isCheckedIn) {
            Alert.alert("Already Checked In", "This user has already checked in.", [{ text: "OK", onPress: () => setIsScannerActive(true) }]);
            return;
          }
          checkInUser(scannedData.email, scannedData.children);
          Alert.alert("Scan Complete", "QR Code is valid and within 24 hours.", [{ text: "OK", onPress: () => setIsScannerActive(true) }]);
        } else {
          Alert.alert("Expired QR Code", "This QR Code is no longer valid as it was generated more than 24 hours ago.", [{ text: "OK", onPress: () => setIsScannerActive(true) }]);
        }
      } catch (error) {
        Alert.alert("Invalid QR Code", "There was an error reading the QR Code.", [{ text: "OK", onPress: () => setIsScannerActive(true) }]);
      }
    }
  };

  if (hasPermission === null) {
    return <Text>Please allow access to camera</Text>;
  }
  if (hasPermission === false) {
    return <Text>Camera access not provided</Text>;
  }

  return (
    <>
      <AnimatedBackground />
      <View style={styles.container}>
        {hasPermission === null && <Text>Please allow access to camera</Text>}
        {hasPermission === false && <Text>Camera access not provided</Text>}
        {hasPermission && (
          <>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Ready to scan.</Text>
            </View>
            <View style={styles.scannerContainer}>
              {isFocused && (
                <CameraView
                  onBarcodeScanned={handleBarCodeScanned}
                  style={StyleSheet.absoluteFillObject}
                  ref={cameraRef}
                  barCodeScannerSettings={{
                    barCodeTypes: ["qr", "pdf417"],
                  }}
                />
              )}
              <View style={styles.viewfinder} />
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    margin: 20, // Adjust spacing as needed
    paddingBottom: '25%'
  },
  titleContainer: {
    // Define the space for the title
    paddingHorizontal: 20,
    marginTop: 30,
  },
  scannerContainer: {
    flex: 1, // Takes up all available space
    width: '100%', // Full width of the container
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 20,  // Add rounded corners
    overflow: 'hidden', // Ensure inner content respects the rounded corners
  },
  viewfinder: {
    width: 250, // Set the width of the viewfinder
    height: 250, // Set the height of the viewfinder
    borderWidth: 2, // Border thickness
    borderColor: 'yellow', // Border color
    backgroundColor: 'transparent', // Transparent background
    alignSelf: 'center', // Center horizontally
    margin: 'auto', // Center vertically
    borderRadius: 2,
  },
  titleText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 27,
    color: Theme.white,
    fontFamily: 'ComfortaaBold',
    textShadowColor: Theme.white,
    textShadowRadius: 17,
  },

  scanner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
});
