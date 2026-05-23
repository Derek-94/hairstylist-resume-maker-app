import { useEffect, useRef, useState } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import { track } from './analytics';

const AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === 'ios'
    ? 'ca-app-pub-2912972164662879/7486316385'
    : 'ca-app-pub-2912972164662879/4299863343';

export function useInterstitialAd(onAdClosed: () => void) {
  const adRef = useRef<InterstitialAd | null>(null);
  const [loaded, setLoaded] = useState(false);
  const callbackRef = useRef(onAdClosed);
  callbackRef.current = onAdClosed;

  useEffect(() => {
    const ad = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });
    adRef.current = ad;

    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
      track('Ad Loaded');
    });
    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
      track('Ad Failed', { reason: error?.message ?? 'unknown' });
    });
    const unsubscribeOpened = ad.addAdEventListener(AdEventType.OPENED, () => {
      track('Ad Shown');
    });
    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      track('Ad Dismissed');
      callbackRef.current();
      ad.load();
      setLoaded(false);
    });

    ad.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeOpened();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  const showAd = () => {
    if (loaded && adRef.current) {
      adRef.current.show();
    } else {
      track('Ad Skipped', { reason: 'not_loaded' });
      callbackRef.current();
    }
  };

  return { showAd, loaded };
}
