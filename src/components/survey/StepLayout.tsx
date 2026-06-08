import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import { track } from '../../utils/analytics';
import { RefObject, useEffect, useState } from 'react';

interface Props {
  step: number;
  total?: number;
  canNext: boolean;
  onNext: () => void;
  onSkip?: () => void;
  onSave?: () => void;
  nextLabel?: string;
  children: React.ReactNode;
  scrollViewRef?: RefObject<ScrollView>;
}

const STEP_NAMES: Record<number, string> = {
  1: '이름', 2: '생년월일', 3: '성별', 4: '연락처', 5: '이메일',
  6: '주소', 7: '학력', 8: '입사가능일', 9: '프로필사진', 10: '보유기술',
  11: '경력', 12: '자격증', 13: '포트폴리오', 14: '자기소개',
};

export default function StepLayout({ step, total = 14, canNext, onNext, onSkip, onSave, nextLabel, children, scrollViewRef }: Props) {
  const insets = useSafeAreaInsets();
  const progress = step / total;
  const { isEditMode, setEditMode } = useResumeStore();

  // Android만: edge-to-edge 모드에선 adjustResize가 창을 줄이지 않아
  // 하단 네비게이션(뒤로/다음 버튼)이 키보드 뒤에 깔린다. 키보드 높이를
  // 받아 그만큼 하단 패딩을 키워 버튼을 키보드 위로 띄운다(iOS의 padding
  // behavior와 동일한 결과). iOS는 리스너를 등록하지 않아 kbHeight=0 →
  // 기존 동작 그대로라 런타임 영향 없음.
  const [kbHeight, setKbHeight] = useState(0);
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    // 다음 스텝으로 넘어올 때 키보드가 이미 떠 있으면 keyboardDidShow가
    // 다시 울지 않으므로, 마운트 시 현재 키보드 높이를 직접 읽어 초기화한다.
    const m = Keyboard.metrics?.();
    if (m?.height) setKbHeight(m.height);
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => setKbHeight(e.endCoordinates.height));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKbHeight(0));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#0f0f0f' }}
      // Android는 Manifest의 adjustResize가 키보드 영역을 처리한다.
      // 여기서 behavior='height'를 주면 이중 처리되어 키보드를 내릴 때
      // 하단에 윈도우 배경(흰색)이 드러난다. iOS만 padding 사용.
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Safe area spacer + progress bar */}
      <View style={{ paddingTop: insets.top }}>
        <View style={{ height: 3, backgroundColor: '#1a1a1a' }}>
          <View
            style={{
              height: 3,
              width: `${progress * 100}%`,
              backgroundColor: '#3D5BF6',
            }}
          />
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step counter */}
        <View style={{ paddingTop: 16, paddingHorizontal: 24 }}>
          <Text style={{ color: '#555', fontSize: 13, fontWeight: '500', letterSpacing: 1 }}>
            {String(step).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </Text>
        </View>

        {/* Content */}
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
          {children}
        </View>
      </ScrollView>

      {/* Edit mode: return to preview pill */}
      {isEditMode && (
        <TouchableOpacity
          onPress={() => { onSave?.(); track('Edit Mode Return To Preview', { step }); setEditMode(false); router.replace('/preview'); }}
          style={{
            marginHorizontal: 24,
            marginBottom: 8,
            height: 44,
            borderRadius: 12,
            backgroundColor: '#1a1a1a',
            borderWidth: 1,
            borderColor: '#3D5BF6',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>미리보기로 돌아가기 →</Text>
        </TouchableOpacity>
      )}

      {/* Bottom navigation */}
      <View
        style={{
          paddingHorizontal: 24,
          // Android: 키보드가 올라오면 버튼이 키보드 위에 오도록 띄운다.
          // endCoordinates.height(kbHeight)는 edge-to-edge에서 시스템 내비
          // 바를 포함하지 않으므로 insets.bottom을 더해 실제 가림 높이를
          // 맞춘다(위 useEffect 참고). iOS는 kbHeight=0이라 영향 없음.
          paddingBottom: kbHeight > 0 ? kbHeight + insets.bottom + 12 : insets.bottom + 16,
          paddingTop: 12,
          flexDirection: 'row',
          gap: 10,
        }}
      >
        {/* Back button */}
        <TouchableOpacity
          onPress={() => {
            if (isEditMode && step > 1) {
              router.replace(`/survey/${step - 1}`);
            } else if (isEditMode) {
              setEditMode(false);
              router.replace('/preview');
            } else {
              router.back();
            }
          }}
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: '#1a1a1a',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>←</Text>
        </TouchableOpacity>

        {/* Skip button (optional steps, hidden once content is entered) */}
        {onSkip && !canNext && (
          <TouchableOpacity
            onPress={() => { track('Survey Step Skipped', { step, stepName: STEP_NAMES[step] }); onSkip!(); }}
            style={{
              flex: 1,
              height: 52,
              borderRadius: 14,
              backgroundColor: '#1a1a1a',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#888', fontSize: 16 }}>건너뛰기</Text>
          </TouchableOpacity>
        )}

        {/* Next / Done button */}
        {(() => {
          const isArrow = !nextLabel;
          const isSmallCircle = isArrow && !!onSkip && !canNext;
          return (
            <TouchableOpacity
              onPress={canNext ? () => { track('Survey Step Completed', { step, stepName: STEP_NAMES[step] }); onNext(); } : undefined}
              style={{
                flex: isSmallCircle ? undefined : 1,
                width: isSmallCircle ? 52 : undefined,
                height: 52,
                borderRadius: isSmallCircle ? 26 : 14,
                backgroundColor: canNext ? '#3D5BF6' : '#1a1a1a',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: canNext ? '#fff' : '#444', fontSize: 18 }}>
                {nextLabel ?? '→'}
              </Text>
            </TouchableOpacity>
          );
        })()}
      </View>
    </KeyboardAvoidingView>
  );
}
