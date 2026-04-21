import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';

const NEGOTIABLE = '협의 필요';

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

  const isNegotiable = data.availableStartDate === NEGOTIABLE;
  const [date, setDate] = useState<Date>(stringToDate(data.availableStartDate));
  const [negotiable, setNegotiable] = useState(isNegotiable);
  const [pickerTouched, setPickerTouched] = useState(
    data.availableStartDate.length > 0 && !isNegotiable
  );

  const selected = negotiable || pickerTouched;

  const handleChange = (_: unknown, d?: Date) => {
    if (d) {
      setDate(d);
      setPickerTouched(true);
      setNegotiable(false);
    }
  };

  const handleNegotiable = () => {
    setNegotiable(true);
    setPickerTouched(false);
  };

  const handleNext = () => {
    update({ availableStartDate: negotiable ? NEGOTIABLE : dateToString(date) });
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

      {/* 선택된 값 표시 */}
      {selected && (
        <Text style={{ color: '#c084fc', fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 12 }}>
          {negotiable ? NEGOTIABLE : displayDate(dateToString(date))}
        </Text>
      )}

      {/* 날짜 피커 */}
      <View style={{
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        overflow: 'hidden',
        opacity: negotiable ? 0.35 : 1,
      }}>
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

      {/* 협의 필요 버튼 */}
      <TouchableOpacity
        onPress={handleNegotiable}
        style={{
          marginTop: 14,
          height: 52,
          borderRadius: 14,
          backgroundColor: negotiable ? '#c084fc' : '#1a1a1a',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: negotiable ? 0 : 1,
          borderColor: '#2a2a2a',
        }}
      >
        <Text style={{ color: negotiable ? '#fff' : '#888', fontSize: 16, fontWeight: '600' }}>
          협의 필요
        </Text>
      </TouchableOpacity>
    </StepLayout>
  );
}
