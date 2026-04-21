import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResumeStore } from '../src/store/resume';

export default function Home() {
  const insets = useSafeAreaInsets();
  const { data, reset } = useResumeStore();
  const hasData = data.name.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#0f0f0f', paddingTop: insets.top, paddingBottom: insets.bottom + 24, paddingHorizontal: 24 }}>

      {/* Top label */}
      <View style={{ marginTop: 48 }}>
        <Text style={{ color: '#c084fc', fontSize: 13, fontWeight: '600', letterSpacing: 2 }}>
          HAIR STYLIST
        </Text>
      </View>

      {/* Main heading */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 36, fontWeight: '800', lineHeight: 48, marginBottom: 16 }}>
          나만의{'\n'}이력서를{'\n'}만들어봐요
        </Text>
        <Text style={{ color: '#555', fontSize: 16, lineHeight: 26 }}>
          몇 가지 질문에 답하면{'\n'}바로 쓸 수 있는 이력서가 완성돼요
        </Text>
      </View>

      {/* Buttons */}
      <View style={{ gap: 12 }}>
        {hasData && (
          <TouchableOpacity
            onPress={() => router.push('/survey/1')}
            style={{
              height: 56,
              borderRadius: 16,
              backgroundColor: '#1a1a1a',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#888', fontSize: 17 }}>이어서 작성하기</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => { reset(); router.push('/survey/1'); }}
          style={{
            height: 60,
            borderRadius: 16,
            backgroundColor: '#c084fc',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
            {hasData ? '처음부터 다시 시작' : '이력서 만들기'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
