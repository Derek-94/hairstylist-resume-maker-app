import { useState } from 'react';
import { View, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';

function stringToDate(s: string): Date {
  const d = s.replace(/\D/g, '');
  if (d.length === 8) {
    return new Date(
      parseInt(d.slice(0, 4)),
      parseInt(d.slice(4, 6)) - 1,
      parseInt(d.slice(6, 8))
    );
  }
  return new Date();
}

function dateToString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

function displayDate(s: string): string {
  const d = s.replace(/\D/g, '');
  if (d.length !== 8) return '';
  return `${d.slice(0, 4)}년 ${d.slice(4, 6)}월 ${d.slice(6)}일`;
}

export default function Step08AvailableDate() {
  const { data, update } = useResumeStore();
  const [date, setDate] = useState<Date>(stringToDate(data.availableStartDate));
  const [selected, setSelected] = useState(data.availableStartDate.length > 0);

  const handleChange = (_: unknown, d?: Date) => {
    if (d) {
      setDate(d);
      setSelected(true);
    }
  };

  const handleNext = () => {
    update({ availableStartDate: dateToString(date) });
    router.push('/survey/9');
  };

  const skip = () => {
    update({ availableStartDate: '' });
    router.push('/survey/9');
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 3);

  return (
    <StepLayout step={8} canNext={selected} onNext={handleNext} onSkip={skip}>
      <QuestionTitle>입사 가능일을 알려주세요</QuestionTitle>

      {selected && (
        <Text style={{ color: '#c084fc', fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 8 }}>
          {displayDate(dateToString(date))}
        </Text>
      )}

      <View style={{ backgroundColor: '#1a1a1a', borderRadius: 16, overflow: 'hidden' }}>
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={handleChange}
          minimumDate={today}
          maximumDate={maxDate}
          locale="ko-KR"
          textColor="#ffffff"
          style={{ height: 200 }}
        />
      </View>
    </StepLayout>
  );
}
