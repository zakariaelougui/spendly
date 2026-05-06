/**
 * Navigation type definitions.
 *
 * Use `AuthNavProp<S>` and `AppTabNavProp<S>` as the `navigation` prop type
 * in screen components to get full TypeScript support for `navigate()` calls.
 */
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
};

export type AppTabParamList = {
  Dashboard: undefined;
  Profile: undefined;
};

export type AuthNavProp<S extends keyof AuthStackParamList> =
  NativeStackNavigationProp<AuthStackParamList, S>;

export type AppTabNavProp<S extends keyof AppTabParamList> =
  BottomTabNavigationProp<AppTabParamList, S>;
