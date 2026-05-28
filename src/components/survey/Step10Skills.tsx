import { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, LayoutAnimation, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';

const SKILL_CATEGORIES = [
  { label: '헤어', skills: ['커트', '펌', '염색', '드라이', '레게머리', '붙임머리', '매직', '셋팅'] },
  { label: '네일', skills: ['젤네일', '아크릴', '네일아트', '네일제거'] },
  { label: '피부/에스테틱', skills: ['피부관리', '왁싱', '눈썹정리', '마사지', '스킨케어'] },
  { label: '메이크업', skills: ['신부메이크업', '웨딩메이크업', '특수분장', '일상메이크업'] },
  { label: '제빵/파티시에', skills: ['제빵', '케이크', '마카롱', '쿠키', '디저트'] },
  { label: '반려동물 미용', skills: ['목욕', '미용컷', '발톱관리', '귀청소'] },
];

const ALL_PRESET = SKILL_CATEGORIES.flatMap(c => c.skills);

export default function Step10Skills() {
  const { data, update } = useResumeStore();
  const [selected, setSelected] = useState<string[]>(data.skills);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [custom, setCustom] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const toggle = (skill: string) => {
    setSelected(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleCategory = (label: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const addCustom = () => {
    const trimmed = custom.trim();
    if (trimmed && !selected.includes(trimmed)) {
      setSelected(prev => [...prev, trimmed]);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
    setCustom('');
  };

  const handleNext = () => {
    update({ skills: selected });
    router.push('/survey/11');
  };

  return (
    <StepLayout step={10} canNext={selected.length > 0} onNext={handleNext} scrollViewRef={scrollViewRef}>
      <QuestionTitle>보유 기술을 선택해주세요</QuestionTitle>

      {/* Category accordion */}
      <View style={{ gap: 6, marginBottom: 20 }}>
        {SKILL_CATEGORIES.map(({ label, skills }) => {
          const isOpen = expanded.includes(label);
          const selectedCount = skills.filter(s => selected.includes(s)).length;
          return (
            <View key={label} style={{ borderRadius: 14, backgroundColor: '#1a1a1a', overflow: 'hidden' }}>
              <TouchableOpacity
                onPress={() => toggleCategory(label)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 18,
                  paddingVertical: 16,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{label}</Text>
                  {selectedCount > 0 && (
                    <View style={{ backgroundColor: '#3D5BF6', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{selectedCount}</Text>
                    </View>
                  )}
                </View>
                <Ionicons
                  name={isOpen ? 'chevron-down' : 'chevron-forward'}
                  size={18}
                  color="#555"
                />
              </TouchableOpacity>

              {isOpen && (
                <View style={{ paddingHorizontal: 18, paddingBottom: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {skills.map(skill => (
                    <TouchableOpacity
                      key={skill}
                      onPress={() => toggle(skill)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: 999,
                        backgroundColor: selected.includes(skill) ? '#3D5BF6' : '#2a2a2a',
                        borderWidth: selected.includes(skill) ? 0 : 1,
                        borderColor: '#333',
                      }}
                    >
                      <Text style={{ color: '#fff', fontSize: 14, fontWeight: selected.includes(skill) ? '600' : '400' }}>
                        {skill}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Direct input */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
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
          <Text style={{ color: '#3D5BF6', fontSize: 15, fontWeight: '600' }}>+ 추가</Text>
        </TouchableOpacity>
      </View>

      {/* Selected skills summary */}
      {selected.length > 0 && (
        <View>
          <Text style={{ color: '#555', fontSize: 12, fontWeight: '600', marginBottom: 10, letterSpacing: 0.5 }}>
            선택된 기술 {selected.length}개
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {selected.map(skill => (
              <TouchableOpacity
                key={skill}
                onPress={() => toggle(skill)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingLeft: 12,
                  paddingRight: 8,
                  paddingVertical: 7,
                  borderRadius: 999,
                  backgroundColor: '#3D5BF6',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{skill}</Text>
                <Ionicons name="close" size={13} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </StepLayout>
  );
}
