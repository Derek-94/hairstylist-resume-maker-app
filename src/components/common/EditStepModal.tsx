import { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, Modal, ScrollView,
  Animated, PanResponder, Dimensions, Pressable, StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResumeStore } from '../../store/resume';
import { CAREER_LABELS, ResumeData } from '../../types/resume';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_MAX = SCREEN_HEIGHT * 0.8;
const DISMISS_THRESHOLD = 120;

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
  const { data, setEditMode } = useResumeStore();

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SHEET_MAX)).current;

  useEffect(() => {
    if (visible) {
      sheetTranslateY.setValue(SHEET_MAX);
      backdropOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(sheetTranslateY, { toValue: 0, damping: 25, stiffness: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const dismissRef = useRef<() => void>(() => {});

  const dismiss = () => {
    sheetTranslateY.stopAnimation();
    backdropOpacity.stopAnimation();
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(sheetTranslateY, { toValue: SHEET_MAX, duration: 300, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  dismissRef.current = dismiss;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_e, gs) => {
        if (gs.dy > 0) {
          sheetTranslateY.setValue(gs.dy);
          backdropOpacity.setValue(1 - gs.dy / SHEET_MAX);
        }
      },
      onPanResponderRelease: (_e, gs) => {
        if (gs.dy > DISMISS_THRESHOLD || gs.vy > 0.5) {
          dismissRef.current();
        } else {
          Animated.parallel([
            Animated.spring(sheetTranslateY, { toValue: 0, damping: 40, stiffness: 300, overshootClamping: true, useNativeDriver: true }),
            Animated.timing(backdropOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
          ]).start();
        }
      },
    })
  ).current;

  const goTo = (step: number, editMode = false) => {
    onClose();
    setEditMode(editMode);
    if (editMode) {
      router.replace(`/survey/${step}`);
    } else {
      router.push(`/survey/${step}`);
    }
  };

  return (
    <Modal animationType="none" transparent visible={visible} statusBarTranslucent presentationStyle="overFullScreen">
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        {/* Backdrop */}
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)', opacity: backdropOpacity }]}>
          <Pressable style={{ flex: 1 }} onPress={dismiss} />
        </Animated.View>

        {/* Sheet */}
        <Animated.View style={{
          backgroundColor: '#0f0f0f',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: insets.bottom + 16,
          maxHeight: '80%',
          transform: [{ translateY: sheetTranslateY }],
        }}>
          {/* Handle (drag zone) */}
          <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }} {...panResponder.panHandlers}>
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
                  onPress={() => goTo(step, true)}
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
        </Animated.View>
      </View>
    </Modal>
  );
}
