import { useState } from 'react';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';
import UnderlineInput from './UnderlineInput';

export default function Step01Name() {
  const { data, update } = useResumeStore();
  const [value, setValue] = useState(data.name);

  const handleNext = () => {
    update({ name: value.trim() });
    router.push('/survey/2');
  };

  return (
    <StepLayout step={1} canNext={value.trim().length > 0} onNext={handleNext}>
      <QuestionTitle>이름이 무엇인가요?</QuestionTitle>
      <UnderlineInput
        placeholder="홍길동"
        value={value}
        onChangeText={setValue}
        autoFocus
        returnKeyType="next"
        onSubmitEditing={value.trim() ? handleNext : undefined}
      />
    </StepLayout>
  );
}
