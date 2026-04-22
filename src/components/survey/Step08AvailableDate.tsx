import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';

const NEGOTIABLE = '협의 필요';

type Mode = 'none' | 'date' | 'negotiable';

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

  const [mode, setMode] = useState<Mode>(() => {
    if (data.availableStartDate === NEGOTIABLE) return 'negotiable';
    if (data.availableStartDate) return 'date';
    return 'none';
  });
  const [date, setDate] = useState<Date>(stringToDate(data.availableStartDate));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 3);

  const handleNext = () => {
    update({
      availableStartDate: mode === 'negotiable' ? NEGOTIABLE : dateToString(date),
    });
    router.push('/survey/9');
  };

  return (
    <StepLayout step={8} canNext={mode !== 'none'} onNext={handleNext}>
      <QuestionTitle>입사 가능일을 알려주세요</QuestionTitle>

      {/* Mode selector */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 28 }}>
        {(['date', 'negotiable'] as const).map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => setMode(m)}
            style={{
              flex: 1,
              height: 52,
              borderRadius: 14,
              backgroundColor: mode === m ? '#c084fc' : '#1a1a1a',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: mode === m ? 0 : 1,
              borderColor: '#2a2a2a',
            }}
          >
            <Text style={{ color: mode === m ? '#fff' : '#888', fontSize: 15, fontWeight: '600' }}>
              {m === 'date' ? '날짜 직접 선택' : '협의 필요'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date picker */}
      {mode === 'date' && (
        <>
          <Text style={{ color: '#c084fc', fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 12 }}>
            {displayDate(dateToString(date))}
          </Text>
          <View style={{ backgroundColor: '#1a1a1a', borderRadius: 16, overflow: 'hidden' }}>
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={(_: unknown, d?: Date) => { if (d) setDate(d); }}
              minimumDate={today}
              maximumDate={maxDate}
              locale="ko-KR"
              textColor="#ffffff"
              style={{ height: 200 }}
            />
          </View>
        </>
      )}
    </StepLayout>
  );
}
