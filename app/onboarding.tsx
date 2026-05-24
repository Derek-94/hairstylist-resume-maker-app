import { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedProps, withRepeat, withSequence, withTiming, withDelay, Easing, interpolateColor } from 'react-native-reanimated';
import Svg, { Path, G } from 'react-native-svg';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { track } from '../src/utils/analytics';

const { width } = Dimensions.get('window');
const PRIMARY = '#c084fc';

const SLIDES = [
  {
    title: '안녕하세요!\n뚝딱이력서입니다.',
    body: '디자이너 첫 발걸음,\n이력서부터 막히셨나요?\n도와드릴게요.',
    sub: '모르는 항목은 건너뛸 수 있어요.\n입력한 내용은 이 폰 안에만 저장돼요.\n서버에 올라가지 않으니, 안심해요.',
  },
  {
    title: 'PDF · 이미지로\n바로 저장해요',
    body: null,
    sub: null,
  },
  {
    title: '이력서 적으러\n가볼까요?',
    body: '5분이면 완성돼요.',
    sub: null,
  },
];

// Wand rendered at 54×64. Handle tip at ~(42, 55) in rendered space,
// center is (27, 32) → pivot offset (15, 23).
const WAND_PIVOT_DX = 15;
const WAND_PIVOT_DY = 23;

function AnimatedWand() {
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
    <Animated.View style={[{ width: 54, height: 64 }, wandStyle]}>
      <Svg width={54} height={64} viewBox="0 0 452 535" fill="none">
        <Path
          d="M228.61 237.964C223.915 229.833 213.518 227.047 205.387 231.741C197.256 236.436 194.47 246.833 199.165 254.964L321.165 466.274C325.859 474.405 336.256 477.191 344.387 472.496C352.518 467.802 355.304 457.405 350.61 449.274L228.61 237.964Z"
          fill="#D4A96A"
        />
        <AnimatedSvgG animatedProps={starProps}>
          <Path
            d="M107.387 62L177.734 121.844L259.774 77.9423L224.554 162.94L290.705 227.516L199.387 221.349L159.069 303.516L136.22 213.94L45 201.942L124.04 152.844L107.387 62Z"
            fill="#C084FC"
          />
          <Path
            d="M107.387 62L124.04 152.844L45 201.942L136.22 213.94L159.069 303.516L199.387 221.349L107.387 62Z"
            fill="#C084FC"
          />
        </AnimatedSvgG>
      </Svg>
    </Animated.View>
  );
}

const AnimatedSvgPath = Animated.createAnimatedComponent(Path);
const AnimatedSvgG = Animated.createAnimatedComponent(G);

const STAGGER = 350;
const FADE_IN = 350;
const FADE_OUT = 300;
const GAP = 400;
const CYCLE = STAGGER * 4 + FADE_IN + 1500 + FADE_OUT + GAP; // 3950ms

const LINE_PATHS = [
  'M248.32 112.64H69.12C59.223 112.64 51.2 120.663 51.2 130.56C51.2 140.457 59.223 148.48 69.12 148.48H248.32C258.217 148.48 266.24 140.457 266.24 130.56C266.24 120.663 258.217 112.64 248.32 112.64Z',
  'M209.92 179.199H66.56C58.077 179.199 51.2 186.076 51.2 194.559C51.2 203.042 58.077 209.919 66.56 209.919H209.92C218.403 209.919 225.28 203.042 225.28 194.559C225.28 186.076 218.403 179.199 209.92 179.199Z',
  'M271.36 240.64H66.56C58.077 240.64 51.2 247.517 51.2 256C51.2 264.483 58.077 271.36 66.56 271.36H271.36C279.843 271.36 286.72 264.483 286.72 256C286.72 247.517 279.843 240.64 271.36 240.64Z',
  'M230.4 302.079H66.56C58.077 302.079 51.2 308.955 51.2 317.439C51.2 325.922 58.077 332.799 66.56 332.799H230.4C238.883 332.799 245.76 325.922 245.76 317.439C245.76 308.955 238.883 302.079 230.4 302.079Z',
  'M261.12 363.52H66.56C58.077 363.52 51.2 370.397 51.2 378.88C51.2 387.363 58.077 394.24 66.56 394.24H261.12C269.603 394.24 276.48 387.363 276.48 378.88C276.48 370.397 269.603 363.52 261.12 363.52Z',
];

function AnimatedDocument() {
  const floatY = useSharedValue(0);
  const l0 = useSharedValue(0);
  const l1 = useSharedValue(0);
  const l2 = useSharedValue(0);
  const l3 = useSharedValue(0);
  const l4 = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
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
      <Svg width={48} height={64} viewBox="0 0 349 466" fill="none">
        <Path
          d="M302.08 0H46.08C20.63 0 0 20.631 0 46.08V419.84C0 445.29 20.63 465.92 46.08 465.92H302.08C327.529 465.92 348.16 445.29 348.16 419.84V46.08C348.16 20.631 327.529 0 302.08 0Z"
          fill="#EDE9FE"
        />
        <AnimatedSvgPath d={LINE_PATHS[0]} fill="#C4B5FD" animatedProps={lp0} />
        <AnimatedSvgPath d={LINE_PATHS[1]} fill="#C4B5FD" animatedProps={lp1} />
        <AnimatedSvgPath d={LINE_PATHS[2]} fill="#C4B5FD" animatedProps={lp2} />
        <AnimatedSvgPath d={LINE_PATHS[3]} fill="#C4B5FD" animatedProps={lp3} />
        <AnimatedSvgPath d={LINE_PATHS[4]} fill="#C4B5FD" animatedProps={lp4} />
      </Svg>
    </Animated.View>
  );
}

function AnimatedArrow() {
  const x = useSharedValue(0);

  useEffect(() => {
    x.value = withRepeat(
      withSequence(
        withTiming(12, { duration: 600, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 600, easing: Easing.in(Easing.ease) }),
      ),
      -1,
    );
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return <Animated.Text style={[{ fontSize: 64, color: PRIMARY }, style]}>→</Animated.Text>;
}

function SlideEmoji({ index }: { index: number }) {
  if (index === 0) return <AnimatedWand />;
  if (index === 1) return <AnimatedDocument />;
  return <AnimatedArrow />;
}

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLast = activeIndex === SLIDES.length - 1;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(isLast ? 1 : 0, {
      duration: 500,
      easing: isLast ? Easing.in(Easing.ease) : Easing.out(Easing.ease),
    });
  }, [isLast]);

  const buttonBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], ['#1a1a1a', PRIMARY]),
  }));

  const buttonTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], ['#888888', '#ffffff']),
  }));

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleNext = async () => {
    if (!isLast) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      await AsyncStorage.setItem('onboarded', '1');
      track('Onboarding Completed');
      router.replace('/survey/1');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => (
          <View style={{ width, flex: 1, paddingHorizontal: 32, justifyContent: 'center', paddingTop: insets.top }}>
            <View style={{ marginBottom: 32 }}>
              <SlideEmoji index={index} />
            </View>
            <Text style={{ color: '#fff', fontSize: 30, fontWeight: '800', lineHeight: 42, marginBottom: 20 }}>
              {item.title}
            </Text>
            {index === 1 ? (
              <Text style={{ color: '#888', fontSize: 17, lineHeight: 28 }}>
                <Text style={{ color: PRIMARY }}>내 폰에만</Text>
                {' '}저장돼요.{'\n'}카카오톡으로도 바로 공유할 수 있어요.
              </Text>
            ) : item.body ? (
              <Text style={{ color: '#888', fontSize: 17, lineHeight: 28, marginBottom: item.sub ? 24 : 0 }}>
                {item.body}
              </Text>
            ) : null}
            {item.sub && (
              <Text style={{ color: '#555', fontSize: 14, lineHeight: 24 }}>
                {item.sub}
              </Text>
            )}
          </View>
        )}
      />

      {/* Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === activeIndex ? 20 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: i === activeIndex ? PRIMARY : '#333',
            }}
          />
        ))}
      </View>

      {/* Button */}
      <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 24 }}>
        <TouchableOpacity onPress={handleNext} activeOpacity={0.8}>
          <Animated.View style={[{ height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }, buttonBgStyle]}>
            <Animated.Text style={[{ fontSize: 18, fontWeight: '700' }, buttonTextStyle]}>
              {isLast ? '시작하기' : '다음'}
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
