import 'dotenv/config';

export default {
  expo: {
    name: 'Expo Firebase Starter',
    slug: 'expo-firebase',
    privacy: 'public',
    newArchEnabled: 'true',
    platforms: ['ios', 'android'],
    plugins: [
      [
        "expo-barcode-scanner",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access camera."
        }
      ]
    ],
    version: '0.15.0',
    orientation: 'portrait',
    icon: './assets/flame.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#FFFFFF'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      infoPlist: {
        NSCameraUsageDescription: "We need access to your camera for scanning QR codes."
      },
      supportsTablet: true
    },
    android: {
      package: "com.anonymous.expofirebase"
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID
    }
  }
};
