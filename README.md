# Clipr

미용사 취준생을 위한 iOS 이력서 생성 앱.

설문 형식으로 정보를 입력하면 이력서가 완성되고, PDF·이미지로 저장하거나 카카오톡으로 바로 공유할 수 있어요.

## 주요 기능

- 14단계 설문으로 이력서 작성 (이름, 사진, 경력, 포트폴리오 등)
- 프로필 사진 촬영 / 갤러리 업로드
- 포트폴리오 사진 최대 6장 (원본 또는 1:1 크롭)
- PDF 저장 및 공유
- 이미지(PNG) 저장 — 포트폴리오 있으면 2페이지 분리 저장
- AirPrint 인쇄
- 모든 데이터 기기 로컬 저장 (서버 없음)

## 기술 스택

- React Native + Expo (managed workflow)
- TypeScript
- expo-router (파일 기반 라우팅)
- Zustand + AsyncStorage (상태 관리 및 영속화)
- expo-print (PDF 생성)
- react-native-view-shot (이미지 캡처)
- Amplitude (익명 이벤트 분석)

## 개발 환경

```bash
npm install
npx expo start
```

iOS 빌드:

```bash
cd ios && pod install
# Xcode에서 Clipr.xcworkspace 열기
```
