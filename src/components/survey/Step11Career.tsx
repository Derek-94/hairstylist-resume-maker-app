import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import { CareerLevel, CAREER_LABELS } from '../../types/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';

const OPTIONS = Object.entries(CAREER_LABELS) as [CareerLevel, string][];

export default function Step11Career() {
  const { data, update } = useResumeStore();

  const handleSelect = (value: CareerLevel) => {
    update({ careerLevel: value });
    router.push('/survey/12');
  };

  return (
    <StepLayout step={11} canNext={false} onNext={() => {}}>
      <QuestionTitle>경력을 선택해주세요</QuestionTitle>
      <View style={{ gap: 10 }}>
        {OPTIONS.map(([value, label]) => (
          <TouchableOpacity
            key={value}
            onPress={() => handleSelect(value)}
            style={{
              height: 56,
              borderRadius: 14,
              backgroundColor: data.careerLevel === value ? '#c084fc' : '#1a1a1a',
              justifyContent: 'center',
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '500' }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </StepLayout>
  );
}
