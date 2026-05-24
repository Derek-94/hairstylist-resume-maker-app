import { useEffect, useRef, useState } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import { track } from './analytics';

const AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === 'ios'
    ? 'ca-app-pub-2912972164662879/7486316385'
    : 'ca-app-pub-2912972164662879/4299863343';

export function useInterstitialAd() {
  const adRef = useRef<InterstitialAd | null>(null);
  const [loaded, setLoaded] = useState(false);
  const onClosedRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const ad = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });
    adRef.current = ad;

    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
      track('Ad Loaded');
    });
    const unsubError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
      track('Ad Failed', { reason: error?.message ?? 'unknown' });
      onClosedRef.current?.();
      onClosedRef.current = null;
    });
    const unsubOpened = ad.addAdEventListener(AdEventType.OPENED, () => {
      track('Ad Shown');
    });
    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      track('Ad Dismissed');
      onClosedRef.current?.();
      onClosedRef.current = null;
      ad.load();
      setLoaded(false);
    });

    ad.load();

    return () => {
      unsubLoaded();
      unsubOpened();
      unsubClosed();
      unsubError();
    };
  }, []);

  const showAd = (onClosed: () => void) => {
    onClosedRef.current = onClosed;
    if (loaded && adRef.current) {
      adRef.current.show();
    } else {
      track('Ad Skipped', { reason: 'not_loaded' });
      onClosed();
      onClosedRef.current = null;
    }
  };

  return { showAd, loaded };
}
