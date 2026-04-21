import { useState } from 'react';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';
import UnderlineInput from './UnderlineInput';

function formatDate(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)} / ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} / ${digits.slice(4, 6)} / ${digits.slice(6)}`;
}

function isValidDate(formatted: string): boolean {
  const digits = formatted.replace(/\D/g, '');
  if (digits.length !== 8) return false;
  const y = parseInt(digits.slice(0, 4));
  const m = parseInt(digits.slice(4, 6));
  const d = parseInt(digits.slice(6, 8));
  return y >= 2020 && y <= 2099 && m >= 1 && m <= 12 && d >= 1 && d <= 31;
}

export default function Step08AvailableDate() {
  const { data, update } = useResumeStore();
  const [value, setValue] = useState(data.availableStartDate);

  const handleNext = () => {
    update({ availableStartDate: value });
    router.push('/survey/9');
  };

  return (
    <StepLayout
      step={8}
      canNext={isValidDate(value)}
      onNext={handleNext}
      onSkip={() => { update({ availableStartDate: '' }); router.push('/survey/9'); }}
    >
      <QuestionTitle>입사 가능일을 알려주세요</QuestionTitle>
      <UnderlineInput
        placeholder="yyyy / mm / dd"
        value={value}
        onChangeText={(t) => setValue(formatDate(t))}
        keyboardType="number-pad"
        autoFocus
        hint="즉시 입사 가능하다면 오늘 날짜를 입력해주세요"
      />
    </StepLayout>
  );
}
