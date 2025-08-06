import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { RootStackParamList } from './src/types/navigation';

import LoadingScreen from './src/components/LoadingScreen';
import MainMenuScreen from './src/screens/MainMenuScreen';
import DeclarationScreen from './src/screens/DeclarationScreen';
import PhotosScreen from './src/screens/PhotosScreen';
import BucketListScreen from './src/screens/BucketListScreen';
import RandomScreen from './src/screens/RandomScreen';
import MusicScreen from './src/screens/MusicScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <>
        {/* ✅ StatusBar corrigido para edge-to-edge */}
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <LoadingScreen />
      </>
    );
  }

  return (
    <NavigationContainer>
      {/* ✅ StatusBar corrigido para edge-to-edge */}
      <StatusBar style="light" translucent backgroundColor="transparent" />
      
      <Stack.Navigator
        initialRouteName="MainMenu"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#fff0f5' },
        }}
      >
        <Stack.Screen name="MainMenu" component={MainMenuScreen} />
        <Stack.Screen name="Declaration" component={DeclarationScreen} />
        <Stack.Screen name="Photos" component={PhotosScreen} />
        <Stack.Screen name="BucketList" component={BucketListScreen} />
        <Stack.Screen name="Random" component={RandomScreen} />
        <Stack.Screen name="Music" component={MusicScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
