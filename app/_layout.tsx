import '../global.css';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initAnalytics, flushAnalytics, track } from '../src/utils/analytics';
import MobileAds from 'react-native-google-mobile-ads';

export default function RootLayout() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    MobileAds().initialize();
    initAnalytics();
    track('App Opened');

    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (appState.current === 'active' && next.match(/inactive|background/)) {
        flushAnalytics();
      }
      appState.current = next;
    });

    return () => sub.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
