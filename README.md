# 뚝딱이력서

이력서가 처음인 취업 준비생을 위한 모바일 이력서 생성 앱.

설문에 답하기만 하면 이력서가 뚝딱 완성되고, PDF·이미지로 저장하거나 카카오톡으로 바로 공유할 수 있어요. 사진 포트폴리오를 함께 담을 수 있어 미용·서비스직처럼 결과물을 보여줘야 하는 직군에 특히 잘 맞아요.

> 코드베이스/번들 식별자에서는 내부 코드명 **Clipr** 를 사용합니다.

## 다운로드

- iOS: [App Store](https://apps.apple.com/kr/app/뚝딱이력서/id6772397044)
- Android: [Google Play](https://play.google.com/store/apps/details?id=com.skhong.clipr.android)

## 주요 기능

- 14단계 설문으로 이력서 작성 (이름, 사진, 경력, 포트폴리오 등)
- 프로필 사진 촬영 / 갤러리 업로드
- 포트폴리오 사진 최대 6장 (원본 또는 1:1 크롭)
- PDF 저장 및 공유
- 이미지(PNG) 저장 — 포트폴리오 있으면 2페이지 분리 저장
- AirPrint 인쇄
- 저장 후 데이터 복원 — 다시 들어와도 작성 내용 유지
- 모든 데이터 기기 로컬 저장 (서버 없음, 네트워크 요청 0)

## 기술 스택

- React Native + Expo (prebuild / native 프로젝트 커밋)
- TypeScript
- expo-router (파일 기반 라우팅)
- Zustand + AsyncStorage (상태 관리 및 영속화)
- expo-print (PDF 생성) · react-native-view-shot (이미지 캡처)
- expo-image-picker / expo-image-manipulator (사진 선택·크롭)
- react-native-google-mobile-ads (AdMob)
- Amplitude (익명 이벤트 분석)

## 개발 환경

```bash
npm install
npx expo start
```

iOS:

```bash
cd ios && pod install
# Xcode에서 Clipr.xcworkspace 열기
```

Android (AAB 빌드):

```bash
npm run build:android
```

## 플랫폼

iOS와 Android를 **동일한 버전(versionName)**으로 맞춰 배포합니다.

| 플랫폼 | 버전 식별자 |
|---|---|
| iOS | `CFBundleShortVersionString` / `CFBundleVersion` |
| Android | `versionName` / `versionCode` |
