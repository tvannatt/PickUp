import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';

import { RootNavigator } from './navigation/RootNavigator';
import { AuthenticatedUserProvider } from './providers';
import { AnimatedBackground } from './components/AnimatedBackground';
import { NextButton } from './components/NextButton';

const App = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        'ComfortaaBold': require('./assets/fonts/Comfortaa-Bold.ttf'),
        'ComfortaaSemiBold': require('./assets/fonts/Comfortaa-SemiBold.ttf'),
        'ComfortaaMedium': require('./assets/fonts/Comfortaa-Medium.ttf'),
        'ComfortaaRegular': require('./assets/fonts/Comfortaa-Regular.ttf'),
        'ComfortaaLight': require('./assets/fonts/Comfortaa-Light.ttf'),
      });
      setFontLoaded(true);
    };

    loadFont();
  }, []);

  if (!fontLoaded) {
    return null;
  }

  return (
    <AuthenticatedUserProvider>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </AuthenticatedUserProvider>
  );
};

export default App;