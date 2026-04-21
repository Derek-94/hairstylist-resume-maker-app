import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Preview() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: '#0f0f0f', justifyContent: 'center', alignItems: 'center', paddingTop: insets.top }}>
      <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>미리보기</Text>
      <Text style={{ color: '#555', fontSize: 14, marginTop: 8 }}>준비 중...</Text>
    </View>
  );
}
