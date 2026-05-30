import { useEffect, useRef, useState } from 'react';
import { RewardedInterstitialAd, RewardedAdEventType, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import { track } from './analytics';

const AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED_INTERSTITIAL
  : Platform.OS === 'ios'
    ? 'ca-app-pub-2912972164662879/1133791299'
    : 'ca-app-pub-2912972164662879/6130344989';

export function useRewardedInterstitialAd() {
  const adRef = useRef<RewardedInterstitialAd | null>(null);
  const [loaded, setLoaded] = useState(false);
  const rewardEarnedRef = useRef(false);
  const onRewardedRef = useRef<(() => void) | null>(null);
  const onFallbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const ad = RewardedInterstitialAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });
    adRef.current = ad;

    const unsubLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
      track('Rewarded Interstitial Loaded');
    });
    const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
      track('Rewarded Interstitial Failed');
      onFallbackRef.current?.();
      onRewardedRef.current = null;
      onFallbackRef.current = null;
    });
    const unsubReward = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      rewardEarnedRef.current = true;
      track('Rewarded Interstitial Earned');
    });
    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      const earned = rewardEarnedRef.current;
      track('Rewarded Interstitial Closed', { earned });
      rewardEarnedRef.current = false;
      if (earned) onRewardedRef.current?.();
      else onFallbackRef.current?.();
      onRewardedRef.current = null;
      onFallbackRef.current = null;
      ad.load();
      setLoaded(false);
    });

    ad.load();

    return () => {
      unsubLoaded();
      unsubError();
      unsubReward();
      unsubClosed();
    };
  }, []);

  const showAd = (onRewarded: () => void, onFallback?: () => void) => {
    onRewardedRef.current = onRewarded;
    onFallbackRef.current = onFallback ?? onRewarded;
    if (loaded && adRef.current) {
      adRef.current.show();
    } else {
      track('Rewarded Interstitial Skipped', { reason: 'not_loaded' });
      onFallbackRef.current?.();
      onRewardedRef.current = null;
      onFallbackRef.current = null;
    }
  };

  return { showAd, loaded };
}
