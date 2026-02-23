# Building Tourly Mobile App

This guide explains how to build the Tourly mobile app for Android (APK) and iOS platforms.

## Prerequisites

Before building, ensure you have:

1. **Node.js** (v18 or later)
2. **pnpm** package manager
3. **Expo CLI** (`npm install -g expo-cli`)
4. **EAS CLI** (`npm install -g eas-cli`)
5. **Expo Account** (free at [expo.dev](https://expo.dev))

For iOS builds:
- macOS with Xcode installed (for local builds)
- Apple Developer Account ($99/year for App Store distribution)

For Android builds:
- Android Studio with SDK (for local builds)
- Java Development Kit (JDK 11 or later)

## Quick Start - Development Testing

### Web Preview
```bash
pnpm dev
```
Open the URL shown in terminal to preview the app in your browser.

### Mobile Preview (Expo Go)
1. Install **Expo Go** app on your phone (iOS App Store or Google Play)
2. Run `pnpm dev` in the project directory
3. Scan the QR code with your phone camera (iOS) or Expo Go app (Android)

## Building for Production

### Option 1: EAS Build (Recommended - Cloud Build)

EAS Build is Expo's cloud build service. It handles all the complexity of native builds.

#### Setup
```bash
# Login to Expo
eas login

# Configure the project (run once)
eas build:configure
```

#### Build Android APK
```bash
# Build APK for testing/sideloading
eas build --platform android --profile preview

# Build AAB for Google Play Store
eas build --platform android --profile production
```

#### Build iOS App
```bash
# Build for TestFlight/App Store
eas build --platform ios --profile production

# Build for simulator testing
eas build --platform ios --profile development --simulator
```

### Option 2: Local Build (Advanced)

For local builds, you need the full native development environment.

#### Android Local Build
```bash
# Generate native Android project
npx expo prebuild --platform android

# Build APK
cd android
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

#### iOS Local Build (macOS only)
```bash
# Generate native iOS project
npx expo prebuild --platform ios

# Open in Xcode
open ios/*.xcworkspace

# Build from Xcode (Product > Archive)
```

## Build Profiles

The `eas.json` file contains build configurations:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

- **development**: For testing with Expo Dev Client
- **preview**: For internal testing (APK for Android)
- **production**: For app store submission (AAB for Android, IPA for iOS)

## App Configuration

Key configuration files:

| File | Purpose |
|------|---------|
| `app.config.ts` | App name, icons, bundle ID, permissions |
| `eas.json` | Build profiles and settings |
| `package.json` | Dependencies and scripts |

### Updating App Info

Edit `app.config.ts` to change:
- `appName`: Display name in app stores
- `version`: App version number
- `icon`: App icon path
- `splash`: Splash screen settings

## Distribution

### Android
- **APK**: Direct install via file transfer or download link
- **AAB**: Upload to Google Play Console

### iOS
- **TestFlight**: Upload IPA to App Store Connect for beta testing
- **App Store**: Submit through App Store Connect

## Troubleshooting

### Common Issues

1. **Build fails with dependency errors**
   ```bash
   rm -rf node_modules
   pnpm install
   ```

2. **iOS build fails with signing errors**
   - Ensure Apple Developer account is configured in EAS
   - Run `eas credentials` to manage certificates

3. **Android build fails with SDK errors**
   - Update Android SDK tools
   - Check `android/build.gradle` for SDK version compatibility

### Getting Help

- [Expo Documentation](https://docs.expo.dev)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo Discord Community](https://chat.expo.dev)

## Project Structure

```
tourly-mobile/
├── app/                    # Screen components (Expo Router)
│   ├── (tabs)/            # Tab-based screens
│   │   ├── index.tsx      # Home screen
│   │   ├── destinations.tsx
│   │   ├── packages.tsx
│   │   └── gallery.tsx
│   └── contact.tsx        # Contact screen
├── assets/                # Images and static files
├── components/            # Reusable components
├── data/                  # App data (destinations, packages)
├── hooks/                 # Custom React hooks
├── app.config.ts          # Expo configuration
├── eas.json              # EAS Build configuration
└── package.json          # Dependencies
```

## Version History

- **1.0.0**: Initial release with Home, Destinations, Packages, Gallery, and Contact screens
