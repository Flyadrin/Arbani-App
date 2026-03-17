# Arbani Tour - Mobile App Setup

The web app is configured with Capacitor to build native **iOS** and **Android** apps.

## Prerequisites

- Node.js 18+ or Bun
- For Android: Android Studio + JDK 17
- For iOS: macOS + Xcode 16+

## Build Steps

### 1. Install dependencies
```bash
bun install
```

### 2. Build the static export
```bash
bun run build
```
This generates the `out/` folder (static HTML/JS/CSS).

### 3. Add native platforms (first time only)
```bash
npx cap add android
npx cap add ios
```

### 4. Sync web assets to native
```bash
npx cap sync
```

### 5. Open in Android Studio
```bash
npx cap open android
```
Then press Run (▶) to build and install on device/emulator.

### 6. Open in Xcode (macOS only)
```bash
npx cap open ios
```
Then press Run (▶) in Xcode.

## After any code changes
```bash
bun run build && npx cap sync
```

## App Configuration
- App ID: `com.arbanitour.app`
- App Name: `Arbani Tour`
- Config file: `capacitor.config.ts`

## Publish to App Stores
- **Google Play**: Generate a signed APK/AAB from Android Studio
- **Apple App Store**: Archive from Xcode, submit via App Store Connect
