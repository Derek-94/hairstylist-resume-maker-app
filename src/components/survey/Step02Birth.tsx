import { useState } from 'react';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';
import UnderlineInput from './UnderlineInput';

function formatBirthDate(raw: string): string {
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
  return y >= 1900 && y <= 2099 && m >= 1 && m <= 12 && d >= 1 && d <= 31;
}

export default function Step02Birth() {
  const { data, update } = useResumeStore();
  const [value, setValue] = useState(data.birthDate);

  const handleChange = (text: string) => {
    setValue(formatBirthDate(text));
  };

  const handleNext = () => {
    update({ birthDate: value });
    router.push('/survey/3');
  };

  return (
    <StepLayout step={2} canNext={isValidDate(value)} onNext={handleNext}>
      <QuestionTitle>생년월일을 알려주세요</QuestionTitle>
      <UnderlineInput
        placeholder="yyyy / mm / dd"
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        autoFocus
        hint="숫자만 입력하면 자동으로 형식이 완성돼요"
      />
    </StepLayout>
  );
}
