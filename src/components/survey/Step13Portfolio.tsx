import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import { PortfolioItem } from '../../types/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';

export default function Step13Portfolio() {
  const { data, update } = useResumeStore();
  const [items, setItems] = useState<PortfolioItem[]>(data.portfolio);
  const [picking, setPicking] = useState(false);

  const addImages = async () => {
    setPicking(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.9,
    });
    setPicking(false);

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const ext = asset.uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `portfolio_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const dest = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.copyAsync({ from: asset.uri, to: dest });
      setItems(prev => [...prev, { uri: dest, width: asset.width, height: asset.height }]);
    }
  };

  const removeItem = (index: number) => {
    Alert.alert('삭제', '이 사진을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => setItems(prev => prev.filter((_, i) => i !== index)) },
    ]);
  };

  const handleNext = () => {
    update({ portfolio: items });
    router.push('/survey/14');
  };

  const skip = () => {
    update({ portfolio: [] });
    router.push('/survey/14');
  };

  const THUMB = 100;

  return (
    <StepLayout step={13} canNext={items.length > 0} onNext={handleNext} onSkip={skip}>
      <QuestionTitle>포트폴리오 사진을 올려주세요</QuestionTitle>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
        {items.map((item, i) => (
          <TouchableOpacity key={i} onLongPress={() => removeItem(i)} style={{ position: 'relative' }}>
            <Image
              source={{ uri: item.uri }}
              style={{ width: THUMB, height: THUMB, borderRadius: 10, backgroundColor: '#1a1a1a' }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => removeItem(i)}
              style={{
                position: 'absolute', top: -6, right: -6,
                width: 22, height: 22, borderRadius: 11,
                backgroundColor: '#ff4444',
                justifyContent: 'center', alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={addImages}
          disabled={picking}
          style={{
            width: THUMB, height: THUMB, borderRadius: 10,
            backgroundColor: '#1a1a1a',
            borderWidth: 1, borderColor: '#2a2a2a', borderStyle: 'dashed',
            justifyContent: 'center', alignItems: 'center', gap: 4,
          }}
        >
          {picking ? (
            <ActivityIndicator color="#c084fc" size="small" />
          ) : (
            <>
              <Text style={{ color: '#555', fontSize: 24 }}>+</Text>
              <Text style={{ color: '#555', fontSize: 12 }}>추가</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {items.length > 0 && (
        <Text style={{ color: '#555', fontSize: 13 }}>꾹 누르면 삭제할 수 있어요</Text>
      )}
    </StepLayout>
  );
}
