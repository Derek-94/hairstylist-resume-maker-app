import { useRef, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';

export default function Step04Phone() {
  const { data, update } = useResumeStore();

  // split stored "010-XXXX-XXXX" back into parts
  const parts = data.phone.split('-');
  const [p1, setP1] = useState(parts[0] ?? '');
  const [p2, setP2] = useState(parts[1] ?? '');
  const [p3, setP3] = useState(parts[2] ?? '');

  const ref2 = useRef<TextInput>(null);
  const ref3 = useRef<TextInput>(null);

  const handleP1 = (t: string) => {
    const d = t.replace(/\D/g, '').slice(0, 3);
    setP1(d);
    if (d.length === 3) ref2.current?.focus();
  };

  const handleP2 = (t: string) => {
    const d = t.replace(/\D/g, '').slice(0, 4);
    setP2(d);
    if (d.length === 4) ref3.current?.focus();
  };

  const handleP3 = (t: string) => {
    const d = t.replace(/\D/g, '').slice(0, 4);
    setP3(d);
  };

  // backspace on empty field → focus previous
  const onP2KeyPress = ({ nativeEvent }: { nativeEvent: { key: string } }) => {
    if (nativeEvent.key === 'Backspace' && p2 === '') {
      // focus p1 — no easy way to move cursor to end, just focus
    }
  };
  const onP3KeyPress = ({ nativeEvent }: { nativeEvent: { key: string } }) => {
    if (nativeEvent.key === 'Backspace' && p3 === '') {
      ref2.current?.focus();
    }
  };

  const phone = `${p1}-${p2}-${p3}`;
  const isValid = p1.length === 3 && p2.length === 4 && p3.length === 4;

  const handleNext = () => {
    update({ phone: phone });
    router.push('/survey/5');
  };

  const inputStyle = {
    height: 56,
    borderRadius: 14,
    backgroundColor: '#1a1a1a',
    color: '#fff' as const,
    fontSize: 24,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  };

  return (
    <StepLayout step={4} canNext={isValid} onNext={handleNext}>
      <QuestionTitle>연락처를 입력해주세요</QuestionTitle>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <TextInput
          value={p1}
          onChangeText={handleP1}
          keyboardType="number-pad"
          maxLength={3}
          autoFocus
          style={[inputStyle, { flex: 3 }]}
          placeholderTextColor="#444"
          placeholder="010"
        />
        <Text style={{ color: '#444', fontSize: 22 }}>-</Text>
        <TextInput
          ref={ref2}
          value={p2}
          onChangeText={handleP2}
          onKeyPress={onP2KeyPress}
          keyboardType="number-pad"
          maxLength={4}
          style={[inputStyle, { flex: 4 }]}
          placeholderTextColor="#444"
          placeholder="0000"
        />
        <Text style={{ color: '#444', fontSize: 22 }}>-</Text>
        <TextInput
          ref={ref3}
          value={p3}
          onChangeText={handleP3}
          onKeyPress={onP3KeyPress}
          keyboardType="number-pad"
          maxLength={4}
          style={[inputStyle, { flex: 4 }]}
          placeholderTextColor="#444"
          placeholder="0000"
        />
      </View>
    </StepLayout>
  );
}
