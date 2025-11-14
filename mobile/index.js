/**
 * Save A Life App - React Native Entry Point
 * Register the app component
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './package.json';

AppRegistry.registerComponent(appName, () => App);