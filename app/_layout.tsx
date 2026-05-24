import '../global.css';
import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initAnalytics, flushAnalytics, track } from '../src/utils/analytics';
import MobileAds from 'react-native-google-mobile-ads';
import SplashIntro from '../src/components/common/SplashIntro';
import { AdContext } from '../src/contexts/AdContext';
import { useRewardedInterstitialAd } from '../src/utils/useRewardedInterstitialAd';
import { useInterstitialAd } from '../src/utils/useInterstitialAd';

export default function RootLayout() {
  const appState = useRef(AppState.currentState);
  const [showSplash, setShowSplash] = useState(true);

  const { showAd: showRewardedAd, loaded: rewardedLoaded } = useRewardedInterstitialAd();
  const { showAd: showInterstitialAd } = useInterstitialAd();

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
    <AdContext.Provider value={{ showRewardedAd, rewardedLoaded, showInterstitialAd }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
        {showSplash && <SplashIntro onDone={() => setShowSplash(false)} />}
      </GestureHandlerRootView>
    </AdContext.Provider>
  );
}
