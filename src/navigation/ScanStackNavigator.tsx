import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScanStackParamList } from './types';
import ScanCameraScreen from '../screens/scan/ScanCameraScreen';
import AnalyzingScreen from '../screens/scan/AnalyzingScreen';
import ResultsScreen from '../screens/scan/ResultsScreen';

const Stack = createNativeStackNavigator<ScanStackParamList>();

export default function ScanStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ScanCamera" component={ScanCameraScreen} />
      <Stack.Screen name="Analyzing" component={AnalyzingScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="Results" component={ResultsScreen} />
    </Stack.Navigator>
  );
}
