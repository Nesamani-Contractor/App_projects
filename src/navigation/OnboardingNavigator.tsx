import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './types';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import OnboardingJourneyScreen from '../screens/onboarding/OnboardingJourneyScreen';
import CreatingProfileScreen from '../screens/onboarding/CreatingProfileScreen';
import PaywallScreen from '../screens/premium/PaywallScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Journey" component={OnboardingJourneyScreen} />
      <Stack.Screen name="CreatingProfile" component={CreatingProfileScreen} />
      <Stack.Screen name="Paywall" component={PaywallScreen} />
    </Stack.Navigator>
  );
}
