import { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

/**
 * Android 전용 날짜 선택기.
 * iOS에서는 절대 사용하지 않는다 (각 스텝의 iOS 인라인 스피너를 그대로 유지).
 *
 * Android의 @react-native-community/datetimepicker는 인라인 컴포넌트가 아니라
 * 네이티브 모달 다이얼로그다. 인라인으로 마운트해두면 다이얼로그가 계속 떠
 * 화면을 전환해도 따라다니는 버그가 생긴다. 그래서 버튼을 누를 때만 마운트하고
 * onChange(set/dismissed) 시 즉시 언마운트한다.
 */
interface Props {
  value: Date;
  hasValue: boolean;
  placeholder?: string;
  onChange: (d: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

function displayDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}년 ${m}월 ${day}일`;
}

export default function AndroidDatePicker({
  value,
  hasValue,
  placeholder = '날짜 선택',
  onChange,
  minimumDate,
  maximumDate,
}: Props) {
  const [show, setShow] = useState(false);

  const handleChange = (event: DateTimePickerEvent, d?: Date) => {
    // 'set'(확인) 또는 'dismissed'(취소) 모두 다이얼로그를 닫는다.
    setShow(false);
    if (event.type === 'set' && d) onChange(d);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={{
          height: 56,
          borderRadius: 14,
          backgroundColor: '#1a1a1a',
          borderWidth: 1,
          borderColor: hasValue ? '#3D5BF6' : '#2a2a2a',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: hasValue ? '#fff' : '#888', fontSize: 17, fontWeight: '600' }}>
          {hasValue ? displayDate(value) : placeholder}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </>
  );
}
