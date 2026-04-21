import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';

const DEFAULT_SKILLS = ['커트', '펌', '염색', '드라이', '레게머리', '붙임머리', '매직', '셋팅', '네일', '스킨케어'];

export default function Step10Skills() {
  const { data, update } = useResumeStore();
  const [selected, setSelected] = useState<string[]>(data.skills);
  const [custom, setCustom] = useState('');

  const toggle = (skill: string) => {
    setSelected(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const addCustom = () => {
    const trimmed = custom.trim();
    if (trimmed && !selected.includes(trimmed)) {
      setSelected(prev => [...prev, trimmed]);
    }
    setCustom('');
  };

  const handleNext = () => {
    update({ skills: selected });
    router.push('/survey/11');
  };

  const allSkills = [...DEFAULT_SKILLS, ...selected.filter(s => !DEFAULT_SKILLS.includes(s))];

  return (
    <StepLayout step={10} canNext={selected.length > 0} onNext={handleNext}>
      <QuestionTitle>보유 기술을 선택해주세요</QuestionTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
        {allSkills.map(skill => (
          <TouchableOpacity
            key={skill}
            onPress={() => toggle(skill)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 999,
              backgroundColor: selected.includes(skill) ? '#c084fc' : '#1a1a1a',
              borderWidth: selected.includes(skill) ? 0 : 1,
              borderColor: '#2a2a2a',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: selected.includes(skill) ? '600' : '400' }}>
              {skill}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TextInput
          value={custom}
          onChangeText={setCustom}
          placeholder="직접 입력"
          placeholderTextColor="#444"
          onSubmitEditing={addCustom}
          returnKeyType="done"
          style={{
            flex: 1,
            height: 46,
            borderRadius: 10,
            backgroundColor: '#1a1a1a',
            paddingHorizontal: 14,
            color: '#fff',
            fontSize: 15,
          }}
        />
        <TouchableOpacity
          onPress={addCustom}
          style={{
            height: 46,
            paddingHorizontal: 16,
            borderRadius: 10,
            backgroundColor: '#1a1a1a',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#c084fc', fontSize: 15, fontWeight: '600' }}>+ 추가</Text>
        </TouchableOpacity>
      </View>
    </StepLayout>
  );
}
