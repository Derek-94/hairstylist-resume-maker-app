import { useState } from 'react';
import { Text } from 'react-native';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';
import UnderlineInput from './UnderlineInput';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export default function Step05Email() {
  const { data, update } = useResumeStore();
  const [value, setValue] = useState(data.email);

  const trimmed = value.trim();
  const isValid = EMAIL_REGEX.test(trimmed);
  const showError = trimmed.length > 0 && !isValid;

  const handleNext = () => {
    update({ email: trimmed });
    router.push('/survey/6');
  };

  return (
    <StepLayout step={5} canNext={isValid} onNext={handleNext} onSkip={() => { update({ email: '' }); router.push('/survey/6'); }}>
      <QuestionTitle>이메일 주소를 알려주세요</QuestionTitle>
      <UnderlineInput
        placeholder="example@email.com"
        value={value}
        onChangeText={setValue}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
      />
      {showError && (
        <Text style={{ color: '#ff4444', fontSize: 13, marginTop: 8 }}>
          유효하지 않은 이메일 주소입니다
        </Text>
      )}
    </StepLayout>
  );
}
