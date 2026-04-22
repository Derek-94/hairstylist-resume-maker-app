import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useResumeStore } from '../../src/store/resume';
import Step01Name from '../../src/components/survey/Step01Name';
import Step02Birth from '../../src/components/survey/Step02Birth';
import Step03Gender from '../../src/components/survey/Step03Gender';
import Step04Phone from '../../src/components/survey/Step04Phone';
import Step05Email from '../../src/components/survey/Step05Email';
import Step06Address from '../../src/components/survey/Step06Address';
import Step07Education from '../../src/components/survey/Step07Education';
import Step08AvailableDate from '../../src/components/survey/Step08AvailableDate';
import Step09ProfileImage from '../../src/components/survey/Step09ProfileImage';
import Step10Skills from '../../src/components/survey/Step10Skills';
import Step11Career from '../../src/components/survey/Step11Career';
import Step12Certifications from '../../src/components/survey/Step12Certifications';
import Step13Portfolio from '../../src/components/survey/Step13Portfolio';
import Step14Introduction from '../../src/components/survey/Step14Introduction';

const STEPS: Record<number, React.ComponentType> = {
  1: Step01Name,
  2: Step02Birth,
  3: Step03Gender,
  4: Step04Phone,
  5: Step05Email,
  6: Step06Address,
  7: Step07Education,
  8: Step08AvailableDate,
  9: Step09ProfileImage,
  10: Step10Skills,
  11: Step11Career,
  12: Step12Certifications,
  13: Step13Portfolio,
  14: Step14Introduction,
};

export default function SurveyStep() {
  const { step } = useLocalSearchParams<{ step: string }>();
  const { isEditMode } = useResumeStore();
  const stepNum = Number(step);
  const StepComponent = STEPS[stepNum];

  if (!StepComponent) {
    router.replace('/survey/1');
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ gestureEnabled: !isEditMode }} />
      <StepComponent />
    </>
  );
}
