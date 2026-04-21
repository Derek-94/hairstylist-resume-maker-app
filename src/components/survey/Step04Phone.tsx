import { useState } from 'react';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';
import UnderlineInput from './UnderlineInput';

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function Step04Phone() {
  const { data, update } = useResumeStore();
  const [value, setValue] = useState(data.phone);

  const handleNext = () => {
    update({ phone: value });
    router.push('/survey/5');
  };

  const isValid = value.replace(/\D/g, '').length >= 10;

  return (
    <StepLayout step={4} canNext={isValid} onNext={handleNext}>
      <QuestionTitle>연락처를 입력해주세요</QuestionTitle>
      <UnderlineInput
        placeholder="010-0000-0000"
        value={value}
        onChangeText={(t) => setValue(formatPhone(t))}
        keyboardType="phone-pad"
        autoFocus
      />
    </StepLayout>
  );
}
