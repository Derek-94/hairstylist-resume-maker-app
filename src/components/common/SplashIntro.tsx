import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, Easing, runOnJS,
} from 'react-native-reanimated';
import AnimatedLogo from './AnimatedLogo';

export default function SplashIntro({ onDone }: { onDone: () => void }) {
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      screenOpacity.value = withTiming(
        0,
        { duration: 400, easing: Easing.in(Easing.ease) },
        () => { runOnJS(onDone)(); },
      );
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: '#0f0f0f', justifyContent: 'center', alignItems: 'center', paddingBottom: 60 },
        screenStyle,
      ]}
    >
      <AnimatedLogo width={150} />
    </Animated.View>
  );
}
