# Clip-it – Expo Router Camera & Gallery App

An Expo (React Native) app using Expo Router with tabs, authentication via Clerk, and a camera-driven gallery experience.

Key libraries: `expo-router`, `expo-camera`, `expo-image`, `expo-file-system`, `expo-notifications`, `@react-navigation/*`, and `@clerk/clerk-expo`.

## Features

- Camera capture with preview and save flow
- Image gallery screen with full-screen viewing
- Tab navigation via Expo Router
- Authentication with Clerk (publishable key)
- Theming and custom icons/images

## Tech Stack

- Expo SDK 53, React Native 0.79, React 19
- Expo Router for file-based routing in `app/`
- React Navigation (tabs, native stack)

## Getting Started

1) Install dependencies

```bash
npm install
```

2) Configure environment variables

Create a `.env` file in the project root (or set via app config) and provide your Clerk publishable key:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Note: This project currently references `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in `app.json` under `expo.extra`. Prefer keeping secrets in `.env` and referencing them via `app.config.(js|ts)` in production.

3) Start the app

```bash
npx expo start
```

Open on:

- Android emulator or device
- iOS simulator (macOS) or device
- Web via React Native Web

## Scripts

- `npm run start` – Start the Expo dev server
- `npm run android` – Start and open Android
- `npm run ios` – Start and open iOS (macOS)
- `npm run web` – Start and open Web
- `npm run lint` – Lint the project
- `npm run reset-project` – Reset to a minimal starter (see `scripts/reset-project.js`)

## Folder Structure

```
app/
  (auth)/           # Clerk auth routes: sign-in, sign-up, auth layout
  (tabs)/           # Tab navigator layout and tab screens (camera, gallery, etc.)
  _layout.tsx       # Root router layout
assets/
  images/           # App icons and images (e.g., icon1.png)
  fonts/            # Custom fonts
components/         # Reusable UI components (e.g., PhotoPreviewSection)
constants/          # Shared constants (e.g., Colors.ts)
hooks/              # Custom hooks
scripts/            # Utility scripts (e.g., reset-project.js)
```

Routing follows Expo Router conventions. See official docs: https://docs.expo.dev/router/introduction

## Configuration

Key config: `app.json`

- `expo.name` / `expo.slug`: App identity
- `expo.icon` / `android.adaptiveIcon.foregroundImage` / `web.favicon`: App imagery
- `plugins`: Includes `expo-router` and `expo-splash-screen`
- `extra`: Includes `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `android.package`: Application ID for Android
- `runtimeVersion` and `updates.url`: For OTA updates via EAS

## Permissions

- Camera: required for capture (configured via `expo-camera`)
- Notifications: if used, ensure permission prompts are handled (`expo-notifications`)

On Android and iOS, Expo handles most permissions, but be sure to request them at runtime where required.

## Development Notes

- Camera screen: see `app/(tabs)/camera.tsx`
- Gallery screen: see `app/(tabs)/GalleryScreen.tsx`
- Auth routes: see `app/(auth)/sign-in.tsx` and `app/(auth)/sign-up.tsx`
- Reusable components: see `components/`

## Build and Release (EAS)

This project includes `eas.json`. To build, install EAS CLI and run:

```bash
npm install -g eas-cli
eas build --platform android   # or ios
```

For updates/OTA:

```bash
eas update --branch production --message "Update"
```

Docs: https://docs.expo.dev/build/introduction/

## Troubleshooting

- Metro cache issues: try `npx expo start -c`
- Android emulator not found: open Android Studio, start an AVD, then run `npm run android`
- iOS simulator (macOS): ensure Xcode + Command Line Tools installed
- Reanimated errors: ensure `react-native-reanimated` babel plugin is configured (Expo SDK templates usually include it). If issues persist, rebuild and clear caches.

## Contributing

Pull requests welcome. For major changes, please open an issue first to discuss what you’d like to change.

## License

Specify your license here (e.g., MIT). Add a `LICENSE` file at the project root for clarity.

