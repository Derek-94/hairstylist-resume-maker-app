import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function SurveyStep() {
  const { step } = useLocalSearchParams();
  return (
    <View style={{ flex: 1, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 24 }}>Step {step}</Text>
    </View>
  );
}
