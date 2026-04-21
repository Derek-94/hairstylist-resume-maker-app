import { TextInput, TextInputProps, View, Text } from 'react-native';

interface Props extends TextInputProps {
  hint?: string;
}

export default function UnderlineInput({ hint, style, ...props }: Props) {
  return (
    <View>
      <TextInput
        placeholderTextColor="#444"
        style={[
          {
            fontSize: 22,
            color: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#333',
            paddingVertical: 12,
            paddingHorizontal: 0,
          },
          style,
        ]}
        {...props}
      />
      {hint && (
        <Text style={{ color: '#555', fontSize: 12, marginTop: 8 }}>{hint}</Text>
      )}
    </View>
  );
}
