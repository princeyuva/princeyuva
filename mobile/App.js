/**
 * Save A Life App - Main Application Entry Point
 * Entry point for React Native application
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import { COLORS } from './src/styles/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/store/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.primaryRed[500]}
          translucent={false}
        />
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;