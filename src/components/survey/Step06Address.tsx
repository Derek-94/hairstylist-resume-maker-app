import { useState } from 'react';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';
import UnderlineInput from './UnderlineInput';

export default function Step06Address() {
  const { data, update } = useResumeStore();
  const [value, setValue] = useState(data.address);

  const handleNext = () => {
    update({ address: value.trim() });
    router.push('/survey/7');
  };

  return (
    <StepLayout step={6} canNext={value.trim().length > 0} onNext={handleNext} onSkip={() => { update({ address: '' }); router.push('/survey/7'); }}>
      <QuestionTitle>거주 지역을 알려주세요</QuestionTitle>
      <UnderlineInput
        placeholder="서울시 강남구"
        value={value}
        onChangeText={setValue}
        autoFocus
        hint="시/구 단위까지만 입력해도 돼요"
      />
    </StepLayout>
  );
}
