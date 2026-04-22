import { useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResumeStore } from '../src/store/resume';
import ResumePreview from '../src/components/template/ResumePreview';
import EditStepModal from '../src/components/common/EditStepModal';
import { exportPdf, printResume } from '../src/utils/exportPdf';
import { saveResumeImages } from '../src/utils/exportImage';
import { shareFile } from '../src/utils/share';

type Action = 'pdf' | 'image' | 'print';

const ACTIONS: { key: Action; label: string; icon: string; sub: string }[] = [
  { key: 'image', label: '이미지',   icon: '🖼',  sub: '사진 앱 저장' },
  { key: 'pdf',   label: 'PDF',      icon: '📄',  sub: '저장·공유' },
  { key: 'print', label: '인쇄',     icon: '🖨',  sub: 'AirPrint' },
];

export default function Preview() {
  const insets = useSafeAreaInsets();
  const { data } = useResumeStore();
  const page1Ref = useRef<View>(null);
  const page2Ref = useRef<View>(null);
  const [loading, setLoading] = useState<Action | null>(null);
  const [editModal, setEditModal] = useState(false);

  const hasPortfolio = data.portfolio.length > 0;

  const handle = async (action: Action) => {
    setLoading(action);
    try {
      if (action === 'image') {
        await saveResumeImages(data.name, page1Ref, hasPortfolio ? page2Ref : undefined);
        Alert.alert('저장 완료', '사진 앱에 저장됐어요');

      } else if (action === 'pdf') {
        const uri = await exportPdf(data);
        await shareFile(uri);

      } else if (action === 'print') {
        try { await printResume(data); } catch {}
      }
    } catch (e: any) {
      const msg: string = e?.message ?? '';
      if (msg.includes('cancel') || msg.includes('Cancel') || msg.includes('dismissed')) return;
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
        paddingTop: insets.top,
        backgroundColor: '#0f0f0f',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
      }}>
        <TouchableOpacity onPress={() => setEditModal(true)}>
          <Text style={{ color: '#c084fc', fontSize: 15 }}>← 수정하기</Text>
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
            onPress={() => handle(key)}
            disabled={loading !== null}
            style={{
              flex: 1,
              height: 60,
              borderRadius: 14,
              backgroundColor: key === 'pdf' ? '#c084fc' : '#1a1a1a',
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
                <Text style={{ fontSize: 17 }}>{icon}</Text>
                <Text style={{ color: key === 'pdf' ? '#fff' : '#ccc', fontSize: 12, fontWeight: '600' }}>{label}</Text>
                <Text style={{ color: key === 'pdf' ? 'rgba(255,255,255,0.7)' : '#555', fontSize: 10 }}>{sub}</Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <EditStepModal visible={editModal} onClose={() => setEditModal(false)} />
    </View>
  );
}
