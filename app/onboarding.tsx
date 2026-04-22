import { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '✍️',
    title: '천천히 입력해도\n괜찮아요',
    body: '모르는 항목은 건너뛸 수 있어요.\n입력한 내용은 이 폰 안에만 저장돼요.\n서버에 올라가지 않아요.',
  },
  {
    emoji: '📄',
    title: 'PDF나 이미지로\n바로 저장해요',
    body: '다 입력하면 이력서가 완성돼요.\nPDF나 사진으로 저장하거나\n카카오톡으로 바로 공유할 수 있어요.',
  },
  {
    emoji: '💜',
    title: '이력서 적으러\n가볼까요?',
    body: '5분이면 완성돼요.',
  },
];

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
      router.replace('/');
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
            <Text style={{ fontSize: 64, marginBottom: 32 }}>{item.emoji}</Text>
            <Text style={{ color: '#fff', fontSize: 30, fontWeight: '800', lineHeight: 42, marginBottom: 20 }}>
              {item.title}
            </Text>
            <Text style={{ color: '#888', fontSize: 17, lineHeight: 28 }}>
              {item.body}
            </Text>
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
