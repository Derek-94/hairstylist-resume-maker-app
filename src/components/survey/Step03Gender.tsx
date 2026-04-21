import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';

const OPTIONS: { label: string; value: '여' | '남' }[] = [
  { label: '여성', value: '여' },
  { label: '남성', value: '남' },
];

export default function Step03Gender() {
  const { data, update } = useResumeStore();

  const handleSelect = (value: '여' | '남') => {
    update({ gender: value });
    router.push('/survey/4');
  };

  return (
    <StepLayout step={3} canNext={false} onNext={() => {}} >
      <QuestionTitle>성별을 선택해주세요</QuestionTitle>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {OPTIONS.map(({ label, value }) => (
          <TouchableOpacity
            key={value}
            onPress={() => handleSelect(value)}
            style={{
              flex: 1,
              height: 56,
              borderRadius: 14,
              backgroundColor: data.gender === value ? '#c084fc' : '#1a1a1a',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </StepLayout>
  );
}
