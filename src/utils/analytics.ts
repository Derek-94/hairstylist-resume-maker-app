import * as amplitude from '@amplitude/analytics-react-native';

export function initAnalytics() {
  if (__DEV__) return;
  const apiKey = process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY;
  if (!apiKey) return;
  amplitude.init(apiKey, { trackingOptions: { ipAddress: false } });
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (__DEV__) return;
  amplitude.track(event, properties);
}
