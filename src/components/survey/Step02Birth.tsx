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
  // default to 25 years ago
  const def = new Date();
  def.setFullYear(def.getFullYear() - 25);
  return def;
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

export default function Step02Birth() {
  const { data, update } = useResumeStore();
  const [date, setDate] = useState<Date>(stringToDate(data.birthDate));
  const [selected, setSelected] = useState(data.birthDate.length > 0);

  const handleChange = (_: unknown, d?: Date) => {
    if (d) {
      setDate(d);
      setSelected(true);
    }
  };

  const handleNext = () => {
    update({ birthDate: dateToString(date) });
    router.push('/survey/3');
  };

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 14);
  const minDate = new Date(1930, 0, 1);

  return (
    <StepLayout step={2} canNext={selected} onNext={handleNext}>
      <QuestionTitle>생년월일을 알려주세요</QuestionTitle>

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
          maximumDate={maxDate}
          minimumDate={minDate}
          locale="ko-KR"
          textColor="#ffffff"
          style={{ height: 200 }}
        />
      </View>
    </StepLayout>
  );
}
