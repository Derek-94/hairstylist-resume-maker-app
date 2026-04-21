import { useState } from 'react';
import { TextInput } from 'react-native';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';

export default function Step12Certifications() {
  const { data, update } = useResumeStore();
  const [value, setValue] = useState(data.certifications);

  const handleNext = () => {
    update({ certifications: value.trim() });
    router.push('/survey/13');
  };

  const skip = () => {
    update({ certifications: '' });
    router.push('/survey/13');
  };

  return (
    <StepLayout step={12} canNext={value.trim().length > 0} onNext={handleNext} onSkip={skip}>
      <QuestionTitle>자격증을 입력해주세요</QuestionTitle>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={'예) 미용사(일반) 자격증'}
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
