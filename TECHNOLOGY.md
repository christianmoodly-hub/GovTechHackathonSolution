# Technology stack — Khetha / NCAP Career Advice

**Product:** Mobile career-advice app for the South African Department of Higher Education and Training (DHET) National Career Advice Portal (NCAP).  
**In-app assistant:** Khetha  
**Document purpose:** Summarise the technologies used for judges, mentors, and technical review.

---

## 1. Overview

| Layer | Technology |
|-------|------------|
| Mobile client | Expo (React Native) + TypeScript |
| Navigation | Expo Router (file-based) |
| Backend / data | Firebase (Auth, Firestore, Hosting, Cloud Functions, App Check) |
| AI assistant | Google Gemini via Firebase AI Logic (tool calling, grounded on NCAP data) |
| Multilingual UI | Custom i18n for 11 official South African languages |
| Voice input | Device microphone + Gemini multimodal audio understanding |
| Voice output (planned) | CSIR Qfrency TTS via Cloud Function (API key pending); text replies work in all languages today |
| Builds | EAS Build (Android APK / AAB) |

---

## 2. Mobile application

| Item | Choice |
|------|--------|
| Framework | **Expo SDK 57** on **React Native** |
| Language | **TypeScript** |
| UI runtime | **React 19** |
| Architecture | New Architecture enabled (`newArchEnabled`) |
| Routing | **expo-router** |
| Local storage | **AsyncStorage** (offline indexes, drafts, profile mirror) |
| Connectivity | **@react-native-community/netinfo** |
| Audio record / play | **expo-audio**, **expo-file-system** |
| Location (“near me”) | **expo-location** + Google Geocoding API |
| Auth UX | **expo-auth-session**, **expo-web-browser** (Google Sign-In) |
| Accessibility extras | Text zoom / high contrast; volume-down & shake triggers for hands-free listen |
| Motion / layout | **react-native-reanimated**, safe-area, screens |
| Notifications | **expo-notifications** |
| Documents | **expo-print**, **expo-sharing** (e.g. career blueprint PDF) |

**Package id:** `za.gov.ncap.careeradvice`  
**Deep link scheme:** `ncap://`

---

## 3. Backend and cloud services (Firebase / Google)

| Service | Role in the app |
|---------|-----------------|
| **Firebase Authentication** | Email/password, Google, anonymous guest |
| **Cloud Firestore** | NCAP catalogue: occupations, qualifications, providers (universities / TVET), bursaries; user profiles |
| **Firebase Hosting** | Web hosting / auth continue URLs |
| **Firebase Cloud Functions** | Server-side proxy for Qfrency TTS (`synthesizeSpeech`); secrets held off-device |
| **Firebase AI Logic** | Client access to **Gemini** (Developer API backend) for the Khetha assistant |
| **Firebase App Check** | Optional hardening for assistant calls (debug token in development) |
| **Google Maps Geocoding API** | Resolve places for nearby learning providers |
| **EAS (Expo Application Services)** | Cloud builds for Android preview/production |

---

## 4. Artificial intelligence (Khetha assistant)

| Concern | Approach |
|---------|----------|
| Model | **Gemini** (configurable; default `gemini-3.6-flash`) |
| Access path | **Firebase AI Logic** (`firebase/ai`) from the mobile app |
| Capabilities | Text chat, **voice notes** (audio in → understand & act), **function calling** (tools) |
| Grounding | Factual answers about careers, qualifications, institutions and bursaries must come from **NCAP tools** that read Firestore / offline cache — not from general model memory |
| In-app actions | Navigate screens, search lists, open entities, start questionnaires, accessibility & language settings, helpline (with confirmation) |
| Safety / scope | System instruction limits the bot to DHET career, study and funding help inside the app |

### Assistant data tools (examples)

- `search_careers` / `get_career`
- `search_qualifications` / `get_qualification`
- `search_institutions` / `get_institution`
- `search_bursaries` / `get_bursary`
- App help, profile, and screen-action tools

---

## 5. Languages and inclusion

| Feature | Technology / approach |
|---------|------------------------|
| UI languages | Custom TypeScript i18n bundles for **11 official SA languages** (English, Afrikaans, isiZulu, isiXhosa, isiNdebele, siSwati, Sepedi, Sesotho, Setswana, Tshivenda, Xitsonga) |
| Assistant replies | Same locale: Gemini is instructed to answer in the selected language |
| Voice in | Microphone recording → Gemini multimodal |
| Voice out | **Intended:** CSIR **Qfrency** cloud TTS (all 11 languages) via Cloud Function. **Current without API key:** multilingual **text** replies; spoken playback waits on Qfrency access |

---

## 6. Offline and resilience

- Directory indexes and pages cached on device (AsyncStorage)
- Profile mirror and outbox for sync when connectivity returns
- NetInfo gates online-only features (assistant Gemini calls, live catalogue refresh)
- Offline still supports core navigation and many local shortcuts

---

## 7. Security and configuration notes

- Firebase web config and public keys are client-side (`EXPO_PUBLIC_*`); restricted in Google Cloud Console where applicable
- **Qfrency API key** is a **server secret** (`QFRENCY_API_KEY` on Cloud Functions) — never shipped in the app binary
- Leaving the app (phone, external URL) requires explicit user confirmation in the assistant flow

---

## 8. Repository layout (high level)

```
GovTech2026/
├── mobile/          # Expo React Native app (main product)
├── functions/       # Firebase Cloud Functions (TTS proxy)
├── firebase/        # Shared Firebase helpers / examples
├── hosting/         # Firebase Hosting static assets
├── firestore.rules  # Firestore security rules
└── output/          # Catalogue / scrape artefacts (data pipeline outputs)
```

---

## 9. One-line pitch for judges

> A TypeScript Expo app on Firebase, with a Gemini-powered Khetha assistant **grounded on DHET NCAP catalogue data**, multilingual across South Africa’s official languages, with voice input today and CSIR Qfrency TTS wired for spoken replies when API access is granted.

---

*Generated for GovTech / DHET hackathon documentation. Stack versions reflect the project at time of writing (Expo 57, Firebase JS SDK 12.x, Gemini via Firebase AI Logic).*
