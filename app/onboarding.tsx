import { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedProps, withRepeat, withSequence, withTiming, withDelay, Easing, interpolateColor } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { track } from '../src/utils/analytics';

const { width } = Dimensions.get('window');
const PRIMARY = '#3D5BF6';

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

// Pen pivot near the cap (top-right of the pen body)
const PEN_PIVOT_DX = 43;
const PEN_PIVOT_DY = 13;

function AnimatedPen() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    const FLICK = 150;
    const RETURN = 500;
    const PAUSE = 800;

    rotation.value = withRepeat(
      withSequence(
        withTiming(12, { duration: FLICK, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: RETURN, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: PAUSE }),
      ),
      -1,
    );
  }, []);

  const penStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: PEN_PIVOT_DX },
      { translateY: PEN_PIVOT_DY },
      { rotate: `${rotation.value}deg` },
      { translateX: -PEN_PIVOT_DX },
      { translateY: -PEN_PIVOT_DY },
    ],
  }));

  return (
    <Animated.View style={[{ width: 54, height: 45 }, penStyle]}>
      <Svg width={54} height={45} viewBox="0 0 109 90" fill="none">
        <Path
          d="M4.93571 78.3624L8.57554 83.1323C10.9208 86.2056 15.3135 86.7959 18.3869 84.4506L80.3951 37.1327C83.4684 34.7875 84.0587 30.3948 81.7134 27.3214L78.0736 22.5515C75.7283 19.4782 71.3356 18.8879 68.2623 21.2332L6.25407 68.5511C3.18069 70.8963 2.59044 75.289 4.93571 78.3624Z"
          fill="#3D5BF6"
          stroke="#1F2547"
          strokeWidth="7"
        />
        <Path
          d="M21.3587 57.0251L33.4915 72.9246L38.2613 69.2848L26.1285 53.3853L21.3587 57.0251Z"
          fill="#1F2547"
        />
        <Path
          d="M85.96 32.8856L73.8272 16.986L102.153 7.94989L85.96 32.8856Z"
          fill="#2A41C8"
          stroke="#1F2547"
          strokeWidth="7"
          strokeLinejoin="round"
        />
      </Svg>
    </Animated.View>
  );
}

const AnimatedSvgPath = Animated.createAnimatedComponent(Path);

const STAGGER = 350;
const FADE_IN = 350;
const FADE_OUT = 300;
const GAP = 400;
const CYCLE = STAGGER * 4 + FADE_IN + 1500 + FADE_OUT + GAP;

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
  const lp0 = useAnimatedProps(() => ({ opacity: l0.value }));
  const lp1 = useAnimatedProps(() => ({ opacity: l1.value * 0.75 }));
  const lp2 = useAnimatedProps(() => ({ opacity: l2.value }));
  const lp3 = useAnimatedProps(() => ({ opacity: l3.value * 0.8 }));
  const lp4 = useAnimatedProps(() => ({ opacity: l4.value * 0.65 }));

  return (
    <Animated.View style={floatStyle}>
      <Svg width={48} height={59} viewBox="0 0 455 555" fill="none">
        {/* Document body */}
        <Path
          d="M49 5.32243C95 9.32243 151 1.32243 217 7.32243C277 11.3224 323 5.32243 367 7.32243C389 25.3224 425 59.3224 449 89.3224C445 157.322 453 225.322 447 291.322C451 359.322 443 435.322 449 503.322C447 535.322 425 549.322 401 547.322C337 543.322 263 551.322 193 547.322C129 549.322 79 543.322 49 549.322C19 549.322 5 531.322 7 503.322C3 435.322 11 359.322 5 291.322C9 225.322 1 157.322 9 89.3224C9 41.3224 19 5.32243 49 5.32243Z"
          fill="white"
          stroke="#1F2547"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Blue corner fold */}
        <Path
          d="M367 7.32227C389 21.3223 411 51.3223 449 89.3223C425 93.3223 387 87.3223 367 87.3223C361 67.3223 361 27.3223 367 7.32227Z"
          fill="#3D5BF6"
          stroke="#1F2547"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Static dark title bar */}
        <Path
          d="M275 117.322H87C81.4772 117.322 77 121.799 77 127.322C77 132.845 81.4772 137.322 87 137.322H275C280.523 137.322 285 132.845 285 127.322C285 121.799 280.523 117.322 275 117.322Z"
          fill="#1F2547"
        />
        {/* Animated skeleton lines */}
        <AnimatedSvgPath
          d="M347 167.322H87C82.5817 167.322 79 170.904 79 175.322C79 179.741 82.5817 183.322 87 183.322H347C351.418 183.322 355 179.741 355 175.322C355 170.904 351.418 167.322 347 167.322Z"
          fill="#B6BAC4"
          animatedProps={lp0}
        />
        <AnimatedSvgPath
          d="M283 201.322H83C78.5817 201.322 75 204.904 75 209.322C75 213.741 78.5817 217.322 83 217.322H283C287.418 217.322 291 213.741 291 209.322C291 204.904 287.418 201.322 283 201.322Z"
          fill="#B6BAC4"
          animatedProps={lp1}
        />
        <AnimatedSvgPath
          d="M371 309.322H85C80.5817 309.322 77 312.904 77 317.322C77 321.741 80.5817 325.322 85 325.322H371C375.418 325.322 379 321.741 379 317.322C379 312.904 375.418 309.322 371 309.322Z"
          fill="#B6BAC4"
          animatedProps={lp2}
        />
        <AnimatedSvgPath
          d="M307 343.322H87C82.5817 343.322 79 346.904 79 351.322C79 355.741 82.5817 359.322 87 359.322H307C311.418 359.322 315 355.741 315 351.322C315 346.904 311.418 343.322 307 343.322Z"
          fill="#B6BAC4"
          animatedProps={lp3}
        />
        <AnimatedSvgPath
          d="M341 377.322H83C78.5817 377.322 75 380.904 75 385.322C75 389.741 78.5817 393.322 83 393.322H341C345.418 393.322 349 389.741 349 385.322C349 380.904 345.418 377.322 341 377.322Z"
          fill="#B6BAC4"
          animatedProps={lp4}
        />
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
  if (index === 0) return <AnimatedPen />;
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
    if (index !== activeIndex) track('Onboarding Slide Viewed', { slide: index + 1 });
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
