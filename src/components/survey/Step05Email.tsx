import { useState } from 'react';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';
import UnderlineInput from './UnderlineInput';

export default function Step05Email() {
  const { data, update } = useResumeStore();
  const [value, setValue] = useState(data.email);

  const handleNext = () => {
    update({ email: value.trim() });
    router.push('/survey/6');
  };

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  return (
    <StepLayout step={5} canNext={isValid} onNext={handleNext} onSkip={() => { update({ email: '' }); router.push('/survey/6'); }}>
      <QuestionTitle>이메일 주소를 알려주세요</QuestionTitle>
      <UnderlineInput
        placeholder="example@email.com"
        value={value}
        onChangeText={setValue}
        keyboardType="email-address"
        autoCapitalize="none"
        autoFocus
      />
    </StepLayout>
  );
}
