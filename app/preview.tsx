import { useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Linking, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useResumeStore } from '../src/store/resume';
import ResumePreview from '../src/components/template/ResumePreview';
import EditStepModal from '../src/components/common/EditStepModal';
import { exportPdf, printResume } from '../src/utils/exportPdf';
import { saveResumeImages } from '../src/utils/exportImage';
import { shareFile } from '../src/utils/share';
import { track } from '../src/utils/analytics';
import { useAds } from '../src/contexts/AdContext';

type Action = 'pdf' | 'image' | 'print';

const ACTIONS: { key: Action; label: string; icon: string; sub: string }[] = [
  { key: 'image', label: '이미지',   icon: '🖼',  sub: '사진 앱 저장' },
  { key: 'pdf',   label: 'PDF',      icon: '📄',  sub: '저장/공유' },
  { key: 'print', label: '인쇄',     icon: '🖨',  sub: 'AirPrint' },
];

export default function Preview() {
  const insets = useSafeAreaInsets();
  const { data } = useResumeStore();

  useEffect(() => { track('Preview Opened'); }, []);
  const page1Ref = useRef<View>(null);
  const page2Ref = useRef<View>(null);
  const [loading, setLoading] = useState<Action | null>(null);
  const [editModal, setEditModal] = useState(false);

  const hasPortfolio = data.portfolio.length > 0;
  const pendingActionRef = useRef<Action | null>(null);
  const [isFirstSave, setIsFirstSave] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('hasSaved').then(val => {
      if (val) setIsFirstSave(false);
    });
  }, []);

  const { showRewardedAd, rewardedLoaded, showInterstitialAd } = useAds();

  const doAction = () => {
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    if (action) handle(action);
  };

  const markSaved = async () => {
    await AsyncStorage.setItem('hasSaved', '1');
    setIsFirstSave(false);
  };

  const handle = async (action: Action) => {
    setLoading(action);
    try {
      if (action === 'image') {
        await saveResumeImages(data.name, page1Ref, hasPortfolio ? page2Ref : undefined);
        track('Export Image', { hasPortfolio });
        Alert.alert('저장 완료', '사진 앱에 저장됐어요');

      } else if (action === 'pdf') {
        const uri = await exportPdf(data);
        track('Export PDF', { hasPortfolio });
        track('Share Initiated', { type: 'pdf' });
        await shareFile(uri);

      } else if (action === 'print') {
        try { await printResume(data); track('Print'); } catch {}
      }
    } catch (e: any) {
      const msg: string = e?.message ?? '';
      if (msg.includes('cancel') || msg.includes('Cancel') || msg.includes('dismissed')) return;
      track('Export Failed', { action, reason: msg || 'unknown' });
      if (msg === 'PHOTOS_PERMISSION_DENIED') {
        Alert.alert(
          '사진 접근 권한이 필요해요',
          '아이폰 설정 > Clipr > 사진을 탭한 후\n"모두" 또는 "추가만"으로 변경해주세요.',
          [
            { text: '설정으로 이동', onPress: () => Linking.openSettings() },
            { text: '닫기', style: 'cancel' },
          ]
        );
        return;
      }
      Alert.alert('오류', msg || '다시 시도해주세요');
    } finally {
      setLoading(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#e8e8e8' }}>
      {/* Header */}
      <View style={{
        paddingTop: insets.top + (Platform.OS === 'android' ? 14 : 0),
        backgroundColor: '#0f0f0f',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
      }}>
        <TouchableOpacity onPress={() => { track('Resume Edited'); setEditModal(true); }}>
          <Text style={{ color: '#3D5BF6', fontSize: 15 }}>← 수정하기</Text>
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', flex: 1, textAlign: 'center' }}>
          미리보기
        </Text>
        <View style={{ width: 72 }} />
      </View>

      {/* Resume scroll area */}
      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 24 }}>
        <ResumePreview data={data} pageRef={page1Ref} portfolioRef={page2Ref} />
      </ScrollView>

      {/* Action buttons */}
      <View style={{
        backgroundColor: '#0f0f0f',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: insets.bottom + 12,
        borderTopWidth: 1,
        borderTopColor: '#222',
        flexDirection: 'row',
        gap: 8,
      }}>
        {ACTIONS.map(({ key, label, icon, sub }) => (
          <TouchableOpacity
            key={key}
            onPress={() => {
              pendingActionRef.current = key;
              if (isFirstSave && rewardedLoaded) {
                showRewardedAd(
                  async () => { await markSaved(); doAction(); },
                  () => { doAction(); },
                );
              } else {
                showInterstitialAd(async () => { await markSaved(); doAction(); });
              }
            }}
            disabled={loading !== null}
            style={{
              flex: 1,
              height: 60,
              borderRadius: 14,
              backgroundColor: key === 'pdf' ? '#3D5BF6' : '#1a1a1a',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              opacity: loading && loading !== key ? 0.4 : 1,
            }}
          >
            {loading === key ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={{ fontSize: Platform.OS === 'android' ? 14 : 17 }}>{icon}</Text>
                <Text numberOfLines={1} style={{ alignSelf: 'stretch', textAlign: 'center', color: key === 'pdf' ? '#fff' : '#ccc', fontSize: Platform.OS === 'android' ? 10 : 12, fontWeight: '600' }}>{label}</Text>
                <Text numberOfLines={1} style={{ alignSelf: 'stretch', textAlign: 'center', color: key === 'pdf' ? 'rgba(255,255,255,0.7)' : '#555', fontSize: Platform.OS === 'android' ? 8 : 10 }}>{sub}</Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <EditStepModal visible={editModal} onClose={() => setEditModal(false)} />
    </View>
  );
}
