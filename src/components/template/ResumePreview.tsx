import { View, Text, Image, StyleSheet } from 'react-native';
import { ResumeData, CAREER_LABELS } from '../../types/resume';

function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

interface Props {
  data: ResumeData;
  pageRef?: React.RefObject<View | null>;
  portfolioRef?: React.RefObject<View | null>;
}

const S = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginVertical: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#aaa',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 14,
    color: '#222',
    lineHeight: 22,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
});

function Divider() {
  return <View style={S.divider} />;
}

export default function ResumePreview({ data, pageRef, portfolioRef }: Props) {
  const hasPortfolio = data.portfolio.length > 0;

  const formatBirth = (raw: string) => {
    const d = raw.replace(/\D/g, '');
    if (d.length !== 8) return raw;
    return `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6)}`;
  };

  const formatDate = (raw: string) => {
    const d = raw.replace(/\D/g, '');
    if (d.length !== 8) return raw;
    return `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6)}`;
  };

  return (
    <View>
      {/* Page 1 */}
      <View style={S.page} ref={pageRef} collapsable={false}>

        {/* Header: profile photo + basic info */}
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 4, alignItems: 'flex-end' }}>
          {/* Profile photo — half the container width */}
          <View style={{ flex: 1, aspectRatio: 1, borderRadius: 8, backgroundColor: '#f0f0f0', overflow: 'hidden' }}>
            {data.profileImageUri ? (
              <Image source={{ uri: data.profileImageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 40, color: '#ccc' }}>👤</Text>
              </View>
            )}
          </View>

          {/* Name + meta — bottom-aligned */}
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Text style={{ fontSize: 9, color: '#aaa', letterSpacing: 1.5, fontWeight: '600', marginBottom: 2 }}>
              HAIR STYLIST
            </Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#111', letterSpacing: -0.5, marginBottom: 4 }}>
              {data.name || '이름'}
            </Text>
            {data.birthDate && (
              <Text style={S.metaText}>{formatBirth(data.birthDate)}{data.gender ? ` · ${data.gender === '여' ? '여성' : '남성'}` : ''}</Text>
            )}
            {data.phone && <Text style={S.metaText}>{data.phone}</Text>}
            {data.email && <Text style={S.metaText}>{data.email}</Text>}
            {data.address && <Text style={S.metaText}>{data.address}</Text>}
          </View>
        </View>

        <Divider />

        {/* Skills */}
        {data.skills.length > 0 && (
          <>
            <Text style={S.sectionLabel}>보유 기술</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
              {data.skills.map(skill => (
                <View key={skill} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: '#ddd' }}>
                  <Text style={{ fontSize: 12, color: '#333' }}>{skill}</Text>
                </View>
              ))}
            </View>
            <Divider />
          </>
        )}

        {/* Career */}
        {data.careerLevel && (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={S.sectionLabel}>경력</Text>
              <Text style={S.bodyText}>{CAREER_LABELS[data.careerLevel]}</Text>
            </View>
            <Divider />
          </>
        )}

        {/* Education + available date */}
        {(data.education || data.availableStartDate) && (
          <>
            <View style={{ flexDirection: 'row' }}>
              {data.education ? (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 16 }}>
                  <Text style={S.sectionLabel}>학력</Text>
                  <Text style={S.bodyText}>{data.education}</Text>
                </View>
              ) : <View style={{ flex: 1 }} />}
              {data.availableStartDate ? (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 16, borderLeftWidth: 1, borderLeftColor: '#e5e5e5' }}>
                  <Text style={S.sectionLabel}>입사 가능일</Text>
                  <Text style={S.bodyText}>{formatDate(data.availableStartDate)}</Text>
                </View>
              ) : <View style={{ flex: 1 }} />}
            </View>
            <Divider />
          </>
        )}

        {/* Certifications */}
        {data.certifications.trim().length > 0 && (
          <>
            <Text style={S.sectionLabel}>자격증</Text>
            <Text style={S.bodyText}>{data.certifications}</Text>
            <Divider />
          </>
        )}

        {/* Introduction */}
        {data.introduction.trim().length > 0 && (
          <>
            <Text style={S.sectionLabel}>자기소개</Text>
            <Text style={[S.bodyText, { lineHeight: 24 }]}>{data.introduction}</Text>
          </>
        )}
      </View>

      {/* Page 2: Portfolio */}
      {hasPortfolio && (
        <View style={[S.page, { marginTop: 12, paddingTop: 28 }]} ref={portfolioRef} collapsable={false}>
          <Text style={S.sectionLabel}>포트폴리오</Text>
          <View style={{ marginTop: 8, gap: 8 }}>
            {chunk(data.portfolio, 2).map((row, rowIndex) => (
              <View key={rowIndex} style={{ flexDirection: 'row', gap: 8 }}>
                {row.map((item, colIndex) => (
                  <Image
                    key={colIndex}
                    source={{ uri: item.uri }}
                    style={{
                      flex: 1,
                      aspectRatio: item.width / item.height,
                      borderRadius: 6,
                      backgroundColor: '#f0f0f0',
                    }}
                    resizeMode="cover"
                  />
                ))}
                {/* 홀수 마지막 줄 빈 칸 채우기 */}
                {row.length === 1 && <View style={{ flex: 1 }} />}
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
