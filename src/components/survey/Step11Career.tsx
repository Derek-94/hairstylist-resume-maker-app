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

  // Android만: 키보드가 올라오면 끝까지 스크롤해 경력 상세 입력칸이
  // 키보드(+ 위로 띄워진 하단 네비) 위로 보이게 한다. 하단 네비를 띄워
  // 스크롤 여백을 만드는 처리는 StepLayout이 전역으로 담당한다.
  // iOS는 리스너를 등록하지 않으므로 기존과 동일.
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    });
    return () => { showSub.remove(); };
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
    </StepLayout>
  );
}
