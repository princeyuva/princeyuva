/**
 * Save A Life App - Redux Store Configuration
 * Global state management for the application
 */

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slices (will be created as needed)
import authSlice from './slices/authSlice';
import emergencySlice from './slices/emergencySlice';
import locationSlice from './slices/locationSlice';
import medicalSlice from './slices/medicalSlice';
import settingsSlice from './slices/settingsSlice';
import notificationsSlice from './slices/notificationsSlice';

// Redux persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'medical', 'settings'], // Only persist these reducers
  blacklist: ['emergency', 'location'], // Don't persist real-time data
};

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  emergency: emergencySlice,
  location: locationSlice,
  medical: medicalSlice,
  settings: settingsSlice,
  notifications: notificationsSlice,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: __DEV__,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;