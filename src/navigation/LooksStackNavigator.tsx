import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LooksStackParamList } from './types';
import ChooseLookScreen from '../screens/looks/ChooseLookScreen';
import LookDetailScreen from '../screens/looks/LookDetailScreen';
import MakeupMatchScreen from '../screens/looks/MakeupMatchScreen';

const Stack = createNativeStackNavigator<LooksStackParamList>();

export default function LooksStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChooseLook" component={ChooseLookScreen} />
      <Stack.Screen name="LookDetail" component={LookDetailScreen} />
      <Stack.Screen name="MakeupMatch" component={MakeupMatchScreen} />
    </Stack.Navigator>
  );
}
