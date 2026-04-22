import { useState } from 'react';
import { TextInput } from 'react-native';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';
import { track } from '../../utils/analytics';

export default function Step14Introduction() {
  const { data, update } = useResumeStore();
  const [value, setValue] = useState(data.introduction);

  const handleNext = () => {
    update({ introduction: value.trim() });
    track('Survey Completed');
    router.push('/preview');
  };

  const skip = () => {
    update({ introduction: '' });
    track('Survey Completed');
    router.push('/preview');
  };

  return (
    <StepLayout step={14} canNext={value.trim().length > 0} onNext={handleNext} onSkip={skip} nextLabel="완료">
      <QuestionTitle>한 줄 자기소개를 작성해주세요</QuestionTitle>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={'예) 손님을 최우선으로 생각하는 미용사가 되고 싶습니다.'}
        placeholderTextColor="#444"
        multiline
        autoFocus
        style={{
          backgroundColor: '#1a1a1a',
          borderRadius: 14,
          padding: 16,
          color: '#fff',
          fontSize: 17,
          minHeight: 120,
          textAlignVertical: 'top',
        }}
      />
    </StepLayout>
  );
}
