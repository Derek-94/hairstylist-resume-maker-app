import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { router } from 'expo-router';
import { useResumeStore } from '../../store/resume';
import StepLayout from './StepLayout';
import QuestionTitle from './QuestionTitle';

export default function Step09ProfileImage() {
  const { data, update } = useResumeStore();
  const [picking, setPicking] = useState(false);

  const handleImage = async (source: 'camera' | 'library') => {
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '카메라 접근 권한이 필요해요',
          '아이폰 설정 > Clipr > 카메라를 켜주세요.',
          [
            { text: '설정으로 이동', onPress: () => Linking.openSettings() },
            { text: '닫기', style: 'cancel' },
          ]
        );
        return;
      }
    }
    setPicking(true);
    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const ext = asset.uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `profile_${Date.now()}.${ext}`;
      const dest = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.copyAsync({ from: asset.uri, to: dest });
      update({ profileImageUri: dest });
    }
    setPicking(false);
  };

  const pickImage = () => {
    Alert.alert('프로필 사진', '어떻게 추가할까요?', [
      { text: '사진 찍기', onPress: () => handleImage('camera') },
      { text: '앨범에서 선택', onPress: () => handleImage('library') },
      { text: '취소', style: 'cancel' },
    ]);
  };

  const handleNext = () => router.push('/survey/10');

  return (
    <StepLayout step={9} canNext={!!data.profileImageUri} onNext={handleNext}>
      <QuestionTitle>프로필 사진을 올려주세요</QuestionTitle>
      <View style={{ alignItems: 'center', marginTop: 8 }}>
        <TouchableOpacity
          onPress={pickImage}
          disabled={picking}
          style={{
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: '#1a1a1a',
            borderWidth: 2,
            borderColor: '#333',
            borderStyle: 'dashed',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {picking ? (
            <ActivityIndicator color="#c084fc" size="small" />
          ) : data.profileImageUri ? (
            <Image
              source={{ uri: data.profileImageUri }}
              style={{ width: 160, height: 160, borderRadius: 80 }}
            />
          ) : (
            <View style={{ alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 32 }}>📷</Text>
              <Text style={{ color: '#555', fontSize: 14 }}>탭해서 선택</Text>
            </View>
          )}
        </TouchableOpacity>
        {data.profileImageUri && !picking && (
          <TouchableOpacity onPress={pickImage} style={{ marginTop: 16 }}>
            <Text style={{ color: '#c084fc', fontSize: 14 }}>다시 선택</Text>
          </TouchableOpacity>
        )}
      </View>
    </StepLayout>
  );
}
