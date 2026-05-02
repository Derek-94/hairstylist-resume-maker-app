import { useEffect, useRef, useState } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

// 테스트 ID — 실제 출시 전에 AdMob에서 받은 ID로 교체
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
    });
    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      callbackRef.current();
      // 다음 광고 미리 로드
      ad.load();
      setLoaded(false);
    });

    ad.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const showAd = () => {
    if (loaded && adRef.current) {
      adRef.current.show();
    } else {
      // 광고가 아직 로드 안 됐으면 그냥 바로 실행
      callbackRef.current();
    }
  };

  return { showAd, loaded };
}
