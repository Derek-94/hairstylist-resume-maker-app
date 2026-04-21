import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import { EDUCATION_OPTIONS, Education } from '../../types/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';

export default function Step07Education() {
  const { data, update } = useResumeStore();

  const handleSelect = (value: Education) => {
    update({ education: value });
    router.push('/survey/8');
  };

  return (
    <StepLayout step={7} canNext={false} onNext={() => {}}>
      <QuestionTitle>최종 학력을 선택해주세요</QuestionTitle>
      <View style={{ gap: 10 }}>
        {EDUCATION_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => handleSelect(option)}
            style={{
              height: 56,
              borderRadius: 14,
              backgroundColor: data.education === option ? '#c084fc' : '#1a1a1a',
              justifyContent: 'center',
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '500' }}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </StepLayout>
  );
}
