import { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '✂️',
    title: '안녕하세요!',
    body: '미용사 취업,\n이력서부터 막히셨나요?\nClipr가 도와드릴게요.',
    sub: '모르는 항목은 건너뛸 수 있어요.\n입력한 내용은 이 폰 안에만 저장돼요.\n서버에 올라가지 않으니, 안심해요.',
  },
  {
    emoji: '📄',
    title: 'PDF나 이미지로\n바로 저장해요',
    body: '다 입력하면 이력서가 완성돼요.\nPDF나 사진으로 저장하거나\n카카오톡으로 바로 공유할 수 있어요.',
    sub: null,
  },
  {
    emoji: null,
    title: '이력서 적으러\n가볼까요?',
    body: '5분이면 완성돼요.',
    sub: null,
  },
];

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

  return (
    <Animated.Text style={[{ fontSize: 64, color: '#c084fc' }, style]}>→</Animated.Text>
  );
}

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLast = activeIndex === SLIDES.length - 1;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleNext = async () => {
    if (!isLast) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      await AsyncStorage.setItem('onboarded', '1');
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
        renderItem={({ item }) => (
          <View style={{ width, flex: 1, paddingHorizontal: 32, justifyContent: 'center', paddingTop: insets.top }}>
            <View style={{ marginBottom: 32 }}>
              {item.emoji ? (
                <Text style={{ fontSize: 64 }}>{item.emoji}</Text>
              ) : (
                <AnimatedArrow />
              )}
            </View>
            <Text style={{ color: '#fff', fontSize: 30, fontWeight: '800', lineHeight: 42, marginBottom: 20 }}>
              {item.title}
            </Text>
            <Text style={{ color: '#888', fontSize: 17, lineHeight: 28, marginBottom: item.sub ? 24 : 0 }}>
              {item.body}
            </Text>
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
              backgroundColor: i === activeIndex ? '#c084fc' : '#333',
            }}
          />
        ))}
      </View>

      {/* Button */}
      <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 24 }}>
        <TouchableOpacity
          onPress={handleNext}
          style={{
            height: 60,
            borderRadius: 16,
            backgroundColor: isLast ? '#c084fc' : '#1a1a1a',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: isLast ? '#fff' : '#888', fontSize: 18, fontWeight: '700' }}>
            {isLast ? '시작하기' : '다음'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
