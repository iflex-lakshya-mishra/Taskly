# Taskly

A simple Expo React Native todo app for organizing tasks with a clean UI.

## Screenshots

> Add your app screenshots here.

## Features

- Create tasks with title, note, date, and priority
- Mark tasks as completed
- View upcoming tasks, task history, and stats
- Schedule and manage tasks from a simple calendar UI
- Persistent local storage for tasks
- Authentication (Firebase)

## Tech Stack

- **Expo** (React Native)
- **React** + **TypeScript**
- **expo-router** (navigation)
- **Firebase** (authentication)
- **AsyncStorage** (persist tasks locally)
- **NativeWind / Tailwind CSS** (styling)

## Installation and Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure Firebase (required for login/signup):

   - Update the Firebase config files under `src/firebase/`.

## Run with Expo Go

1. Start the development server:

   ```bash
   npx expo start
   ```

2. Scan the QR code in **Expo Go** (iOS/Android) to run the app.

## Folder Structure

```text
.
├── app/                         # Expo Router screens
├── assets/                      # App icons, images, splash assets
├── src/                         # App code
│   ├── components/
│   ├── constants/
│   ├── firebase/               # Firebase config
│   ├── hooks/
│   ├── screens/
│   └── utils/                  # Storage + task hooks
├── types/
├── README.md
├── package.json
└── tsconfig.json
```

