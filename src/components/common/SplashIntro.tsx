import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, useAnimatedProps,
  withRepeat, withSequence, withTiming, withDelay, Easing,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path, G } from 'react-native-svg';

const AnimatedSvgPath = Animated.createAnimatedComponent(Path);
const AnimatedSvgG = Animated.createAnimatedComponent(G);

// Wand pivot scaled 1.6x from onboarding (54×64 → 86×102)
const WAND_PIVOT_DX = 24;
const WAND_PIVOT_DY = 37;

const STAGGER = 300;
const FADE_IN = 300;
const FADE_OUT = 250;
const GAP = 300;
const CYCLE = STAGGER * 4 + FADE_IN + 1200 + FADE_OUT + GAP;

const LINE_PATHS = [
  'M248.32 112.64H69.12C59.223 112.64 51.2 120.663 51.2 130.56C51.2 140.457 59.223 148.48 69.12 148.48H248.32C258.217 148.48 266.24 140.457 266.24 130.56C266.24 120.663 258.217 112.64 248.32 112.64Z',
  'M209.92 179.199H66.56C58.077 179.199 51.2 186.076 51.2 194.559C51.2 203.042 58.077 209.919 66.56 209.919H209.92C218.403 209.919 225.28 203.042 225.28 194.559C225.28 186.076 218.403 179.199 209.92 179.199Z',
  'M271.36 240.64H66.56C58.077 240.64 51.2 247.517 51.2 256C51.2 264.483 58.077 271.36 66.56 271.36H271.36C279.843 271.36 286.72 264.483 286.72 256C286.72 247.517 279.843 240.64 271.36 240.64Z',
  'M230.4 302.079H66.56C58.077 302.079 51.2 308.955 51.2 317.439C51.2 325.922 58.077 332.799 66.56 332.799H230.4C238.883 332.799 245.76 325.922 245.76 317.439C245.76 308.955 238.883 302.079 230.4 302.079Z',
  'M261.12 363.52H66.56C58.077 363.52 51.2 370.397 51.2 378.88C51.2 387.363 58.077 394.24 66.56 394.24H261.12C269.603 394.24 276.48 387.363 276.48 378.88C276.48 370.397 269.603 363.52 261.12 363.52Z',
];

function SplashDocument() {
  const floatY = useSharedValue(0);
  const l0 = useSharedValue(0);
  const l1 = useSharedValue(0);
  const l2 = useSharedValue(0);
  const l3 = useSharedValue(0);
  const l4 = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );

    const runLine = (sv: typeof l0, stagger: number) => {
      const hold = CYCLE - stagger - FADE_IN - FADE_OUT - GAP;
      const fadeIn = withTiming(1, { duration: FADE_IN, easing: Easing.out(Easing.ease) });
      sv.value = withRepeat(
        withSequence(
          stagger > 0 ? withDelay(stagger, fadeIn) : fadeIn,
          withDelay(hold, withTiming(0, { duration: FADE_OUT, easing: Easing.in(Easing.ease) })),
          withTiming(0, { duration: GAP }),
        ),
        -1,
      );
    };

    runLine(l0, 0);
    runLine(l1, STAGGER);
    runLine(l2, STAGGER * 2);
    runLine(l3, STAGGER * 3);
    runLine(l4, STAGGER * 4);
  }, []);

  const floatStyle = useAnimatedStyle(() => ({ transform: [{ translateY: floatY.value }] }));
  const lp0 = useAnimatedProps(() => ({ opacity: l0.value * 0.65 }));
  const lp1 = useAnimatedProps(() => ({ opacity: l1.value * 0.5 }));
  const lp2 = useAnimatedProps(() => ({ opacity: l2.value * 0.45 }));
  const lp3 = useAnimatedProps(() => ({ opacity: l3.value * 0.4 }));
  const lp4 = useAnimatedProps(() => ({ opacity: l4.value * 0.35 }));

  return (
    <Animated.View style={floatStyle}>
      <Svg width={96} height={128} viewBox="0 0 349 466" fill="none">
        <Path
          d="M302.08 0H46.08C20.63 0 0 20.631 0 46.08V419.84C0 445.29 20.63 465.92 46.08 465.92H302.08C327.529 465.92 348.16 445.29 348.16 419.84V46.08C348.16 20.631 327.529 0 302.08 0Z"
          fill="#E8EDFF"
        />
        <AnimatedSvgPath d={LINE_PATHS[0]} fill="#93AAFB" animatedProps={lp0} />
        <AnimatedSvgPath d={LINE_PATHS[1]} fill="#93AAFB" animatedProps={lp1} />
        <AnimatedSvgPath d={LINE_PATHS[2]} fill="#93AAFB" animatedProps={lp2} />
        <AnimatedSvgPath d={LINE_PATHS[3]} fill="#93AAFB" animatedProps={lp3} />
        <AnimatedSvgPath d={LINE_PATHS[4]} fill="#93AAFB" animatedProps={lp4} />
      </Svg>
    </Animated.View>
  );
}

function SplashWand() {
  const rotation = useSharedValue(0);
  const starOpacity = useSharedValue(1);

  useEffect(() => {
    const FLICK = 150;
    const RETURN = 500;
    const PAUSE = 800;

    rotation.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: FLICK, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: RETURN, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: PAUSE }),
      ),
      -1,
    );
    starOpacity.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: FLICK, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: RETURN, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: PAUSE }),
      ),
      -1,
    );
  }, []);

  const wandStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: WAND_PIVOT_DX },
      { translateY: WAND_PIVOT_DY },
      { rotate: `${rotation.value}deg` },
      { translateX: -WAND_PIVOT_DX },
      { translateY: -WAND_PIVOT_DY },
    ],
  }));

  const starProps = useAnimatedProps(() => ({ opacity: starOpacity.value }));

  return (
    <Animated.View style={[{ width: 86, height: 102 }, wandStyle]}>
      <Svg width={86} height={102} viewBox="0 0 452 535" fill="none">
        <Path
          d="M228.61 237.964C223.915 229.833 213.518 227.047 205.387 231.741C197.256 236.436 194.47 246.833 199.165 254.964L321.165 466.274C325.859 474.405 336.256 477.191 344.387 472.496C352.518 467.802 355.304 457.405 350.61 449.274L228.61 237.964Z"
          fill="#D4A96A"
        />
        <AnimatedSvgG animatedProps={starProps}>
          <Path
            d="M107.387 62L177.734 121.844L259.774 77.9423L224.554 162.94L290.705 227.516L199.387 221.349L159.069 303.516L136.22 213.94L45 201.942L124.04 152.844L107.387 62Z"
            fill="#3D5BF6"
          />
          <Path
            d="M107.387 62L124.04 152.844L45 201.942L136.22 213.94L159.069 303.516L199.387 221.349L107.387 62Z"
            fill="#3D5BF6"
          />
        </AnimatedSvgG>
      </Svg>
    </Animated.View>
  );
}

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
      {/* 서류(좌하) + 요술봉(우상) 겹침 레이아웃 */}
      <View style={{ width: 160, height: 140, marginLeft: 20 }}>
        <View style={{ position: 'absolute', left: 0, bottom: 0 }}>
          <SplashDocument />
        </View>
        <View style={{ position: 'absolute', right: 0, top: 0 }}>
          <SplashWand />
        </View>
      </View>
    </Animated.View>
  );
}
