import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';

interface Props {
  step: number;
  total?: number;
  canNext: boolean;
  onNext: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  children: React.ReactNode;
}

export default function StepLayout({ step, total = 14, canNext, onNext, onSkip, nextLabel, children }: Props) {
  const insets = useSafeAreaInsets();
  const progress = step / total;
  const { isEditMode, setEditMode } = useResumeStore();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#0f0f0f' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Safe area spacer + progress bar */}
      <View style={{ paddingTop: insets.top }}>
        <View style={{ height: 3, backgroundColor: '#1a1a1a' }}>
          <View
            style={{
              height: 3,
              width: `${progress * 100}%`,
              backgroundColor: '#c084fc',
            }}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step counter + 미리보기로 돌아가기 */}
        <View style={{ paddingTop: 16, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#555', fontSize: 13, fontWeight: '500', letterSpacing: 1 }}>
            {String(step).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </Text>
          {isEditMode && (
            <TouchableOpacity onPress={() => { setEditMode(false); router.replace('/preview'); }}>
              <Text style={{ color: '#c084fc', fontSize: 13, fontWeight: '600' }}>미리보기로 돌아가기 →</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
          {children}
        </View>
      </ScrollView>

      {/* Bottom navigation */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 16,
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
            onPress={onSkip}
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
              onPress={canNext ? onNext : undefined}
              style={{
                flex: isSmallCircle ? undefined : 1,
                width: isSmallCircle ? 52 : undefined,
                height: 52,
                borderRadius: isSmallCircle ? 26 : 14,
                backgroundColor: canNext ? '#c084fc' : '#1a1a1a',
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
