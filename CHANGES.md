# MyPlan – Fixed & Enhanced

## What Was Fixed & Changed

### 🐛 Bug Fixes
- **Empty components filled in**: `TaskItem.tsx`, `WeekStrip.tsx`, `colors.ts`, and `storage.ts` were all 0 bytes. All four are now fully implemented.
- **Firebase error messages**: Raw Firebase error codes (like `auth/user-not-found`) are now shown as friendly English messages.
- **Sign-out confirmation**: Added a confirmation dialog before signing out to prevent accidental logouts.
- **Name sync on login**: Display name is now looked up by UID *and* email for reliability.
- **Clear tasks now shows count**: The confirmation dialog now says how many tasks will be deleted.
- **Email normalized**: Email is `.trim().toLowerCase()` before auth calls to prevent case-sensitivity issues.

### 🔐 Per-User Task Storage (User Isolation)
Tasks are now stored under a user-specific key: `taskly-tasks-{uid}`.  
- Each user only sees their own tasks.  
- A one-time migration from the old shared key runs automatically.  
- `deleteTask(id)` method added to `useTasks` hook.

### 📱 Mobile UX Improvements
- Login & Signup forms now use a **card design** that looks great on all screen sizes.
- `returnKeyType` and `onSubmitEditing` wired up — users can submit with the keyboard "done" key.
- `hitSlop` added to small touch targets (eye icon, footer links).
- `ActivityIndicator` spinner shown inside buttons during loading.
- `autoComplete` hints for better autofill on iOS/Android.
- `SafeAreaView` added to SettingsScreen to avoid notch overlap.

### 🔵 Google Sign-In (Ready to Activate)
Google Sign-In buttons added to both Login and Signup screens.  
Full activation requires 3 steps:

1. **Install packages** (already added to `package.json`):
   ```bash
   npx expo install expo-auth-session expo-crypto
   ```

2. **Configure Firebase Console**:
   - Enable Google as a Sign-In provider
   - Download your Web Client ID, iOS Client ID, Android Client ID

3. **Add to `.env`**:
   ```
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
   EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
   ```

4. **Uncomment** the `expo-auth-session` import and the handler code in `LoginScreen.tsx` (marked with comments).

### 🧹 Junk Folders Removed
The following IDE/tool folders are safe to remove from your project root:
- `.idea/` (JetBrains IDE cache — not needed in repo)
- `.expo/` (Expo cache — auto-generated, in `.gitignore`)
- `node_modules/` (always excluded from version control)

These are already in `.gitignore` and should not be committed.

### 📁 Empty Root Folders
These root-level folders were empty stubs (content lives in `src/`):
- `components/`, `constants/`, `firebase/`, `hooks/`, `utils/`

You can safely delete them. All actual code is under `src/`.

## Files Changed
| File | Change |
|------|--------|
| `src/screens/LoginScreen.tsx` | Google button, better UX, friendly errors, card UI |
| `src/screens/SignupScreen.tsx` | Google button, better UX, friendly errors, card UI |
| `src/screens/SettingsScreen.tsx` | Stats display, sign-out confirm, SafeAreaView |
| `src/utils/useTasks.ts` | Per-user storage, `deleteTask` added |
| `src/components/TaskItem.tsx` | Implemented from scratch (was empty) |
| `src/components/WeekStrip.tsx` | Implemented from scratch (was empty) |
| `src/constants/colors.ts` | Implemented from scratch (was empty) |
| `src/utils/storage.ts` | Implemented from scratch (was empty) |
| `package.json` | Added `expo-auth-session`, `expo-crypto` |
