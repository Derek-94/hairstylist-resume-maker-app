import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResumeStore } from '../../store/resume';
import { CAREER_LABELS, ResumeData } from '../../types/resume';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const STEPS: { step: number; label: string; getValue: (d: ResumeData) => string }[] = [
  { step: 1,  label: '이름',          getValue: (d) => d.name },
  { step: 2,  label: '생년월일',       getValue: (d) => d.birthDate },
  { step: 3,  label: '성별',           getValue: (d) => d.gender === '여' ? '여성' : d.gender === '남' ? '남성' : '' },
  { step: 4,  label: '연락처',         getValue: (d) => d.phone },
  { step: 5,  label: '이메일',         getValue: (d) => d.email },
  { step: 6,  label: '주소',           getValue: (d) => d.address },
  { step: 7,  label: '학력',           getValue: (d) => d.education },
  { step: 8,  label: '입사 가능일',    getValue: (d) => d.availableStartDate },
  { step: 9,  label: '프로필 사진',    getValue: (d) => d.profileImageUri ? '등록됨' : '' },
  { step: 10, label: '보유 기술',      getValue: (d) => d.skills.length > 0 ? `${d.skills.length}개 선택` : '' },
  { step: 11, label: '경력',           getValue: (d) => d.careerLevel ? CAREER_LABELS[d.careerLevel] : '' },
  { step: 12, label: '자격증',         getValue: (d) => d.certifications },
  { step: 13, label: '포트폴리오',     getValue: (d) => d.portfolio.length > 0 ? `${d.portfolio.length}장` : '' },
  { step: 14, label: '자기소개',       getValue: (d) => d.introduction },
];

export default function EditStepModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { data } = useResumeStore();

  const goTo = (step: number) => {
    onClose();
    router.push(`/survey/${step}`);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={{
        backgroundColor: '#0f0f0f',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: insets.bottom + 16,
        maxHeight: '80%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      }}>
        {/* Handle */}
        <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#333' }} />
        </View>

        <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700', paddingHorizontal: 20, paddingBottom: 12 }}>
          어디를 수정할까요?
        </Text>

        <ScrollView>
          {/* 처음부터 */}
          <TouchableOpacity
            onPress={() => goTo(1)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#1a1a1a',
            }}
          >
            <Text style={{ color: '#c084fc', fontSize: 16, fontWeight: '600' }}>처음부터 검토하기</Text>
            <Text style={{ color: '#555', fontSize: 14 }}>1번부터 →</Text>
          </TouchableOpacity>

          {STEPS.map(({ step, label, getValue }) => {
            const value = getValue(data);
            return (
              <TouchableOpacity
                key={step}
                onPress={() => goTo(step)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: '#1a1a1a',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ color: '#444', fontSize: 12, width: 22 }}>
                    {String(step).padStart(2, '0')}
                  </Text>
                  <Text style={{ color: '#fff', fontSize: 16 }}>{label}</Text>
                </View>
                <Text style={{ color: '#555', fontSize: 14 }} numberOfLines={1}>
                  {value || '미입력'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}
