import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Keyboard, Platform } from 'react-native';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import { CareerLevel, CAREER_LABELS } from '../../types/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';

const OPTIONS = Object.entries(CAREER_LABELS) as [CareerLevel, string][];

export default function Step11Career() {
  const { data, update } = useResumeStore();
  const [level, setLevel] = useState<CareerLevel | null>(data.careerLevel);
  const [detail, setDetail] = useState(data.careerDetail ?? '');
  const scrollRef = useRef<ScrollView>(null);
  const [kbHeight, setKbHeight] = useState(0);

  // Android만: edge-to-edge 모드에선 adjustResize가 창을 줄이지 않아
  // ScrollView가 풀높이 그대로라 스크롤할 여백이 없다. 그래서 키보드가
  // 올라오면 그 높이만큼 하단에 spacer를 넣어 스크롤 여백을 만든 뒤
  // 그만큼 끝까지 올린다. iOS는 리스너를 등록하지 않으므로 기존과 동일.
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKbHeight(e.endCoordinates.height);
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKbHeight(0));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const handleNext = () => {
    update({ careerLevel: level, careerDetail: detail });
    router.push('/survey/12');
  };

  return (
    <StepLayout step={11} canNext={!!level} onNext={handleNext} scrollViewRef={scrollRef} onSave={() => { if (level) update({ careerLevel: level, careerDetail: detail }); }}>
      <QuestionTitle>경력을 선택해주세요</QuestionTitle>
      <View style={{ gap: 10, marginBottom: 28 }}>
        {OPTIONS.map(([value, label]) => (
          <TouchableOpacity
            key={value}
            onPress={() => setLevel(value)}
            style={{
              height: 56,
              borderRadius: 14,
              backgroundColor: level === value ? '#3D5BF6' : '#1a1a1a',
              justifyContent: 'center',
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '500' }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ color: '#555', fontSize: 13, fontWeight: '500', marginBottom: 10 }}>
        경력 상세 (선택)
      </Text>
      <TextInput
        value={detail}
        onChangeText={setDetail}
        placeholder="예) ○○샵 2년 근무, 커트·펌 전담"
        placeholderTextColor="#444"
        multiline
        returnKeyType="done"
        onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)}
        style={{
          backgroundColor: '#1a1a1a',
          borderRadius: 14,
          paddingHorizontal: 16,
          paddingVertical: 14,
          color: '#fff',
          fontSize: 15,
          lineHeight: 22,
          minHeight: 80,
          textAlignVertical: 'top',
        }}
      />
      {/* Android: 키보드 높이만큼 스크롤 여백 확보 (위 useEffect 참고) */}
      {kbHeight > 0 && <View style={{ height: kbHeight }} />}
    </StepLayout>
  );
}
