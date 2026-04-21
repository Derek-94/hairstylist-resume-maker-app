# 미용업 이력서 생성기 — iOS 앱 (Hairstylist Resume Maker)

> 이 문서는 웹 버전(Vue 3, `hairstylist-resume-maker.vercel.app`)에서 **React Native + Expo로 재작성**하는 프로젝트의 컨텍스트 문서다. 웹 버전은 유지하고 iOS 네이티브 앱을 별도로 만든다.

---

## 프로젝트 개요

미용업 취준생(20대 초반, 이력서를 한 번도 써본 적 없는 사람)을 위한 **iOS 네이티브 이력서 생성 앱**. 설문 형식으로 정보를 입력받아 이력서 PDF/PNG를 만들어주고, 카톡이나 파일로 바로 공유할 수 있게 한다.

### 왜 iOS 앱으로 만드는가
- 웹 버전을 Vercel에 출시해 검증됨. 기능·UX 기본 형태 확정.
- 타겟 사용자는 **무조건 폰**으로 접근 → 네이티브 앱이 웹앱보다 사용성, 신뢰도, 설치 편의성 모두 우위.
- 백엔드가 필요 없는 구조라 네이티브 앱의 복잡도 비용이 매우 낮음.
- 웹 버전의 기술 부채(html2canvas의 한글 렌더링·비율·투명 여백 이슈)가 네이티브에서는 자연스럽게 소멸.

### 왜 RN + Expo인가
- 앱이 작음(화면 ~15개) → 재작성 비용 < 두 코드베이스 유지보수 비용
- Expo 매니지드 워크플로로 이 앱에 필요한 기능 전부 커버 (expo-print, expo-image-picker, expo-file-system, expo-sharing, AsyncStorage 등)
- EAS Build로 로컬 Xcode 빌드 우회 가능
- 개발자는 이미 Apple Developer Program 등록 상태, 기존 앱 출시 경험 있음

---

## 기술 스택

| 영역 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | **Expo (SDK 최신)** | 매니지드 워크플로 |
| 언어 | TypeScript | |
| 네비게이션 | **expo-router** | 파일 기반 라우팅 |
| 상태 관리 | **Zustand** | Pinia 대체, 훨씬 가벼움 |
| 스타일 | **NativeWind** | Tailwind 문법 그대로 RN에 적용 |
| 이미지 선택 | **expo-image-picker** | 카메라/갤러리 |
| 이미지 크롭 | **expo-image-manipulator** + 커스텀 크롭 UI (gesture-handler + reanimated) | 또는 `react-native-image-crop-picker`(dev build 필요) |
| 뷰 캡처 (PNG) | **react-native-view-shot** | |
| PDF 생성 | **expo-print** | HTML 템플릿 문자열 → PDF |
| 인쇄 | **expo-print.printAsync** | AirPrint |
| 공유 | **expo-sharing** | iOS 네이티브 공유 시트 (카톡 포함) |
| 미디어 저장 | **expo-media-library** | PNG → 사진 앱 |
| 파일 저장 | **expo-file-system** | PDF + 이미지 영속화 |
| 영속성(텍스트) | **@react-native-async-storage/async-storage** | |
| 폰트 | **Apple SD Gothic Neo**(iOS 기본) | v1은 번들 폰트 없이 시스템 폰트 사용 |

### 백엔드
**없음.** 모든 데이터는 기기 로컬에만 저장. 네트워크 요청 0.

---

## 핵심 UX 원칙 (절대 지켜야 할 것들)

웹 버전에서 검증된 원칙 그대로 유지:

1. **모바일 네이티브 퍼스트** — 웹에서는 "모바일 퍼스트"였지만 RN은 애초에 네이티브. 플랫폼 규약(iOS HIG) 따름
2. **한 화면에 질문 하나** — Typeform 스타일, 한 번에 많은 정보 요구 금지
3. **진입장벽 최소화** — 디지털 리터러시 낮은 사용자 전제. 커스터마이징 UI 없음
4. **템플릿 선택 없음 (v1)** — 단일 템플릿 고정. 웹의 4종 → iOS v1은 1종으로 시작
5. **추출이 목적** — 앱 크롬 최소화, 결과물이 문서처럼 보이도록

---

## 서비스 흐름 (User Flow)

웹 버전 대비 다음 변경사항 반영:
- **경력** 스텝을 **포트폴리오**보다 **앞으로** 이동
- **경력**을 자유 텍스트 → **선택지(enum)** 로 변경
- **기본사항 확장** (학력, 주소, email, 입사 가능일)
- 결과물 첫 장에는 포트폴리오 제외, **포트폴리오는 2번째 장**
- 포트폴리오 크롭 **1:1 강제 → 자유 비율**
- 저장 후 수정 시 **데이터 복원** 지원

```
설문 시작 (/survey/1)
  ↓ 스텝 1: 이름
  ↓ 스텝 2: 생년월일
  ↓ 스텝 3: 성별
  ↓ 스텝 4: 연락처
  ↓ 스텝 5: email
  ↓ 스텝 6: 주소
  ↓ 스텝 7: 학력
  ↓ 스텝 8: 입사 가능일
  ↓ 스텝 9: 프로필 사진 (필수, 1:1 크롭)
  ↓ 스텝 10: 보유 기술 (필수, 목록 + 커스텀 입력)
  ↓ 스텝 11: 경력 (선택지 — 아래 7개 중 하나)
  ↓ 스텝 12: 자격증 (선택)
  ↓ 스텝 13: 포트폴리오 사진 (선택, 자유 비율 크롭, 여러 장)
  ↓ 스텝 14: 한 줄 자기소개 (선택)
        ↓
미리보기 화면 (/preview)
  - 입력한 데이터로 이력서 렌더링 (단일 템플릿)
  - 포트폴리오는 시각적으로 2페이지 구분선 이후에 표시
  - "수정하기" 버튼으로 설문 복귀 (데이터 유지)
  - "PDF 저장" / "이미지 저장" / "공유" / "인쇄" 버튼
        ↓
추출
  - PDF: expo-print (HTML 템플릿 문자열) → {이름}_이력서.pdf
  - 이미지: view-shot → 1페이지 PNG / 포폴 있으면 2페이지 PNG 분리 저장
  - 공유: expo-sharing → 카톡 등 선택
  - 인쇄: expo-print.printAsync() → AirPrint
```

### 경력 선택지 7개
1. 헤어스탭 (경력 O)
2. 헤어스탭 (경력 X)
3. 디자이너 (상)
4. 디자이너 (중상)
5. 디자이너 (중)
6. 디자이너 (중하)
7. 디자이너 (하)

---

## 데이터 스키마 (Zustand Store)

```ts
type CareerLevel =
  | 'staff_experienced'
  | 'staff_new'
  | 'designer_s'
  | 'designer_a'
  | 'designer_b'
  | 'designer_c'
  | 'designer_d'

interface PortfolioItem {
  uri: string           // expo-file-system 로컬 URI (base64 X)
  width: number         // 원본 비율 보존 (masonry 레이아웃용)
  height: number
}

interface ResumeData {
  name: string
  birthDate: string
  gender: '남' | '여' | ''
  phone: string
  email: string
  address: string
  education: string              // 드롭다운: 고졸/전문대졸/대졸/재학중/기타
  availableStartDate: string     // ISO date
  profileImageUri: string | null
  skills: string[]
  careerLevel: CareerLevel | null
  certifications: string
  portfolio: PortfolioItem[]
  introduction: string
}
```

- 이미지는 base64 X, **파일 URI**로 저장 (웹의 5MB localStorage 한계 문제 소멸)
- Zustand + AsyncStorage 영속화 미들웨어로 자동 저장/복원
- 이미지 URI가 가리키는 실제 파일은 `expo-file-system`의 `documentDirectory`에 복사해 보관 (picker가 준 임시 경로는 세션 종료 시 날아감)

---

## 프로젝트 구조 (예상)

```
app/                          # expo-router 라우팅
├── _layout.tsx              # 루트 레이아웃, 폰트 로딩, 스토어 초기화
├── index.tsx                # 진입 → /survey/1 리다이렉트 or 온보딩
├── survey/
│   └── [step].tsx           # 스텝 1~14 동적 라우트
└── preview.tsx              # 미리보기 + 추출

src/
├── store/
│   └── resume.ts            # Zustand + persist (AsyncStorage)
├── components/
│   ├── survey/              # 각 스텝 UI (TextInput, Picker, ImageCropper 등)
│   ├── template/
│   │   ├── ResumePreview.tsx    # RN 네이티브 미리보기
│   │   └── resumeHtml.ts        # PDF/프린트용 HTML 템플릿 빌더
│   └── common/
├── utils/
│   ├── exportPdf.ts         # expo-print 호출
│   ├── exportImage.ts       # view-shot + media-library 저장
│   ├── share.ts             # expo-sharing 래퍼
│   └── fileStorage.ts       # picker URI → documentDirectory 복사
└── types/
    └── resume.ts
```

---

## 단일 템플릿 디자인 방향

**"정갈한 에디토리얼 미니멀"** — 흑백 기반, 타이포 대비로 계층 구성.

- 흰 배경, 검정 텍스트
- 이름을 크게 (굵은 산세리프 또는 세리프), 본문은 가볍게
- 섹션 구분은 얇은 회색 라인 하나만. 장식 아이콘·색 블록 없음
- 포트폴리오는 넉넉한 여백의 그리드 — 사진 자체가 디자인이 되도록
- 포인트는 색이 아닌 **굵기/크기 대비**로만
- 썸네일 모서리만 살짝 radius(4-8px), 레이아웃은 직선
- 참고 톤: 매거진 B, Linear 블로그, 에디토리얼 인터뷰 페이지

---

## 추출 아키텍처

### PDF (expo-print)
- 템플릿 데이터 → HTML 문자열 빌드
- `Print.printToFileAsync({ html })` → 로컬 PDF URI 반환
- `Sharing.shareAsync(uri)` 또는 `FileSystem.copyAsync`로 파일 앱 저장
- 포트폴리오 섹션 앞에 `<div style="page-break-before: always">` → 2페이지 강제

### PNG (view-shot)
- 미리보기 화면을 RN 뷰로 렌더링
- 페이지1(기본+경력+자격+자기소개)과 페이지2(포폴)를 **별도 뷰로 분리**해서 각각 `captureRef`
- 포폴 있으면 2장 저장, 없으면 1장
- `expo-media-library`로 사진 앱에 저장, 파일명: `{이름}_이력서_1.png` / `_2.png`

### 공유
- `expo-sharing.shareAsync(uri)` → iOS 네이티브 공유 시트
- 사용자가 카톡·메일·파일 등 직접 선택

### 인쇄
- `Print.printAsync({ html })` → AirPrint 네이티브 다이얼로그

---

## 미해결 설계 결정 (v1 들어가기 전 확정 필요)

웹 버전에서 유저 피드백으로 받았으나 아직 구체 안이 확정되지 않은 항목들. RN으로 재작성하면서 정할 것.

### 1. 포트폴리오 크롭 자유 비율 + 미리보기 레이아웃
- 크롭은 자유 비율로 확정 (1:1 강제 폐기)
- 미리보기 레이아웃 후보:
  - **(A) Masonry 2열** — 원본 비율 전부 보존, 세로사진 많은 실사용에 자연스러움 ← 추천
  - (B) 첫 사진 원본 비율로 크게, 나머지 2열 1:1 — 단순하지만 세로/가로 혼합 시 어색

### 2. 이미지 저장 포맷 (포폴 있을 때)
- **(A) PNG 2장 분리 저장** (`_1.png`, `_2.png`) — 각 페이지 독립 ← 추천
- (B) 한 장에 이어 붙임 — 카톡 전송은 편하지만 매우 세로로 김

### 3. 기본사항 확장 필드의 필수/선택 분류
- 4개 필드(학력·주소·email·입사가능일)를 각각 **필수/선택** 확정 필요
- 선택이라면 "건너뛰기" 버튼 노출 방식 확정

### 4. 앱 이름 / 번들 ID
- v1 설계 단계에서는 추후 추가 예정
- 앱스토어 등록 전 확정 필요

---

## 개발/배포

### 로컬 개발
```bash
pnpm install                      # 또는 npm/yarn
npx expo start                    # dev 서버
# Expo Go 앱으로 실기기 테스트 (네이티브 모듈 충돌 없을 때)
# 네이티브 모듈 추가 시 → npx expo run:ios (dev client 빌드)
```

### 빌드 / 출시
- **EAS Build** (`eas build --platform ios`) — 클라우드 빌드
- **TestFlight** 베타 배포 → 실사용자 피드백
- **App Store Connect** 심사 제출
- 앱스토어 4.2조(웹 래퍼) 리스크 없음 (네이티브 RN 구현)
- 심사 자료: 앱 아이콘 1024x1024, 스플래시, 스크린샷(6.7" / 6.5" / 5.5"), 개인정보처리방침 URL, 앱 설명

### 개인정보처리방침
- 데이터 수집 **없음** (전부 기기 로컬)
- 간단한 정적 페이지 한 장으로 충분

---

## 웹 버전에서 이식할 자산

재작성이지만 다음은 재사용:
- 데이터 스키마 (필드명·타입)
- 설문 질문 문구 (UX 카피)
- 스킬 목록 기본값 + 커스텀 입력 로직
- 크롭 플로우 UX (선택 → 크롭 모달 → 목록 추가)
- 단일 템플릿 디자인 의도 (미니멀 기반의 비주얼 방향)
- 결정 로그(웹 CLAUDE.md의 "개발 히스토리 & 주요 결정 사항")의 의사결정 맥락

---

## 웹 버전에서 해결된 / 해결될 이슈

| 웹 이슈 | RN에서의 상태 |
|---|---|
| html2canvas 한글 태그 밀림 | **발생 안 함** (네이티브 텍스트 렌더링) |
| html2canvas flex gap 미지원 | **발생 안 함** (RN flex는 gap 지원) |
| object-fit / aspect-ratio 미지원 | **발생 안 함** (RN Image의 resizeMode) |
| 흰 테두리 / 투명 여백 / rounded-xl 아티팩트 | **발생 안 함** (view-shot은 네이티브) |
| localStorage 5MB 제한 | **없음** (file-system + AsyncStorage 분리) |
| Vercel SPA 라우팅 404 | **해당 없음** (앱 내부 라우팅) |
| 저장 후 새로고침 시 데이터 소실 | **해결** (AsyncStorage persist 자동) |

---

## 참고: 웹 버전 저장소

- 웹: `https://github.com/Derek-94/hairstylist-resume-maker`
- 배포: `https://hairstylist-resume-maker.vercel.app`
- 웹 CLAUDE.md는 해당 저장소 루트에 있음 — 결정 로그, html2canvas 이슈 해결 과정 등 세부 컨텍스트 필요 시 참조

---

## v1 MVP 체크리스트 (착수 시 순서)

1. [ ] Expo 프로젝트 초기화 + TypeScript + NativeWind + expo-router 셋업
2. [ ] Zustand + AsyncStorage persist 스토어 구성
3. [ ] 설문 14스텝 UI (텍스트/선택지/날짜/사진업로드)
4. [ ] 이미지 피커 + 자유 비율 크롭 화면
5. [ ] 단일 템플릿 RN 컴포넌트 (미리보기용)
6. [ ] HTML 템플릿 빌더 (PDF/프린트용)
7. [ ] expo-print PDF 저장 + 공유
8. [ ] view-shot PNG 저장 (2페이지 분리)
9. [ ] 공유 시트 연결
10. [ ] AirPrint 인쇄
11. [ ] 아이콘/스플래시/앱 이름 확정
12. [ ] EAS Build → TestFlight 내부 테스트
13. [ ] 앱스토어 심사 제출
