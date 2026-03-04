import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import SplashScreen from '../screens/SplashScreen';
import LandingScreen from '../screens/LandingScreen';
import QuestionnaireScreen from '../screens/QuestionnaireScreen';
import CalculationScreen from '../screens/CalculationScreen';
import RevealScreen from '../screens/RevealScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ShareScreen from '../screens/ShareScreen';
import InsightDetailScreen from '../screens/InsightDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#000000' },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen
          name="Questionnaire"
          component={QuestionnaireScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="Calculation"
          component={CalculationScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="Reveal"
          component={RevealScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Share" component={ShareScreen} />
        <Stack.Screen
          name="InsightDetail"
          component={InsightDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
