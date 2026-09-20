import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { RootTabParamList, MainStackParamList } from './types';
import ScanStackNavigator from './ScanStackNavigator';
import LooksStackNavigator from './LooksStackNavigator';
import DashboardStackNavigator from './DashboardStackNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import PaywallScreen from '../screens/premium/PaywallScreen';
import SplashHomeScreen from '../screens/SplashHomeScreen';
import { colors } from '../theme/colors';
import { useAppState } from '../context/AppStateContext';

const Tab = createBottomTabNavigator<RootTabParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.ivory,
    primary: colors.roseDeep,
  },
};

const ICONS: Record<keyof RootTabParamList, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  ScanTab: { active: 'camera', inactive: 'camera-outline' },
  LooksTab: { active: 'color-wand', inactive: 'color-wand-outline' },
  DashboardTab: { active: 'sparkles', inactive: 'sparkles-outline' },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.berry,
        tabBarInactiveTintColor: colors.slate,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFill}>
            <View style={styles.tabBarTint} />
          </BlurView>
        ),
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = ICONS[route.name];
          return (
            <Ionicons
              name={focused ? icons.active : icons.inactive}
              size={size ?? 22}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="ScanTab" component={ScanStackNavigator} options={{ title: 'Scan' }} />
      <Tab.Screen name="LooksTab" component={LooksStackNavigator} options={{ title: 'Looks' }} />
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStackNavigator}
        options={{ title: 'Dashboard' }}
      />
    </Tab.Navigator>
  );
}

function MainStackNavigator() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Tabs" component={MainTabs} />
      <MainStack.Screen
        name="Paywall"
        component={PaywallScreen}
        options={{ presentation: 'modal' }}
      />
    </MainStack.Navigator>
  );
}

export default function RootNavigator() {
  const { ready, hasOnboarded } = useAppState();

  if (!ready) return <SplashHomeScreen />;

  return (
    <NavigationContainer theme={navTheme}>
      {hasOnboarded ? <MainStackNavigator /> : <OnboardingNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    height: 82,
    paddingTop: 8,
  },
  tabBarTint: {
    flex: 1,
    backgroundColor: 'rgba(255,251,246,0.75)',
  },
  tabBarLabel: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
    marginTop: -2,
  },
});
