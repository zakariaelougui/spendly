# Spendly — Expense Tracker

A React Native mobile app for tracking personal expenses, built with Expo.

---

## Requirements

- [Node.js](https://nodejs.org) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- [Expo Go](https://expo.dev/client) app on your iOS or Android device

---

## Installation

```bash
npm install
```

---

## Running the app

### On a physical device (same Wi-Fi network)

```bash
npx expo start --lan
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS).

### On an Android emulator

```bash
npx expo start --android
```

### On an iOS simulator

```bash
npx expo start --ios
```

### In a web browser

```bash
npx expo start --web
```

---

## Demo credentials

| Field    | Value               |
|----------|---------------------|
| Email    | alex@example.com    |
| Password | password            |

A guest mode is also available from the welcome screen — no credentials needed.

---

## Project structure

```
expense-tracker/
├── App.tsx                   # Root component — provider tree (theme, navigation)
├── index.ts                  # Expo entry point
├── app.json                  # Expo app config (name, icons, splash screen)
├── babel.config.js           # Babel config using babel-preset-expo
├── tsconfig.json             # TypeScript config
│
└── src/
    ├── api/
    │   ├── types.ts          # Zod schemas + TypeScript types (User, Expense, AuthSession)
    │   ├── client.ts         # HTTP client foundation (swap here to point at a real server)
    │   ├── auth.ts           # Auth API: login, signup, guestLogin, logout
    │   └── expenses.ts       # Expenses API: getExpenses, addExpense, deleteExpense
    │
    ├── store/
    │   ├── authStore.ts      # Zustand store — session state and auth actions
    │   └── expensesStore.ts  # Zustand store — expenses list and CRUD actions
    │
    ├── context/
    │   └── AuthContext.tsx   # Compatibility shim — re-exports useAuthStore as useAuth
    │
    ├── navigation/
    │   ├── index.tsx         # RootNavigator — switches between auth stack and app tabs
    │   └── types.ts          # Navigation prop types for screens
    │
    ├── screens/
    │   ├── WelcomeScreen.tsx # Landing screen — sign in / create account / guest
    │   ├── LoginScreen.tsx   # Email + password sign-in form
    │   ├── SignupScreen.tsx  # New account registration form
    │   ├── DashboardScreen.tsx # Expense list with monthly and all-time totals
    │   └── ProfileScreen.tsx # User info and sign-out
    │
    ├── components/
    │   └── AddExpenseModal.tsx # Modal form for adding a new expense
    │
    └── theme/
        └── index.ts          # MD3 theme with custom indigo/violet palette
```

---

## Architecture overview

- **State management** — [Zustand](https://github.com/pmndrs/zustand). Two stores: `authStore` for session data and `expensesStore` for the expense list.
- **Validation** — [Zod](https://zod.dev) is used both for form validation in screens and for parsing API responses at runtime.
- **Navigation** — [React Navigation](https://reactnavigation.org) with a native stack for auth screens and a bottom tab navigator for the main app.
- **UI** — [React Native Paper](https://reactnativepaper.com) (Material Design 3).
- **Dark mode** — three appearance options (Light, Dark, System) available in the Profile screen. The preference is persisted via `AsyncStorage` so it survives app restarts. `System` follows the device's color scheme automatically.
- **API layer** — currently backed by mock data with simulated delays. To connect a real backend, update `src/api/client.ts` and replace the function bodies in `src/api/auth.ts` and `src/api/expenses.ts`.
