import { createContext, useContext } from 'react';

interface AdContextValue {
  showRewardedAd: (onRewarded: () => void, onFallback?: () => void) => void;
  rewardedLoaded: boolean;
  showInterstitialAd: (onClosed: () => void) => void;
}

export const AdContext = createContext<AdContextValue>({
  showRewardedAd: (_onRewarded, onFallback) => { onFallback?.(); },
  rewardedLoaded: false,
  showInterstitialAd: (onClosed) => { onClosed(); },
});

export const useAds = () => useContext(AdContext);
