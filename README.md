# PICKUP APP/DASHBOARD
![Supports Expo iOS](https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff)
![Supports Expo Android](https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff)
[![runs with Expo Go](https://img.shields.io/badge/Runs%20with%20Expo%20Go-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.dev/client)

## Installation
# For both app and website, you will need a `.env` file
# Replace XXXX's with your own Firebase config keys

1. make `.env` file
2. Update `.env` with your own configuration, e.g.:

```shell
#For the app the .env file will look like this:
API_KEY=XXXX
AUTH_DOMAIN=XXXX
PROJECT_ID=XXXX
STORAGE_BUCKET=XXXX
MESSAGING_SENDER_ID=XXXX
APP_ID=XXXX
```

```shell
#For the website the .env file will look like this:
REACT_APP_API_KEY=XXXX
REACT_APP_AUTH_DOMAIN=XXXX
REACT_APP_PROJECT_ID=XXXX
REACT_APP_STORAGE_BUCKET=XXXX
REACT_APP_MESSAGING_SENDER_ID=XXXX
REACT_APP_APP_ID=XXXX
```

3. Start the project (app):
- `cd mobile-app` -- navigate to the corresponding folder
- Place the `.env` file within the folder
- `npm install` -- install dependencies
- `yarn ios` -- open on iOS simulator
- `yarn android` -- open on Android simulator
- `npx expo start` -- open QR code to run on physical device with Expo Go

4. To test:
- `npm run test` -- runs tests

5. Start the project (website):
- `cd website` -- navigate to the corresponding folder
- Place the `.env` file within the folder
- `npm install` -- install dependencies
- `npm start` -- begins website in development mode. 
- ![Website](https://pickup-e29cc.web.app/) -- actual website

6. To Publish new version of website:
- `npm run build` -- compiles all files within the `website` folder into a `build` folder
- `firebase deploy` -- publishes the build folder to the website link. (linked in step 5).

## File Structure (app)

```shell
Pickup mobile app
├── __tests__ ➡️ Unit tests for the app. Primarily for the QR code encryption/decryption
├── assets ➡️ All static assets, includes app logo and fonts
├── components ➡️ All re-suable UI components for form screens
│   └── AnimatedBackground.js ➡️ UI Component for animating the background
│   └── Button.js ➡️ Custom Button component using Pressable, comes with two variants and handles opacity
│   └── ChildButton.js ➡️ Work in progress. unused
│   └── FormErrorMessage.js ➡️ Component to display server errors from Firebase
│   └── Greetings.js ➡️ Component to ranomize greetings
│   └── Icon.js ➡️ Icon component
│   └── index.js ➡️ Page where we see which components are actually in use
│   └── LoadingIndicator.js ➡️ Loading indicator component
│   └── Logo.js ➡️ Logo component
│   └── NavBar.js ➡️ Work in progress. Revamped nav bar component
│   └── NextButtom.js ➡️ Work in progress
│   └── QRCodeScanner.js ➡️ Staff side component which processes the scanning of QR codes
│   └── RenderItem.js ➡️ Staff/Guardian side component. determines what to show for the status page of each 
│   └── SecondaryButtom.js ➡️ Smaller button design.
│   └── TextInput.js ➡️ Custom TextInput component that supports left and right cons
│   └── UserQRCode.js ➡️ Guardian side component which creates the QR code that will be shown to staff
│   └── VerifyEmail.js ➡️ Component that users see if they need to verify their email.
│   └── View.js ➡️ Custom View component that supports safe area views
├── hooks ➡️ All custom hook components
│   └── useTogglePasswordVisibility.js ➡️ A custom hook that toggles password visibility on a TextInput component on a confirm password field
├── config ➡️ All configuration files
│   └── firebase.js ➡️ Configuration file to initialize firebase with firebaseConfig and auth. Contains all backend connections. Consider splitting this up into multiple files.
│   └── images.js ➡️ Require image assets, reusable values across the app
│   └── theme.js ➡️ Custom set of colors, reusable values across the app
├── providers ➡️ All custom providers that use React Context API
│   └── AuthenticatedUserProvider.js ➡️ An Auth User Context component that shares Firebase user object when logged-in
├── navigation
│   └── AppStack.js ➡️ Protected routes such as Home screen
│   └── AuthStack.js ➡️ Routes such as Login screen, when the user is not authenticated
│   └── RootNavigator.js ➡️ Switch between Auth screens and App screens based on Firebase user logged-in state
├── screens
│   └── ForgotPasswordScreen.js ➡️ Forgot Password screen component
│   └── GuardianHomeScreen.js ➡️ Protected route/screen component. Renders general information for guardian and navigation bar
│   └── HomeScreen.js ➡️ Screen component determines whehter to render guardian, staff, or verify email screen
│   └── index.js ➡️ Shows which components are in use/can be used
│   └── LoginScreen.js ➡️ Login screen component
│   └── SettingsScreen.js ➡️ Screen for logout and delete account functionality. Preferences can also be put here
│   └── SignupScreen.js ➡️ Signup screen component
│   └── StaffHomeScreen.js ➡️ Protected route/screen component. Renders general information for staff and navigation bar
│   └── StatusScreen.js ➡️ Determines what to render for Guardians/Staff. Guardians will see their children here. Staff will see all children here. Live updates on the childrens status will be displayed
├── App.js ➡️ Entry Point for Mobile apps, wrap all providers here
├── app.config.js ➡️ Expo config file
└── babel.config.js ➡️ Babel config (should be using `babel-preset-expo`)
```

## File Structure (website)
```shell
Pickup dashboard
├── public ➡️ Outward facing files, like favicon, logo, and assets
├── src ➡️ Functional code. Most development should be done here
│   └── components ➡️ reusable screens, things that the users will see
│       └── AdminPage.js ➡️ Protected Route. Organizes what the admin will see, header, dashboard, footer
│       └── CSVUploadComponent.js ➡️ Clickable component that accepts a csv file and uploads the data to firebase
│       └── LiveUpdates.js ➡️ Dashboard that reflects the status of children in relation to the queue
│       └── LoginPage.js ➡️ Only allows authorized users to enter the admin page
│       └── ProtectedRoute.js ➡️ Declares which pages are protected
│   └── css ➡️ Determines the look of each page.
│       └── AdminPage.js ➡️ Where the header/footer should be
│       └── LiveUpates.js ➡️ Dashboard uses a table component from Bootstrap library
│       └── LoginPage.js ➡️ Simple UI components
│   └── firebase ➡️ Connects website to firebase
│       └── firebase.js ➡️ Connects to database and real-time database
├── App.css ➡️ Look of teh overall website, manages routes
├── App.js ➡️ Manages routes
├── index.css ➡️ Also manages looks
├── index.js ➡️ Determines which components should be rendered first
├── ThemeContext.js ➡️ Dark mode for website
```
