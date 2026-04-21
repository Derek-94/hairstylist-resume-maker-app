import { Text } from 'react-native';

export default function QuestionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: 32, lineHeight: 36 }}>
      {children}
    </Text>
  );
}
