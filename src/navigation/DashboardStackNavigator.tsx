import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardStackParamList } from './types';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ScanDetailScreen from '../screens/dashboard/ScanDetailScreen';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export default function DashboardStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="ScanDetail" component={ScanDetailScreen} />
    </Stack.Navigator>
  );
}
